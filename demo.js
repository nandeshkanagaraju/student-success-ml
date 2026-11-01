(function () {
  'use strict';
  const E=window.DemoEngine, $=id=>document.getElementById(id);
  let rows=null, source='', predict=null, scores=null, partition=null, baseline=null, last=null, revision=0;
  const labels={Age:'Age',Gender:'Gender code',Ethnicity:'Ethnicity code',ParentalEducation:'Parent education code',StudyTimeWeekly:'Study hours / week',Absences:'Absences',Tutoring:'Tutoring',ParentalSupport:'Parental support',Extracurricular:'Extracurricular',Sports:'Sports',Music:'Music',Volunteering:'Volunteering'};
  const support=['None','Low','Moderate','High','Very high'];
  const main=['Absences','StudyTimeWeekly','ParentalSupport','Tutoring'];
  E.fields.forEach(([name,lo,hi,step,value])=> {
    const div=document.createElement('div');div.className='lab-field';
    const label=document.createElement('label');label.htmlFor='input'+name;label.textContent=labels[name];
    let input;
    if(hi===1 || name==='ParentalSupport') {
      input=document.createElement('select');
      for(let v=lo;v<=hi;v++){const opt=document.createElement('option');opt.value=v;opt.textContent=name==='ParentalSupport'?support[v]:name==='Gender'?String(v):v?'Yes':'No';input.append(opt);}
    } else {
      input=document.createElement('input');input.type='range';input.min=lo;input.max=hi;input.step=step;
      const output=document.createElement('output');output.htmlFor='input'+name;output.textContent=value;label.append(output);
      input.addEventListener('input',()=>{output.textContent=input.value;});
    }
    input.id='input'+name;input.value=value;
    input.addEventListener('input',stale);div.append(label,input);$(main.includes(name)?'labFields':'labOtherFields').append(div);
  });
  $('labColumns').textContent=E.fields.map(f=>f[0]).concat('GPA').join(', ');
  function status(message,error=false){$('labStatus').textContent=message;$('labStatus').dataset.error=String(error);}
  function stage(n){for(let i=1;i<=3;i++)$('labStep'+i).classList.toggle('active',i===n);}
  function stale(){if(last){$('labPrediction').className='lab-empty';$('labPrediction').textContent='Inputs changed. Run Predict GPA to update the estimate.';}last=null;$('labPin').disabled=true;$('labExport').disabled=true;}
  function invalidate(){revision++;predict=null;baseline=null;last=null;$('labInputs').disabled=true;$('labMetrics').hidden=true;$('labPin').disabled=true;$('labExport').disabled=true;$('labPrediction').className='lab-empty';$('labPrediction').textContent='Train the selected model to make a prediction.';stage(rows?2:1);}
  function load(data,label){rows=data;source=label;invalidate();$('labTrain').disabled=false;$('labData').textContent=`${label} · ${rows.length} rows · 12 features · target: GPA. StudentID and GradeClass excluded.`;status('Data ready. Train the model to evaluate on held-out students.');}
  $('labSample').addEventListener('click',()=>{load(E.sample(),'Synthetic teaching data (invented examples)');$('labFile').value='';});
  $('labFile').addEventListener('change',async event=> {
    const file=event.target.files[0];if(!file)return;
    const token=++revision;
    try {
      if(file.size>2*1024*1024)throw Error('Please choose a CSV smaller than 2 MB.');
      const text=await file.text();if(token!==revision)return;
      const data=E.parseCSV(text);load(data,'Uploaded CSV');
    } catch(error) {if(token!==revision)return;rows=null;source='';invalidate();$('labTrain').disabled=true;$('labData').textContent='CSV not loaded. Correct the file or load example data.';status(error.message,true);}
  });
  $('labModel').addEventListener('change',()=>{invalidate();$('labMethod').textContent=$('labModel').value==='knn'?'Finds the five closest training profiles and averages their GPAs. Uses unscaled inputs, like the notebook.':'Fits a weighted sum of the 12 inputs plus an intercept. This is a simple baseline, similar to the notebook’s extra linear analysis.';status(rows?'Model changed. Train again to update the evaluation.':'Load data to begin.');});
  $('labTrain').addEventListener('click',()=> {
    if(!rows)return;
    invalidate();const token=revision, method=$('labModel').value;
    $('labTrain').disabled=true;status('Fitting the model and evaluating held-out rows…');
    // Allow the browser to paint status before performing the calculation.
    setTimeout(()=> {
      if(token!==revision){$('labTrain').disabled=!rows;return;}
      try {
        partition=E.split(rows);predict=E.fit(partition.train,method);scores=E.evaluate(partition.test,predict);
        $('labMetrics').hidden=false;
        $('labMetrics').innerHTML=`<dl class="lab-scores"><div><dt>Test R²</dt><dd>${scores.r2===null?'N/A':scores.r2.toFixed(3)}</dd></div><div><dt>RMSE · GPA</dt><dd>${scores.rmse.toFixed(3)}</dd></div><div><dt>MAE · GPA</dt><dd>${scores.mae.toFixed(3)}</dd></div></dl><p class="tip">${partition.train.length} training rows / ${partition.test.length} test rows. Scores calculated now on ${source==='Uploaded CSV'?'your uploaded CSV':'synthetic data'}; these are separate from the research results. R² can be negative; it is not an accuracy percentage.</p>`;
        const points=partition.test.map((r,i)=>`<circle cx="${36+r.y*59}" cy="${258-Math.max(0,Math.min(4,scores.predictions[i]))*59}" r="2.5" fill="currentColor" opacity=".55"/>`).join('');
        $('labMetrics').insertAdjacentHTML('beforeend',`<svg class="lab-plot" viewBox="0 0 300 300" role="img" aria-label="Actual versus predicted GPA on held-out rows. Dashed diagonal indicates perfect predictions. Predictions outside 0 to 4 are clipped in this plot."><path d="M36 22V258H272 M36 258L272 22" stroke="currentColor" fill="none" stroke-dasharray="4 4" opacity=".3"/>${points}<g fill="currentColor" font-size="10"><text x="30" y="274">0</text><text x="266" y="274">4</text><text x="20" y="27">4</text><text x="100" y="291">Actual GPA →</text><text x="8" y="170" transform="rotate(-90 8 170)">Predicted GPA →</text></g></svg>`);
        $('labInputs').disabled=false;stage(3);status('Model ready. Set a student profile and predict.');
      } catch(error){predict=null;status(error.message,true);}finally{$('labTrain').disabled=!rows;}
    },30);
  });
  function profile(values){E.fields.forEach(([name,,,,def])=>{const input=$('input'+name);input.value=values[name]===undefined?def:values[name];input.dispatchEvent(new Event('input'));});}
  document.querySelectorAll('[data-profile]').forEach(button=>button.addEventListener('click',()=>profile(button.dataset.profile==='regular'?{Absences:3,StudyTimeWeekly:14,Tutoring:1,ParentalSupport:3}:{Absences:24,StudyTimeWeekly:4,Tutoring:0,ParentalSupport:2})));
  $('labReset').addEventListener('click',()=>profile({}));
  $('labPredict').addEventListener('click',()=> {
    if(!predict)return;
    const x=E.fields.map(([name])=>Number($('input'+name).value));
    const raw=predict(x),gpa=Math.max(0,Math.min(4,raw));
    last={source,method:$('labModel').selectedOptions[0].textContent,inputs:Object.fromEntries(E.fields.map(([name],i)=>[name,x[i]])),predictedGPA:gpa,rawPrediction:raw,testMetrics:{r2:scores.r2,rmse:scores.rmse,mae:scores.mae},trainingRows:partition.train.length,testRows:partition.test.length,baseline:baseline?{predictedGPA:baseline.predictedGPA,inputs:baseline.inputs}:null};
    $('labPrediction').className='lab-result';
    const delta=baseline?gpa-baseline.predictedGPA:null;
    $('labPrediction').innerHTML=`<div class="ctl-label">Estimated GPA · ${source==='Uploaded CSV'?'uploaded data':'synthetic-data model'}</div><div class="lab-gpa">${gpa.toFixed(2)} <small>/ 4.00</small></div><div class="lab-meter" aria-hidden="true"><i style="width:${gpa*25}%"></i></div><p>${delta===null?'Keep this estimate as a baseline, change an input, then predict again.':`${delta>=0?'+':'−'}${Math.abs(delta).toFixed(2)} GPA points versus baseline (${baseline.predictedGPA.toFixed(2)}).`}</p><p class="tip">Held-out mean absolute error: ${scores.mae.toFixed(3)} GPA points. This is average test error, not a confidence interval.${raw!==gpa?' The raw estimate ('+raw.toFixed(2)+') was clipped to the GPA range.':''}</p>`;
    $('labPin').disabled=false;$('labExport').disabled=false;
  });
  $('labPin').addEventListener('click',()=>{if(!last)return;baseline=last;status(`Baseline saved: ${baseline.predictedGPA.toFixed(2)} GPA. Change inputs and predict to compare.`);});
  $('labExport').addEventListener('click',()=>{if(!last)return;const url=URL.createObjectURL(new Blob([JSON.stringify(last,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='student-prediction.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();
