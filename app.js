'use strict';
// Quellenangaben und Prüflogik: Stand 21.10.2026.
// Nur Rechtsverordnungen bestimmen die Bestehensregeln; PAL-Unterlagen erläutern Prüfungsaufgaben.
const SOURCES = {
  metal: { law:'https://www.gesetze-im-internet.de/indmetausbv_2007/__27.html', title:'§ 27 IndMetAusbV – Bestehensregelung' },
  metalIm: { law:'https://www.gesetze-im-internet.de/indmetausbv_2007/__14.html', title:'§ 14 IndMetAusbV – Prüfungsbereiche Industriemechaniker:in' },
  metalAm: { law:'https://www.gesetze-im-internet.de/indmetausbv_2007/__10.html', title:'§ 10 IndMetAusbV – Prüfungsbereiche Anlagenmechaniker:in' },
  electro: { law:'https://www.gesetze-im-internet.de/indelausbv_2007/__27.html', title:'§ 27 IndElAusbV – Bestehensregelung' },
  eAt: { law:'https://www.gesetze-im-internet.de/indelausbv_2007/__18.html', title:'§ 18 IndElAusbV – Elektroniker:in Automatisierungstechnik' },
  eBt: { law:'https://www.gesetze-im-internet.de/indelausbv_2007/__22.html', title:'§ 22 IndElAusbV – Elektroniker:in Betriebstechnik' },
  mech: { law:'https://www.gesetze-im-internet.de/mechatronikerausbv/__8.html', title:'§ 8 MechatronikerAusbV – Bestehensregeln' },
  chem: { law:'https://www.gesetze-im-internet.de/chemikausbv_2009/__9.html', title:'§ 9 ChemikAusbV – Gewichtung und Bestehen' },
  chemOral: { law:'https://www.gesetze-im-internet.de/chemikausbv_2009/__10.html', title:'§ 10 ChemikAusbV – Ergänzungsprüfung' },
  chemP1: { law:'https://www.gesetze-im-internet.de/chemikausbv_2009/__7.html', title:'§ 7 ChemikAusbV – Teil 1, praktische Teilaufgaben' },
  chemP2: { law:'https://www.gesetze-im-internet.de/chemikausbv_2009/__8.html', title:'§ 8 ChemikAusbV – Teil 2, praktische Teilaufgaben' },
  maf: { law:'https://www.gesetze-im-internet.de/maschf_ausbv/__9.html', title:'§ 9 MaschFüAusbV – Abschlussprüfung und Bestehen' },
  mafMid: { law:'https://www.gesetze-im-internet.de/maschf_ausbv/__8.html', title:'§ 8 MaschFüAusbV – Zwischenprüfung' },
  ihk: { law:'https://www.ihk.de/koeln/hauptnavigation/ausbildung/pruefungen/pruefungsergebnisse-der-abschlusspruefung-5015046', title:'IHK Köln – Prüfungsergebnisse sind zunächst vorläufig' }
};
const PAL = {
  im:'https://www.ihk.de/stuttgart/pal/berufe-a-bis-z/industriemechaniker-in-4020--5148822',
  am:'https://www.ihk.de/stuttgart/pal/berufe-a-bis-z/anlagenmechaniker-in-4010--5080584',
  ebt:'https://www.ihk.de/stuttgart/pal/berufe-a-bis-z/elektroniker-in-fuer-betriebstechnik-3090--5093198',
  eat:'https://www.ihk.de/stuttgart/pal/berufe-a-bis-z/elektroniker-in-fuer-automatisierungstechnik-3100--5170586',
  maf:'https://www.ihk.de/stuttgart/pal/berufe-a-bis-z/maschinen-und-anlagenfuehrer-in-4171-4172-4173-4174--5150554',
  chem:'https://www.ihk.de/stuttgart/pal/berufe-a-bis-z/chemikant-in-2661-2671--5154752',
  mech:'https://www.ihk.de/stuttgart/pal/berufe-a-bis-z/mechatroniker-in-0942--5176024'
};
const P=(id,name,group,weight,kind='other',split=null)=>({id,name,group,weight,kind,split});
const A_B=[{label:'Teil A · gebundene Aufgaben',weight:50},{label:'Teil B · ungebundene Aufgaben',weight:50}];
const WISO_SPLIT=[{label:'Gebundene Aufgaben',weight:40},{label:'Ungebundene Aufgaben',weight:60}];
const CHEM1_SPLIT=[{label:'Verfahrens-/produktionstechnische Grundoperation',weight:60},{label:'Messtechnische Aufgabe',weight:20},{label:'Anlagentechnische Montagearbeit',weight:20}];
const CHEM2_SPLIT=[{label:'Verfahrenstechnische Grundoperationen',weight:60},{label:'Regelungs-/Steuerungsaufgabe',weight:20},{label:'Inspektion oder Wartung',weight:20}];
const electroParts=()=>[P('p1','TAP 1 · Komplexe Arbeitsaufgabe','1',40),P('aa','Arbeitsauftrag · praktisch','2',30,'practical'),P('se','Systementwurf','2',12,'written',A_B),P('fs','Funktions- und Systemanalyse','2',12,'written',A_B),P('wiso','Wirtschafts- und Sozialkunde','2',6,'written',WISO_SPLIT)];
const metalParts=(job='im')=>[P('p1',job==='am'?'TAP 1 · Komplexe Arbeitsaufgabe (Rohr-/Anlagenteile)':'TAP 1 · Herstellen einer Baugruppe','1',40),P('aa','Arbeitsauftrag · praktisch','2',30,'practical'),P('af','Auftrags- und Funktionsanalyse','2',12,'written'),P('ft','Fertigungstechnik','2',12,'written'),P('wiso','Wirtschafts- und Sozialkunde','2',6,'written',WISO_SPLIT)];
const jobs=[
  {id:'mech',short:'MT',name:'Mechatroniker:in',category:'Metall & Elektro',type:'mech',details:'Gestreckte Abschlussprüfung · Teil 1 und Teil 2',parts:[P('p1','TAP 1 · Arbeiten an einem mechatronischen Teilsystem','1',40),P('aa','Arbeitsauftrag · praktisch','2',30,'practical'),P('ap','Arbeitsplanung','2',12,'written',A_B),P('fa','Funktionsanalyse','2',12,'written',A_B),P('wiso','Wirtschafts- und Sozialkunde','2',6,'written',WISO_SPLIT)],refs:['mech','ihk'],pal:PAL.mech,notes:'Anders als bei vielen Industrie-Metall- und Elektroberufen wird nach § 8 kein separater ausreichender schriftlicher Block als Bestehensbedingung verlangt. Eine einzige mündliche Ergänzungsprüfung kann möglich sein.',splitNote:'Die Teilaufgaben-Aufteilung ist eine Eingabehilfe nach PAL-Prüfungsschema. Für die konkrete Prüfung maßgeblich ist der ausgewiesene Teilpunkteschlüssel.'},
  {id:'im',short:'IM',name:'Industriemechaniker:in',category:'Metall & Elektro',type:'metal',details:'Gestreckte Abschlussprüfung · Teil 1 und Teil 2',parts:metalParts(),refs:['metal','metalIm','ihk'],pal:PAL.im,notes:'Das gewichtete Ergebnis der drei schriftlichen Teil-2-Bereiche muss separat mindestens 50 Punkte erreichen. Zulässige Ergänzungsprüfungen können sich auf einzelne schriftliche Bereiche beziehen.',splitNote:'Für Auftrags- und Funktionsanalyse sowie Fertigungstechnik sind hier bewusst keine festen A/B-Gewichtungen hinterlegt: Ausschlaggebend ist das Punkteblatt der konkreten PAL-Prüfung.'},
  {id:'eat',short:'EAT',name:'Elektroniker:in für Automatisierungstechnik',category:'Elektrotechnik',type:'electro',details:'Gestreckte Abschlussprüfung · Teil 1 und Teil 2',parts:electroParts(),refs:['electro','eAt','ihk'],pal:PAL.eat,notes:'Zusätzlich zu Gesamt- und Praxisergebnis muss der gewichtete schriftliche Block separat ausreichend sein.',splitNote:'Teil A/Teil B wird für Systementwurf und Funktions- und Systemanalyse jeweils 50:50 berücksichtigt. Für WiSo gilt die typische PAL-Aufteilung 40:60; konkretes Prüfungsheft prüfen.'},
  {id:'ebt',short:'EBT',name:'Elektroniker:in für Betriebstechnik',category:'Elektrotechnik',type:'electro',details:'Gestreckte Abschlussprüfung · Teil 1 und Teil 2',parts:electroParts(),refs:['electro','eBt','ihk'],pal:PAL.ebt,notes:'Der schriftliche Teil-2-Block ist eine zusätzliche eigenständige Bestehensanforderung.',splitNote:'PAL-Vorgaben Sommer 2026 bestätigen die 50:50-Aufteilung in Systementwurf und Funktions- und Systemanalyse. WiSo kann mit 40:60 nach Prüfungsheft eingegeben werden.'},
  {id:'maf',short:'MAF',name:'Maschinen- und Anlagenführer:in',category:'Produktion',type:'maf',details:'Zweijährige Ausbildung · Zwischenprüfung und Abschlussprüfung',parts:[P('praxis','Praktischer Prüfungsteil','p',null,'practical'),P('pt','Produktionstechnik','w',50,'written'),P('pp','Produktionsplanung','w',30,'written'),P('wiso','Wirtschafts- und Sozialkunde','w',20,'written')],refs:['maf','mafMid','ihk'],pal:PAL.maf,notes:'Die Zwischenprüfung geht nicht als Teil 1 in die Abschlussnote ein. Praxis und Schriftliches müssen getrennt mindestens ausreichend sein; die Verordnung enthält keine gemeinsame Prozentgewichtung zwischen diesen beiden Teilen.',splitNote:'Die Prüfungsinhalte variieren je nach Ausbildungsschwerpunkt. Die Bestehenslogik des § 9 gilt unabhängig davon.'},
  {id:'chem',short:'CH',name:'Chemikant:in',category:'Chemie',type:'chem',details:'Gestreckte Abschlussprüfung · acht Prüfungsbereiche',parts:[P('p1a','Verfahrens- und produktionstechnische Arbeit · praktisch','1',20,'other',CHEM1_SPLIT),P('p1v','Verfahrenstechnik','1',5),P('p1m','Messtechnik','1',5),P('p1anlage','Anlagentechnik','1',10),P('p2praxis','Produktions- oder Verarbeitungsprozess · praktisch','2',30,'practical',CHEM2_SPLIT),P('p2prod','Produktionstechnik','2',15,'written'),P('p2pl','Prozessleittechnik','2',5,'written'),P('p2wiso','Wirtschafts- und Sozialkunde','2',10,'written')],refs:['chem','chemP1','chemP2','chemOral','ihk'],pal:PAL.chem,notes:'Produktions-/Verarbeitungsprozess UND Produktionstechnik müssen jeweils ausreichend sein. Daneben muss von Prozessleittechnik und WiSo mindestens ein weiterer Bereich ausreichend sein. Die Prüfungsbereiche des ersten Teils werden einzeln gewichtet.',splitNote:'Die praktischen Teilaufgaben haben gesetzlich vorgeschriebene Gewichtungen von 60:20:20 (§§ 7 und 8). Die Eingabe dieser Teilaufgaben ist optional.'},
  {id:'am',short:'AM',name:'Anlagenmechaniker:in (Industrie)',category:'Metall & Elektro',type:'metal',details:'Industrieller IHK-Beruf · gestreckte Abschlussprüfung',parts:metalParts('am'),refs:['metal','metalAm','ihk'],pal:PAL.am,notes:'Dieser Rechner gilt für Anlagenmechaniker:innen nach der industriellen Metallberufe-Verordnung (IHK), nicht für Anlagenmechaniker:innen Sanitär-, Heizungs- und Klimatechnik (Handwerk).',splitNote:'Für Auftrags- und Funktionsanalyse sowie Fertigungstechnik sind nur Gesamtpunkte hinterlegt, bis der jeweilige PAL-Punkteschlüssel eine genaue A/B-Aufteilung belegt.'}
];
const profileMap=Object.fromEntries(jobs.map(p=>[p.id,p]));
const $=id=>document.getElementById(id);
const fmt=v=>Number.isFinite(v)?v.toLocaleString('de-DE',{minimumFractionDigits:1,maximumFractionDigits:2}):'–';
const pct=n=>`${fmt(n)} %`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isFiniteScore=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=100;
const grade=n=>n>=92?'1':n>=81?'2':n>=67?'3':n>=50?'4':n>=30?'5':'6';
const gradesTitle=n=>n>=92?'sehr gut':n>=81?'gut':n>=67?'befriedigend':n>=50?'ausreichend':n>=30?'mangelhaft':'ungenügend';
const small=xs=>xs.reduce((a,x)=>a+x,0);
function newState(p){return {values:Object.fromEntries(p.parts.map(x=>[x.id,null])),splits:{},advanced:false,oral:{}};}
const savedState=Object.fromEntries(jobs.map(p=>[p.id,newState(p)]));
let current='mech';
const getJob=()=>profileMap[current];
const getState=()=>savedState[current];
function effectiveScores(job,state){
  const o={...state.values};
  if(state.advanced){for(const p of job.parts){if(p.split&&Array.isArray(state.splits[p.id])){const arr=state.splits[p.id];o[p.id]=arr.every(isFiniteScore)?small(arr.map((v,i)=>v*p.split[i].weight/100)):null;}}}
  return o;
}
function outputRules(job,s){
  const all=job.parts.every(p=>isFiniteScore(s[p.id]));
  if(!all)return {complete:false,passed:false,score:null,rules:[],computed:{}};
  if(job.type==='maf'){
    const score=(s.pt*50+s.pp*30+s.wiso*20)/100;
    const written=['pt','pp','wiso'];
    const conditions=[
      ['Praktischer Prüfungsteil mindestens ausreichend',s.praxis>=50,`Praxis: ${fmt(s.praxis)} Punkte`],
      ['Schriftlicher Prüfungsteil mindestens ausreichend',score>=50,`Schriftlicher Block: ${fmt(score)} Punkte`],
      ['Zwei von drei schriftlichen Bereichen mindestens ausreichend',written.filter(k=>s[k]>=50).length>=2,`${written.filter(k=>s[k]>=50).length} von 3 Bereichen`],
      ['Kein schriftlicher Bereich ungenügend',written.every(k=>s[k]>=30),`Niedrigster schriftlicher Bereich: ${fmt(Math.min(...written.map(k=>s[k])))} Punkte`]
    ];
    return {complete:true,passed:conditions.every(c=>c[1]),score:null,rules:conditions,computed:{written:score,practical:s.praxis}};
  }
  const score=small(job.parts.map(p=>s[p.id]*p.weight/100));
  const p2=small(job.parts.filter(p=>p.group==='2').map(p=>s[p.id]*p.weight))/60; // auf 100 Punkte normiertes Ergebnis Teil 2
  let conditions=[['Gesamtergebnis mindestens ausreichend',score>=50,`Gesamt: ${fmt(score)} Punkte`]];
  if(job.type==='chem'){
    conditions.push(['Teil 2 insgesamt mindestens ausreichend',p2>=50,`Teil 2: ${fmt(p2)} Punkte`]);
    conditions.push(['Produktions-/Verarbeitungsprozess mindestens ausreichend',s.p2praxis>=50,`${fmt(s.p2praxis)} Punkte`]);
    conditions.push(['Produktionstechnik mindestens ausreichend',s.p2prod>=50,`${fmt(s.p2prod)} Punkte`]);
    conditions.push(['Prozessleittechnik oder WiSo mindestens ausreichend',s.p2pl>=50||s.p2wiso>=50,`PLT: ${fmt(s.p2pl)} · WiSo: ${fmt(s.p2wiso)}`]);
    conditions.push(['Kein Teil-2-Bereich ungenügend',['p2praxis','p2prod','p2pl','p2wiso'].every(k=>s[k]>=30),'Alle Bereiche von Teil 2 mindestens 30 Punkte']);
  }else{
    const written=job.parts.filter(p=>p.kind==='written');
    const writtenIds=written.map(p=>p.id);
    const block=small(written.map(p=>s[p.id]*p.weight))/30;
    conditions.push(['Arbeitsauftrag mindestens ausreichend',s.aa>=50,`Arbeitsauftrag: ${fmt(s.aa)} Punkte`]);
    if(job.type==='electro'||job.type==='metal')conditions.push(['Schriftlicher Block mindestens ausreichend',block>=50,`Gewichteter schriftlicher Block: ${fmt(block)} Punkte`]);
    conditions.push(['Zwei von drei schriftlichen Bereichen mindestens ausreichend',written.filter(p=>s[p.id]>=50).length>=2,`${written.filter(p=>s[p.id]>=50).length} von 3 Bereichen`]);
    conditions.push(['Kein Prüfungsbereich in Teil 2 ungenügend',['aa',...writtenIds].every(k=>s[k]>=30),'Alle Teil-2-Bereiche mindestens 30 Punkte']);
  }
  return {complete:true,passed:conditions.every(c=>c[1]),score,rules:conditions,computed:{part2:p2,...((job.type==='electro'||job.type==='metal')?{written:small(job.parts.filter(p=>p.kind==='written').map(p=>s[p.id]*p.weight))/30}:{})}};
}
function oralTypes(job){return job.parts.filter(p=>p.kind==='written').map(p=>p.id);}
function oralMode(job){return job.type==='chem'||job.type==='mech'?'single':'multiple';}
function withOrals(base,oral){const s={...base}; for(const [id,v] of Object.entries(oral)){if(isFiniteScore(s[id])&&isFiniteScore(v))s[id]=(2*s[id]+v)/3;}return s;}
function possibleSubjects(job,base){
  const allowed=oralTypes(job).filter(k=>base[k]<50);
  if(!allowed.length)return [];
  const good=outputRules(job,base);
  if(!good.complete||good.passed)return [];
  if(oralMode(job)==='single')return allowed.filter(k=>outputRules(job,withOrals(base,{[k]:100})).passed);
  if(!outputRules(job,withOrals(base,Object.fromEntries(allowed.map(k=>[k,100])))).passed)return [];
  return allowed;
}
function optionLink(label,url){return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;}
function buildJobMenu(){
  $('jobMenu').innerHTML=jobs.map(p=>`<button type="button" class="job-choice" data-job="${p.id}" aria-pressed="${p.id===current}"><span class="job-initial">${p.short}</span><span class="job-name">${esc(p.name)}</span><span class="job-arrow">›</span></button>`).join('');
  $('jobMenu').addEventListener('click',e=>{const b=e.target.closest('[data-job]');if(b)switchJob(b.dataset.job);});
  $('mobileSelect').innerHTML=jobs.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
  $('mobileSelect').addEventListener('change',e=>switchJob(e.target.value));
}
function switchJob(id){
  if(!profileMap[id])return;
  current=id;history.replaceState(null,'',`#${id}`);
  document.querySelectorAll('[data-job]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.job===id)));
  $('mobileSelect').value=id;
  renderJob();
  window.scrollTo({top:0,behavior:'auto'});
}
function makeInput(p){
  const s=getState(); const val=s.values[p.id];
  const split=p.split;
  return `<div class="score-row" data-score="${p.id}"><div class="row-head"><div><div class="row-name">${esc(p.name)}</div><div class="row-meta">${p.weight===null?'Eigenständiger Praxisteil':`Gewichtung Gesamtergebnis: ${fmt(p.weight)} %`}${p.kind==='practical'?' · Praxis':''}</div></div><div class="score-controls"><input type="number" class="point-number" id="n-${p.id}" min="0" max="100" step="0.1" inputmode="decimal" value="${val===null?'':val}" aria-label="Punkte ${esc(p.name)}" placeholder="–"><span class="point-label">P.</span></div></div><input class="slider" type="range" id="r-${p.id}" min="0" max="100" step="1" value="${val===null?50:val}" aria-label="Punkte-Regler ${esc(p.name)}"><div class="slider-ends"><span>0 Punkte</span><span id="g-${p.id}">${isFiniteScore(val)?gradesTitle(val):'Noch keine Eingabe'}</span><span>100 Punkte</span></div>${split?`<div class="split-panel" id="split-${p.id}" ${!s.advanced?'hidden':''}><div class="split-heading">Aufteilung der Teilaufgaben · ${split.map(x=>x.weight+' %').join(' / ')}</div><div class="split-items">${split.map((x,i)=>`<div class="split-item"><label for="s-${p.id}-${i}">${esc(x.label)} <small>${x.weight} %</small></label><div class="split-line"><input type="number" id="s-${p.id}-${i}" min="0" max="100" step="0.1" inputmode="decimal" class="split-num" aria-label="${esc(x.label)} bei ${esc(p.name)}" placeholder="–"><input type="range" id="sr-${p.id}-${i}" min="0" max="100" step="1" value="50" aria-label="Regler ${esc(x.label)}"></div></div>`).join('')}</div><div class="split-total" id="split-total-${p.id}">Ergebnis: –</div></div>`:''}</div>`;
}
function renderJob(){
  const job=getJob(); const state=getState();
  $('jobTitle').textContent=job.name;
  $('jobSubtitle').textContent=job.details;
  $('jobBadge').textContent=job.short;
  $('jobContext').textContent=job.type==='maf'?'Zwischenprüfung ohne Abschlussgewichtung':job.type==='chem'?'Teil 1: 40 % · Teil 2: 60 %':'Teil 1: 40 % · Teil 2: 60 %';
  $('advancedBox').hidden=!job.parts.some(p=>p.split);
  $('advancedToggle').checked=state.advanced;
  const g1=job.parts.filter(p=>p.group==='1'),g2=job.parts.filter(p=>p.group==='2');
  $('scoreSections').innerHTML=job.type==='maf'
    ?`<div class="group-head"><h3>Praktischer Prüfungsteil</h3><span>Eigenständig zu bestehen</span></div>${makeInput(job.parts[0])}<div class="group-head"><h3>Schriftlicher Prüfungsteil</h3><span>Gewichtung innerhalb Schriftliches: 50 / 30 / 20</span></div>${job.parts.slice(1).map(makeInput).join('')}`
    :`<div class="group-head"><h3>Abschlussprüfung Teil 1</h3><span>Gewichtung gesamt: 40 %</span></div>${g1.map(makeInput).join('')}<div class="group-head"><h3>Abschlussprüfung Teil 2</h3><span>Gewichtung gesamt: 60 %</span></div>${g2.map(makeInput).join('')}`;
  $('profileInfo').textContent=job.notes;
  $('splitInfo').textContent=job.splitNote;
  $('legislation').innerHTML=job.refs.map(k=>`<li>${optionLink(SOURCES[k].title,SOURCES[k].law)}</li>`).join('')+`<li>${optionLink('PAL – Prüfungsunterlagen zum Beruf',job.pal)}</li>`;
  $('rulesHeader').textContent=job.type==='maf'?'Bestehensbedingungen (Praxis + Schriftliches)':'Bestehensbedingungen laut Verordnung';
  $('advancedNote').textContent=job.type==='chem'?'Gesetzliche 60/20/20-Aufteilung der praktischen Arbeitsaufgaben': 'Gebundene und ungebundene Aufgaben getrennt eingeben (konkrete PAL-Prüfung beachten)';
  $('resetButton').onclick=()=>{savedState[current]=newState(getJob());renderJob();};
  bindInputs(job);
  draw();
}
function bindInputs(job){
  const state=getState();
  $('advancedToggle').onchange=e=>{state.advanced=e.target.checked; if(state.advanced)for(const p of job.parts.filter(p=>p.split)){
    if(!state.splits[p.id])state.splits[p.id]=p.split.map(()=>state.values[p.id]);
  }draw();};
  for(const p of job.parts){
    const n=$(`n-${p.id}`),r=$(`r-${p.id}`);
    n.addEventListener('change',()=>updatePoint(p.id,n.value));
    r.addEventListener('input',()=>updatePoint(p.id,r.value));
    if(p.split){for(let i=0;i<p.split.length;i++){
      $(`s-${p.id}-${i}`).addEventListener('change',e=>updateSplit(p,i,e.target.value));
      $(`sr-${p.id}-${i}`).addEventListener('input',e=>updateSplit(p,i,e.target.value));
    }}
  }
  $('sampleTypical').onclick=()=>scenario(false);
  $('sampleFail').onclick=()=>scenario(true);
}
function valFromInput(raw){if(String(raw).trim()==='')return null;const v=Number(String(raw).replace(',','.'));return isFiniteScore(v)?v:null;}
function updatePoint(id,raw){
  const state=getState();const job=getJob();const val=valFromInput(raw);state.values[id]=val;
  const p=job.parts.find(x=>x.id===id);if(p.split){state.splits[id]=p.split.map(()=>val);}
  draw();
}
function updateSplit(p,i,raw){
  const state=getState();const arr=state.splits[p.id]||p.split.map(()=>state.values[p.id]);arr[i]=valFromInput(raw);state.splits[p.id]=arr;
  draw();
}
function scenario(failing){
  const job=getJob(),state=getState();state.oral={};state.advanced=false;
  if(job.type==='maf'){
    Object.assign(state.values,failing?{praxis:70,pt:48,pp:45,wiso:60}:{praxis:75,pt:60,pp:54,wiso:64});
  }else if(job.type==='chem'){
    const seq=failing?[72,64,60,57,73,43,48,65]:[63,58,65,54,70,57,54,65];job.parts.forEach((p,i)=>state.values[p.id]=seq[i]);
  }else{
    const seq=failing?[45,76,35,75,35]:[58,70,63,55,60];job.parts.forEach((p,i)=>state.values[p.id]=seq[i]);
  }
  state.splits={};renderJob();
}
function draw(){
  const job=getJob(),state=getState();
  const vals=effectiveScores(job,state); const base=outputRules(job,vals);
  const splits=job.parts.filter(p=>p.split);
  for(const p of job.parts){
    const v=vals[p.id],n=$(`n-${p.id}`),r=$(`r-${p.id}`),g=$(`g-${p.id}`);
    const editingSplit=state.advanced&&p.split;
    n.disabled=!!editingSplit;r.disabled=!!editingSplit;
    n.value=isFiniteScore(v)?String(Number(v.toFixed(3))):'';
    r.value=isFiniteScore(v)?String(v):'50';
    g.textContent=isFiniteScore(v)?`${gradesTitle(v)} · Note ${grade(v)}`:'Noch keine Eingabe';
    g.className=isFiniteScore(v)?(v>=50?'grade-label good':v<30?'grade-label bad':'grade-label warning'):'';
    if(p.split){$(`split-${p.id}`).hidden=!state.advanced;const arr=state.splits[p.id]||p.split.map(()=>state.values[p.id]);
      for(let i=0;i<arr.length;i++){$(`s-${p.id}-${i}`).value=isFiniteScore(arr[i])?String(arr[i]):'';$(`sr-${p.id}-${i}`).value=isFiniteScore(arr[i])?String(arr[i]):'50';}
      $(`split-total-${p.id}`).textContent=`Berechnetes Fachresultat: ${isFiniteScore(v)?fmt(v)+' Punkte':'–'}`;
    }
  }
  $('advancedToggle').checked=state.advanced;
  const missing=job.parts.filter(p=>!isFiniteScore(vals[p.id]));
  $('progressInfo').textContent=missing.length?`${missing.length} von ${job.parts.length} Bewertungen fehlen`:'Alle Bewertungen eingegeben';
  const eligible=base.complete?possibleSubjects(job,vals):[];
  // Vorhandene mündliche Simulation wird nur angewendet, wenn diese bei aktuellen Eingaben noch zulässig ist.
  const effectiveOral=Object.fromEntries(Object.entries(state.oral).filter(([k,v])=>eligible.includes(k)&&isFiniteScore(v)));
  const after=base.complete?outputRules(job,withOrals(vals,effectiveOral)):base;
  showOral(job,vals,base,eligible,effectiveOral,after);
  displayResults(job,after,base,eligible,Object.keys(effectiveOral));
}
function showOral(job,vals,base,eligible,active,after){
  const box=$('oralPanel');
  if(!base.complete){box.innerHTML='<h3>Mündliche Ergänzungsprüfung</h3><p class="muted">Sobald alle Punkte eingetragen sind, werden mögliche Ergänzungsprüfungen angezeigt.</p>';return;}
  if(base.passed){box.innerHTML='<h3>Mündliche Ergänzungsprüfung</h3><p class="muted">Mit diesen Ergebnissen wäre keine Ergänzungsprüfung zum Bestehen erforderlich.</p>';return;}
  if(!eligible.length){box.innerHTML='<h3>Mündliche Ergänzungsprüfung</h3><div class="notice warn">Für diese Punkte ergibt sich keine rechnerisch zum Bestehen führende Ergänzung in den zulässigen schriftlichen Bereichen. Ändere die Ausgangswerte, um andere Szenarien zu prüfen.</div>';return;}
  const mode=oralMode(job);
  box.innerHTML=`<div class="oral-head"><h3>Mündliche Ergänzungsprüfung</h3><span class="micro">Schriftlich : Mündlich = 2 : 1</span></div><p class="muted">${mode==='single'?'Nach der Verordnung ist höchstens ein schriftlicher Bereich ergänzbar.':'Nach der Verordnung sind Ergänzungen in einzelnen schriftlichen Prüfungsbereichen möglich.'} Die endgültige Entscheidung trifft der Prüfungsausschuss.</p><div class="oral-cards">${eligible.map(id=>{
    const p=job.parts.find(x=>x.id===id); const on=Object.prototype.hasOwnProperty.call(active,id); const v=on?active[id]:60;
    return `<div class="oral-card"><label class="oral-select"><input type="checkbox" data-oral="${id}" ${on?'checked':''}> <span>${esc(p.name)} <small>schriftlich: ${fmt(vals[id])} P.</small></span></label>${on?`<div class="oral-score"><input type="range" id="oral-range-${id}" min="0" max="100" step="1" value="${v}" aria-label="Mündliche Punkte ${esc(p.name)}"><input type="number" id="oral-num-${id}" min="0" max="100" step="1" value="${v}" aria-label="Punktzahl mündliche Ergänzungsprüfung ${esc(p.name)}"><span>P.</span></div><div class="oral-compute">Neues Fachresultat: ${fmt((2*vals[id]+v)/3)} Punkte</div>`:''}</div>`;
  }).join('')}</div>${Object.keys(active).length?`<div class="oral-outcome ${after.passed?'good':'bad'}">Mit der simulierten Ergänzungsprüfung: <strong>${after.passed?'BESTANDEN':'NICHT BESTANDEN'}</strong></div>`:''}`;
  box.querySelectorAll('[data-oral]').forEach(input=>input.addEventListener('change',e=>{
    const id=e.target.dataset.oral;
    if(e.target.checked){if(mode==='single')getState().oral={};getState().oral[id]=60;}else delete getState().oral[id];draw();
  }));
  for(const id of Object.keys(active)){
    const slider=$(`oral-range-${id}`);
    slider.addEventListener('input',e=>{
      const value=+e.target.value;
      getState().oral[id]=value;
      $(`oral-num-${id}`).value=String(value);
      const card=slider.closest('.oral-card');
      const detail=card.querySelector('.oral-compute');
      if(detail)detail.textContent=`Neues Fachresultat: ${fmt((2*vals[id]+value)/3)} Punkte`;
      const activeNow=Object.fromEntries(Object.entries(getState().oral).filter(([key,n])=>eligible.includes(key)&&isFiniteScore(n)));
      const simulated=outputRules(job,withOrals(vals,activeNow));
      const outcome=box.querySelector('.oral-outcome');
      if(outcome){outcome.className=`oral-outcome ${simulated.passed?'good':'bad'}`;outcome.innerHTML=`Mit der simulierten Ergänzungsprüfung: <strong>${simulated.passed?'BESTANDEN':'NICHT BESTANDEN'}</strong>`;}
      displayResults(job,simulated,base,eligible,Object.keys(activeNow));
    });
    slider.addEventListener('change',()=>draw());
    $(`oral-num-${id}`).addEventListener('change',e=>{const v=valFromInput(e.target.value);if(v!==null)getState().oral[id]=v;draw();});
  }
}
function displayResults(job,res,base,eligible,oralIds){
  const panel=$('resultPanel');
  const className=!res.complete?'neutral':res.passed?'good':'bad';
  panel.className=`result-card ${className}`;
  const title=!res.complete?'Noch keine vollständige Berechnung':res.passed?'BESTANDEN':'NICHT BESTANDEN';
  const mainScore=job.type==='maf'?`Schriftlich ${res.complete?fmt(res.computed.written):'–'} · Praxis ${res.complete?fmt(res.computed.practical):'–'}`:
    `${res.complete?fmt(res.score):'–'} Punkte gesamt`;
  $('resultLabel').textContent=title;
  $('resultScore').textContent=mainScore;
  $('resultDesc').textContent=!res.complete?'Trage alle geforderten Ergebnisse ein.':res.passed?'Alle gesetzlichen Bestehensbedingungen sind im Rechenmodell erfüllt.':'Mindestens eine gesetzliche Bestehensbedingung ist nicht erfüllt.';
  $('stickyState').textContent=title;
  $('stickyPoints').textContent=res.complete?(job.type==='maf'?`P ${fmt(res.computed.practical)} | S ${fmt(res.computed.written)}`:`${fmt(res.score)} P.`):'Eingaben fehlen';
  $('stickyBar').className=`sticky-bar ${className}`;
  $('resultDetails').innerHTML=!res.complete?`<div class="missing-msg">${job.parts.filter(p=>!isFiniteScore(effectiveScores(job,getState())[p.id])).length} Bewertung(en) fehlen noch.</div>`:
  `<div class="mini-metrics">${job.type==='maf'?`<div><span>Praxis</span><strong>${fmt(res.computed.practical)} P.</strong></div><div><span>Schriftlich</span><strong>${fmt(res.computed.written)} P.</strong></div>`:
  `<div><span>Gesamtergebnis</span><strong>${fmt(res.score)} P.</strong></div><div><span>Teil 2</span><strong>${fmt(res.computed.part2)} P.</strong></div>${Number.isFinite(res.computed.written)?`<div><span>Schriftlicher Block</span><strong>${fmt(res.computed.written)} P.</strong></div>`:''}`}</div><div class="rule-list">${res.rules.map(r=>`<div class="rule-line"><span class="rule-mark ${r[1]?'good':'bad'}">${r[1]?'✓':'×'}</span><div><strong>${esc(r[0])}</strong><small>${esc(r[2])}</small></div></div>`).join('')}</div>`;
  const counter=oralIds.length?`Mündliche Ergänzungsprüfung für ${oralIds.length} Fach/Fächer simuliert. `:'';
  $('warningText').textContent=`${counter}Punkte im Rechner werden ohne amtliche Zwischenrundung verarbeitet. Verbindliche Ergebnisse, Punkteschlüssel und Zulassung zur Ergänzungsprüfung legt die zuständige IHK fest.`;
}
function startup(){buildJobMenu();const hash=location.hash.replace('#','');switchJob(profileMap[hash]?hash:'mech');}
if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',startup);
// Export für reproduzierbare fachliche Testfälle (Node), ohne Einfluss auf die Webseite.
if(typeof module!=='undefined')module.exports={jobs,profileMap,outputRules,effectiveScores,possibleSubjects,withOrals,oralMode};
