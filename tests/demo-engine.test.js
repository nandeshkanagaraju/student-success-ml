const assert=require('node:assert/strict');
const E=require('../demo-engine.js');
const rows=E.sample(), {train,test}=E.split(rows);
assert.equal(train.length,256);assert.equal(test.length,64);
assert.equal(new Set([...train,...test]).size,320);
assert.deepEqual(E.split(rows),E.split(rows));
for(const method of ['knn','linear']) {
 const model=E.fit(train,method), score=E.evaluate(test,model);
 assert.ok(Number.isFinite(score.r2));assert.ok(score.rmse>0);
 assert.ok(score.r2>.7,method+' should learn the sample relationship');
 const low=E.fields.map(f=>f[4]), high=low.slice();low[5]=2;high[5]=26;
 assert.ok(model(low)>model(high),method+' should capture the attendance relationship');
 const before=model(low);test.forEach(r=>r.y+=100);assert.equal(model(low),before);test.forEach(r=>r.y-=100);
}
const header=E.fields.map(f=>f[0]).concat('GPA','StudentID','GradeClass');
const csv=header.join(',')+'\r\n'+rows.slice(0,40).map((r,i)=>[...r.x,r.y,i,99].join(',')).join('\r\n');
const parsed=E.parseCSV('\uFEFF'+csv);assert.equal(parsed.length,40);assert.deepEqual(parsed[0],rows[0]);
assert.throws(()=>E.parseCSV(csv.replace('GPA','Target')),/Missing columns/);
assert.throws(()=>E.parseCSV(csv.replace('StudentID','GPA')),/duplicate column/);
assert.throws(()=>E.parseCSV(csv.split('\r\n').slice(0,4).join('\n')),/30 and 5,000/);
assert.throws(()=>E.parseCSV(csv.replace(/\r\n[^,]+,/, '\r\n99,')),/Age/);
assert.equal(E.evaluate([{x:[],y:2},{x:[],y:2}],()=>2).r2,null);
console.log('Demo engine: split isolation, deterministic training, prediction, CSV validation and metrics passed.');
