/* Small, dependency-free regression engine. Used by demo.js and tests. */
(function (root) {
  'use strict';
  const fields = [
    ['Age',15,18,1,16], ['Gender',0,1,1,0], ['Ethnicity',0,3,1,0],
    ['ParentalEducation',0,4,1,2], ['StudyTimeWeekly',0,20,.5,10],
    ['Absences',0,29,1,10], ['Tutoring',0,1,1,0], ['ParentalSupport',0,4,1,2],
    ['Extracurricular',0,1,1,0], ['Sports',0,1,1,0], ['Music',0,1,1,0], ['Volunteering',0,1,1,0]
  ];
  function random(seed) { return () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed/4294967296; }; }
  function sample() {
    const rand = random(42);
    return Array.from({length:320}, () => {
      const x = fields.map(([,lo,hi,step]) => step === 1 ? lo+Math.floor(rand()*(hi-lo+1)) : lo+rand()*(hi-lo));
      // Invented teaching data, never the Kaggle dataset or research predictions.
      const y = Math.max(0,Math.min(4,2.6-.095*x[5]+.028*x[4]+.14*x[7]+.22*x[6]+.12*x[8]+(rand()-.5)*.7));
      return {x,y};
    });
  }
  function parseCSV(text) {
    const rows=[]; let row=[], value='', quoted=false;
    text=text.replace(/^\uFEFF/,'');
    for(let i=0;i<text.length;i++) {
      const c=text[i];
      if(c==='"') { if(quoted && text[i+1]==='"') {value+='"';i++;} else quoted=!quoted; }
      else if(!quoted && (c===',' || c==='\n' || c==='\r')) {
        row.push(value.trim());value='';
        if(c!==',') { if(row.some(v=>v!=='')) rows.push(row);row=[]; if(c==='\r' && text[i+1]==='\n')i++; }
      } else value+=c;
    }
    if(quoted) throw Error('The CSV has an unclosed quoted field.');
    row.push(value.trim());if(row.some(v=>v!==''))rows.push(row);
    const headers=rows.shift() || [];
    const required=fields.map(f=>f[0]).concat('GPA');
    const missing=required.filter(f=>!headers.includes(f));
    if(missing.length)throw Error('Missing columns: '+missing.join(', '));
    if(new Set(headers).size!==headers.length)throw Error('The CSV contains duplicate column names.');
    if(rows.length<30 || rows.length>5000)throw Error('Please supply between 30 and 5,000 student rows.');
    return rows.map((r,i)=> {
      if(r.length!==headers.length)throw Error(`Row ${i+2}: column count does not match the header.`);
      const values=required.map(name=> {
        const raw=r[headers.indexOf(name)];
        if(raw==='' || !Number.isFinite(Number(raw)))throw Error(`Row ${i+2}: ${name} must be numeric and present.`);
        return Number(raw);
      });
      fields.forEach(([name,lo,hi,step],j)=> {
        if(values[j]<lo || values[j]>hi || (step===1 && !Number.isInteger(values[j])))throw Error(`Row ${i+2}: ${name} must be ${step===1?'an integer ':''}between ${lo} and ${hi}.`);
      });
      const y=values.pop();if(y<0 || y>4)throw Error(`Row ${i+2}: GPA must be between 0 and 4.`);
      return {x:values,y};
    });
  }
  function split(rows) {
    const shuffled=rows.slice(), rand=random(42);
    for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    const n=Math.floor(rows.length*.8);return {train:shuffled.slice(0,n),test:shuffled.slice(n)};
  }
  function fit(rows, method) {
    if(method==='knn') return x=>rows.map(r=>({y:r.y,d:r.x.reduce((s,v,i)=>s+(v-x[i])**2,0)})).sort((a,b)=>a.d-b.d).slice(0,5).reduce((s,r)=>s+r.y,0)/5;
    // Ridge-stabilized least squares, trained only on the training partition.
    const n=fields.length+1, a=Array.from({length:n},()=>Array(n+1).fill(0));
    rows.forEach(r=>{const x=[1,...r.x];for(let i=0;i<n;i++){for(let j=0;j<n;j++)a[i][j]+=x[i]*x[j];a[i][n]+=x[i]*r.y;}});
    for(let i=1;i<n;i++)a[i][i]+=1e-6;
    for(let i=0;i<n;i++) {
      let pivot=i;for(let j=i+1;j<n;j++)if(Math.abs(a[j][i])>Math.abs(a[pivot][i]))pivot=j;
      [a[i],a[pivot]]=[a[pivot],a[i]];
      if(Math.abs(a[i][i])<1e-12)throw Error('The data does not have enough variation to fit this model.');
      const d=a[i][i];for(let j=i;j<=n;j++)a[i][j]/=d;
      for(let k=0;k<n;k++)if(k!==i){const f=a[k][i];for(let j=i;j<=n;j++)a[k][j]-=f*a[i][j];}
    }
    const coef=a.map(r=>r[n]);return x=>coef[0]+x.reduce((s,v,i)=>s+v*coef[i+1],0);
  }
  function evaluate(test,predict) {
    const mean=test.reduce((s,r)=>s+r.y,0)/test.length;
    const predictions=test.map(r=>predict(r.x));
    const squared=test.reduce((s,r,i)=>s+(r.y-predictions[i])**2,0);
    const total=test.reduce((s,r)=>s+(r.y-mean)**2,0);
    return {r2:total>0?1-squared/total:null,rmse:Math.sqrt(squared/test.length),mae:test.reduce((s,r,i)=>s+Math.abs(r.y-predictions[i]),0)/test.length,predictions};
  }
  const api={fields,sample,parseCSV,split,fit,evaluate};
  if(typeof module!=='undefined' && module.exports)module.exports=api;else root.DemoEngine=api;
})(typeof window!=='undefined'?window:globalThis);
