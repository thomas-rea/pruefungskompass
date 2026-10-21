'use strict';
const assert = require('node:assert/strict');
const {jobs,profileMap,outputRules,withOrals,possibleSubjects,effectiveScores,oralMode}=require('./app.js');
let tests=0;
function check(job,values,expected,label){const o=outputRules(profileMap[job],values);assert.equal(o.passed,expected,job+': '+label);assert.equal(o.complete,true);tests++;return o;}
for(const job of jobs){const s=Object.fromEntries(job.parts.map(p=>[p.id,50]));check(job.id,s,true,'alle genau 50');const incomplete={...s};delete incomplete[job.parts[0].id];assert.equal(outputRules(job,incomplete).complete,false);tests++;}
for(const job of ['mech','im','eat','ebt','am']){
  const all=Object.fromEntries(profileMap[job].parts.map(p=>[p.id,70]));all.aa=49.9;check(job,all,false,'Praxis unter 50 trotz hohem Schnitt');
  const all2={...all,aa:60};all2[profileMap[job].parts[2].id]=29.9;check(job,all2,false,'ungügend in Teil2');
}
// Mechatronik hat KEINE Mindestregel für den schriftlichen Block, industrielle Elektro/Metall schon
check('mech',{p1:100,aa:100,ap:50,fa:50,wiso:30},true,'2 schriftliche 4, schriftlicher Block <50 erlaubt');
for(const id of ['im','am'])check(id,{p1:100,aa:100,af:50,ft:50,wiso:30},false,'schriftlicher Block 46 trotz 2x50');
for(const id of ['eat','ebt'])check(id,{p1:100,aa:100,se:50,fs:50,wiso:30},false,'schriftlicher Block 46 trotz 2x50');
for(const id of ['im','am'])check(id,{p1:0,aa:100,af:100,ft:100,wiso:100},true,'schlechte TAP1 kann ausgeglichen werden');
// Chemikant: 8 Bereiche, 4 TAP1 (40%), 4 TAP2 (60%)
check('chem',{p1a:50,p1v:50,p1m:50,p1anlage:50,p2praxis:50,p2prod:50,p2pl:50,p2wiso:50},true,'alle 50');
check('chem',{p1a:100,p1v:100,p1m:100,p1anlage:100,p2praxis:49,p2prod:100,p2pl:100,p2wiso:100},false,'praktischer Prozess Pflicht');
check('chem',{p1a:100,p1v:100,p1m:100,p1anlage:100,p2praxis:100,p2prod:49,p2pl:100,p2wiso:100},false,'Produktionstechnik Pflicht');
check('chem',{p1a:100,p1v:100,p1m:100,p1anlage:100,p2praxis:100,p2prod:100,p2pl:49,p2wiso:49},false,'PLT oder WiSo mindestens 50');
check('chem',{p1a:100,p1v:100,p1m:100,p1anlage:100,p2praxis:100,p2prod:100,p2pl:30,p2wiso:50},true,'ein anderer schriftlicher ausreichend, einer mangelhaft');
// MAF: Praxis und Schriftliches getrennt; kein globaler Score
const mafPass=check('maf',{praxis:50,pt:50,pp:50,wiso:50},true,'praxis 50 und schriftliche 50');assert.equal(mafPass.score,null);tests++;
check('maf',{praxis:49.9,pt:100,pp:100,wiso:100},false,'Praxis <50 keine Verrechnung');
check('maf',{praxis:100,pt:50,pp:50,wiso:30},false,'2x50 schriftlicher Block <50');
check('maf',{praxis:100,pt:50,pp:50,wiso:50},true,'2x50 und Block 50');
check('maf',{praxis:100,pt:100,pp:29.9,wiso:100},false,'ein ungenügender schriftlicher Teil');
const mechBase={p1:65,aa:60,ap:35,fa:60,wiso:35};
assert.equal(possibleSubjects(profileMap.mech,mechBase).includes('ap'),true);tests++;
assert.equal(outputRules(profileMap.mech,withOrals(mechBase,{ap:100})).passed,true);tests++;
assert.equal(oralMode(profileMap.mech),'single');tests++;
assert.equal(oralMode(profileMap.chem),'single');tests++;
assert.equal(oralMode(profileMap.im),'multiple');tests++;
const chemBase={p1a:80,p1v:70,p1m:70,p1anlage:70,p2praxis:60,p2prod:30,p2pl:60,p2wiso:60};
assert.equal(possibleSubjects(profileMap.chem,chemBase).includes('p2prod'),true);tests++;
assert.equal(possibleSubjects(profileMap.chem,{...chemBase,p2praxis:30}).length,0);tests++;
const c=profileMap.chem;let s=Object.fromEntries(c.parts.map(p=>[p.id,55]));let splits={p2praxis:[60,50,40]};
let v=effectiveScores(c,{values:s,splits,advanced:true});assert.equal(v.p2praxis,54);tests++;
for(const job of jobs){if(job.type!=='maf'){assert.equal(job.parts.reduce((s,p)=>s+p.weight,0),100);tests++;}}
console.log(`${tests} fachliche Tests erfolgreich.`);
