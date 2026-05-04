'use strict';

const BASE_PATH = '/Ankerpruefung/';
console.log('HTB Prüf-App app.js loaded');

const STORAGE_STATE = 'htb-pruef-app-v20';
const STORAGE_HISTORY = 'htb-pruef-history-v20';
const STORAGE_KALIB = 'htb-pruef-kalib-v20';
const HISTORY_MAX = 30;

const TEST_KEYS = ['eignung', 'auszieh', 'abnahme'];
const TEST_LABELS = {
  eignung: 'Eignungsprüfung',
  auszieh: 'Ausziehversuch',
  abnahme: 'Abnahmeprüfung'
};

const FILIALEN = {
  Arzl:{adresse:'A-6471 Arzl im Pitztal, Gewerbepark Pitztal 16',tel:'+43 5412 / 63975',email:'office.arzl@htb-bau.at'},
  'Nüziders':{adresse:'A-6714 Nüziders, Landstraße 19',tel:'+43 5552 / 34 739',email:'office.nueziders@htb-bau.at'},
  Zirl:{adresse:'A-6170 Zirl, Neuraut 1',tel:'+43 5238 / 58 873 1',email:'office.ibk@htb-bau.at'},
  Schwoich:{adresse:'A-6334 Schwoich, Kufsteiner Wald 28',tel:'+43 5372 / 63 600',email:'office.schwoich@htb-bau.at'},
  Fusch:{adresse:'A-5672 Fusch a.d. Großglocknerstraße, Achenstraße 2',tel:'+43 6546 / 40 116',email:'office.fusch@htb-bau.at'},
  Wels:{adresse:'A-4600 Wels, Hans-Sachs-Straße 103',tel:'+43 7242 / 601 600',email:'office.wels@htb-bau.at'},
  Klagenfurt:{adresse:'A-9020 Klagenfurt, Josef-Sablatnig-Straße 251',tel:'+43 463 / 33 533 700',email:'office.klagenfurt@htb-bau.at'}
};

const BUILTIN_KALIBRIERUNGEN = [
  {
    id: 'builtin_nc41333832_2026_01_26',
    displayName: 'CFK Presse NC41333832',
    presseTyp: 'L-HK-DZ-140-250-105-HPR',
    presseNr: 'NC41333832',
    manometerTyp: 'DSI 160/1000',
    manometerNr: '300177',
    kalibriertAm: '2026-01-26',
    gueltigMonate: 12,
    punkte: [
      { kN: 5,    bar: 3   },
      { kN: 10,   bar: 5   },
      { kN: 15,   bar: 8   },
      { kN: 20,   bar: 10  },
      { kN: 25,   bar: 13  },
      { kN: 30,   bar: 15  },
      { kN: 35,   bar: 18  },
      { kN: 40,   bar: 20  },
      { kN: 45,   bar: 23  },
      { kN: 50,   bar: 26  },
      { kN: 55,   bar: 28  },
      { kN: 60,   bar: 31  },
      { kN: 65,   bar: 33  },
      { kN: 70,   bar: 36  },
      { kN: 75,   bar: 38  },
      { kN: 80,   bar: 41  },
      { kN: 85,   bar: 43  },
      { kN: 90,   bar: 46  },
      { kN: 95,   bar: 49  },
      { kN: 100,  bar: 51  },
      { kN: 110,  bar: 56  },
      { kN: 120,  bar: 61  },
      { kN: 130,  bar: 66  },
      { kN: 140,  bar: 71  },
      { kN: 150,  bar: 77  },
      { kN: 160,  bar: 82  },
      { kN: 170,  bar: 87  },
      { kN: 180,  bar: 92  },
      { kN: 190,  bar: 97  },
      { kN: 200,  bar: 102 },
      { kN: 220,  bar: 112 },
      { kN: 240,  bar: 122 },
      { kN: 260,  bar: 133 },
      { kN: 280,  bar: 143 },
      { kN: 300,  bar: 153 },
      { kN: 320,  bar: 164 },
      { kN: 340,  bar: 174 },
      { kN: 360,  bar: 184 },
      { kN: 380,  bar: 194 },
      { kN: 400,  bar: 204 },
      { kN: 420,  bar: 215 },
      { kN: 440,  bar: 224 },
      { kN: 460,  bar: 235 },
      { kN: 480,  bar: 245 },
      { kN: 500,  bar: 255 },
      { kN: 520,  bar: 265 },
      { kN: 540,  bar: 275 },
      { kN: 560,  bar: 285 },
      { kN: 580,  bar: 296 },
      { kN: 600,  bar: 306 },
      { kN: 620,  bar: 316 },
      { kN: 640,  bar: 326 },
      { kN: 660,  bar: 336 },
      { kN: 680,  bar: 346 },
      { kN: 700,  bar: 357 },
      { kN: 720,  bar: 367 },
      { kN: 740,  bar: 377 },
      { kN: 760,  bar: 387 },
      { kN: 780,  bar: 397 },
      { kN: 800,  bar: 407 },
      { kN: 850,  bar: 433 },
      { kN: 900,  bar: 459 },
      { kN: 950,  bar: 484 },
      { kN: 1000, bar: 510 },
      { kN: 1050, bar: 535 },
      { kN: 1100, bar: 561 },
      { kN: 1150, bar: 586 },
      { kN: 1200, bar: 611 },
      { kN: 1250, bar: 637 },
      { kN: 1300, bar: 662 },
      { kN: 1350, bar: 687 },
      { kN: 1400, bar: 712 }
    ]
  }
];

/* technische Daten */
const TYPE_LIBRARY = [
  { key:'GEWI_T_25', group:'GEWI [T]', label:'GEWI [T] 25', At:491, lastStreck:270, lastStreck90:243, bruchlast:304, bruch80:243.2, nenndurchmesser:25, muffe:40, streckZug:'550/620' },
  { key:'GEWI_T_28', group:'GEWI [T]', label:'GEWI [T] 28', At:616, lastStreck:340, lastStreck90:306, bruchlast:382, bruch80:305.6, nenndurchmesser:28, muffe:45, streckZug:'550/620' },
  { key:'GEWI_T_32', group:'GEWI [T]', label:'GEWI [T] 32', At:804, lastStreck:440, lastStreck90:396, bruchlast:499, bruch80:399.2, nenndurchmesser:32, muffe:52, streckZug:'550/620' },
  { key:'GEWI_T_40', group:'GEWI [T]', label:'GEWI [T] 40', At:1257, lastStreck:693, lastStreck90:623.7, bruchlast:781, bruch80:624.8, nenndurchmesser:40, muffe:65, streckZug:'550/620' },
  { key:'GEWI_T_50', group:'GEWI [T]', label:'GEWI [T] 50', At:1963, lastStreck:1080, lastStreck90:972, bruchlast:1215, bruch80:972, nenndurchmesser:50, muffe:80, streckZug:'550/620' },
  { key:'GEWI_T_57_5', group:'GEWI [T]', label:'GEWI [T] 57,5', At:2597, lastStreck:1441, lastStreck90:1296.9, bruchlast:1818, bruch80:1454.4, nenndurchmesser:57.5, muffe:102, streckZug:'555/700' },
  { key:'GEWI_TR_25', group:'GEWI Plus [TR]', label:'GEWI Plus [TR] 25', At:491, lastStreck:329, lastStreck90:296.1, bruchlast:393, bruch80:314.4, nenndurchmesser:25, muffe:45, streckZug:'670/800' },
  { key:'GEWI_TR_30', group:'GEWI Plus [TR]', label:'GEWI Plus [TR] 30', At:707, lastStreck:474, lastStreck90:426.6, bruchlast:565, bruch80:452, nenndurchmesser:30, muffe:55, streckZug:'670/800' },
  { key:'GEWI_TR_35', group:'GEWI Plus [TR]', label:'GEWI Plus [TR] 35', At:962, lastStreck:645, lastStreck90:580.5, bruchlast:770, bruch80:616, nenndurchmesser:35, muffe:65, streckZug:'670/800' },
  { key:'GEWI_TR_43', group:'GEWI Plus [TR]', label:'GEWI Plus [TR] 43', At:1452, lastStreck:973, lastStreck90:875.7, bruchlast:1162, bruch80:929.6, nenndurchmesser:43, muffe:80, streckZug:'670/800' },
  { key:'GEWI_TR_50', group:'GEWI Plus [TR]', label:'GEWI Plus [TR] 50', At:1936, lastStreck:1315, lastStreck90:1183.5, bruchlast:1570, bruch80:1256, nenndurchmesser:50, muffe:90, streckZug:'670/800' },
  { key:'GEWI_TR_57_5', group:'GEWI Plus [TR]', label:'GEWI Plus [TR] 57,5', At:2597, lastStreck:1740, lastStreck90:1566, bruchlast:2077, bruch80:1661.6, nenndurchmesser:57.5, muffe:102, streckZug:'670/800' },
  { key:'GEWI_WR_26_5', group:'GEWI hochfest [WR]', label:'GEWI hochfest [WR] 26,5', At:552, lastStreck:525, lastStreck90:472.5, bruchlast:580, bruch80:464, nenndurchmesser:26.5, muffe:50, streckZug:'950/1050' },
  { key:'GEWI_WR_32', group:'GEWI hochfest [WR]', label:'GEWI hochfest [WR] 32', At:804, lastStreck:760, lastStreck90:684, bruchlast:845, bruch80:676, nenndurchmesser:32, muffe:60, streckZug:'950/1050' },
  { key:'GEWI_WR_36', group:'GEWI hochfest [WR]', label:'GEWI hochfest [WR] 36', At:1018, lastStreck:960, lastStreck90:864, bruchlast:1070, bruch80:856, nenndurchmesser:36, muffe:68, streckZug:'950/1050' },
  { key:'GEWI_WR_40', group:'GEWI hochfest [WR]', label:'GEWI hochfest [WR] 40', At:1257, lastStreck:1190, lastStreck90:1071, bruchlast:1320, bruch80:1056, nenndurchmesser:40, muffe:70, streckZug:'950/1050' },
  { key:'GEWI_WR_47', group:'GEWI hochfest [WR]', label:'GEWI hochfest [WR] 47', At:1735, lastStreck:1650, lastStreck90:1485, bruchlast:1820, bruch80:1456, nenndurchmesser:47, muffe:83, streckZug:'950/1050' },
  { key:'IBO_R32_280', group:'IBO', label:'IBO R32-280', At:410, lastStreck:220, lastStreck90:198, bruchlast:280, bruch80:224, nenndurchmesser:42, muffe:null, streckZug:null },
  { key:'IBO_R32_360', group:'IBO', label:'IBO R32-360', At:510, lastStreck:280, lastStreck90:252, bruchlast:360, bruch80:288, nenndurchmesser:42, muffe:null, streckZug:null },
  { key:'IBO_R38_500', group:'IBO', label:'IBO R38-500', At:750, lastStreck:400, lastStreck90:360, bruchlast:500, bruch80:400, nenndurchmesser:51, muffe:null, streckZug:null },
  { key:'IBO_R51_550', group:'IBO', label:'IBO R51-550', At:890, lastStreck:450, lastStreck90:405, bruchlast:550, bruch80:440, nenndurchmesser:63, muffe:null, streckZug:null },
  { key:'IBO_R51_800', group:'IBO', label:'IBO R51-800', At:1150, lastStreck:640, lastStreck90:576, bruchlast:800, bruch80:640, nenndurchmesser:63, muffe:null, streckZug:null }
];

/* ---------------- util ---------------- */
const $ = id => document.getElementById(id);

function clone(v){ return JSON.parse(JSON.stringify(v)); }
function h(v){
  return String(v ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
function fmt(v,d=2){
  const n=Number(v);
  return Number.isFinite(n)?n.toFixed(d).replace('.',','):'—';
}
function formatInputNumber(n,d=1){
  if(!Number.isFinite(n)) return '';
  const s=n.toFixed(d);
  return s.replace(/\.0+$/,'').replace(/(\.\d*[1-9])0+$/,'$1');
}
function parseIntervalStr(str){
  return [...new Set(String(str||'').split(',').map(s=>Number(s.trim())).filter(n=>Number.isFinite(n)&&n>=0))].sort((a,b)=>a-b);
}
function normalizeCsvDate(value){
  const s = String(value||'').trim();
  if(!s) return '';
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
  m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
  if(m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  return s;
}
function toNumFlexible(v){
  const s = String(v ?? '').trim();
  if(!s) return NaN;
  if(s.includes(',') && s.includes('.')) return Number(s.replace(/\./g,'').replace(',', '.'));
  if(s.includes(',')) return Number(s.replace(',', '.'));
  return Number(s);
}
function dateDE(iso){
  const s=String(iso||'').trim();
  const m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : s;
}
function dateTag(d=new Date()){
  return `${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${d.getFullYear()}`;
}
function formatElapsed(ms){
  const t = Math.max(0, Math.floor(ms/1000));
  const hh = Math.floor(t/3600);
  const mm = Math.floor((t%3600)/60);
  const ss = t%60;
  return hh>0
    ? `${hh}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
    : `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}
function uid(){
  try{ return crypto.randomUUID(); }
  catch{ return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`; }
}

/* ---------------- dynamic style tweaks ---------------- */
function ensureDynamicStyles(){
  if(document.getElementById('app-dynamic-style-v20')) return;
  const style = document.createElement('style');
  style.id = 'app-dynamic-style-v20';
  style.textContent = `
    .field__input--required, .field__select--required, .field__textarea--required{
      background: rgba(255,80,80,.10) !important;
      border-color: rgba(255,120,120,.45) !important;
    }
    .field__input--computed{
      color:#2bb673 !important;
      font-weight:800 !important;
    }
    .mess-stage-col, .th-stage{
      width:58px !important;
      min-width:58px !important;
      max-width:58px !important;
      text-align:center;
      font-size:11px;
    }
    .mess-load-col, .th-load{
      width:66px !important;
      min-width:66px !important;
      max-width:66px !important;
      text-align:center;
      font-size:11px;
    }
  `;
  document.head.appendChild(style);
}

function setRequiredVisual(el, required){
  if(!el) return;
  el.classList.remove('field__input--required','field__select--required','field__textarea--required');
  if(required){
    if(el.classList.contains('field__select')) el.classList.add('field__select--required');
    else if(el.classList.contains('field__textarea')) el.classList.add('field__textarea--required');
    else el.classList.add('field__input--required');
  }
}

function applyComputedVisual(el, computed){
  if(!el) return;
  el.classList.toggle('field__input--computed', !!computed);
}

/* ---------------- state ---------------- */
function makeGlobalMeta(){
  return {
    filiale:'',
    bauvorhaben:'',
    bauherr:'',
    bauleitung:'',
    lage:'',
    nummer:'',
    blattNr:'',
    pruefdatum:'',
    pumperNr:'',
    anmerkung:'',
    selectedKalibId:''
  };
}

function makeSpec(testKey){
  if(testKey === 'eignung'){
    return {
      bodenart:'nichtbindig',
      typKey:'',
      LA:'',
      Ltb:'',
      Ltf:'',
      Le:'',
      Et:'0,205',
      At:'',
      P0:'',
      Pa:'',
      Pd:'',
      gamma:'1,1',
      Pp:'',
      Pt01k:''
    };
  }
  return {
    bodenart:'nichtbindig',
    typKey:'',
    L:'',
    Lb:'',
    Ldb:'',
    Ueberstand:'',
    Et:'205',
    At:'',
    P0:'',
    Pd:'',
    k:'',
    Pp:'',
    Pt01k:''
  };
}

function factorLabel(f){
  const n = Number(f);
  if(n === -1) return 'P0';
  if(n === 0) return 'Pa';
  if(Math.abs(n - 1) < 1e-9) return 'Pp';
  return `${formatInputNumber(n,2).replace('.',',')}*Pp`;
}

function makeStageDef(kind='factor', factor=0.4, intervals=[0,1]){
  let label = 'Pa';
  if(kind === 'p0') label = 'P0';
  else if(kind === 'pa') label = 'Pa';
  else label = factorLabel(factor);
  return {
    kind,
    factor: kind === 'factor' ? Number(factor) : (kind === 'p0' ? -1 : 0),
    label,
    intervalsStr: intervals.join(', '),
    druck:''
  };
}

function normalizeStageDef(stage){
  if(!stage) return makeStageDef('pa',0,[1]);
  const kind = stage.kind || (stage.label === 'P0' ? 'p0' : stage.label === 'Pa' ? 'pa' : 'factor');
  const factor = kind === 'factor' ? Number(stage.factor || 0.4) : (kind === 'p0' ? -1 : 0);
  return {
    kind,
    factor,
    label: kind === 'factor' ? factorLabel(factor) : (kind === 'p0' ? 'P0' : 'Pa'),
    intervalsStr: stage.intervalsStr || '0, 1',
    druck: stage.druck || ''
  };
}

function buildEignungNormCycles(bodenart='nichtbindig'){
  const z5Intervals = bodenart === 'bindig'
    ? [0,1,2,3,4,5,7,10,15,20,30,45,60,90,120,150,180]
    : [0,1,2,3,4,5,7,10,15,20,30,45,60];

  return [
    {
      nr:1,
      title:'Zyklus 1',
      holdStageIdx:1,
      stageDefs:[
        makeStageDef('pa',0,[1]),
        makeStageDef('factor',0.4,[0,1,2,3,4,5,7,10,15]),
        makeStageDef('pa',0,[1])
      ]
    },
    {
      nr:2,
      title:'Zyklus 2',
      holdStageIdx:1,
      stageDefs:[
        makeStageDef('factor',0.4,[1]),
        makeStageDef('factor',0.55,[0,1,2,3,4,5,7,10,15]),
        makeStageDef('factor',0.4,[1]),
        makeStageDef('pa',0,[1])
      ]
    },
    {
      nr:3,
      title:'Zyklus 3',
      holdStageIdx:2,
      stageDefs:[
        makeStageDef('factor',0.4,[1]),
        makeStageDef('factor',0.55,[1]),
        makeStageDef('factor',0.7,[0,1,2,3,4,5,7,10,15,20,30]),
        makeStageDef('factor',0.55,[1]),
        makeStageDef('factor',0.4,[1]),
        makeStageDef('pa',0,[1])
      ]
    },
    {
      nr:4,
      title:'Zyklus 4',
      holdStageIdx:3,
      stageDefs:[
        makeStageDef('factor',0.4,[1]),
        makeStageDef('factor',0.55,[1]),
        makeStageDef('factor',0.7,[1]),
        makeStageDef('factor',0.85,[0,1,2,3,4,5,7,10,15,20,30,45,60]),
        makeStageDef('factor',0.7,[1]),
        makeStageDef('factor',0.55,[1]),
        makeStageDef('factor',0.4,[1]),
        makeStageDef('pa',0,[1])
      ]
    },
    {
      nr:5,
      title:'Zyklus 5',
      holdStageIdx:4,
      stageDefs:[
        makeStageDef('factor',0.4,[1]),
        makeStageDef('factor',0.55,[1]),
        makeStageDef('factor',0.7,[1]),
        makeStageDef('factor',0.85,[1]),
        makeStageDef('factor',1.0,z5Intervals),
        makeStageDef('factor',0.85,[1]),
        makeStageDef('factor',0.7,[1]),
        makeStageDef('factor',0.55,[1]),
        makeStageDef('factor',0.4,[1]),
        makeStageDef('pa',0,[1]),
        makeStageDef('p0',-1,[1])
      ]
    }
  ];
}

function buildAusziehOrAbnahmeNormCycles(testKey){
  const criteriaLow = testKey === 'abnahme'
    ? 'Änderung < 0,1 mm / 5 min'
    : 'Änderung < 0,5 mm / Zeitstufe';

  const criteriaPp = testKey === 'abnahme'
    ? 'Änderung < 0,1 mm von 10 → 15 min'
    : 'Änderung < 0,5 mm / Zeitstufe';

  return [
    { nr:0, title:'Schritt 0', holdStageIdx:0, criterion:'Anfangsverschiebung', stageDefs:[makeStageDef('p0',-1,[0,1])] },
    { nr:1, title:'Schritt 1', holdStageIdx:0, criterion:criteriaLow, stageDefs:[makeStageDef('factor',0.2,[0,1,2,5,10,15,20])] },
    { nr:2, title:'Schritt 2', holdStageIdx:0, criterion:criteriaLow, stageDefs:[makeStageDef('factor',0.4,[0,1,2,5,10,15,20])] },
    { nr:3, title:'Schritt 3', holdStageIdx:0, criterion:criteriaLow, stageDefs:[makeStageDef('factor',0.6,[0,1,2,5,10,15,20])] },
    { nr:4, title:'Schritt 4', holdStageIdx:0, criterion:criteriaLow, stageDefs:[makeStageDef('factor',0.8,[0,1,2,5,10,15,20])] },
    { nr:5, title:'Schritt 5', holdStageIdx:0, criterion:criteriaPp, stageDefs:[makeStageDef('factor',1.0,[0,1,2,5,10,15,20,30,60])] },
    { nr:6, title:'Entlastung', holdStageIdx:0, criterion:'Restsetzung Dr', stageDefs:[makeStageDef('p0',-1,[0,1])] }
  ];
}

function makeCycleFromDef(def, oldCycle=null){
  const oldRows = Object.fromEntries((oldCycle?.rows || []).map(r => [`${r.stageIdx}|${r.min}`, r]));
  const stageDefs = (def.stageDefs || []).map((s, i) => {
    const old = oldCycle?.stageDefs?.[i];
    return {
      ...normalizeStageDef(s),
      druck: old?.druck || s.druck || ''
    };
  });

  const rows = [];
  stageDefs.forEach((stage, stageIdx) => {
    const ints = parseIntervalStr(stage.intervalsStr);
    ints.forEach(min => {
      const old = oldRows[`${stageIdx}|${min}`];
      rows.push(old ? { ...old, stageIdx, min } : {
        stageIdx,
        min,
        ablesung:'',
        versch:'',
        anm:''
      });
    });
  });

  return {
    id: oldCycle?.id || uid(),
    nr: def.nr,
    title: def.title || `Zyklus ${def.nr}`,
    holdStageIdx: Number.isInteger(def.holdStageIdx) ? def.holdStageIdx : 0,
    criterion: def.criterion || '',
    elapsedMs: oldCycle?.elapsedMs || 0,
    startzeit: oldCycle?.startzeit || '',
    stageDefs,
    rows
  };
}

function makeTestState(key){
  const defs = key === 'eignung'
    ? buildEignungNormCycles('nichtbindig')
    : buildAusziehOrAbnahmeNormCycles(key);

  const cycles = defs.map(d => makeCycleFromDef(d));
  return {
    typeKey:'',
    mode:'norm',
    activeCycleId: cycles[0]?.id || '',
    spec: makeSpec(key),
    cycles,
    photos:{
      overview:null,
      detail:null
    }
  };
}

function getInitialState(){
  return {
    activeTest:'eignung',
    evalTest:'eignung',
    settings:{
      alarmDurationSec:4,
      alarmSoundEnabled:true
    },
    meta: makeGlobalMeta(),
    tests:{
      eignung: makeTestState('eignung'),
      auszieh: makeTestState('auszieh'),
      abnahme: makeTestState('abnahme')
    }
  };
}

const state = getInitialState();
const timerMap = {};
let _saveT = null;
let _audioCtx = null;
let _alarmGain = null;
let _alarmReady = false;
let _floatingRaf = null;
let _timeAdjustCtx = null;

function getTest(key){ return state.tests[key]; }

function ensureActiveCycle(testKey){
  const test = getTest(testKey);
  if(!test.cycles.length){
    test.activeCycleId = '';
    return null;
  }
  let c = test.cycles.find(cy => cy.id === test.activeCycleId);
  if(!c){
    c = test.cycles[0];
    test.activeCycleId = c.id;
  }
  return c;
}

function getCycleById(testKey, cycleId){
  return getTest(testKey).cycles.find(c => c.id === cycleId) || null;
}

function getActiveCycle(testKey){
  return ensureActiveCycle(testKey);
}

function getAnkertypByKey(key){
  return TYPE_LIBRARY.find(t => t.key === key) || null;
}

/* ---------------- render helpers ---------------- */
function getNumberLabel(testKey){
  if(testKey === 'eignung') return 'Anker Nr.';
  if(testKey === 'abnahme') return 'Pfahl Nr.';
  return 'Nagel Nr.';
}

function getLocationLabel(testKey){
  if(testKey === 'eignung') return 'Ankerlage';
  if(testKey === 'abnahme') return 'Pfahllage';
  return 'Nagellage';
}

function getTypeLabel(testKey){
  if(testKey === 'eignung') return 'Ankertyp';
  if(testKey === 'abnahme') return 'Pfahltyp';
  return 'Nageltyp';
}

function renderTypeOptions(currentKey){
  const groups = {};
  TYPE_LIBRARY.forEach(t => {
    if(!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });

  return `<option value="">Bitte wählen</option>${
    Object.entries(groups).map(([group, items]) => `
      <optgroup label="${h(group)}">
        ${items.map(item => `<option value="${h(item.key)}" ${currentKey === item.key ? 'selected' : ''}>${h(item.label)}</option>`).join('')}
      </optgroup>
    `).join('')
  }`;
}

function renderTypeInfo(testKey){
  const typ = getAnkertypByKey(getTest(testKey).typeKey);
  if(!typ) return '';

  const rows = [
    ['Typ', typ.label],
    ['Nenndurchmesser', typ.nenndurchmesser != null ? `${typ.nenndurchmesser} mm` : '—'],
    ['Ø über Muffe', typ.muffe != null ? `${typ.muffe} mm` : '—'],
    ['Streckgrenze / Zugfestigkeit', typ.streckZug || '—'],
    ['Querschnittsfläche At', typ.At != null ? `${fmt(typ.At,0)} mm²` : '—'],
    ['Last an der Streckgrenze', typ.lastStreck != null ? `${fmt(typ.lastStreck,1)} kN` : '—'],
    ['90 % Streckgrenze', typ.lastStreck90 != null ? `${fmt(typ.lastStreck90,1)} kN` : '—'],
    ['Bruchlast', typ.bruchlast != null ? `${fmt(typ.bruchlast,1)} kN` : '—'],
    ['80 % Bruchlast', typ.bruch80 != null ? `${fmt(typ.bruch80,1)} kN` : '—']
  ];

  return `
    <div class="info-box">
      <b>Technische Daten</b><br>
      ${rows.map(([k,v]) => `${h(k)}: <b>${h(v)}</b>`).join('<br>')}
    </div>
  `;
}

function renderStutzpunkteControl(){
  return `
    <div id="kalibStuetzpunkteWrap" hidden style="margin-top:14px">
      <div class="settings-group__title" style="margin-bottom:6px">
        Stützpunkte-Kontrolle
        <span style="font-weight:400; font-size:12px; color:rgba(220,235,250,.7)">
          — exakte CSV-Werte, keine Interpolation
        </span>
      </div>

      <label class="field">
        <span class="field__label">Stützpunkt auswählen</span>
        <select id="kalibStuetzpunkteSelect" class="field__select">
          <option value="">Stützpunkt auswählen …</option>
        </select>
      </label>

      <div id="kalibStuetzpunkteResult" class="stuetz-result"></div>
    </div>
  `;
}

function renderPressSection(){
  return `
    <details class="card card--collapsible" open>
      <summary class="card__title">Presse / Kalibrierung</summary>
      <div class="card__body">
        <div class="form-grid">
          <label class="field field--full">
            <span class="field__label">Spannpresse auswählen</span>
            <select id="presseSelect" class="field__select"></select>
          </label>
        </div>

        <div class="action-row" style="justify-content:flex-start; margin-top:12px; gap:8px; flex-wrap:wrap">
          <button id="btnKalibImport" class="btn btn--ghost btn--small" type="button">📥 CSV importieren</button>
          <button id="btnKalibExport" class="btn btn--ghost btn--small" type="button">📤 CSV exportieren / Vorlage</button>
          <button id="btnKalibDelete" class="btn btn--danger btn--small" type="button">🗑 Kalibrierung löschen</button>
          <input id="kalibImportInput" type="file" accept=".csv,text/csv" style="display:none" />
        </div>

        <p id="kalibEmptyHint" class="hint" style="text-align:left; margin-top:10px">
          Noch keine Presse ausgewählt. CSV importieren oder Presse aus der Liste wählen.
        </p>

        <div id="kalibInfoBox" class="settings-group kalib-info" hidden style="margin-top:12px">
          <div class="kalib-info__header">
            <div>
              <div id="kalibName" class="kalib-info__name">—</div>
              <div id="kalibSub" class="kalib-info__sub">—</div>
            </div>
            <div id="kalibValidBadge" class="kalib-badge">—</div>
          </div>

          <div class="kalib-info__grid">
            <div class="kalib-info__item"><div class="kalib-info__label">Pressentyp</div><div id="kInfo-presseTyp" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Pressen-Nr.</div><div id="kInfo-presseNr" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Manometertyp</div><div id="kInfo-manTyp" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Manometer-Nr.</div><div id="kInfo-manNr" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Kalibriert am</div><div id="kInfo-kalibAm" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Gültig bis</div><div id="kInfo-gueltigBis" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Stützpunkte</div><div id="kInfo-punkte" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Max. Last</div><div id="kInfo-maxKn" class="kalib-info__val">—</div></div>
          </div>

          ${renderStutzpunkteControl()}
        </div>

        <div id="kalibPreview" class="kalib-preview" hidden>
          <div class="kalib-preview__title">Druckvorschau für aktuelle Vorgaben</div>
          <div id="kalibPreviewTable" class="kalib-preview__table"></div>
        </div>
      </div>
    </details>
  `;
}

function renderMetaSection(testKey){
  const m = state.meta;
  return `
    <details class="card card--collapsible" open>
      <summary class="card__title">Stammdaten</summary>
      <div class="card__body">
        <div class="form-grid">
          <label class="field">
            <span class="field__label">Niederlassung *</span>
            <select class="field__select" data-role="meta-filiale">
              <option value="">Bitte wählen</option>
              ${Object.keys(FILIALEN).map(f => `<option value="${h(f)}" ${m.filiale === f ? 'selected' : ''}>${h(f)}</option>`).join('')}
            </select>
          </label>

          <label class="field field--full">
            <span class="field__label">Bauvorhaben</span>
            <input class="field__input" data-role="meta-bauvorhaben" type="text" value="${h(m.bauvorhaben)}" />
          </label>

          <label class="field">
            <span class="field__label">Bauherr</span>
            <input class="field__input" data-role="meta-bauherr" type="text" value="${h(m.bauherr)}" />
          </label>

          <label class="field">
            <span class="field__label">Bauleitung</span>
            <input class="field__input" data-role="meta-bauleitung" type="text" value="${h(m.bauleitung)}" />
          </label>

          <label class="field">
            <span class="field__label">${h(getLocationLabel(testKey))}</span>
            <input class="field__input" data-role="meta-lage" type="text" value="${h(m.lage)}" />
          </label>

          <label class="field">
            <span class="field__label">${h(getNumberLabel(testKey))}</span>
            <input class="field__input" data-role="meta-nummer" type="text" value="${h(m.nummer)}" />
          </label>

          <label class="field">
            <span class="field__label">Blatt Nr.</span>
            <input class="field__input" data-role="meta-blattNr" type="text" value="${h(m.blattNr)}" />
          </label>

          <label class="field">
            <span class="field__label">Prüfdatum</span>
            <input class="field__input" data-role="meta-pruefdatum" type="date" value="${h(m.pruefdatum)}" />
          </label>

          <label class="field">
            <span class="field__label">Hydraulikpumpe Nr.</span>
            <input class="field__input" data-role="meta-pumperNr" type="text" value="${h(m.pumperNr)}" />
          </label>

          <label class="field field--full">
            <span class="field__label">Anmerkung</span>
            <textarea class="field__input field__textarea" rows="2" data-role="meta-anmerkung">${h(m.anmerkung)}</textarea>
          </label>
        </div>
      </div>
    </details>
  `;
}

function renderSpecSection(testKey){
  const test = getTest(testKey);
  const s = test.spec;
  const isEignung = testKey === 'eignung';

  return `
    <details class="card card--collapsible" open>
      <summary class="card__title">${isEignung ? 'Vorgabe Anker' : 'Vorgaben'}</summary>
      <div class="card__body">

        ${isEignung ? `
          <div class="select-grid">
            <label class="select-card">
              <input type="radio" name="bodenart-${testKey}" value="nichtbindig" data-role="spec-bodenart" data-test="${testKey}" ${s.bodenart !== 'bindig' ? 'checked' : ''} />
              <span><b>Nicht bindig / Fels</b><br><small>Beobachtung Pp: 60 min</small></span>
            </label>
            <label class="select-card">
              <input type="radio" name="bodenart-${testKey}" value="bindig" data-role="spec-bodenart" data-test="${testKey}" ${s.bodenart === 'bindig' ? 'checked' : ''} />
              <span><b>Bindig</b><br><small>Beobachtung Pp: 180 min</small></span>
            </label>
          </div>
        ` : ''}

        <div class="form-grid" style="margin-top:12px">
          <label class="field">
            <span class="field__label">${h(getTypeLabel(testKey))}</span>
            <select class="field__select" data-role="typeKey" data-test="${testKey}">
              ${renderTypeOptions(test.typeKey)}
            </select>
          </label>

          ${isEignung ? `
            <label class="field"><span class="field__label">Ankerlänge L<sub>A</sub> [m]</span><input class="field__input" data-role="spec-LA" data-test="${testKey}" type="number" step="0.01" value="${h(s.LA)}"></label>
            <label class="field"><span class="field__label">Verank.länge L<sub>tb</sub> [m]</span><input class="field__input" data-role="spec-Ltb" data-test="${testKey}" type="number" step="0.01" value="${h(s.Ltb)}"></label>
            <label class="field"><span class="field__label">Freie Länge L<sub>tf</sub> [m]</span><input class="field__input" data-role="spec-Ltf" data-test="${testKey}" type="number" step="0.01" value="${h(s.Ltf)}"></label>
            <label class="field"><span class="field__label">Spannüberstand L<sub>e</sub> [m]</span><input class="field__input" data-role="spec-Le" data-test="${testKey}" type="number" step="0.01" value="${h(s.Le)}"></label>
            <label class="field"><span class="field__label">E-Modul E<sub>t</sub> [kN/mm²]</span><input class="field__input" data-role="spec-Et" data-test="${testKey}" type="number" step="0.001" value="${h(s.Et)}"></label>
            <label class="field"><span class="field__label">Querschnitt A<sub>t</sub> [mm²]</span><input class="field__input" data-role="spec-At" data-test="${testKey}" type="number" step="0.1" value="${h(s.At)}"></label>
            <label class="field"><span class="field__label">Festlegekraft P<sub>0</sub> [kN]</span><input class="field__input" data-role="spec-P0" data-test="${testKey}" type="number" step="0.1" value="${h(s.P0)}"></label>
            <label class="field"><span class="field__label">Vorbelastung P<sub>a</sub> [kN]</span><input class="field__input" data-role="spec-Pa" data-test="${testKey}" type="number" step="0.1" value="${h(s.Pa)}"></label>
            <label class="field"><span class="field__label">Prüfkraft P<sub>p</sub> [kN]</span><input id="vor-Pp" class="field__input" data-role="spec-Pp" data-test="${testKey}" type="number" step="0.01" value="${h(s.Pp)}" readonly><small id="hint-vor-Pp" class="field__hint"></small></label>
            <label class="field"><span class="field__label">0,1%-Dehngrenze P<sub>t0,1k</sub> [kN]</span><input id="vor-Pt01k" class="field__input" data-role="spec-Pt01k" data-test="${testKey}" type="number" step="0.1" value="${h(s.Pt01k)}"></label>
            <label class="field"><span class="field__label">Bemessung P<sub>d</sub> [kN]</span><input id="vor-Pd" class="field__input" data-role="spec-Pd" data-test="${testKey}" type="number" step="0.01" value="${h(s.Pd)}"><small id="hint-vor-Pd" class="field__hint"></small></label>
            <label class="field"><span class="field__label">Teilsicherheit γ<sub>a</sub> [-]</span><input id="vor-gamma" class="field__input" data-role="spec-gamma" data-test="${testKey}" type="number" step="0.01" value="${h(s.gamma)}"></label>
          ` : `
            <label class="field"><span class="field__label">${testKey === 'abnahme' ? 'Pfahllänge L [m]' : 'Nagellänge L [m]'}</span><input class="field__input" data-role="spec-L" data-test="${testKey}" type="number" step="0.01" value="${h(s.L)}"></label>
            <label class="field"><span class="field__label">Einbindungslänge L<sub>b</sub> [m]</span><input class="field__input" data-role="spec-Lb" data-test="${testKey}" type="number" step="0.01" value="${h(s.Lb)}"></label>
            <label class="field"><span class="field__label">Ungebundene Länge L<sub>db</sub> [m]</span><input class="field__input" data-role="spec-Ldb" data-test="${testKey}" type="number" step="0.01" value="${h(s.Ldb)}"></label>
            <label class="field"><span class="field__label">Überstand [m]</span><input class="field__input" data-role="spec-Ueberstand" data-test="${testKey}" type="number" step="0.01" value="${h(s.Ueberstand)}"></label>
            <label class="field"><span class="field__label">Elastizitätsmodul E<sub>t</sub> [kN/mm²]</span><input class="field__input" data-role="spec-Et" data-test="${testKey}" type="number" step="0.1" value="${h(s.Et)}"></label>
            <label class="field"><span class="field__label">Querschnitt Stab A<sub>t</sub> [mm²]</span><input class="field__input" data-role="spec-At" data-test="${testKey}" type="number" step="0.1" value="${h(s.At)}"></label>
            <label class="field"><span class="field__label">Vorbelastung P<sub>0</sub> [kN]</span><input class="field__input" data-role="spec-P0" data-test="${testKey}" type="number" step="0.1" value="${h(s.P0)}"></label>
            <label class="field"><span class="field__label">Bemessungslast P<sub>d</sub> [kN]</span><input class="field__input" data-role="spec-Pd" data-test="${testKey}" type="number" step="0.1" value="${h(s.Pd)}"></label>
            <label class="field"><span class="field__label">Prüffaktor k [-]</span><input class="field__input" data-role="spec-k" data-test="${testKey}" type="number" step="0.01" value="${h(s.k)}"></label>
            <label class="field"><span class="field__label">Prüfkraft P<sub>p</sub> [kN]</span><input class="field__input field__input--computed" data-role="spec-Pp" data-test="${testKey}" type="number" step="0.01" value="${h(s.Pp)}" readonly></label>
            <label class="field"><span class="field__label">Materiallast / Streckgrenze [kN]</span><input class="field__input" data-role="spec-Pt01k" data-test="${testKey}" type="number" step="0.1" value="${h(s.Pt01k)}"></label>
          `}
        </div>

        ${renderTypeInfo(testKey)}

        ${isEignung ? `
          <div class="auto-grid">
            <div class="auto-card">
              <div class="auto-card__label">Prüfkraft Pp</div>
              <div id="calc-PpFromPd" class="auto-card__value">—</div>
            </div>
            <div class="auto-card">
              <div class="auto-card__label">min. Lapp</div>
              <div id="calc-minLapp" class="auto-card__value">—</div>
            </div>
            <div class="auto-card">
              <div class="auto-card__label">max. Lapp</div>
              <div id="calc-maxLapp" class="auto-card__value">—</div>
            </div>
            <div class="auto-card">
              <div class="auto-card__label">s Grenzlinie b (Pp)</div>
              <div id="calc-sGrenzB" class="auto-card__value">—</div>
            </div>
            <div class="auto-card">
              <div class="auto-card__label">s Grenzlinie a (Pp)</div>
              <div id="calc-sGrenzA" class="auto-card__value">—</div>
            </div>
          </div>

          <div class="info-box">
            <b>Automatisch berechnet</b><br>
            Tatsächlich rechnerische freie Stahllänge L<sub>app</sub>: <b id="calc-LappMeasured">—</b><br>
            Grenzwerte freie Stahllänge eingehalten: <span id="calc-LappCheck" class="inline-badge">—</span>
          </div>
        ` : ''}
      </div>
    </details>
  `;
}

function buildTimerBox(testKey, cycle){
  return `
    <div id="globalTimerBox-${testKey}" class="timer-box" style="margin-bottom:12px">
      <div class="global-timer-head" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <div class="zyklus-title" style="font-weight:800">Stoppuhr ${h(TEST_LABELS[testKey])}</div>
        <span id="activeZyklusBadge-${testKey}" class="zyklus-badge">${cycle ? cycle.title : '—'}</span>
      </div>

      <div class="timer-row" style="margin-bottom:8px">
        <div class="timer-display" id="globalTimerDisplay-${testKey}" data-role="timer-display" data-test="${testKey}" title="Tippen zum Anpassen">${cycle ? formatElapsed(cycle.elapsedMs || 0) : '00:00'}</div>
        <span class="timer-edit-hint">tippen = anpassen</span>

        <label class="field" style="min-width:170px">
          <span class="field__label">Modus</span>
          <select class="field__select" data-role="test-mode" data-test="${testKey}">
            <option value="norm" ${getTest(testKey).mode === 'norm' ? 'selected' : ''}>Norm / Vorlage</option>
            <option value="frei" ${getTest(testKey).mode === 'frei' ? 'selected' : ''}>Freie Eingabe</option>
          </select>
        </label>

        <label class="field" style="min-width:170px; margin-left:auto">
          <span class="field__label">${testKey === 'eignung' ? 'Aktiver Zyklus' : 'Aktiver Abschnitt'}</span>
          <select class="field__select" data-role="active-cycle" data-test="${testKey}">
            ${getTest(testKey).cycles.map(c => `
              <option value="${h(c.id)}" ${getTest(testKey).activeCycleId === c.id ? 'selected' : ''}>${h(c.title)}</option>
            `).join('')}
          </select>
        </label>

        <div class="timer-buttons">
          <button class="timer-btn timer-btn--start" data-role="timer-start" data-test="${testKey}" type="button">Start</button>
          <button class="timer-btn timer-btn--stop" data-role="timer-stop" data-test="${testKey}" type="button">Stop</button>
          <button class="timer-btn timer-btn--ghost" data-role="timer-reset" data-test="${testKey}" type="button">Reset</button>
        </div>
      </div>

      <div class="timer-info" id="globalTimerStartzeit-${testKey}">${cycle?.startzeit ? `Startzeit: ${cycle.startzeit}` : 'Noch nicht gestartet'}</div>
      <div class="timer-info timer-next" id="globalTimerNext-${testKey}">Nächste Messung: —</div>
    </div>
  `;
}

function renderStageEditor(stage, idx, testKey, cycle){
  const isFree = getTest(testKey).mode === 'frei';
  const pp = Number(getTest(testKey).spec.Pp);
  const p0 = Number(getTest(testKey).spec.P0);
  const pa = Number(getTest(testKey).spec.Pa);
  let lastKn = NaN;
  if(stage.kind === 'p0') lastKn = p0;
  else if(stage.kind === 'pa') lastKn = pa;
  else lastKn = Number.isFinite(pp) ? pp * Number(stage.factor || 0) : NaN;

  if(!isFree){
    return `
      <div class="field">
        <span class="field__label">${h(stage.label)}</span>
        <input class="field__input" data-role="stage-druck" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="number" step="0.1" value="${h(stage.druck)}">
        <span class="hint" style="font-size:11px;text-align:left;margin-top:2px">≈ ${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'} kN</span>
      </div>
    `;
  }

  return `
    <div class="field" style="min-width:130px">
      <span class="field__label">Stufe ${idx+1}</span>
      <select class="field__select" data-role="stage-kind" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}">
        <option value="pa" ${stage.kind === 'pa' ? 'selected' : ''}>Pa</option>
        <option value="factor" ${stage.kind === 'factor' ? 'selected' : ''}>X * Pp</option>
        <option value="p0" ${stage.kind === 'p0' ? 'selected' : ''}>P0</option>
      </select>
      <input class="field__input" data-role="stage-factor" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="number" step="0.05" value="${stage.kind === 'factor' ? h(stage.factor) : ''}" ${stage.kind === 'factor' ? '' : 'disabled'}>
      <input class="field__input" data-role="stage-intervals" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="text" value="${h(stage.intervalsStr)}">
      <input class="field__input" data-role="stage-druck" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="number" step="0.1" value="${h(stage.druck)}">
      <div class="action-row" style="justify-content:flex-start;margin-top:4px">
        <button class="timer-btn timer-btn--ghost" data-role="stage-del" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="button">−</button>
        ${idx === cycle.stageDefs.length - 1 ? `<button class="timer-btn timer-btn--ghost" data-role="stage-add" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="button">+</button>` : ''}
      </div>
    </div>
  `;
}

function calcStageLoad(stage, testKey){
  const spec = getTest(testKey).spec;
  const Pp = Number(spec.Pp);
  const P0 = Number(spec.P0);
  const Pa = Number(spec.Pa);

  if(stage.kind === 'p0') return Number.isFinite(P0) ? P0 : NaN;
  if(stage.kind === 'pa') return Number.isFinite(Pa) ? Pa : NaN;
  return Number.isFinite(Pp) ? Pp * Number(stage.factor || 0) : NaN;
}

function buildMeasurementBody(cycle, testKey){
  let html = '';
  const isFree = getTest(testKey).mode === 'frei';

  for(let i=0;i<cycle.rows.length;i++){
    const row = cycle.rows[i];
    const stage = cycle.stageDefs[row.stageIdx];
    const prevStageIdx = i > 0 ? cycle.rows[i - 1].stageIdx : null;
    const isFirstInStage = row.stageIdx !== prevStageIdx;

    let rowspan = 1;
    if(isFirstInStage){
      rowspan = cycle.rows.filter(r => r.stageIdx === row.stageIdx).length;
    }

    const lastKn = calcStageLoad(stage, testKey);

    html += `<tr data-row="${i}" class="${i===0 ? 'row-active' : ''}">`;

    if(isFirstInStage){
      html += `<td class="mess-stage-col" rowspan="${rowspan}"><span class="mess-stage-pill">${h(stage.label)}</span></td>`;
      html += `<td class="mess-load-col" rowspan="${rowspan}">${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'}</td>`;
      html += `<td rowspan="${rowspan}"><input class="mess-input mess-input--auto" data-role="stage-druck" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${row.stageIdx}" type="number" step="0.1" value="${h(stage.druck)}"></td>`;
    }

    html += `
      <td>
        <div class="minute-cell">
          <input class="mess-input minute-input" data-role="row-min" data-test="${testKey}" data-cycle="${cycle.id}" data-row="${i}" type="number" step="1" value="${h(row.min)}" ${isFree ? '' : 'readonly'}>
          ${isFree && i === cycle.rows.length - 1 ? `<button class="row-plus" data-role="row-add" data-test="${testKey}" data-cycle="${cycle.id}" data-row="${i}" type="button">+</button>` : ''}
        </div>
      </td>
      <td><input class="mess-input" data-role="row-ablesung" data-test="${testKey}" data-cycle="${cycle.id}" data-row="${i}" type="number" step="0.01" value="${h(row.ablesung)}"></td>
      <td><input class="mess-input mess-input--auto" data-role="row-versch" data-test="${testKey}" data-cycle="${cycle.id}" data-row="${i}" type="number" step="0.01" value="${h(row.versch)}" readonly></td>
      <td><button class="row-anm-btn ${row.anm ? 'has-anm' : ''}" data-role="row-anm" data-test="${testKey}" data-cycle="${cycle.id}" data-row="${i}" type="button">+</button></td>
    `;
    html += `</tr>`;
  }

  return html;
}

function renderCycleCard(cycle, testKey){
  const isFree = getTest(testKey).mode === 'frei';
  return `
    <div class="zyklus-card" data-cycle-card="${cycle.id}">
      <div class="zyklus-card__head">
        <span class="zyklus-badge">${testKey === 'eignung' ? 'Zyklus' : 'Abschnitt'} ${cycle.nr}</span>
        <span class="zyklus-title">${h(cycle.title)}</span>
        <span class="zyklus-spacer"></span>
        ${isFree ? `<button class="zyklus-del" data-role="cycle-del" data-test="${testKey}" data-cycle="${cycle.id}" type="button">Löschen</button>` : ''}
      </div>

      ${isFree ? `
        <div class="interval-row">
          <span class="interval-label">Halte-Laststufe</span>
          <select class="field__select" data-role="hold-stage" data-test="${testKey}" data-cycle="${cycle.id}">
            ${cycle.stageDefs.map((s, i) => `<option value="${i}" ${cycle.holdStageIdx === i ? 'selected' : ''}>${h(s.label)}</option>`).join('')}
          </select>
        </div>
      ` : ''}

      <div class="zyklus-load-row">
        ${cycle.stageDefs.map((s, i) => renderStageEditor(s, i, testKey, cycle)).join('')}
      </div>

      <div class="table-wrap">
        <table class="mess-table">
          <thead>
            <tr>
              <th class="th-stage">Laststufe</th>
              <th class="th-load">Last<br><small>kN</small></th>
              <th class="th-druck">Druck<br><small>bar</small></th>
              <th class="th-min">Min</th>
              <th class="th-mess">Mess&shy;uhr<br><small>mm</small></th>
              <th class="th-versch">Verschiebung<br><small>mm</small></th>
              <th class="th-anm">Anm.</th>
            </tr>
          </thead>
          <tbody>
            ${buildMeasurementBody(cycle, testKey)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderPhotoSection(testKey){
  const photos = getTest(testKey).photos;
  return `
    <details class="card card--collapsible" open>
      <summary class="card__title">Fotos</summary>
      <div class="card__body">
        <div class="photo-grid">
          <div class="photo-box">
            <div class="photo-box__title">Übersichtsfoto</div>
            <div class="photo-preview">${photos.overview ? `<img src="${photos.overview}" alt="Übersichtsfoto">` : 'Kein Bild'}</div>
            <div class="photo-actions">
              <button class="btn btn--ghost btn--small" data-role="photo-pick-overview" data-test="${testKey}" type="button">Foto wählen</button>
              <button class="btn btn--ghost btn--small" data-role="photo-del-overview" data-test="${testKey}" type="button">Löschen</button>
              <input data-role="photo-input-overview" data-test="${testKey}" type="file" accept="image/*" capture="environment" style="display:none">
            </div>
          </div>

          <div class="photo-box">
            <div class="photo-box__title">Detailfoto</div>
            <div class="photo-preview">${photos.detail ? `<img src="${photos.detail}" alt="Detailfoto">` : 'Kein Bild'}</div>
            <div class="photo-actions">
              <button class="btn btn--ghost btn--small" data-role="photo-pick-detail" data-test="${testKey}" type="button">Foto wählen</button>
              <button class="btn btn--ghost btn--small" data-role="photo-del-detail" data-test="${testKey}" type="button">Löschen</button>
              <input data-role="photo-input-detail" data-test="${testKey}" type="file" accept="image/*" capture="environment" style="display:none">
            </div>
          </div>
        </div>
      </div>
    </details>
  `;
}

function renderTestPane(testKey){
  const host = $(`content-${testKey}`);
  if(!host) return;
  const activeCycle = getActiveCycle(testKey);

  host.innerHTML = `
    ${renderMetaSection(testKey)}
    ${renderPressSection()}
    ${renderSpecSection(testKey)}

    <details class="card card--collapsible" open>
      <summary class="card__title">Lastzyklen ${h(TEST_LABELS[testKey])}</summary>
      <div class="card__body">
        ${buildTimerBox(testKey, activeCycle)}
        ${getTest(testKey).cycles.map(c => renderCycleCard(c, testKey)).join('')}
        <div class="plus-wrap">
          <button class="btn-plus" data-role="add-cycle" data-test="${testKey}" type="button">+</button>
          <div class="plus-label">Abschnitt hinzufügen (nur freie Eingabe)</div>
        </div>
      </div>
    </details>

    ${renderPhotoSection(testKey)}

    <section class="card card--actions card--actions-bottom">
      <div class="action-row">
        <button class="btn btn--save btn--small" data-role="save-test" data-test="${testKey}" type="button">Speichern</button>
        <button class="btn btn--ghost btn--small" data-role="pdf-test" data-test="${testKey}" type="button">PDF Protokoll</button>
        <button class="btn btn--ghost btn--small" data-role="reset-test" data-test="${testKey}" type="button">Reset</button>
      </div>
      <div class="hint">Speichern im Verlauf · PDF mit Filiale in Fußzeile</div>
    </section>
  `;
}

function renderAllTests(){
  TEST_KEYS.forEach(renderTestPane);
  renderKalibInfo();
  renderKalibPreview();
  updateRequiredFieldStates();
}

function renderAuswertung(){
  const host = $('auswertungContainer');
  if(!host) return;

  const testKey = state.evalTest;
  const test = getTest(testKey);

  if(!test.cycles.length){
    host.innerHTML = `<div class="empty-state">Keine Daten vorhanden.</div>`;
    return;
  }

  host.innerHTML = `
    <div class="auswertung-block">
      <div class="auswertung-block__title">${h(TEST_LABELS[testKey])}</div>
      <div class="kpi-grid">
        <div class="kpi"><div class="kpi__label">Prüfung</div><div class="kpi__value">${h(TEST_LABELS[testKey])}</div></div>
        <div class="kpi"><div class="kpi__label">Anzahl Abschnitte</div><div class="kpi__value">${test.cycles.length}</div></div>
        <div class="kpi"><div class="kpi__label">Typ</div><div class="kpi__value">${h(getAnkertypByKey(test.typeKey)?.label || '—')}</div></div>
        <div class="kpi"><div class="kpi__label">Pp</div><div class="kpi__value">${fmt(test.spec.Pp,2)} kN</div></div>
      </div>
      ${test.cycles.map(c => `
        <div class="diag-wrap">
          ${buildSimpleCycleSvg(c, testKey)}
        </div>
      `).join('')}
    </div>
  `;
}

function buildSimpleCycleSvg(cycle, testKey){
  let cum = 0;
  const pts = cycle.rows
    .filter(r => Number.isFinite(Number(r.min)))
    .map(r => {
      const v = Number(r.versch);
      if(Number.isFinite(v)) cum += v;
      return { min:Number(r.min), s:cum };
    });

  const W=520,H=240,ml=48,mr=18,mt=20,mb=40,pw=W-ml-mr,ph=H-mt-mb;
  const xMax=Math.max(...pts.map(p=>p.min),1);
  const yMin=Math.min(...pts.map(p=>p.s),0);
  const yMax=Math.max(...pts.map(p=>p.s),1);

  const tx=v=>ml+(v/xMax)*pw;
  const ty=v=>mt+ph-((v-yMin)/((yMax-yMin)||1))*ph;
  const poly=pts.map(p=>`${tx(p.min)},${ty(p.s)}`).join(' ');

  return `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${W}" height="${H}" rx="8" fill="#0b1725"/>
      <rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="rgba(255,255,255,.18)"/>
      ${poly ? `<polyline points="${poly}" fill="none" stroke="#f08a1c" stroke-width="2"/>` : ''}
      ${pts.map(p=>`<circle cx="${tx(p.min)}" cy="${ty(p.s)}" r="3" fill="#f08a1c"/>`).join('')}
      <text x="${W/2}" y="14" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${h(TEST_LABELS[testKey])} · ${h(cycle.title)}</text>
      <text x="${W/2}" y="${H-6}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Zeit [min]</text>
      <text x="14" y="${mt+ph/2}" transform="rotate(-90 14 ${mt+ph/2})" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Verschiebung [mm]</text>
    </svg>
  `;
}

/* ---------------- logic ---------------- */
function applyTypePreset(testKey, typeKey){
  const test = getTest(testKey);
  const typ = getAnkertypByKey(typeKey);
  test.typeKey = typeKey || '';

  if(!typ){
    renderAllTests();
    saveDraftDebounced();
    return;
  }

  if(!test.spec.At || true){
    test.spec.At = formatInputNumber(Number(typ.At), 0);
  }
  if(typ.lastStreck != null){
    test.spec.Pt01k = formatInputNumber(Number(typ.lastStreck), 1);
  }

  renderAllTests();
  renderAuswertung();
  saveDraftDebounced();
}

function setMetaValue(role, value){
  if(role === 'meta-filiale') state.meta.filiale = value;
  if(role === 'meta-bauvorhaben') state.meta.bauvorhaben = value;
  if(role === 'meta-bauherr') state.meta.bauherr = value;
  if(role === 'meta-bauleitung') state.meta.bauleitung = value;
  if(role === 'meta-lage') state.meta.lage = value;
  if(role === 'meta-nummer') state.meta.nummer = value;
  if(role === 'meta-blattNr') state.meta.blattNr = value;
  if(role === 'meta-pruefdatum') state.meta.pruefdatum = value;
  if(role === 'meta-pumperNr') state.meta.pumperNr = value;
  if(role === 'meta-anmerkung') state.meta.anmerkung = value;
}

function setSpecValue(testKey, role, value){
  const s = getTest(testKey).spec;

  if(role === 'spec-bodenart') s.bodenart = value;
  if(role === 'spec-LA') s.LA = value;
  if(role === 'spec-Ltb') s.Ltb = value;
  if(role === 'spec-Ltf') s.Ltf = value;
  if(role === 'spec-Le') s.Le = value;
  if(role === 'spec-L') s.L = value;
  if(role === 'spec-Lb') s.Lb = value;
  if(role === 'spec-Ldb') s.Ldb = value;
  if(role === 'spec-Ueberstand') s.Ueberstand = value;
  if(role === 'spec-Et') s.Et = value;
  if(role === 'spec-At') s.At = value;
  if(role === 'spec-P0') s.P0 = value;
  if(role === 'spec-Pa') s.Pa = value;
  if(role === 'spec-Pd') s.Pd = value;
  if(role === 'spec-gamma') s.gamma = value;
  if(role === 'spec-k') s.k = value;
  if(role === 'spec-Pt01k') s.Pt01k = value;
}

function recomputePp(testKey){
  const s = getTest(testKey).spec;
  if(testKey === 'eignung'){
    const Pd = toNumFlexible(s.Pd);
    const gamma = toNumFlexible(s.gamma);
    s.Pp = (Number.isFinite(Pd) && Number.isFinite(gamma) && gamma > 0)
      ? formatInputNumber(Pd * gamma, 2)
      : '';
  }else{
    const Pd = toNumFlexible(s.Pd);
    const k = toNumFlexible(s.k);
    s.Pp = (Number.isFinite(Pd) && Number.isFinite(k) && k > 0)
      ? formatInputNumber(Pd * k, 2)
      : '';
  }
}

function syncRowsFromStageDefs(cycle){
  const oldMap = Object.fromEntries((cycle.rows || []).map(r => [`${r.stageIdx}|${r.min}`, r]));
  const nextRows = [];

  cycle.stageDefs = cycle.stageDefs.map(normalizeStageDef);

  cycle.stageDefs.forEach((stage, stageIdx) => {
    const ints = parseIntervalStr(stage.intervalsStr);
    ints.forEach(min => {
      const key = `${stageIdx}|${min}`;
      const old = oldMap[key];
      nextRows.push(old ? { ...old, stageIdx, min } : {
        stageIdx,
        min,
        ablesung:'',
        versch:'',
        anm:''
      });
    });
  });

  cycle.rows = nextRows;
}

function applyNormToTest(testKey){
  const test = getTest(testKey);
  const defs = testKey === 'eignung'
    ? buildEignungNormCycles(test.spec.bodenart)
    : buildAusziehOrAbnahmeNormCycles(testKey);

  const oldByNr = new Map((test.cycles || []).map(c => [c.nr, c]));
  test.cycles = defs.map(def => makeCycleFromDef(def, oldByNr.get(def.nr) || null));
  ensureActiveCycle(testKey);
}

function calcStageLoad(stage, testKey){
  const s = getTest(testKey).spec;
  const Pp = toNumFlexible(s.Pp);
  const P0 = toNumFlexible(s.P0);
  const Pa = toNumFlexible(s.Pa);

  if(stage.kind === 'p0') return P0;
  if(stage.kind === 'pa') return Pa;
  return Number.isFinite(Pp) ? Pp * Number(stage.factor || 0) : NaN;
}

function recalcDisplacement(testKey, cycleId){
  const c = getCycleById(testKey, cycleId);
  if(!c) return;

  c.rows.forEach((row, idx) => {
    const a = toNumFlexible(row.ablesung);
    if(idx === 0){
      row.versch = Number.isFinite(a) ? '0' : '';
      return;
    }
    const prev = toNumFlexible(c.rows[idx-1].ablesung);
    row.versch = Number.isFinite(a) && Number.isFinite(prev)
      ? formatInputNumber(a - prev, 2)
      : '';
  });
}

function recalcAllDisplacements(testKey){
  getTest(testKey).cycles.forEach(c => recalcDisplacement(testKey, c.id));
}

function syncPressureFromCalibration(testKey){
  const kalib = findKalibById(state.meta.selectedKalibId);
  const test = getTest(testKey);

  test.cycles.forEach(c => {
    c.stageDefs = c.stageDefs.map(normalizeStageDef);
    c.stageDefs.forEach(stage => {
      const kn = calcStageLoad(stage, testKey);
      const { bar } = kalib ? lookupStuetzpunkt(kn, kalib.punkte) : { bar:null };
      stage.druck = bar != null ? String(bar) : stage.druck || '';
    });
  });

  renderAllTests();
  renderAuswertung();
  saveDraftDebounced();
}

function updateRequiredFieldStates(){
  const metaRequiredRoles = ['meta-filiale'];
  metaRequiredRoles.forEach(role => {
    document.querySelectorAll(`[data-role="${role}"]`).forEach(el => {
      setRequiredVisual(el, !String(el.value || '').trim());
    });
  });

  const eignungRequired = ['typeKey','spec-LA','spec-Ltb','spec-Ltf','spec-Le','spec-Et','spec-P0','spec-Pa','spec-Pd','spec-gamma'];
  const otherRequired = ['typeKey','spec-L','spec-Lb','spec-Ldb','spec-Ueberstand','spec-Et','spec-P0','spec-Pd','spec-k'];

  document.querySelectorAll('[data-test]').forEach(el => {
    const testKey = el.dataset.test;
    const role = el.dataset.role;
    if(!testKey || !role) return;

    if(testKey === 'eignung'){
      setRequiredVisual(el, eignungRequired.includes(role) && !String(el.value || '').trim());
    }else if(testKey === 'auszieh' || testKey === 'abnahme'){
      setRequiredVisual(el, otherRequired.includes(role) && !String(el.value || '').trim());
    }
  });

  document.querySelectorAll('[data-role="spec-At"],[data-role="spec-Pt01k"],[data-role="spec-Pp"]').forEach(el => {
    setRequiredVisual(el, false);
  });
  document.querySelectorAll('[data-role="spec-Pp"]').forEach(el => applyComputedVisual(el, true));
}

/* ---------------- photo ---------------- */
function fileToDataUrl(file){
  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- history ---------------- */
function renderHistoryList(){
  const host = $('historyList');
  if(!host) return;

  const list = readHistory();
  if(!list.length){
    host.innerHTML = `<div class="empty-state">Noch keine Protokolle gespeichert.</div>`;
    return;
  }

  host.innerHTML = list.map(e => `
    <details class="historyItem" data-id="${h(e.id)}">
      <summary class="historyItem__head">
        <span class="historyItem__chevron">▸</span>
        <span class="historyItem__title">${h(e.title)}</span>
        <span class="historyItem__date">${h(new Date(e.savedAt).toLocaleString('de-DE'))}</span>
      </summary>
      <div class="historyItem__body">
        <div class="historyBtns">
          <button data-role="history-load" data-id="${h(e.id)}">Laden</button>
          <button data-role="history-pdf" data-id="${h(e.id)}">PDF</button>
          <button data-role="history-export" data-id="${h(e.id)}">JSON Export</button>
          <button data-role="history-del" data-id="${h(e.id)}">Löschen</button>
        </div>
      </div>
    </details>
  `).join('');
}

/* ---------------- pdf ---------------- */
async function exportPdfForTest(testKey, snapshotState=null){
  if(!window.PDFLib){
    alert('PDF-Bibliothek nicht geladen.');
    return;
  }

  const src = snapshotState || state;
  const meta = snapshotState ? snapshotState.meta : state.meta;
  const test = snapshotState ? snapshotState.tests[testKey] : getTest(testKey);

  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([595.28, 841.89]);
  const W = page.getWidth();
  const H = page.getHeight();

  page.drawRectangle({ x:0, y:H-36, width:W, height:36, color:rgb(0.05,0.18,0.31) });
  page.drawText(`HTB ${TEST_LABELS[testKey]}`, { x:30, y:H-24, size:14, font:fontB, color:rgb(1,1,1) });

  let y = H - 70;
  const rows = [
    ['Bauvorhaben', meta.bauvorhaben || '—'],
    ['Bauherr', meta.bauherr || '—'],
    ['Lage', meta.lage || '—'],
    [getNumberLabel(testKey), meta.nummer || '—'],
    ['Prüfdatum', dateDE(meta.pruefdatum)],
    [getTypeLabel(testKey), getAnkertypByKey(test.typeKey)?.label || '—']
  ];

  rows.forEach(([k,v]) => {
    page.drawText(`${k}:`, { x:30, y, size:10, font:fontB });
    page.drawText(String(v), { x:160, y, size:10, font });
    y -= 16;
  });

  y -= 10;
  page.drawText('Protokoll', { x:30, y, size:12, font:fontB }); y -= 16;

  test.cycles.forEach(c => {
    if(y < 120){
      page = pdf.addPage([595.28, 841.89]);
      y = H - 50;
    }
    page.drawText(`${c.title}`, { x:30, y, size:10, font:fontB }); y -= 12;
    page.drawText('Stufe   Last   Druck   Min   Messuhr   Versch.', { x:30, y, size:8, font:fontB }); y -= 10;

    c.rows.forEach(r => {
      if(y < 50){
        page = pdf.addPage([595.28, 841.89]);
        y = H - 50;
      }
      const stage = c.stageDefs[r.stageIdx];
      const kn = calcStageLoad(stage, testKey);
      page.drawText(
        `${String(stage.label).padEnd(8)} ${String(Number.isFinite(kn) ? fmt(kn,1) : '').padEnd(8)} ${String(stage.druck || '').padEnd(7)} ${String(r.min).padEnd(4)} ${String(r.ablesung || '').padEnd(8)} ${String(r.versch || '')}`,
        { x:30, y, size:8, font }
      );
      y -= 10;
    });

    y -= 8;
  });

  const fil = FILIALEN[meta.filiale] || {};
  pdf.getPages().forEach(p => {
    p.drawRectangle({ x:0, y:0, width:W, height:28, color:rgb(0.05,0.18,0.31) });
    p.drawText(`HTB Baugesellschaft m.b.H. – ${meta.filiale || '—'}`, { x:30, y:17, size:8, font:fontB, color:rgb(1,1,1) });
    p.drawText(`${fil.adresse || ''}`, { x:30, y:7, size:7, font, color:rgb(.85,.9,1) });
  });

  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type:'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dateTag()}_${testKey}_protokoll.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/* ---------------- settings helpers ---------------- */
function buildTemplatePayload(testKey){
  return {
    meta: clone(state.meta),
    tests: {
      [testKey]: clone(state.tests[testKey])
    }
  };
}

function importTemplatePayload(testKey, payload){
  if(payload.meta){
    state.meta = {
      ...makeGlobalMeta(),
      ...payload.meta
    };
  }
  if(payload.tests?.[testKey]){
    const current = state.tests[testKey];
    state.tests[testKey] = {
      ...makeTestState(testKey),
      ...payload.tests[testKey],
      spec: { ...makeSpec(testKey), ...(payload.tests[testKey].spec || {}) },
      photos: { overview:null, detail:null, ...(payload.tests[testKey].photos || {}) }
    };
    if(!state.tests[testKey].activeCycleId){
      state.tests[testKey].activeCycleId = state.tests[testKey].cycles[0]?.id || '';
    }
  }
}

/* ---------------- main events ---------------- */
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-role]');
  if(!el) return;

  const role = el.dataset.role;
  const testKey = el.dataset.test;

  if(role === 'save-test'){
    const snap = collectSnapshot();
    const title = `${TEST_LABELS[testKey]} · ${state.meta.nummer || '—'} · ${state.meta.bauvorhaben || '—'}`;
    const list = readHistory();
    list.unshift({ id:uid(), title, savedAt:snap.savedAt, snapshot:snap });
    writeHistory(list);
    renderHistoryList();
    alert('Im Verlauf gespeichert.');
    return;
  }

  if(role === 'pdf-test'){
    await exportPdfForTest(testKey);
    return;
  }

  if(role === 'reset-test'){
    if(!confirm(`${TEST_LABELS[testKey]} zurücksetzen?`)) return;
    state.tests[testKey] = makeTestState(testKey);
    renderAllTests();
    renderAuswertung();
    saveDraftDebounced();
    return;
  }

  if(role === 'kalib-import-btn'){
    $('kalibImportInput')?.click();
    return;
  }

  if(role === 'kalib-export-btn'){
    const kalib = findKalibById(state.meta.selectedKalibId);
    if(!kalib){
      const txt = buildKalibCsvTemplate();
      const blob = new Blob([txt], { type:'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'HTB_Kalibrierung_Vorlage.csv';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      return;
    }
    const txt = kalibToCsv(kalib);
    const blob = new Blob([txt], { type:'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HTB_Kalib_${kalib.presseNr}_${kalib.kalibriertAm}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    return;
  }

  if(role === 'kalib-delete-btn'){
    handleKalibDelete();
    renderAllTests();
    return;
  }

  if(role === 'photo-pick-overview'){
    el.parentElement.querySelector('[data-role="photo-input-overview"]')?.click();
    return;
  }
  if(role === 'photo-pick-detail'){
    el.parentElement.querySelector('[data-role="photo-input-detail"]')?.click();
    return;
  }
  if(role === 'photo-del-overview'){
    getTest(testKey).photos.overview = null;
    renderTestPane(testKey);
    saveDraftDebounced();
    return;
  }
  if(role === 'photo-del-detail'){
    getTest(testKey).photos.detail = null;
    renderTestPane(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'timer-start'){
    const c = getActiveCycle(testKey);
    if(c) startTimer(c.id);
    return;
  }
  if(role === 'timer-stop'){
    const c = getActiveCycle(testKey);
    if(c) stopTimer(c.id);
    return;
  }
  if(role === 'timer-reset'){
    const c = getActiveCycle(testKey);
    if(c && confirm(`Timer für ${c.title} zurücksetzen?`)) resetTimer(c.id);
    return;
  }
  if(role === 'timer-display'){
    const c = getActiveCycle(testKey);
    if(c){
      _timeAdjustCtx = { testKey, cycleId:c.id };
      $('timeAdjustInput').value = '0';
      $('timeAdjustPreview').textContent = `Neue Zeit: ${formatElapsed(c.elapsedMs || 0)}`;
      $('timeAdjustModal').hidden = false;
    }
    return;
  }

  if(role === 'add-cycle'){
    const test = getTest(testKey);
    if(test.mode === 'norm'){
      alert('Im Modus "Norm / Vorlage" sind die Zyklen fix.');
      return;
    }
    const defs = testKey === 'eignung'
      ? buildEignungNormCycles(test.spec.bodenart)
      : buildAusziehOrAbnahmeNormCycles(testKey);
    const tpl = defs[Math.min(test.cycles.length, defs.length - 1)];
    const cycle = makeCycleFromDef({ ...tpl, nr:test.cycles.length + 1 });
    test.cycles.push(cycle);
    test.activeCycleId = cycle.id;
    renderTestPane(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'cycle-del'){
    const cycleId = el.dataset.cycle;
    const test = getTest(testKey);
    test.cycles = test.cycles.filter(c => c.id !== cycleId);
    ensureActiveCycle(testKey);
    renderTestPane(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'stage-add'){
    const c = getCycleById(testKey, el.dataset.cycle);
    if(!c) return;
    c.stageDefs.push(makeStageDef('factor',0.4,[0,1]));
    syncRowsFromStageDefs(c);
    renderTestPane(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'stage-del'){
    const c = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.stage);
    if(!c || c.stageDefs.length <= 1) return;
    c.stageDefs.splice(idx,1);
    c.holdStageIdx = Math.min(c.holdStageIdx, c.stageDefs.length - 1);
    syncRowsFromStageDefs(c);
    renderTestPane(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'row-add'){
    const c = getCycleById(testKey, el.dataset.cycle);
    if(!c || getTest(testKey).mode !== 'frei') return;

    const last = Number(c.rows[c.rows.length - 1]?.min || 0);
    const stageIdx = c.rows[c.rows.length - 1]?.stageIdx ?? 0;
    c.rows.push({
      stageIdx,
      min:last + 1,
      ablesung:'',
      versch:'',
      anm:''
    });
    renderTestPane(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'row-anm'){
    const c = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.row);
    if(!c) return;
    const cur = c.rows[idx]?.anm || '';
    const v = prompt('Anmerkung:', cur);
    if(v !== null){
      c.rows[idx].anm = v;
      renderTestPane(testKey);
      saveDraftDebounced();
    }
    return;
  }

  if(role === 'history-load'){
    const entry = readHistory().find(h => h.id === el.dataset.id);
    if(entry) applySnapshot(entry.snapshot);
    return;
  }

  if(role === 'history-del'){
    if(!confirm('Eintrag löschen?')) return;
    writeHistory(readHistory().filter(h => h.id !== el.dataset.id));
    renderHistoryList();
    return;
  }

  if(role === 'history-export'){
    const entry = readHistory().find(h => h.id === el.dataset.id);
    if(!entry) return;
    const blob = new Blob([JSON.stringify(entry.snapshot,null,2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HTB_History_${dateTag()}_${el.dataset.id}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    return;
  }

  if(role === 'history-pdf'){
    const entry = readHistory().find(h => h.id === el.dataset.id);
    if(!entry) return;
    const t = entry.snapshot.state.activeTest || 'eignung';
    await exportPdfForTest(t, entry.snapshot.state);
    return;
  }
});

document.addEventListener('change', async e => {
  const el = e.target.closest('[data-role]');
  if(!el) return;
  const role = el.dataset.role;
  const testKey = el.dataset.test;

  if(role === 'kalib-select'){
    state.meta.selectedKalibId = el.value;
    renderAllTests();
    saveDraftDebounced();
    return;
  }

  if(role === 'typeKey'){
    applyTypePreset(testKey, el.value);
    return;
  }

  if(role === 'spec-bodenart'){
    getTest(testKey).spec.bodenart = el.value;
    if(getTest(testKey).mode === 'norm') applyNormToTest(testKey);
    renderTestPane(testKey);
    renderAuswertung();
    saveDraftDebounced();
    return;
  }

  if(role === 'test-mode'){
    getTest(testKey).mode      ? `Auto aus Pd · γa = ${fmt(a.Pp,2)} kN`
      : '';
  }

  const hintPd = $('hint-vor-Pd');
  if(hintPd){
    hintPd.textContent = '';
  }

  const lappEl = $('calc-LappMeasured');
  if(lappEl){
    lappEl.textContent = Number.isFinite(a.measuredLapp)
      ? `${fmt(a.measuredLapp,2)} m${a.measuredZyklus ? ` (Zyklus ${a.measuredZyklus})` : ''}`
      : '—';
  }

  const checkEl = $('calc-LappCheck');
  if(checkEl){
    if(Number.isFinite(a.measuredLapp) && Number.isFinite(a.minLapp) && Number.isFinite(a.maxLapp)){
      const ok = a.measuredLapp >= a.minLapp && a.measuredLapp <= a.maxLapp;
      checkEl.textContent = ok ? 'OK' : 'nicht OK';
      checkEl.className = `inline-badge ${ok ? 'inline-badge--good' : 'inline-badge--bad'}`;
    }else{
      checkEl.textContent = '—';
      checkEl.className = 'inline-badge';
    }
  }

  updateRequiredFieldStates();
}

/* ═══════════════════════════════════════════════════════
   ANKERTYP UI
═══════════════════════════════════════════════════════ */
function initAnkertypSelect(){
  const old = $('vor-ankertyp');
  if(!old) return;

  if(old.tagName === 'SELECT'){
    fillAnkertypOptions(old);
    return;
  }

  const select = document.createElement('select');
  select.id = old.id;
  select.className = old.className.replace('field__input', 'field__select');
  fillAnkertypOptions(select);

  const currentValue = old.value || state.vorgabe.ankertyp || '';
  old.replaceWith(select);

  if(currentValue){
    const exists = ANKER_TYPEN.some(t => t.key === currentValue);
    if(exists){
      select.value = currentValue;
    }else{
      const opt = document.createElement('option');
      opt.value = currentValue;
      opt.textContent = currentValue;
      select.appendChild(opt);
      select.value = currentValue;
    }
  }
}

function fillAnkertypOptions(select){
  const current = select.value || state.vorgabe.ankertyp || '';
  select.innerHTML = `<option value="">Bitte wählen</option>`;

  const groups = {};
  ANKER_TYPEN.forEach(t => {
    if(!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });

  Object.entries(groups).forEach(([group, items]) => {
    const og = document.createElement('optgroup');
    og.label = group;
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.key;
      opt.textContent = item.label;
      og.appendChild(opt);
    });
    select.appendChild(og);
  });

  if(current && ANKER_TYPEN.some(t => t.key === current)){
    select.value = current;
  }
}

function ensureAnkertypInfoBox(){
  let box = $('ankertypInfoBox');
  if(box) return box;

  const field = $('vor-ankertyp')?.closest('.field');
  if(!field) return null;

  box = document.createElement('div');
  box.id = 'ankertypInfoBox';
  box.className = 'info-box field--full';
  box.style.cssText = 'margin-top:12px;padding:10px 14px;border-radius:8px;background:rgba(86,183,255,.08);border:1px solid rgba(86,183,255,.2);font-size:13px;line-height:1.7';

  const grid = field.parentElement;
  if(grid) grid.appendChild(box);

  return box;
}

function renderAnkertypInfo(){
  const box = ensureAnkertypInfoBox();
  if(!box) return;

  const typ = getAnkertypByKey(state.vorgabe.ankertyp);
  if(!typ){
    box.hidden = true;
    return;
  }

  const rows = [
    ['Typ', typ.label],
    ['Nenndurchmesser', typ.nenndurchmesser != null ? `${typ.nenndurchmesser} mm` : '—'],
    ['Ø über Muffe', typ.muffe != null ? `${typ.muffe} mm` : '—'],
    ['Streckgrenze / Zugfestigkeit', typ.streckZug || '—'],
    ['Querschnittsfläche At', typ.At != null ? `${fmt(typ.At,0)} mm²` : '—'],
    ['Last an der Streckgrenze', typ.lastStreck != null ? `${fmt(typ.lastStreck,1)} kN` : '—'],
    ['90 % Streckgrenze', typ.lastStreck90 != null ? `${fmt(typ.lastStreck90,1)} kN` : '—'],
    ['Bruchlast', typ.bruchlast != null ? `${fmt(typ.bruchlast,1)} kN` : '—'],
    ['80 % Bruchlast', typ.bruch80 != null ? `${fmt(typ.bruch80,1)} kN` : '—']
  ];

  box.hidden = false;
  box.innerHTML = `<b style="display:block;margin-bottom:4px">Technische Daten</b>${rows.map(([k,v])=>`${h(k)}: <b>${h(v)}</b>`).join('<br>')}`;
}

function applyAnkertypPreset(key, { overwrite = true } = {}){
  const typ = getAnkertypByKey(key);
  state.vorgabe.ankertyp = key || '';

  if(!typ){
    renderAnkertypInfo();
    updateRequiredFieldStates();
    return;
  }

  if(typ.At != null && (overwrite || !state.vorgabe.At || String(state.vorgabe.At).trim() === '')){
    state.vorgabe.At = formatInputNumber(Number(typ.At), 0);
    if($('vor-At')) $('vor-At').value = state.vorgabe.At;
  }

  if(typ.lastStreck != null && (overwrite || !state.vorgabe.Pt01k || String(state.vorgabe.Pt01k).trim() === '')){
    state.vorgabe.Pt01k = formatInputNumber(Number(typ.lastStreck), 1);
    if($('vor-Pt01k')) $('vor-Pt01k').value = state.vorgabe.Pt01k;
  }

  renderAnkertypInfo();
  updateLappPreview();
  if(!$('tab-auswertung')?.hidden) renderAuswertung();
  saveDraftDebounced();
}

/* ═══════════════════════════════════════════════════════
   AUDIO / ALARM
═══════════════════════════════════════════════════════ */
function getAlarmAudioContext(){
  if(!_audioCtx){
    try{
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      _alarmGain = _audioCtx.createGain();
      _alarmGain.gain.value = 1.0;
      _alarmGain.connect(_audioCtx.destination);
    }catch{
      return null;
    }
  }
  return _audioCtx;
}

function audioNeedsResume(ctx){
  return !ctx || ctx.state === 'suspended' || ctx.state === 'interrupted';
}

async function unlockAlarmAudio(){
  const ctx = getAlarmAudioContext();
  if(!ctx) return false;

  try{
    if(audioNeedsResume(ctx)){
      await ctx.resume();
      await new Promise(r => setTimeout(r, 30));
    }
    if(audioNeedsResume(ctx)){
      _alarmReady = false;
      updateAlarmSoundButton();
      return false;
    }

    const buf = ctx.createBuffer(1,1,22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(_alarmGain || ctx.destination);
    src.start(0);

    _alarmReady = true;
    updateAlarmSoundButton();
    return true;
  }catch{
    _alarmReady = false;
    updateAlarmSoundButton();
    return false;
  }
}

function scheduleBeep(ctx,start,duration=0.10,freq=2350,volume=0.52){
  const out = _alarmGain || ctx.destination;
  [freq, freq * 1.015].forEach(f => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(f,start);
    g.gain.setValueAtTime(0.0001,start);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001,volume),start+0.005);
    g.gain.setValueAtTime(Math.max(0.0001,volume),start+Math.max(0.03,duration-0.02));
    g.gain.exponentialRampToValueAtTime(0.0001,start+duration);
    osc.connect(g);
    g.connect(out);
    osc.start(start);
    osc.stop(start+duration+0.02);
  });
}

async function playIntervalBeep(){
  if(state.settings?.alarmSoundEnabled === false) return false;

  const ctx = getAlarmAudioContext();
  if(!ctx) return false;

  if(audioNeedsResume(ctx)){
    const ok = await unlockAlarmAudio();
    if(!ok) return false;
  }

  try{
    const p = [120,90,120,90,120,360];
    const tot = Math.max(1,Math.round(Number(state.settings.alarmDurationSec || 4) / 0.9));
    const vib = [];
    for(let i=0;i<tot;i++) vib.push(...p);
    if(navigator.vibrate) navigator.vibrate(vib);
  }catch{}

  const dur = clamp(Number(state.settings.alarmDurationSec || 4),1,30);
  const now = ctx.currentTime + 0.02;
  const cycle = 0.90;

  for(let t=0;t<dur;t+=cycle){
    scheduleBeep(ctx, now+t,      0.10, 2350, 0.52);
    scheduleBeep(ctx, now+t+0.20, 0.10, 2350, 0.52);
    scheduleBeep(ctx, now+t+0.40, 0.12, 2550, 0.56);
  }

  return true;
}

function installAudioUnlock(){
  const fn = () => {
    if(state.settings?.alarmSoundEnabled === false) return;
    void unlockAlarmAudio();
  };
  ['pointerdown','touchstart','keydown','click'].forEach(evt =>
    window.addEventListener(evt, fn, { passive:true })
  );
}

function updateAlarmSoundButton(){
  const btn = $('btnAlarmSoundToggle');
  const status = $('alarmSoundStatus');
  if(!btn) return;

  const enabledPref = state.settings.alarmSoundEnabled !== false;
  const active = enabledPref && _alarmReady;

  btn.textContent = active ? 'Ton ausschalten' : 'Ton einschalten';
  btn.classList.toggle('btn--save', active);
  btn.classList.toggle('btn--ghost', !active);

  if(status){
    status.textContent = active
      ? 'Alarmton ist aktiv.'
      : (enabledPref ? 'Für iPhone: einmal hier aktivieren oder vor dem Start testen.' : 'Alarmton ist ausgeschaltet.');
  }
}

async function toggleAlarmSoundByUserGesture(){
  const active = state.settings.alarmSoundEnabled !== false && _alarmReady;
  if(active){
    state.settings.alarmSoundEnabled = false;
    _alarmReady = false;
    updateAlarmSoundButton();
    saveDraftDebounced();
    return;
  }

  state.settings.alarmSoundEnabled = true;
  const ok = await unlockAlarmAudio();

  if(ok){
    const ctx = getAlarmAudioContext();
    const now = ctx.currentTime + 0.02;
    scheduleBeep(ctx, now,      0.08, 2100, 0.42);
    scheduleBeep(ctx, now+0.18, 0.10, 2550, 0.50);
  }

  updateAlarmSoundButton();
  saveDraftDebounced();

  if(!ok){
    alert('Ton konnte nicht aktiviert werden. Lautstärke prüfen und erneut antippen.');
  }
}

/* ═══════════════════════════════════════════════════════
   TIMER (GLOBAL ÜBER ALLE ZYKLEN)
═══════════════════════════════════════════════════════ */
function ensureTimer(zid,z){
  if(!timerMap[zid]){
    const min = Number(z?.elapsedMs || 0) / 60000;
    const ints = parseIntervalStr(z.intervalleStr);
    timerMap[zid] = {
      running:false,
      startMs:0,
      accumulatedMs:Number(z?.elapsedMs || 0),
      raf:null,
      alarmCount:ints.filter(iv => iv > 0 && min >= iv).length
    };
  }
  return timerMap[zid];
}

function getElapsedMs(zid,z){
  const t = timerMap[zid];
  if(!t) return Number(z?.elapsedMs || 0);
  return t.running ? t.accumulatedMs + (Date.now() - t.startMs) : t.accumulatedMs;
}

function highlightActiveMeasurementRow(z){
  document.querySelectorAll('.zyklus-card tbody tr').forEach(r => r.classList.remove('row-active'));
  if(!z) return;

  const card = document.querySelector(`.zyklus-card[data-zid="${z.id}"]`);
  if(!card) return;

  const ints = parseIntervalStr(z.intervalleStr);
  const eMin = getElapsedMs(z.id,z) / 60000;
  const passed = ints.filter(iv => eMin >= iv);
  const last = passed.length ? passed[passed.length - 1] : ints[0];
  const idx = z.messungen.findIndex(m => Number(m.min) === Number(last));

  if(idx >= 0){
    const row = card.querySelector(`tr[data-row="${idx}"]`);
    if(row) row.classList.add('row-active');
  }
}

function updateGlobalTimerUi(){
  const z = getActiveZyklus();
  const display = $('globalTimerDisplay');
  const badge = $('activeZyklusBadge');
  const select = $('activeZyklusSelect');
  const startzeit = $('globalTimerStartzeit');
  const nextEl = $('globalTimerNext');
  const btnStart = $('btnGlobalTimerStart');
  const btnStop = $('btnGlobalTimerStop');

  if(!z){
    if(display) display.textContent = '00:00';
    return;
  }

  const t = ensureTimer(z.id,z);
  const ms = getElapsedMs(z.id,z);
  z.elapsedMs = ms;

  if(display) display.textContent = formatElapsed(ms);
  if(badge) badge.textContent = `Zyklus ${z.nr}`;
  if(select) select.value = z.id;
  if(startzeit) startzeit.textContent = z.startzeit ? `Startzeit: ${z.startzeit}` : 'Noch nicht gestartet';

  const ints = parseIntervalStr(z.intervalleStr);
  const eMin = ms / 60000;
  const next = ints.filter(iv => iv > 0).find(iv => eMin < iv);

  if(nextEl){
    nextEl.textContent = next !== undefined
      ? `Nächste Messung: ${next} min (in ${Math.max(0,Math.ceil((next*60000-ms)/1000))}s)`
      : 'Alle Intervalle erreicht';
  }

  if(btnStart){
    btnStart.textContent = t.running ? 'Läuft' : (z.elapsedMs > 0 ? 'Weiter' : 'Start');
    btnStart.disabled = t.running;
  }
  if(btnStop) btnStop.disabled = !t.running;

  highlightActiveMeasurementRow(z);
}

function triggerIntervalAlarm(){
  const display = $('globalTimerDisplay');

  document.body.classList.remove('screen-flash');
  void document.body.offsetWidth;
  document.body.classList.add('screen-flash');

  if(display){
    display.classList.remove('timer-display--alarm');
    void display.offsetWidth;
    display.classList.add('timer-display--alarm');
  }

  void playIntervalBeep();

  setTimeout(() => document.body.classList.remove('screen-flash'), 1800);
  setTimeout(() => {
    if(display) display.classList.remove('timer-display--alarm');
  }, Math.max(2400, Number(state.settings.alarmDurationSec || 4) * 1000 + 600));
}

function tickTimer(zid){
  const z = getZyklusById(zid);
  const t = timerMap[zid];
  if(!z || !t || !t.running) return;

  z.elapsedMs = getElapsedMs(zid,z);

  const ints = parseIntervalStr(z.intervalleStr).filter(n => n > 0);
  const passed = ints.filter(iv => z.elapsedMs / 60000 >= iv).length;

  if(passed > t.alarmCount){
    t.alarmCount = passed;
    triggerIntervalAlarm();
  }

  updateGlobalTimerUi();
  updateFloatingTimerWidget();
  t.raf = requestAnimationFrame(() => tickTimer(zid));
}

function stopAllOtherTimers(exceptZid){
  Object.keys(timerMap).forEach(zid => {
    if(zid !== exceptZid && timerMap[zid]?.running){
      stopTimer(zid);
    }
  });
}

function startTimer(zid){
  const z = getZyklusById(zid);
  if(!z) return;

  if(state.settings.alarmSoundEnabled !== false) void unlockAlarmAudio();
  stopAllOtherTimers(zid);

  const t = ensureTimer(zid,z);
  if(t.running) return;

  if(!z.startzeit) z.startzeit = formatTimeHHMMSS(new Date());

  const ints = parseIntervalStr(z.intervalleStr).filter(n => n > 0);
  t.alarmCount = ints.filter(iv => t.accumulatedMs / 60000 >= iv).length;
  t.running = true;
  t.startMs = Date.now();

  updateGlobalTimerUi();
  tickTimer(zid);
  startFloatingLoop();
  saveDraftDebounced();
}

function stopTimer(zid){
  const z = getZyklusById(zid);
  const t = timerMap[zid];
  if(!z || !t || !t.running) return;

  t.accumulatedMs += (Date.now() - t.startMs);
  z.elapsedMs = t.accumulatedMs;
  t.running = false;

  if(t.raf) cancelAnimationFrame(t.raf);
  t.raf = null;

  updateGlobalTimerUi();
  updateFloatingTimerWidget();
  stopFloatingLoopIfIdle();
  saveDraftDebounced();
}

function resetTimer(zid){
  const z = getZyklusById(zid);
  if(!z) return;

  const t = ensureTimer(zid,z);
  if(t.raf) cancelAnimationFrame(t.raf);

  t.running = false;
  t.startMs = 0;
  t.accumulatedMs = 0;
  t.raf = null;
  t.alarmCount = 0;

  z.elapsedMs = 0;
  z.startzeit = '';

  updateGlobalTimerUi();
  updateFloatingTimerWidget();
  stopFloatingLoopIfIdle();
  saveDraftDebounced();
}

function startActiveTimer(){
  const z = getActiveZyklus();
  if(z) startTimer(z.id);
}

function stopActiveTimer(){
  const z = getActiveZyklus();
  if(z) stopTimer(z.id);
}

function resetActiveTimer(){
  const z = getActiveZyklus();
  if(z && confirm(`Timer für Zyklus ${z.nr} zurücksetzen?`)){
    resetTimer(z.id);
  }
}

/* ═══════════════════════════════════════════════════════
   FLOATING TIMER
═══════════════════════════════════════════════════════ */
function getFirstRunningZyklus(){
  return state.zyklen.find(z => timerMap[z.id]?.running) || null;
}

function isElementVisible(el){
  if(!el) return false;
  const r = el.getBoundingClientRect();
  if(r.width === 0 && r.height === 0) return false;
  if(getComputedStyle(el).display === 'none') return false;
  return r.top >= 0 && r.bottom <= window.innerHeight;
}

function updateFloatingTimerWidget(){
  const wrap = $('floatingTimer');
  const label = $('floatingTimerLabel');
  const display = $('floatingTimerDisplay');
  if(!wrap || !label || !display) return;

  const z = getFirstRunningZyklus();
  if(!z){
    wrap.hidden = true;
    return;
  }

  label.textContent = `Zyklus ${z.nr}`;
  display.textContent = formatElapsed(getElapsedMs(z.id,z));
  wrap.hidden = isElementVisible($('globalTimerBox'));
}

function startFloatingLoop(){
  if(_floatingRaf) return;
  const loop = () => {
    updateFloatingTimerWidget();
    if(Object.values(timerMap).some(t => t.running)){
      _floatingRaf = requestAnimationFrame(loop);
    }else{
      _floatingRaf = null;
    }
  };
  _floatingRaf = requestAnimationFrame(loop);
}

function stopFloatingLoopIfIdle(){
  if(!Object.values(timerMap).some(t => t.running) && _floatingRaf){
    cancelAnimationFrame(_floatingRaf);
    _floatingRaf = null;
  }
}

/* ═══════════════════════════════════════════════════════
   TIME ADJUST MODAL
═══════════════════════════════════════════════════════ */
function openTimeAdjustModal(zid){
  _timeAdjustVid = zid;
  if($('timeAdjustInput')) $('timeAdjustInput').value = '0';
  updateTimeAdjustPreview();
  if($('timeAdjustModal')) $('timeAdjustModal').hidden = false;
}

function closeTimeAdjustModal(){
  if($('timeAdjustModal')) $('timeAdjustModal').hidden = true;
  _timeAdjustVid = null;
}

function updateTimeAdjustPreview(){
  const z = getZyklusById(_timeAdjustVid);
  if(!z || !$('timeAdjustPreview')) return;
  const next = Math.max(0, getElapsedMs(z.id,z) + Number($('timeAdjustInput')?.value || 0) * 1000);
  $('timeAdjustPreview').textContent = `Neue Zeit: ${formatElapsed(next)}`;
}

function applyTimeAdjustment(){
  const z = getZyklusById(_timeAdjustVid);
  if(!z) return;

  const offset = Number($('timeAdjustInput')?.value || 0);
  const t = ensureTimer(z.id,z);
  const next = Math.max(0, getElapsedMs(z.id,z) + offset * 1000);

  if(t.running){
    t.startMs = Date.now();
    t.accumulatedMs = next;
  }else{
    t.accumulatedMs = next;
  }

  z.elapsedMs = next;
  if(!z.startzeit && next > 0) z.startzeit = formatTimeHHMMSS(new Date());

  updateGlobalTimerUi();
  updateFloatingTimerWidget();
  saveDraftDebounced();
  closeTimeAdjustModal();
}

/* ═══════════════════════════════════════════════════════
   PRESSE UI
═══════════════════════════════════════════════════════ */
function renderPresseDropdown(){
  const sel = $('presseSelect');
  if(!sel) return;

  const kalibs = loadAllKalibs();
  const current = state.meta.selectedKalibId;

  sel.innerHTML = `<option value="">Bitte wählen</option>`;

  kalibs.forEach(k => {
    const opt = document.createElement('option');
    opt.value = k.id;
    opt.textContent = `${k.displayName}${k.kalibriertAm ? ` (${k.kalibriertAm})` : ''}`;
    if(k.id === current) opt.selected = true;
    sel.appendChild(opt);
  });
}

function renderKalibStuetzpunkte(kalib){
  const wrap = $('kalibStuetzpunkteWrap');
  const sel  = $('kalibStuetzpunkteSelect');
  const result = $('kalibStuetzpunkteResult');

  if(!wrap || !sel || !result) return;

  if(!kalib || !kalib.punkte?.length){
    wrap.hidden = true;
    sel.innerHTML = '';
    result.textContent = '';
    return;
  }

  wrap.hidden = false;
  sel.innerHTML = `<option value="">Stützpunkt auswählen …</option>`;

  kalib.punkte.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = `${fmt(p.kN,1)} kN → ${fmt(p.bar,1)} bar`;
    sel.appendChild(opt);
  });

  sel.onchange = () => {
    const idx = Number(sel.value);
    if(!Number.isFinite(idx) || sel.value === ''){
      result.textContent = '';
      return;
    }
    const p = kalib.punkte[idx];
    if(!p){
      result.textContent = '';
      return;
    }
    result.innerHTML = `
      <span class="stuetz-kn">${fmt(p.kN,1)} kN</span>
      <span class="stuetz-arr">→</span>
      <span class="stuetz-bar">${fmt(p.bar,1)} bar</span>
      <span class="stuetz-note">(exakter CSV-Wert · keine Interpolation)</span>
    `;
  };
}

function renderKalibInfo(){
  const box = $('kalibInfoBox');
  const emptyHint = $('kalibEmptyHint');
  if(!box) return;

  const kalib = findKalibById(state.meta.selectedKalibId);

  const setText = (id, value) => {
    const el = $(id);
    if(el) el.textContent = value;
  };

  if(!kalib){
    box.hidden = true;
    if(emptyHint) emptyHint.hidden = false;
    renderKalibStuetzpunkte(null);
    renderKalibPreview();
    return;
  }

  box.hidden = false;
  if(emptyHint) emptyHint.hidden = true;

  setText('kalibName', kalib.displayName);
  setText('kalibSub', `${kalib.presseTyp} · ${kalib.presseNr}`);

  const status = kalibStatus(kalib);
  const bis = kalibGueltigBis(kalib);
  const badge = $('kalibValidBadge');
  const bisStr = bis ? bis.toLocaleDateString('de-DE') : '—';
  const diffDays = bis ? Math.floor((bis - new Date()) / 86400000) : 999;

  if(badge){
    badge.textContent =
      status === 'ok'   ? `✅ Gültig bis ${bisStr}` :
      status === 'warn' ? `⚠️ Läuft ab in ${diffDays} Tagen (${bisStr})` :
                          `❌ Abgelaufen seit ${bisStr}`;
    badge.className = `kalib-badge kalib-badge--${status}`;
  }

  setText('kInfo-presseTyp', kalib.presseTyp || '—');
  setText('kInfo-presseNr', kalib.presseNr || '—');
  setText('kInfo-manTyp', kalib.manometerTyp || '—');
  setText('kInfo-manNr', kalib.manometerNr || '—');
  setText('kInfo-kalibAm', kalib.kalibriertAm ? new Date(kalib.kalibriertAm).toLocaleDateString('de-DE') : '—');
  setText('kInfo-gueltigBis', bisStr);
  setText('kInfo-punkte', `${(kalib.punkte || []).length} Stützpunkte`);
  setText('kInfo-maxKn', `${kalib.punkte?.length ? Math.max(...kalib.punkte.map(p => p.kN)) : 0} kN`);

  renderKalibStuetzpunkte(kalib);
  renderKalibPreview();
}

function renderKalibPreview(){
  const wrap = $('kalibPreview');
  const table = $('kalibPreviewTable');
  if(!wrap || !table) return;

  const Pp = toNumFlexible(state.vorgabe.Pp);
  const kalib = findKalibById(state.meta.selectedKalibId);

  if(!kalib || !Number.isFinite(Pp) || Pp <= 0){
    wrap.hidden = true;
    return;
  }

  wrap.hidden = false;
  const vorschau = berechneDruckvorschau();

  table.innerHTML = `
    <div class="kalib-prev-row kalib-prev-row--head">
      <span>Laststufe</span>
      <span style="text-align:right">kN</span>
      <span style="text-align:right">bar</span>
    </div>
    ${vorschau.map(v => {
      const knStr = Number.isFinite(v.kN) ? fmt(v.kN,1) + ' kN' : '—';
      const note = v.exact ? '' : (v.basisKn != null ? ` · Stützpunkt ${fmt(v.basisKn,1)} kN` : '');
      const barStr = v.bar !== null
        ? `${fmt(v.bar,1)} bar${note}`
        : (v.oor ? '⚠ außerhalb' : '—');

      return `
        <div class="kalib-prev-row">
          <span class="prev-label">${h(v.label)}</span>
          <span class="prev-kn">${knStr}</span>
          <span class="${v.oor ? 'prev-bar prev-bar--oor' : 'prev-bar'}">${barStr}</span>
        </div>
      `;
    }).join('')}
  `;
}

/* ═══════════════════════════════════════════════════════
   DRUCK AUS KALIBRIERUNG
═══════════════════════════════════════════════════════ */
function syncDruckFromKalib(){
  const kalib = findKalibById(state.meta.selectedKalibId);

  if(!kalib){
    document.querySelectorAll('[data-role="m-druck"], [data-role="ls-druck"]').forEach(el => {
      el.classList.remove('mess-input--auto');
      el.readOnly = false;
      el.title = '';
    });
    return;
  }

  const Pp = toNumFlexible(state.vorgabe.Pp);
  const Pa = toNumFlexible(state.vorgabe.Pa);
  const P0 = toNumFlexible(state.vorgabe.P0);

  state.zyklen.forEach(z => {
    z.laststufen = normalizeLaststufenArray(z.laststufen);

    z.laststufen.forEach(ls => {
      let kN = NaN;

      if(ls.kind === 'p0'){
        kN = P0;
      }else if(ls.kind === 'pa'){
        kN = Pa;
      }else{
        kN = Number.isFinite(Pp) ? Pp * Number(ls.faktor || 0) : NaN;
      }

      const bar = kNtoBar(kN);
      ls.druck = bar !== null ? String(bar) : '';
    });

    const haltIdx = Number.isInteger(z.haltLaststufeIdx)
      ? Math.min(z.haltLaststufeIdx, z.laststufen.length - 1)
      : defaultHoldIdxFromLaststufen(z.laststufen);

    const haltLs = z.laststufen[haltIdx];
    let haltKn = NaN;

    if(haltLs){
      if(haltLs.kind === 'p0'){
        haltKn = P0;
      }else if(haltLs.kind === 'pa'){
        haltKn = Pa;
      }else{
        haltKn = Number.isFinite(Pp) ? Pp * Number(haltLs.faktor || 0) : NaN;
      }
    }

    const haltBar = kNtoBar(haltKn);
    const haltBarStr = haltBar !== null ? String(haltBar) : '';

    z.messungen.forEach(row => {
      row.druck = haltBarStr;
    });
  });

  renderZyklen();

  document.querySelectorAll('[data-role="m-druck"]').forEach(input => {
    if(input.value !== ''){
      input.readOnly = true;
      input.classList.add('mess-input--auto');
      input.title = 'Automatisch aus Kalibrierung berechnet';
    }else{
      input.readOnly = false;
      input.classList.remove('mess-input--auto');
      input.title = '';
    }
  });

  document.querySelectorAll('[data-role="ls-druck"]').forEach(input => {
    const card = input.closest('.zyklus-card');
    const z = getZyklusById(card?.dataset.zid);
    const idx = Number(input.dataset.idx);

    if(z?.laststufen[idx]?.druck){
      input.value = z.laststufen[idx].druck;
      input.readOnly = true;
      input.classList.add('mess-input--auto');
      input.title = 'Automatisch aus Kalibrierung berechnet';
    }else{
      input.readOnly = false;
      input.classList.remove('mess-input--auto');
      input.title = '';
    }
  });

  saveDraftDebounced();
}

/* ═══════════════════════════════════════════════════════
   GLOBALER TIMER HTML
═══════════════════════════════════════════════════════ */
function buildGlobalTimerHtml(){
  const z = getActiveZyklus();
  const display = z ? formatElapsed(getElapsedMs(z.id,z)) : '00:00';
  const badge = z ? `Zyklus ${z.nr}` : '—';

  return `
    <div id="globalTimerBox" class="timer-box" style="margin-bottom:12px">
      <div class="global-timer-head" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <div class="zyklus-title" style="font-weight:800">Stoppuhr Eignungsprüfung</div>
        <span id="activeZyklusBadge" class="zyklus-badge">${badge}</span>
      </div>

      <div class="timer-row" style="margin-bottom:8px">
        <div class="timer-display" id="globalTimerDisplay" data-role="global-elapsed" title="Tippen zum Anpassen">${display}</div>
        <span class="timer-edit-hint">tippen = anpassen</span>

        <label class="field" style="min-width:170px">
          <span class="field__label">Modus</span>
          <select id="zyklenModeSelect" data-role="zyklen-mode" class="field__select">
            <option value="norm" ${state.settings.zyklenMode === 'norm' ? 'selected' : ''}>Norm / Vorlage</option>
            <option value="frei" ${state.settings.zyklenMode === 'frei' ? 'selected' : ''}>Freie Eingabe</option>
          </select>
        </label>

        <label class="field" style="min-width:170px; margin-left:auto">
          <span class="field__label">Aktiver Zyklus</span>
          <select id="activeZyklusSelect" data-role="global-active-select" class="field__select">
            ${state.zyklen.map(zy => `
              <option value="${h(zy.id)}" ${state.meta.activeZyklusId === zy.id ? 'selected' : ''}>
                Zyklus ${zy.nr}
              </option>
            `).join('')}
          </select>
        </label>

        <div class="timer-buttons">
          <button id="btnGlobalTimerStart" class="timer-btn timer-btn--start" data-role="global-start" type="button">Start</button>
          <button id="btnGlobalTimerStop" class="timer-btn timer-btn--stop" data-role="global-stop" type="button">Stop</button>
          <button id="btnGlobalTimerReset" class="timer-btn timer-btn--ghost" data-role="global-reset" type="button">Reset</button>
        </div>
      </div>

      <div class="timer-info" id="globalTimerStartzeit">Noch nicht gestartet</div>
      <div class="timer-info timer-next" id="globalTimerNext">Nächste Messung: —</div>
      <div class="hint" style="text-align:left;margin-top:8px">
        <b>Norm / Vorlage:</b> Zeitintervalle fix.
        <br>
        <b>Freie Eingabe:</b> Intervalle und Laststufen veränderbar.
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════
   ZYKLUS-RENDERING
   → Laststufe + Last links der Minuten
═══════════════════════════════════════════════════════ */
function buildLaststufenHtml(z){
  const isFree = state.settings.zyklenMode === 'frei';
  z.laststufen = normalizeLaststufenArray(z.laststufen);

  const Pp = toNumFlexible(state.vorgabe.Pp);
  const Pa = toNumFlexible(state.vorgabe.Pa);
  const P0 = toNumFlexible(state.vorgabe.P0);

  return z.laststufen.map((ls, i) => {
    let lastKn = NaN;

    if(ls.kind === 'p0'){
      lastKn = P0;
    }else if(ls.kind === 'pa'){
      lastKn = Pa;
    }else{
      lastKn = Number.isFinite(Pp) ? (Pp * ls.faktor) : NaN;
    }

    if(!isFree){
      return `
        <div class="field">
          <span class="field__label">${h(ls.label)}</span>
          <input class="field__input" data-role="ls-druck" data-idx="${i}" type="number" step="0.1" placeholder="bar" value="${h(ls.druck)}" />
          <span class="hint" style="font-size:11px;text-align:left;margin-top:2px">≈ ${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'} kN</span>
        </div>
      `;
    }

    return `
      <div class="field" style="min-width:130px">
        <span class="field__label">Stufe ${i+1}</span>

        <select class="field__select" data-role="ls-type" data-idx="${i}">
          <option value="pa" ${ls.kind === 'pa' ? 'selected' : ''}>Pa</option>
          <option value="factor" ${ls.kind === 'factor' ? 'selected' : ''}>X · Pp</option>
          <option value="p0" ${ls.kind === 'p0' ? 'selected' : ''}>P0</option>
        </select>

        <input
          class="field__input"
          data-role="ls-factor"
          data-idx="${i}"
          type="number"
          step="0.05"
          value="${ls.kind === 'factor' ? h(ls.faktor) : ''}"
          ${ls.kind === 'factor' ? '' : 'disabled'}
          placeholder="z.B. 0,55"
        />

        <input class="field__input" data-role="ls-druck" data-idx="${i}" type="number" step="0.1" placeholder="bar" value="${h(ls.druck)}" />

        <span class="hint" style="font-size:11px;text-align:left;margin-top:2px">
          ${ls.kind === 'factor' ? h(factorToLabel(ls.faktor)) : h(ls.label)} · ≈ ${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'} kN
        </span>

        <div class="action-row" style="justify-content:flex-start;margin-top:4px">
          <button class="timer-btn timer-btn--ghost" data-role="ls-del" data-idx="${i}" type="button">−</button>
          ${i === z.laststufen.length - 1 ? `<button class="timer-btn timer-btn--ghost" data-role="ls-add" data-idx="${i}" type="button">+</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function buildMeasurementBody(z, isFree){
  let html = '';
  const stages = normalizeLaststufenArray(z.laststufen);

  for(let i=0;i<z.messungen.length;i++){
    const row = z.messungen[i];
    const prev = z.messungen[i-1];
    const stage = stages[row.stageIdx ?? z.haltLaststufeIdx ?? 0] || stages[0] || makeLaststufe('pa');
    const isFirstInStage = !prev || (prev.stageIdx ?? z.haltLaststufeIdx ?? 0) !== (row.stageIdx ?? z.haltLaststufeIdx ?? 0);

    let rowspan = 1;
    if(isFirstInStage){
      const stageIdx = row.stageIdx ?? z.haltLaststufeIdx ?? 0;
      rowspan = z.messungen.filter(r => (r.stageIdx ?? z.haltLaststufeIdx ?? 0) === stageIdx).length;
    }

    const load = (() => {
      if(stage.kind === 'p0') return toNumFlexible(state.vorgabe.P0);
      if(stage.kind === 'pa') return toNumFlexible(state.vorgabe.Pa);
      const Pp = toNumFlexible(state.vorgabe.Pp);
      return Number.isFinite(Pp) ? Pp * Number(stage.faktor || 0) : NaN;
    })();

    html += `<tr data-row="${i}">`;

    if(isFirstInStage){
      html += `<td class="mess-stage-col" rowspan="${rowspan}"><span class="mess-stage-pill">${h(stage.label)}</span></td>`;
      html += `<td class="mess-load-col" rowspan="${rowspan}">${Number.isFinite(load) ? fmt(load,1) : '—'}</td>`;
      html += `<td rowspan="${rowspan}"><input class="mess-input mess-input--auto" data-role="stage-druck-static" type="number" step="0.1" value="${h(stage.druck)}" readonly></td>`;
    }

    html += `
      <td>
        <div class="minute-cell">
          <input class="mess-input minute-input" data-role="m-min" data-row="${i}" type="number" step="1" inputmode="numeric" value="${h(row.min)}" ${isFree ? '' : 'readonly'}>
          ${isFree && i === z.messungen.length - 1 ? `<button class="row-plus" data-role="row-plus" data-row="${i}" type="button">+</button>` : ''}
        </div>
      </td>
      <td><input class="mess-input" data-role="m-ablesung" data-row="${i}" type="number" step="0.01" inputmode="decimal" value="${h(row.ablesung)}"></td>
      <td><input class="mess-input mess-input--auto" data-role="m-versch" data-row="${i}" type="number" step="0.01" inputmode="decimal" value="${h(row.versch)}" readonly title="${i===0 ? 'Referenzwert (erste Ablesung = 0)' : 'Δ zur vorherigen Ablesung (automatisch)'}"></td>
      <td><button class="row-anm-btn ${row.anm ? 'has-anm' : ''}" data-role="m-anm-btn" data-row="${i}" type="button" title="${h(row.anm || 'Anmerkung hinzufügen')}">+</button></td>
    `;
    html += `</tr>`;
  }

  return html;
}

function buildZyklusHtml(z){
  const isFree = state.settings.zyklenMode === 'frei';
  const haltIdx = Number.isInteger(z.haltLaststufeIdx)
    ? z.haltLaststufeIdx
    : defaultHoldIdxFromLaststufen(z.laststufen);

  return `
    <div class="zyklus-card" data-zid="${h(z.id)}">
      <div class="zyklus-card__head">
        <span class="zyklus-badge">Zyklus ${z.nr}</span>
        <span class="zyklus-title">Halt ${z.haltMin} min</span>
        <span class="zyklus-spacer"></span>
        ${isFree ? `<button class="zyklus-del" data-role="zyklus-del" type="button">Löschen</button>` : ''}
      </div>

      ${isFree ? `
        <div class="interval-row">
          <span class="interval-label">Halte-Laststufe</span>
          <select class="field__select" data-role="halt-idx">
            ${normalizeLaststufenArray(z.laststufen).map((ls,i)=>`
              <option value="${i}" ${haltIdx === i ? 'selected' : ''}>${h(ls.label)}</option>
            `).join('')}
          </select>
        </div>
      ` : ''}

      <div class="zyklus-load-row">${buildLaststufenHtml(z)}</div>

      <div class="interval-row">
        <span class="interval-label">Intervalle [min]</span>
        <input
          class="field__input"
          data-role="intervalle"
          type="text"
          value="${h(z.laststufen[haltIdx]?.intervalsStr || '')}"
          ${isFree ? '' : 'readonly'}
        >
      </div>

      <div class="table-wrap">
        <table class="mess-table">
          <thead>
            <tr>
              <th class="th-stage">Laststufe</th>
              <th class="th-load">Last<br><small>kN</small></th>
              <th class="th-druck">Druck<br><small>bar</small></th>
              <th class="th-min">Min</th>
              <th class="th-mess">Mess&shy;uhr<br><small>mm</small></th>
              <th class="th-versch">Verschieb.<br><small>Anker&shy;kopf [mm]</small></th>
              <th class="th-anm">Anm.</th>
            </tr>
          </thead>
          <tbody>${buildMeasurementBody(z, isFree)}</tbody>
        </table>
      </div>
    </div>
  `;
}

function updatePlusButtonVisibility(){
  const plusWrap = document.querySelector('.plus-wrap');
  if(!plusWrap) return;

  if(state.settings.zyklenMode === 'norm'){
    plusWrap.style.display = 'none';
    return;
  }

  plusWrap.style.display = '';
}

function recalcRowsFromStages(z){
  const newRows = [];
  normalizeLaststufenArray(z.laststufen).forEach((stage, stageIdx) => {
    const ints = parseIntervalStr(stage.intervalsStr);
    ints.forEach(min => {
      const old = z.messungen?.find(r => Number(r.min) === Number(min) && (r.stageIdx ?? 0) === stageIdx);
      newRows.push(old ? { ...old, min, stageIdx } : {
        stageIdx,
        min,
        ablesung:'',
        versch:'',
        anm:''
      });
    });
  });

  z.messungen = newRows;
  const holdStage = normalizeLaststufenArray(z.laststufen)[z.haltLaststufeIdx ?? 0];
  z.haltMin = parseIntervalStr(holdStage?.intervalsStr || '').slice(-1)[0] || z.haltMin || 0;
}

function renderZyklen(){
  const host = $('zyklenContainer');
  if(!host) return;

  ensureActiveZyklus();
  recalcAllVerschiebungen();

  const globalTimerHtml = buildGlobalTimerHtml();

  if(!state.zyklen.length){
    host.innerHTML = globalTimerHtml + `<div class="empty-state">Noch kein Lastzyklus angelegt.</div>`;
    updateGlobalTimerUi();
    updateFloatingTimerWidget();
    updateLappPreview();
    renderKalibPreview();
    updatePlusButtonVisibility();
    return;
  }

  host.innerHTML = globalTimerHtml + state.zyklen.map(buildZyklusHtml).join('');

  updateGlobalTimerUi();
  updateFloatingTimerWidget();
  updateLappPreview();
  renderKalibPreview();
  updatePlusButtonVisibility();

  const active = getActiveZyklus();
  if(active){
    const card = document.querySelector(`.zyklus-card[data-zid="${active.id}"]`);
    updateComputedRowsForCard(card, active);
    highlightActiveMeasurementRow(active);
  }
}

/* ═══════════════════════════════════════════════════════
   DELEGATION
═══════════════════════════════════════════════════════ */
function hookZyklenDelegation(){
  const host = $('zyklenContainer');
  if(!host || host.dataset.bound === '1') return;
  host.dataset.bound = '1';

  host.addEventListener('change', e => {
    const el = e.target.closest('[data-role]');
    if(!el) return;

    const role = el.dataset.role;

    if(role === 'global-active-select'){
      state.meta.activeZyklusId = el.value || '';
      updateGlobalTimerUi();
      saveDraftDebounced();
      return;
    }

    if(role === 'zyklen-mode'){
      setZyklenMode(el.value);
      return;
    }

    const card = el.closest('.zyklus-card');
    const z = card ? getZyklusById(card.dataset.zid) : null;
    const lsIdx = Number(el.dataset.idx);

    if(role === 'halt-idx' && z){
      z.haltLaststufeIdx = Number(el.value || 0);
      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'ls-type' && z){
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      const old = z.laststufen[lsIdx] || makeLaststufe('factor',0.4,'');
      const kind = el.value === 'pa' ? 'pa' : el.value === 'p0' ? 'p0' : 'factor';
      const factor = kind === 'factor'
        ? (Number.isFinite(Number(old.faktor)) ? Number(old.faktor) : 0.4)
        : 0;

      const prevIntervals = old.intervalsStr || '0, 1';
      z.laststufen[lsIdx] = { ...makeLaststufe(kind, factor, old.druck || ''), intervalsStr: prevIntervals };
      z.haltLaststufeIdx = Math.min(
        Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : defaultHoldIdxFromLaststufen(z.laststufen),
        z.laststufen.length - 1
      );

      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }
  });

  host.addEventListener('input', e => {
    const el = e.target.closest('[data-role]');
    if(!el) return;

    const role = el.dataset.role;

    if(role === 'global-active-select'){
      state.meta.activeZyklusId = el.value || '';
      updateGlobalTimerUi();
      saveDraftDebounced();
      return;
    }

    const card = el.closest('.zyklus-card');
    if(!card) return;

    const z = getZyklusById(card.dataset.zid);
    if(!z) return;

    const idx = Number(el.dataset.row);
    const lsIdx = Number(el.dataset.idx);

    if(role === 'ls-druck'){
      if(z.laststufen[lsIdx]) z.laststufen[lsIdx].druck = el.value;
      saveDraftDebounced();
      return;
    }

    if(role === 'ls-factor'){
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      const old = z.laststufen[lsIdx] || makeLaststufe('factor',0.4,'');
      const factor = Number(el.value);

      z.laststufen[lsIdx] = {
        ...makeLaststufe('factor', Number.isFinite(factor) ? factor : 0.4, old.druck || ''),
        intervalsStr: old.intervalsStr || '0, 1'
      };

      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'intervalle'){
      if(state.settings.zyklenMode !== 'frei') return;

      const holdIdx = Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : 0;
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      if(z.laststufen[holdIdx]){
        z.laststufen[holdIdx].intervalsStr = el.value;
      }

      recalcRowsFromStages(z);
      recalcVerschiebung(z);

      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      else renderZyklen();

      saveDraftDebounced();
      return;
    }

    if(role === 'm-min'){
      if(state.settings.zyklenMode !== 'frei') return;
      if(z.messungen[idx]) z.messungen[idx].min = el.value;
      updateLappPreview();
      saveDraftDebounced();
      return;
    }

    if(role === 'm-ablesung'){
      if(z.messungen[idx]) z.messungen[idx].ablesung = el.value;
      recalcVerschiebung(z);
      updateComputedRowsForCard(card, z);
      updateLappPreview();
      if(!$('tab-auswertung')?.hidden) renderAuswertung();
      saveDraftDebounced();
      return;
    }
  });

  host.addEventListener('click', e => {
    const el = e.target.closest('[data-role]');
    if(!el) return;

    const role = el.dataset.role;

    if(role === 'global-start'){
      startActiveTimer();
      return;
    }
    if(role === 'global-stop'){
      stopActiveTimer();
      return;
    }
    if(role === 'global-reset'){
      resetActiveTimer();
      return;
    }
    if(role === 'global-elapsed'){
      const z = getActiveZyklus();
      if(z) openTimeAdjustModal(z.id);
      return;
    }

    const card = el.closest('.zyklus-card');
    if(!card) return;

    const z = getZyklusById(card.dataset.zid);
    if(!z) return;

    const idx = Number(el.dataset.row);
    const lsIdx = Number(el.dataset.idx);

    if(role === 'zyklus-del'){
      if(confirm(`Zyklus ${z.nr} löschen?`)){
        state.zyklen = state.zyklen.filter(x => x.id !== z.id);
        delete timerMap[z.id];
        ensureActiveZyklus();
        renderZyklen();
        saveDraftDebounced();
      }
      return;
    }

    if(role === 'ls-add'){
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      z.laststufen.push({
        ...makeLaststufe('factor', 0.4, ''),
        intervalsStr: '0, 1'
      });
      z.haltLaststufeIdx = defaultHoldIdxFromLaststufen(z.laststufen);
      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'ls-del'){
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      if(z.laststufen.length <= 1){
        alert('Mindestens eine Laststufe muss vorhanden bleiben.');
        return;
      }

      z.laststufen.splice(lsIdx, 1);
      z.haltLaststufeIdx = Math.min(
        Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : 0,
        z.laststufen.length - 1
      );

      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'row-plus'){
      if(state.settings.zyklenMode !== 'frei') return;
      if(!z.messungen[idx]) return;

      const stageIdx = z.messungen[idx].stageIdx ?? z.haltLaststufeIdx ?? 0;
      const sameStageRows = z.messungen.filter(r => (r.stageIdx ?? 0) === stageIdx);
      const lastMin = Number(sameStageRows[sameStageRows.length - 1]?.min || 0);

      z.messungen.push({
        stageIdx,
        min: lastMin + 1,
        ablesung:'',
        versch:'',
        anm:''
      });

      renderZyklen();
      saveDraftDebounced();
      return;
    }

    if(role === 'm-anm-btn'){
      const cur = z.messungen[idx]?.anm || '';
      const v = prompt('Anmerkung:', cur);
      if(v !== null){
        z.messungen[idx].anm = v;
        renderZyklen();
        saveDraftDebounced();
      }
      return;
    }
  });
}

/* ═══════════════════════════════════════════════════════
   BERECHNUNGEN / AUSWERTUNG
═══════════════════════════════════════════════════════ */
function calcLapp(deltaS_mm,Pp_kN,Pa_kN,Et_kNmm2,At_mm2){
  const dF = Pp_kN - Pa_kN;
  if(!Number.isFinite(deltaS_mm) || !Number.isFinite(dF) || dF <= 0 || !Number.isFinite(Et_kNmm2) || !Number.isFinite(At_mm2)) return NaN;
  return (deltaS_mm * Et_kNmm2 * At_mm2) / (dF * 1000);
}

function calcKriechmass(points){
  if(!Array.isArray(points) || points.length < 2) return NaN;

  const sorted = points
    .filter(p => Number.isFinite(p.min) && p.min > 0 && Number.isFinite(p.s_mm))
    .sort((a,b) => a.min - b.min);

  if(sorted.length < 2) return NaN;

  const a = sorted[0];
  const b = sorted[sorted.length - 1];
  if(a.min === b.min) return NaN;

  return (b.s_mm - a.s_mm) / (Math.log10(b.min) - Math.log10(a.min));
}

function getZyklusKpis(z){
  const Pp = toNumFlexible(state.vorgabe.Pp);
  const Pa = toNumFlexible(state.vorgabe.Pa);
  const Et = toNumFlexible(state.vorgabe.Et);
  const At = toNumFlexible(state.vorgabe.At);

  let cum = 0;
  const cumPts = z.messungen.map(m => {
    const v = toNumFlexible(m.versch);
    if(Number.isFinite(v)) cum += v;
    return { min:toNumFlexible(m.min), s_mm:cum };
  }).filter(p => Number.isFinite(p.min));

  const maxPt = cumPts[cumPts.length - 1];
  const dS = Number.isFinite(maxPt?.s_mm) ? maxPt.s_mm : NaN;

  const holdIdx = Number.isInteger(z.haltLaststufeIdx)
    ? Math.min(z.haltLaststufeIdx, z.laststufen.length - 1)
    : defaultHoldIdxFromLaststufen(z.laststufen);

  const holdStage = normalizeLaststufenArray(z.laststufen)[holdIdx];
  const lastKn = holdStage ? calcStageLoad(holdStage, 'eignung') : NaN;
  const isPpHold = holdStage?.kind === 'factor' && Math.abs(Number(holdStage.faktor || 0) - 1) < 0.0001;
  const Lapp = isPpHold ? calcLapp(dS,Pp,Pa,Et,At) : NaN;

  const isB = state.vorgabe.bodenart === 'bindig';
  const tMin = isB ? 60 : 20;
  const tMax = isB ? 180 : 60;
  const krPts = cumPts.filter(p => p.min >= tMin && p.min <= tMax);
  const ks = calcKriechmass(krPts);

  return { lastKn, dS, Lapp, ks, haltLabel: holdStage?.label || '—' };
}

function buildLastVerschiebungSvg(z){
  const Pp  = toNumFlexible(state.vorgabe.Pp);
  const Pa  = toNumFlexible(state.vorgabe.Pa);
  const Et  = toNumFlexible(state.vorgabe.Et);
  const At  = toNumFlexible(state.vorgabe.At);
  const Ltf = toNumFlexible(state.vorgabe.Ltf);
  const Le  = toNumFlexible(state.vorgabe.Le);
  const Ltb = toNumFlexible(state.vorgabe.Ltb);

  const minLapp = 0.8 * Ltf + Le;
  const maxLapp = Ltf + Le + 0.5 * Ltb;

  let cum = 0;
  const cumulative = z.messungen.map(m => {
    const v = toNumFlexible(m.versch);
    if(Number.isFinite(v)) cum += v;
    return { min:toNumFlexible(m.min), s:cum };
  }).filter(p => Number.isFinite(p.min));

  const holdIdx = Number.isInteger(z.haltLaststufeIdx)
    ? Math.min(z.haltLaststufeIdx, z.laststufen.length - 1)
    : defaultHoldIdxFromLaststufen(z.laststufen);
  const holdStage = normalizeLaststufenArray(z.laststufen)[holdIdx];
  const lastHalt = holdStage ? calcStageLoad(holdStage, 'eignung') : NaN;
  const sHalt = Number(cumulative[cumulative.length - 1]?.s);

  const W=520,H=300,ml=58,mr=20,mt=20,mb=46,pw=W-ml-mr,ph=H-mt-mb;
  const xMax = Number.isFinite(Pp) ? Pp * 1.1 : 1;
  const sMaxData = Math.max(...cumulative.map(m => Number(m.s)).filter(Number.isFinite),1);
  const yMax = Math.max(sMaxData * 1.2, 5);

  const tx = v => ml + (v / xMax) * pw;
  const ty = v => mt + ph - (v / yMax) * ph;

  function sFor(F,Lapp){
    if(!Number.isFinite(F) || !Number.isFinite(Lapp) || !Number.isFinite(Et) || !Number.isFinite(At)) return NaN;
    return (Lapp * (F - Pa) * 1000) / (Et * At);
  }

  const linePts = [];
  for(let f=Pa;f<=xMax;f+=Math.max(0.1, xMax/40)) linePts.push(f);

  const polyMin = linePts.map(f => {
    const s = sFor(f,minLapp);
    return Number.isFinite(s) ? `${tx(f)},${ty(Math.max(0,Math.min(yMax,s)))}` : null;
  }).filter(Boolean).join(' ');

  const polyMax = linePts.map(f => {
    const s = sFor(f,maxLapp);
    return Number.isFinite(s) ? `${tx(f)},${ty(Math.max(0,Math.min(yMax,s)))}` : null;
  }).filter(Boolean).join(' ');

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${W}" height="${H}" rx="8" fill="#0b1725"/>
    <rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="rgba(255,255,255,.18)"/>
    ${polyMin?`<polyline points="${polyMin}" fill="none" stroke="#56b7ff" stroke-width="2" stroke-dasharray="6 4"/>`:''}
    ${polyMax?`<polyline points="${polyMax}" fill="none" stroke="#ffb45a" stroke-width="2" stroke-dasharray="6 4"/>`:''}
    ${Number.isFinite(lastHalt)&&Number.isFinite(sHalt)?`<circle cx="${tx(lastHalt)}" cy="${ty(sHalt)}" r="5" fill="#f08a1c" stroke="#fff" stroke-width="1.5"/>`:''}
    <text x="${W/2}" y="14" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Last / Verschiebung</text>
  </svg>`;
}

function buildKriechSvg(z){
  const W=520,H=260,ml=58,mr=20,mt=20,mb=42,pw=W-ml-mr,ph=H-mt-mb;

  let cum = 0;
  const pts = z.messungen
    .filter(m => toNumFlexible(m.min) > 0 && Number.isFinite(toNumFlexible(m.versch)))
    .map(m => {
      cum += toNumFlexible(m.versch);
      return { t:toNumFlexible(m.min), s:cum };
    })
    .sort((a,b) => a.t - b.t);

  const tMax = Math.max(...pts.map(p => p.t), 1);
  const sMin = Math.min(...pts.map(p => p.s), 0);
  const sMax = Math.max(...pts.map(p => p.s), sMin + 1);
  const tMin = 1;

  const tx = t => ml + ((Math.log10(Math.max(t,tMin)) - Math.log10(tMin)) / (Math.log10(tMax) - Math.log10(tMin) || 1)) * pw;
  const ty = s => mt + ph - ((s - sMin) / ((sMax - sMin) || 1)) * ph;
  const poly = pts.map(p => `${tx(p.t)},${ty(p.s)}`).join(' ');

  return `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="520" height="260" rx="8" fill="#0b1725"/>
    <rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="rgba(255,255,255,.18)"/>
    ${poly ? `<polyline points="${poly}" fill="none" stroke="#f08a1c" stroke-width="2"/>` : ''}
    ${pts.map(p => `<circle cx="${tx(p.t)}" cy="${ty(p.s)}" r="3" fill="#f08a1c"/>`).join('')}
    <text x="260" y="14" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kriechverhalten</text>
  </svg>`;
}

function renderAuswertung(){
  const host = $('auswertungContainer');
  if(!host) return;

  if(!state.zyklen.length){
    host.innerHTML = `<div class="empty-state">Noch keine Lastzyklen vorhanden.</div>`;
    return;
  }

  const isB = state.vorgabe.bodenart === 'bindig';
  const ksLimit = 2;

  host.innerHTML = state.zyklen.map(z => {
    const k = getZyklusKpis(z);
    const Ltf = toNumFlexible(state.vorgabe.Ltf);
    const Le  = toNumFlexible(state.vorgabe.Le);
    const Ltb = toNumFlexible(state.vorgabe.Ltb);
    const minL = 0.8 * Ltf + Le;
    const maxL = Ltf + Le + 0.5 * Ltb;
    const lappOk = Number.isFinite(k.Lapp) ? (k.Lapp >= minL && k.Lapp <= maxL) : null;
    const ksOk = Number.isFinite(k.ks) ? k.ks <= ksLimit : null;

    return `
      <div class="auswertung-block">
        <div class="auswertung-block__title">Zyklus ${z.nr} · Halt bei ${h(k.haltLabel)} (${z.haltMin} min · ${isB ? 'bindig' : 'nicht bindig'})</div>
        <div class="kpi-grid">
          <div class="kpi"><div class="kpi__label">Last bei Halt</div><div class="kpi__value">${fmt(k.lastKn,1)} kN</div></div>
          <div class="kpi"><div class="kpi__label">Verschiebung Δs</div><div class="kpi__value">${fmt(k.dS,2)} mm</div></div>
          <div class="kpi"><div class="kpi__label">Kriechmaß k<sub>s</sub></div><div class="kpi__value ${ksOk===true?'kpi__value--good':ksOk===false?'kpi__value--bad':''}">${fmt(k.ks,2)} mm</div></div>
          <div class="kpi"><div class="kpi__label">L<sub>app</sub></div><div class="kpi__value ${lappOk===true?'kpi__value--good':lappOk===false?'kpi__value--bad':''}">${fmt(k.Lapp,2)} m</div></div>
        </div>
        <div class="diag-wrap">${buildLastVerschiebungSvg(z)}</div>
        <div class="diag-wrap">${buildKriechSvg(z)}</div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════
   HISTORY
═══════════════════════════════════════════════════════ */
function renderHistoryList(){
  const host = $('historyList');
  if(!host) return;

  const list = readHistory();
  if(!list.length){
    host.innerHTML = `<div class="empty-state">Noch keine Protokolle gespeichert.</div>`;
    return;
  }

  host.innerHTML = list.map(e => {
    const s = e.snapshot || {};
    return `
      <details class="historyItem" data-hid="${h(e.id)}">
        <summary class="historyItem__head">
          <span class="historyItem__chevron">▸</span>
          <span class="historyItem__title">${h(e.title)}</span>
          <span class="historyItem__date">${h(new Date(e.savedAt).toLocaleString('de-DE'))}</span>
        </summary>
        <div class="historyItem__body">
          Bauvorhaben: <b>${h(s.meta?.bauvorhaben || '—')}</b><br>
          Anker Nr.: <b>${h(s.meta?.ankerNr || '—')}</b><br>
          Bodenart: <b>${h(s.vorgabe?.bodenart || '—')}</b><br>
          Zyklen: <b>${(s.zyklen || []).length}</b>
          <div class="historyBtns">
            <button data-hact="load" data-id="${h(e.id)}">Laden</button>
            <button data-hact="pdf" data-id="${h(e.id)}">PDF</button>
            <button data-hact="export" data-id="${h(e.id)}">JSON Export</button>
            <button data-hact="del" data-id="${h(e.id)}">Löschen</button>
          </div>
        </div>
      </details>
    `;
  }).join('');
}

function hookHistoryDelegation(){
  const host = $('historyList');
  if(!host || host.dataset.bound === '1') return;
  host.dataset.bound = '1';

  host.addEventListener('click', async e => {
    const btn = e.target.closest('[data-hact]');
    if(!btn) return;

    const id = btn.dataset.id;
    const act = btn.dataset.hact;
    const list = readHistory();
    const entry = list.find(x => x.id === id);

    if(!entry && act !== 'del') return;

    if(act === 'del'){
      if(!confirm('Eintrag löschen?')) return;
      writeHistory(list.filter(x => x.id !== id));
      renderHistoryList();
      return;
    }

    if(act === 'load'){
      applySnapshot(entry.snapshot, true);
      saveDraftDebounced();
      document.querySelector('.tab[data-tab="formular"]')?.click();
      return;
    }

    if(act === 'pdf'){
      await exportPdfFromSnapshot(entry.snapshot);
      return;
    }

    if(act === 'export'){
      downloadJson(entry.snapshot, `${dateTag()}_HTB_Anker_${(entry.snapshot.meta?.ankerNr || 'export').replace(/\s+/g,'_')}.json`);
      return;
    }
  });
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE / EXPORT / PDF
═══════════════════════════════════════════════════════ */
function downloadJson(data, filename){
  const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function buildTemplateSnapshot(){
  const snap = collectSnapshot();
  snap.meta = {
    ...snap.meta,
    bauvorhaben:'',
    bauherr:'',
    ankerlage:'',
    ankerNr:'',
    blattNr:'',
    pruefdatum:'',
    anmerkung:''
  };

  snap.zyklen = (snap.zyklen || []).map(z => ({
    ...z,
    elapsedMs:0,
    startzeit:'',
    laststufen:z.laststufen.map(ls => ({ ...ls, druck:'' })),
    messungen:z.messungen.map(m => ({ ...m, druck:'', ablesung:'', versch:'', anm:'' }))
  }));

  return snap;
}

async function exportPdfFromSnapshot(snap){
  if(!window.PDFLib){
    alert('PDF-Bibliothek nicht geladen.');
    return;
  }

  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([595.28, 841.89]);
  const { width:W, height:H } = page.getSize();
  let y = H - 50;

  page.drawRectangle({ x:0, y:H-30, width:W, height:30, color:rgb(0.05,0.18,0.31) });
  page.drawText('HTB Ankerprüfung – Verpreßanker Eignungsprüfung', {
    x:30, y:H-20, size:11, font:fontB, color:rgb(1,1,1)
  });

  y = H - 60;
  const meta = snap.meta || {};
  const vor = snap.vorgabe || {};

  const lines = [
    ['Bauvorhaben',meta.bauvorhaben||''],
    ['Bauherr',meta.bauherr||''],
    ['Anker Nr.',meta.ankerNr||''],
    ['Ankerlage',meta.ankerlage||''],
    ['Prüfdatum',dateDE(meta.pruefdatum)],
    ['Bodenart',vor.bodenart||''],
    ['Ankertyp',vor.ankertyp||''],
    ['LA / Ltb / Ltf / Le [m]',`${vor.LA||''} / ${vor.Ltb||''} / ${vor.Ltf||''} / ${vor.Le||''}`],
    ['Pp / Pa [kN]',`${vor.Pp||''} / ${vor.Pa||''}`],
    ['Et / At',`${vor.Et||''} kN/mm² / ${vor.At||''} mm²`]
  ];

  page.drawText('Stammdaten & Vorgabe',{ x:30, y, size:12, font:fontB, color:rgb(0,0,0) });
  y -= 16;

  lines.forEach(([k,v]) => {
    page.drawText(`${k}:`,{ x:30, y, size:9, font:fontB });
    page.drawText(String(v),{ x:160, y, size:9, font });
    y -= 12;
  });

  y -= 10;
  page.drawText('Lastzyklen',{ x:30, y, size:12, font:fontB });
  y -= 14;

  (snap.zyklen || []).forEach(z => {
    if(y < 140){
      page = pdf.addPage([595.28, 841.89]);
      y = H - 50;
    }

    page.drawText(`Zyklus ${z.nr} · Halt ${z.haltMin} min`,{ x:30, y, size:10, font:fontB });
    y -= 12;
    page.drawText('Stufe   Last   Druck   Min   Messuhr   Versch.   Anm.',{ x:30, y, size:8, font:fontB });
    y -= 10;

    z.messungen.forEach(m => {
      if(y < 80){
        page = pdf.addPage([595.28, 841.89]);
        y = H - 50;
      }

      const stageIdx = m.stageIdx ?? (Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : 0);
      const stage = normalizeLaststufenArray(z.laststufen)[stageIdx] || makeLaststufe('pa');
      const lastKn = (() => {
        if(stage.kind === 'p0') return toNumFlexible(vor.P0);
        if(stage.kind === 'pa') return toNumFlexible(vor.Pa);
        const Pp = toNumFlexible(vor.Pp);
        return Number.isFinite(Pp) ? Pp * Number(stage.faktor || 0) : NaN;
      })();

      page.drawText(
        `${String(stage.label).padEnd(8)} ${String(Number.isFinite(lastKn) ? fmt(lastKn,1) : '').padEnd(8)} ${String(stage.druck || '').padEnd(7)} ${String(m.min).padEnd(4)} ${String(m.ablesung || '').padEnd(8)} ${String(m.versch || '').padEnd(8)} ${m.anm || ''}`,
        { x:30, y, size:8, font }
      );
      y -= 10;
    });

    y -= 6;
  });

  const filiale = meta.filiale || meta.Niederlassung || '';
  const fil = FILIALEN[filiale] || {};
  pdf.getPages().forEach(p => {
    p.drawRectangle({ x:0, y:0, width:W, height:30, color:rgb(0.05,0.18,0.31) });
    p.drawText(`HTB Baugesellschaft m.b.H. – Filiale ${filiale || '—'}`, {
      x:30, y:18, size:8, font:fontB, color:rgb(1,1,1)
    });
    p.drawText(`${fil.adresse || ''} · ${fil.tel || ''} · ${fil.email || ''}`, {
      x:30, y:8, size:7, font, color:rgb(.85,.9,1)
    });
  });

  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type:'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dateTag()}_HTB_Ankerpruefung_${(meta.ankerNr || 'export').replace(/\s+/g,'_')}.pdf`;
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function normalizeBottomActionCards(){
  /* Sticky bleibt rein über CSS gesteuert [1] */
}

function normalizeKalibImportInput(){
  const inp = $('kalibImportInput');
  if(inp){
    inp.setAttribute('accept', '.csv,text/csv');
  }
}

/* ═══════════════════════════════════════════════════════
   TABS / INIT
═══════════════════════════════════════════════════════ */
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.tab === name));
  document.querySelectorAll('.pane').forEach(p => p.hidden = p.id !== 'tab-' + name);

  if(name === 'auswertung') renderAuswertung();
  if(name === 'verlauf') renderHistoryList();
}

function init(){
  ensureDynamicStyles();
  initAnkertypSelect();

  loadDraft();
  ensureDefaultZyklen();
  recalcAllVerschiebungen();

  syncMetaToUi();
  syncVorgabeToUi();
  renderAnkertypInfo();
  renderPresseDropdown();
  syncMetaToUi();
  renderKalibInfo();
  renderKalibPreview();
  renderZyklen();
  updateLappPreview();
  renderHistoryList();

  if(state.meta.selectedKalibId){
    syncDruckFromKalib();
  }

  normalizeKalibImportInput();
  updateRequiredFieldStates();

  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab))
  );

  META_FIELDS.forEach(([id,k]) => {
    const el = $(id);
    el?.addEventListener('input', () => {
      state.meta[k] = el.value;
      updateRequiredFieldStates();
      saveDraftDebounced();
    });

    el?.addEventListener('change', () => {
      state.meta[k] = el.value;
      updateRequiredFieldStates();
      saveDraftDebounced();
    });
  });

  VOR_FIELDS.forEach(k => {
    const el = $('vor-' + k);
    if(!el) return;

    const evtName = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evtName, () => {
      if(k !== 'Pp'){
        state.vorgabe[k] = el.value || '';
      }

      if(k === 'ankertyp'){
        applyAnkertypPreset(state.vorgabe.ankertyp, { overwrite:true });
      }

      maybeAutofillVorgabe(k);
      updateLappPreview();
      renderKalibPreview();

      if(findKalibById(state.meta.selectedKalibId)){
        syncDruckFromKalib();
      }else{
        renderZyklen();
      }

      if(!$('tab-auswertung')?.hidden) renderAuswertung();
      updateRequiredFieldStates();
      saveDraftDebounced();
    });
  });

  $('boden-bindig')?.addEventListener('change', () => {
    state.vorgabe.bodenart = 'bindig';

    if(state.settings.zyklenMode === 'norm'){
      applyNormTemplateToState();
      recalcAllVerschiebungen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      else renderZyklen();
    }

    if(!$('tab-auswertung')?.hidden) renderAuswertung();
    updateRequiredFieldStates();
    saveDraftDebounced();
  });

  $('boden-nichtbindig')?.addEventListener('change', () => {
    state.vorgabe.bodenart = 'nichtbindig';

    if(state.settings.zyklenMode === 'norm'){
      applyNormTemplateToState();
      recalcAllVerschiebungen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      else renderZyklen();
    }

    if(!$('tab-auswertung')?.hidden) renderAuswertung();
    updateRequiredFieldStates();
    saveDraftDebounced();
  });

  $('btnAddZyklus')?.addEventListener('click', () => {
    if(state.settings.zyklenMode === 'norm'){
      alert('Im Modus "Norm / Vorlage" sind immer genau 5 Zyklen aktiv.');
      return;
    }

    const defs = getNormZyklusDefs(state.vorgabe.bodenart);
    const templateDef = defs[Math.min(state.zyklen.length, defs.length - 1)];
    const newNr = state.zyklen.length + 1;

    const z = makeZyklusFromDefinition({ ...templateDef, nr:newNr }, null);
    z.id = uid();

    state.zyklen.push(z);
    ensureActiveZyklus();

    if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
    else renderZyklen();

    saveDraftDebounced();
  });

  hookZyklenDelegation();

  $('btnSaveFormular')?.addEventListener('click', saveCurrentToHistory);
  $('btnSaveAuswertung')?.addEventListener('click', saveCurrentToHistory);
  $('btnSaveVerlauf')?.addEventListener('click', saveCurrentToHistory);

  $('btnSaveSettings')?.addEventListener('click', () => {
    state.settings.alarmDurationSec = clamp(Number($('settings-alarmDuration')?.value || 4),1,30);
    saveDraftDebounced();
    alert('Einstellungen gespeichert.');
  });

  $('btnReset')?.addEventListener('click', () => {
    if(!confirm('Komplettes Formular zurücksetzen?')) return;

    const fresh = getInitialState();
    Object.assign(state.meta, fresh.meta);
    Object.assign(state.vorgabe, fresh.vorgabe);
    Object.assign(state.settings, fresh.settings);
    state.zyklen = [];

    Object.keys(timerMap).forEach(k => {
      const t = timerMap[k];
      if(t?.raf) cancelAnimationFrame(t.raf);
      delete timerMap[k];
    });

    initAnkertypSelect();
    ensureDefaultZyklen();
    recalcAllVerschiebungen();

    syncMetaToUi();
    syncVorgabeToUi();
    renderAnkertypInfo();
    renderPresseDropdown();
    syncMetaToUi();
    renderKalibInfo();
    renderKalibPreview();
    renderZyklen();
    updateLappPreview();
    updateRequiredFieldStates();
    saveDraftDebounced();
  });

  $('btnPdfFormular')?.addEventListener('click', () => exportPdfFromSnapshot(collectSnapshot()));
  $('btnPdfAuswertung')?.addEventListener('click', () => exportPdfFromSnapshot(collectSnapshot()));

  $('btnAlarmSoundToggle')?.addEventListener('click', toggleAlarmSoundByUserGesture);
  $('settings-alarmDuration')?.addEventListener('input', e => {
    state.settings.alarmDurationSec = clamp(Number(e.target.value || 4),1,30);
    saveDraftDebounced();
  });

  $('btnExportTemplate')?.addEventListener('click', () => {
    downloadJson(buildTemplateSnapshot(), `${dateTag()}_HTB_Anker_Vorlage.htbanker.json`);
  });

  $('btnImportTemplate')?.addEventListener('click', () => $('importFileInput')?.click());
  $('importFileInput')?.addEventListener('change', async e => {
    const f = e.target.files?.[0];
    if(!f) return;
    try        ? `${fmt(v.bar,1)} bar${note}`
        : (v.oor ? '⚠ außerhalb' : '—');

      return `
        <div class="kalib-prev-row">
          <span class="prev-label">${h(v.label)}</span>
          <span class="prev-kn">${knStr}</span>
          <span class="${v.oor ? 'prev-bar prev-bar--oor' : 'prev-bar'}">${barStr}</span>
        </div>
      `;
    }).join('')}
  `;
}

/* ═══════════════════════════════════════════════════════
   DRUCK AUS KALIBRIERUNG
═══════════════════════════════════════════════════════ */
function syncDruckFromKalib(){
  const kalib = findKalibById(state.meta.selectedKalibId);

  if(!kalib){
    document.querySelectorAll('[data-role="m-druck"], [data-role="stage-druck-static"], [data-role="ls-druck"]').forEach(el => {
      el.classList.remove('mess-input--auto');
      el.readOnly = false;
      el.title = '';
    });
    return;
  }

  state.zyklen.forEach(z => {
    const stages = normalizeLaststufenArray(z.laststufen);

    stages.forEach(stage => {
      const kn = calcStageLoad(stage, 'eignung');
      const bar = kNtoBar(kn);
      stage.druck = bar != null ? String(bar) : '';
    });

    z.laststufen = stages;
  });

  renderZyklen();
  saveDraftDebounced();
}

/* ═══════════════════════════════════════════════════════
   GLOBALER TIMER HTML
═══════════════════════════════════════════════════════ */
function buildGlobalTimerHtml(){
  const z = getActiveZyklus();
  const display = z ? formatElapsed(getElapsedMs(z.id,z)) : '00:00';
  const badge = z ? `Zyklus ${z.nr}` : '—';

  return `
    <div id="globalTimerBox" class="timer-box" style="margin-bottom:12px">
      <div class="global-timer-head" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <div class="zyklus-title" style="font-weight:800">Stoppuhr Eignungsprüfung</div>
        <span id="activeZyklusBadge" class="zyklus-badge">${badge}</span>
      </div>

      <div class="timer-row" style="margin-bottom:8px">
        <div class="timer-display" id="globalTimerDisplay" data-role="global-elapsed" title="Tippen zum Anpassen">${display}</div>
        <span class="timer-edit-hint">tippen = anpassen</span>

        <label class="field" style="min-width:170px">
          <span class="field__label">Modus</span>
          <select id="zyklenModeSelect" data-role="zyklen-mode" class="field__select">
            <option value="norm" ${state.settings.zyklenMode === 'norm' ? 'selected' : ''}>Norm / Vorlage</option>
            <option value="frei" ${state.settings.zyklenMode === 'frei' ? 'selected' : ''}>Freie Eingabe</option>
          </select>
        </label>

        <label class="field" style="min-width:170px; margin-left:auto">
          <span class="field__label">Aktiver Zyklus</span>
          <select id="activeZyklusSelect" data-role="global-active-select" class="field__select">
            ${state.zyklen.map(zy => `
              <option value="${h(zy.id)}" ${state.meta.activeZyklusId === zy.id ? 'selected' : ''}>
                Zyklus ${zy.nr}
              </option>
            `).join('')}
          </select>
        </label>

        <div class="timer-buttons">
          <button id="btnGlobalTimerStart" class="timer-btn timer-btn--start" data-role="global-start" type="button">Start</button>
          <button id="btnGlobalTimerStop" class="timer-btn timer-btn--stop" data-role="global-stop" type="button">Stop</button>
          <button id="btnGlobalTimerReset" class="timer-btn timer-btn--ghost" data-role="global-reset" type="button">Reset</button>
        </div>
      </div>

      <div class="timer-info" id="globalTimerStartzeit">Noch nicht gestartet</div>
      <div class="timer-info timer-next" id="globalTimerNext">Nächste Messung: —</div>
      <div class="hint" style="text-align:left;margin-top:8px">
        <b>Norm / Vorlage:</b> Zeitintervalle fix.
        <br>
        <b>Freie Eingabe:</b> Intervalle und Laststufen veränderbar.
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════
   ZYKLUS-RENDERING
   → Laststufe + Last links der Minuten
═══════════════════════════════════════════════════════ */
function buildLaststufenHtml(z){
  const isFree = state.settings.zyklenMode === 'frei';
  z.laststufen = normalizeLaststufenArray(z.laststufen);

  const Pp = toNumFlexible(state.vorgabe.Pp);
  const Pa = toNumFlexible(state.vorgabe.Pa);
  const P0 = toNumFlexible(state.vorgabe.P0);

  return z.laststufen.map((ls, i) => {
    let lastKn = NaN;

    if(ls.kind === 'p0'){
      lastKn = P0;
    }else if(ls.kind === 'pa'){
      lastKn = Pa;
    }else{
      lastKn = Number.isFinite(Pp) ? (Pp * ls.faktor) : NaN;
    }

    if(!isFree){
      return `
        <div class="field">
          <span class="field__label">${h(ls.label)}</span>
          <input class="field__input" data-role="ls-druck" data-idx="${i}" type="number" step="0.1" placeholder="bar" value="${h(ls.druck)}" />
          <span class="hint" style="font-size:11px;text-align:left;margin-top:2px">≈ ${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'} kN</span>
        </div>
      `;
    }

    return `
      <div class="field" style="min-width:130px">
        <span class="field__label">Stufe ${i+1}</span>

        <select class="field__select" data-role="ls-type" data-idx="${i}">
          <option value="pa" ${ls.kind === 'pa' ? 'selected' : ''}>Pa</option>
          <option value="factor" ${ls.kind === 'factor' ? 'selected' : ''}>X · Pp</option>
          <option value="p0" ${ls.kind === 'p0' ? 'selected' : ''}>P0</option>
        </select>

        <input
          class="field__input"
          data-role="ls-factor"
          data-idx="${i}"
          type="number"
          step="0.05"
          value="${ls.kind === 'factor' ? h(ls.faktor) : ''}"
          ${ls.kind === 'factor' ? '' : 'disabled'}
          placeholder="z.B. 0,55"
        />

        <input class="field__input" data-role="ls-druck" data-idx="${i}" type="number" step="0.1" placeholder="bar" value="${h(ls.druck)}" />

        <span class="hint" style="font-size:11px;text-align:left;margin-top:2px">
          ${ls.kind === 'factor' ? h(factorToLabel(ls.faktor)) : h(ls.label)} · ≈ ${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'} kN
        </span>

        <div class="action-row" style="justify-content:flex-start;margin-top:4px">
          <button class="timer-btn timer-btn--ghost" data-role="ls-del" data-idx="${i}" type="button">−</button>
          ${i === z.laststufen.length - 1 ? `<button class="timer-btn timer-btn--ghost" data-role="ls-add" data-idx="${i}" type="button">+</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function buildMeasurementBody(z, isFree){
  let html = '';
  const stages = normalizeLaststufenArray(z.laststufen);

  for(let i=0;i<z.messungen.length;i++){
    const row = z.messungen[i];
    const prev = z.messungen[i-1];
    const stage = stages[row.stageIdx ?? z.haltLaststufeIdx ?? 0] || stages[0] || makeLaststufe('pa');
    const isFirstInStage = !prev || (prev.stageIdx ?? z.haltLaststufeIdx ?? 0) !== (row.stageIdx ?? z.haltLaststufeIdx ?? 0);

    let rowspan = 1;
    if(isFirstInStage){
      const stageIdx = row.stageIdx ?? z.haltLaststufeIdx ?? 0;
      rowspan = z.messungen.filter(r => (r.stageIdx ?? z.haltLaststufeIdx ?? 0) === stageIdx).length;
    }

    const load = (() => {
      if(stage.kind === 'p0') return toNumFlexible(state.vorgabe.P0);
      if(stage.kind === 'pa') return toNumFlexible(state.vorgabe.Pa);
      const Pp = toNumFlexible(state.vorgabe.Pp);
      return Number.isFinite(Pp) ? Pp * Number(stage.faktor || 0) : NaN;
    })();

    html += `<tr data-row="${i}">`;

    if(isFirstInStage){
      html += `<td class="mess-stage-col" rowspan="${rowspan}"><span class="mess-stage-pill">${h(stage.label)}</span></td>`;
      html += `<td class="mess-load-col" rowspan="${rowspan}">${Number.isFinite(load) ? fmt(load,1) : '—'}</td>`;
      html += `<td rowspan="${rowspan}"><input class="mess-input mess-input--auto" data-role="stage-druck-static" type="number" step="0.1" value="${h(stage.druck)}" readonly></td>`;
    }

    html += `
      <td>
        <div class="minute-cell">
          <input class="mess-input minute-input" data-role="m-min" data-row="${i}" type="number" step="1" inputmode="numeric" value="${h(row.min)}" ${isFree ? '' : 'readonly'}>
          ${isFree && i === z.messungen.length - 1 ? `<button class="row-plus" data-role="row-plus" data-row="${i}" type="button">+</button>` : ''}
        </div>
      </td>
      <td><input class="mess-input" data-role="m-ablesung" data-row="${i}" type="number" step="0.01" inputmode="decimal" value="${h(row.ablesung)}"></td>
      <td><input class="mess-input mess-input--auto" data-role="m-versch" data-row="${i}" type="number" step="0.01" inputmode="decimal" value="${h(row.versch)}" readonly title="${i===0 ? 'Referenzwert (erste Ablesung = 0)' : 'Δ zur vorherigen Ablesung (automatisch)'}"></td>
      <td><button class="row-anm-btn ${row.anm ? 'has-anm' : ''}" data-role="m-anm-btn" data-row="${i}" type="button" title="${h(row.anm || 'Anmerkung hinzufügen')}">+</button></td>
    `;
    html += `</tr>`;
  }

  return html;
}

function buildZyklusHtml(z){
  const isFree = state.settings.zyklenMode === 'frei';
  const haltIdx = Number.isInteger(z.haltLaststufeIdx)
    ? z.haltLaststufeIdx
    : defaultHoldIdxFromLaststufen(z.laststufen);

  return `
    <div class="zyklus-card" data-zid="${h(z.id)}">
      <div class="zyklus-card__head">
        <span class="zyklus-badge">Zyklus ${z.nr}</span>
        <span class="zyklus-title">Halt ${z.haltMin} min</span>
        <span class="zyklus-spacer"></span>
        ${isFree ? `<button class="zyklus-del" data-role="zyklus-del" type="button">Löschen</button>` : ''}
      </div>

      ${isFree ? `
        <div class="interval-row">
          <span class="interval-label">Halte-Laststufe</span>
          <select class="field__select" data-role="halt-idx">
            ${normalizeLaststufenArray(z.laststufen).map((ls,i)=>`
              <option value="${i}" ${haltIdx === i ? 'selected' : ''}>${h(ls.label)}</option>
            `).join('')}
          </select>
        </div>
      ` : ''}

      <div class="zyklus-load-row">${buildLaststufenHtml(z)}</div>

      <div class="interval-row">
        <span class="interval-label">Intervalle [min]</span>
        <input
          class="field__input"
          data-role="intervalle"
          type="text"
          value="${h(z.laststufen[haltIdx]?.intervalsStr || '')}"
          ${isFree ? '' : 'readonly'}
        >
      </div>

      <div class="table-wrap">
        <table class="mess-table">
          <thead>
            <tr>
              <th class="th-stage">Laststufe</th>
              <th class="th-load">Last<br><small>kN</small></th>
              <th class="th-druck">Druck<br><small>bar</small></th>
              <th class="th-min">Min</th>
              <th class="th-mess">Mess&shy;uhr<br><small>mm</small></th>
              <th class="th-versch">Verschieb.<br><small>Anker&shy;kopf [mm]</small></th>
              <th class="th-anm">Anm.</th>
            </tr>
          </thead>
          <tbody>${buildMeasurementBody(z, isFree)}</tbody>
        </table>
      </div>
    </div>
  `;
}

function updatePlusButtonVisibility(){
  const plusWrap = document.querySelector('.plus-wrap');
  if(!plusWrap) return;

  if(state.settings.zyklenMode === 'norm'){
    plusWrap.style.display = 'none';
    return;
  }

  plusWrap.style.display = '';
}

function recalcRowsFromStages(z){
  const newRows = [];
  normalizeLaststufenArray(z.laststufen).forEach((stage, stageIdx) => {
    const ints = parseIntervalStr(stage.intervalsStr);
    ints.forEach(min => {
      const old = z.messungen?.find(r => Number(r.min) === Number(min) && (r.stageIdx ?? 0) === stageIdx);
      newRows.push(old ? { ...old, min, stageIdx } : {
        stageIdx,
        min,
        ablesung:'',
        versch:'',
        anm:''
      });
    });
  });

  z.messungen = newRows;
  const holdStage = normalizeLaststufenArray(z.laststufen)[z.haltLaststufeIdx ?? 0];
  z.haltMin = parseIntervalStr(holdStage?.intervalsStr || '').slice(-1)[0] || z.haltMin || 0;
}

function renderZyklen(){
  const host = $('zyklenContainer');
  if(!host) return;

  ensureActiveZyklus();
  recalcAllVerschiebungen();

  const globalTimerHtml = buildGlobalTimerHtml();

  if(!state.zyklen.length){
    host.innerHTML = globalTimerHtml + `<div class="empty-state">Noch kein Lastzyklus angelegt.</div>`;
    updateGlobalTimerUi();
    updateFloatingTimerWidget();
    updateLappPreview();
    renderKalibPreview();
    updatePlusButtonVisibility();
    return;
  }

  host.innerHTML = globalTimerHtml + state.zyklen.map(buildZyklusHtml).join('');

  updateGlobalTimerUi();
  updateFloatingTimerWidget();
  updateLappPreview();
  renderKalibPreview();
  updatePlusButtonVisibility();

  const active = getActiveZyklus();
  if(active){
    const card = document.querySelector(`.zyklus-card[data-zid="${active.id}"]`);
    updateComputedRowsForCard(card, active);
    highlightActiveMeasurementRow(active);
  }
}

function hookZyklenDelegation(){
  const host = $('zyklenContainer');
  if(!host || host.dataset.bound === '1') return;
  host.dataset.bound = '1';

  host.addEventListener('change', e => {
    const el = e.target.closest('[data-role]');
    if(!el) return;

    const role = el.dataset.role;

    if(role === 'global-active-select'){
      state.meta.activeZyklusId = el.value || '';
      updateGlobalTimerUi();
      saveDraftDebounced();
      return;
    }

    if(role === 'zyklen-mode'){
      setZyklenMode(el.value);
      return;
    }

    const card = el.closest('.zyklus-card');
    const z = card ? getZyklusById(card.dataset.zid) : null;
    const lsIdx = Number(el.dataset.idx);

    if(role === 'halt-idx' && z){
      z.haltLaststufeIdx = Number(el.value || 0);
      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'ls-type' && z){
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      const old = z.laststufen[lsIdx] || makeLaststufe('factor',0.4,'');
      const kind = el.value === 'pa' ? 'pa' : el.value === 'p0' ? 'p0' : 'factor';
      const factor = kind === 'factor'
        ? (Number.isFinite(Number(old.faktor)) ? Number(old.faktor) : 0.4)
        : 0;

      const prevIntervals = old.intervalsStr || '0, 1';
      z.laststufen[lsIdx] = { ...makeLaststufe(kind, factor, old.druck || ''), intervalsStr: prevIntervals };
      z.haltLaststufeIdx = Math.min(
        Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : defaultHoldIdxFromLaststufen(z.laststufen),
        z.laststufen.length - 1
      );

      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }
  });

  host.addEventListener('input', e => {
    const el = e.target.closest('[data-role]');
    if(!el) return;

    const role = el.dataset.role;

    if(role === 'global-active-select'){
      state.meta.activeZyklusId = el.value || '';
      updateGlobalTimerUi();
      saveDraftDebounced();
      return;
    }

    const card = el.closest('.zyklus-card');
    if(!card) return;

    const z = getZyklusById(card.dataset.zid);
    if(!z) return;

    const idx = Number(el.dataset.row);
    const lsIdx = Number(el.dataset.idx);

    if(role === 'ls-druck'){
      if(z.laststufen[lsIdx]) z.laststufen[lsIdx].druck = el.value;
      saveDraftDebounced();
      return;
    }

    if(role === 'ls-factor'){
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      const old = z.laststufen[lsIdx] || makeLaststufe('factor',0.4,'');
      const factor = Number(el.value);

      z.laststufen[lsIdx] = {
        ...makeLaststufe('factor', Number.isFinite(factor) ? factor : 0.4, old.druck || ''),
        intervalsStr: old.intervalsStr || '0, 1'
      };

      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'intervalle'){
      if(state.settings.zyklenMode !== 'frei') return;

      const holdIdx = Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : 0;
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      if(z.laststufen[holdIdx]){
        z.laststufen[holdIdx].intervalsStr = el.value;
      }

      recalcRowsFromStages(z);
      recalcVerschiebung(z);

      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      else renderZyklen();

      saveDraftDebounced();
      return;
    }

    if(role === 'm-min'){
      if(state.settings.zyklenMode !== 'frei') return;
      if(z.messungen[idx]) z.messungen[idx].min = el.value;
      updateLappPreview();
      saveDraftDebounced();
      return;
    }

    if(role === 'm-ablesung'){
      if(z.messungen[idx]) z.messungen[idx].ablesung = el.value;
      recalcVerschiebung(z);
      updateComputedRowsForCard(card, z);
      updateLappPreview();
      if(!$('tab-auswertung')?.hidden) renderAuswertung();
      saveDraftDebounced();
      return;
    }
  });

  host.addEventListener('click', e => {
    const el = e.target.closest('[data-role]');
    if(!el) return;

    const role = el.dataset.role;

    if(role === 'global-start'){
      startActiveTimer();
      return;
    }
    if(role === 'global-stop'){
      stopActiveTimer();
      return;
    }
    if(role === 'global-reset'){
      resetActiveTimer();
      return;
    }
    if(role === 'global-elapsed'){
      const z = getActiveZyklus();
      if(z) openTimeAdjustModal(z.id);
      return;
    }

    const card = el.closest('.zyklus-card');
    if(!card) return;

    const z = getZyklusById(card.dataset.zid);
    if(!z) return;

    const idx = Number(el.dataset.row);
    const lsIdx = Number(el.dataset.idx);

    if(role === 'zyklus-del'){
      if(confirm(`Zyklus ${z.nr} löschen?`)){
        state.zyklen = state.zyklen.filter(x => x.id !== z.id);
        delete timerMap[z.id];
        ensureActiveZyklus();
        renderZyklen();
        saveDraftDebounced();
      }
      return;
    }

    if(role === 'ls-add'){
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      z.laststufen.push({
        ...makeLaststufe('factor', 0.4, ''),
        intervalsStr: '0, 1'
      });
      z.haltLaststufeIdx = defaultHoldIdxFromLaststufen(z.laststufen);
      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'ls-del'){
      z.laststufen = normalizeLaststufenArray(z.laststufen);
      if(z.laststufen.length <= 1){
        alert('Mindestens eine Laststufe muss vorhanden bleiben.');
        return;
      }

      z.laststufen.splice(lsIdx, 1);
      z.haltLaststufeIdx = Math.min(
        Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : 0,
        z.laststufen.length - 1
      );

      recalcRowsFromStages(z);
      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'row-plus'){
      if(state.settings.zyklenMode !== 'frei') return;
      if(!z.messungen[idx]) return;

      const stageIdx = z.messungen[idx].stageIdx ?? z.haltLaststufeIdx ?? 0;
      const sameStageRows = z.messungen.filter(r => (r.stageIdx ?? 0) === stageIdx);
      const lastMin = Number(sameStageRows[sameStageRows.length - 1]?.min || 0);

      z.messungen.push({
        stageIdx,
        min: lastMin + 1,
        ablesung:'',
        versch:'',
        anm:''
      });

      renderZyklen();
      saveDraftDebounced();
      return;
    }

    if(role === 'm-anm-btn'){
      const cur = z.messungen[idx]?.anm || '';
      const v = prompt('Anmerkung:', cur);
      if(v !== null){
        z.messungen[idx].anm = v;
        renderZyklen();
        saveDraftDebounced();
      }
      return;
    }
  });
}

/* ═══════════════════════════════════════════════════════
   BERECHNUNGEN / AUSWERTUNG
═══════════════════════════════════════════════════════ */
function calcLapp(deltaS_mm,Pp_kN,Pa_kN,Et_kNmm2,At_mm2){
  const dF = Pp_kN - Pa_kN;
  if(!Number.isFinite(deltaS_mm) || !Number.isFinite(dF) || dF <= 0 || !Number.isFinite(Et_kNmm2) || !Number.isFinite(At_mm2)) return NaN;
  return (deltaS_mm * Et_kNmm2 * At_mm2) / (dF * 1000);
}

function calcKriechmass(points){
  if(!Array.isArray(points) || points.length < 2) return NaN;

  const sorted = points
    .filter(p => Number.isFinite(p.min) && p.min > 0 && Number.isFinite(p.s_mm))
    .sort((a,b) => a.min - b.min);

  if(sorted.length < 2) return NaN;

  const a = sorted[0];
  const b = sorted[sorted.length - 1];
  if(a.min === b.min) return NaN;

  return (b.s_mm - a.s_mm) / (Math.log10(b.min) - Math.log10(a.min));
}

function getZyklusKpis(z){
  const Pp = toNumFlexible(state.vorgabe.Pp);
  const Pa = toNumFlexible(state.vorgabe.Pa);
  const Et = toNumFlexible(state.vorgabe.Et);
  const At = toNumFlexible(state.vorgabe.At);

  let cum = 0;
  const cumPts = z.messungen.map(m => {
    const v = toNumFlexible(m.versch);
    if(Number.isFinite(v)) cum += v;
    return { min:toNumFlexible(m.min), s_mm:cum };
  }).filter(p => Number.isFinite(p.min));

  const maxPt = cumPts[cumPts.length - 1];
  const dS = Number.isFinite(maxPt?.s_mm) ? maxPt.s_mm : NaN;

  const holdIdx = Number.isInteger(z.haltLaststufeIdx)
    ? Math.min(z.haltLaststufeIdx, z.laststufen.length - 1)
    : defaultHoldIdxFromLaststufen(z.laststufen);

  const holdStage = normalizeLaststufenArray(z.laststufen)[holdIdx];
  const lastKn = holdStage ? calcStageLoad(holdStage, 'eignung') : NaN;
  const isPpHold = holdStage?.kind === 'factor' && Math.abs(Number(holdStage.faktor || 0) - 1) < 0.0001;
  const Lapp = isPpHold ? calcLapp(dS,Pp,Pa,Et,At) : NaN;

  const isB = state.vorgabe.bodenart === 'bindig';
  const tMin = isB ? 60 : 20;
  const tMax = isB ? 180 : 60;
  const krPts = cumPts.filter(p => p.min >= tMin && p.min <= tMax);
  const ks = calcKriechmass(krPts);

  return { lastKn, dS, Lapp, ks, haltLabel: holdStage?.label || '—' };
}

function buildLastVerschiebungSvg(z){
  const Pp  = toNumFlexible(state.vorgabe.Pp);
  const Pa  = toNumFlexible(state.vorgabe.Pa);
  const Et  = toNumFlexible(state.vorgabe.Et);
  const At  = toNumFlexible(state.vorgabe.At);
  const Ltf = toNumFlexible(state.vorgabe.Ltf);
  const Le  = toNumFlexible(state.vorgabe.Le);
  const Ltb = toNumFlexible(state.vorgabe.Ltb);

  const minLapp = 0.8 * Ltf + Le;
  const maxLapp = Ltf + Le + 0.5 * Ltb;

  let cum = 0;
  const cumulative = z.messungen.map(m => {
    const v = toNumFlexible(m.versch);
    if(Number.isFinite(v)) cum += v;
    return { min:toNumFlexible(m.min), s:cum };
  }).filter(p => Number.isFinite(p.min));

  const holdIdx = Number.isInteger(z.haltLaststufeIdx)
    ? Math.min(z.haltLaststufeIdx, z.laststufen.length - 1)
    : defaultHoldIdxFromLaststufen(z.laststufen);
  const holdStage = normalizeLaststufenArray(z.laststufen)[holdIdx];
  const lastHalt = holdStage ? calcStageLoad(holdStage, 'eignung') : NaN;
  const sHalt = Number(cumulative[cumulative.length - 1]?.s);

  const W=520,H=300,ml=58,mr=20,mt=20,mb=46,pw=W-ml-mr,ph=H-mt-mb;
  const xMax = Number.isFinite(Pp) ? Pp * 1.1 : 1;
  const sMaxData = Math.max(...cumulative.map(m => Number(m.s)).filter(Number.isFinite),1);
  const yMax = Math.max(sMaxData * 1.2, 5);

  const tx = v => ml + (v / xMax) * pw;
  const ty = v => mt + ph - (v / yMax) * ph;

  function sFor(F,Lapp){
    if(!Number.isFinite(F) || !Number.isFinite(Lapp) || !Number.isFinite(Et) || !Number.isFinite(At)) return NaN;
    return (Lapp * (F - Pa) * 1000) / (Et * At);
  }

  const linePts = [];
  for(let f=Pa;f<=xMax;f+=Math.max(0.1, xMax/40)) linePts.push(f);

  const polyMin = linePts.map(f => {
    const s = sFor(f,minLapp);
    return Number.isFinite(s) ? `${tx(f)},${ty(Math.max(0,Math.min(yMax,s)))}` : null;
  }).filter(Boolean).join(' ');

  const polyMax = linePts.map(f => {
    const s = sFor(f,maxLapp);
    return Number.isFinite(s) ? `${tx(f)},${ty(Math.max(0,Math.min(yMax,s)))}` : null;
  }).filter(Boolean).join(' ');

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${W}" height="${H}" rx="8" fill="#0b1725"/>
    <rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="rgba(255,255,255,.18)"/>
    ${polyMin?`<polyline points="${polyMin}" fill="none" stroke="#56b7ff" stroke-width="2" stroke-dasharray="6 4"/>`:''}
    ${polyMax?`<polyline points="${polyMax}" fill="none" stroke="#ffb45a" stroke-width="2" stroke-dasharray="6 4"/>`:''}
    ${Number.isFinite(lastHalt)&&Number.isFinite(sHalt)?`<circle cx="${tx(lastHalt)}" cy="${ty(sHalt)}" r="5" fill="#f08a1c" stroke="#fff" stroke-width="1.5"/>`:''}
    <text x="${W/2}" y="14" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Last / Verschiebung</text>
  </svg>`;
}

function buildKriechSvg(z){
  const W=520,H=260,ml=58,mr=20,mt=20,mb=42,pw=W-ml-mr,ph=H-mt-mb;

  let cum = 0;
  const pts = z.messungen
    .filter(m => Number(m.min) > 0 && Number.isFinite(Number(m.versch)))
    .map(m => {
      cum += Number(m.versch);
      return { t:Number(m.min), s:cum };
    })
    .sort((a,b) => a.t - b.t);

  const tMax = Math.max(...pts.map(p => p.t), z.haltMin || 60);
  const sMin = Math.min(...pts.map(p => p.s), 0);
  const sMax = Math.max(...pts.map(p => p.s), sMin + 1);
  const tMin = 1;

  const tx = t => ml + ((Math.log10(Math.max(t,tMin)) - Math.log10(tMin)) / (Math.log10(tMax) - Math.log10(tMin) || 1)) * pw;
  const ty = s => mt + ph - ((s - sMin) / ((sMax - sMin) || 1)) * ph;
  const poly = pts.map(p => `${tx(p.t)},${ty(p.s)}`).join(' ');

  return `<svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="520" height="260" rx="8" fill="#0b1725"/>
    <rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="rgba(255,255,255,.18)"/>
    ${poly ? `<polyline points="${poly}" fill="none" stroke="#f08a1c" stroke-width="2"/>` : ''}
    ${pts.map(p => `<circle cx="${tx(p.t)}" cy="${ty(p.s)}" r="3" fill="#f08a1c"/>`).join('')}
    <text x="260" y="14" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Kriechverhalten</text>
  </svg>`;
}

function renderAuswertung(){
  const host = $('auswertungContainer');
  if(!host) return;

  if(!state.zyklen.length){
    host.innerHTML = `<div class="empty-state">Noch keine Lastzyklen vorhanden.</div>`;
    return;
  }

  const isB = state.vorgabe.bodenart === 'bindig';
  const ksLimit = 2;

  host.innerHTML = state.zyklen.map(z => {
    const k = getZyklusKpis(z);
    const Ltf = toNumFlexible(state.vorgabe.Ltf);
    const Le  = toNumFlexible(state.vorgabe.Le);
    const Ltb = toNumFlexible(state.vorgabe.Ltb);
    const minL = 0.8 * Ltf + Le;
    const maxL = Ltf + Le + 0.5 * Ltb;
    const lappOk = Number.isFinite(k.Lapp) ? (k.Lapp >= minL && k.Lapp <= maxL) : null;
    const ksOk = Number.isFinite(k.ks) ? k.ks <= ksLimit : null;

    return `
      <div class="auswertung-block">
        <div class="auswertung-block__title">Zyklus ${z.nr} · Halt bei ${h(k.haltLabel)} (${z.haltMin} min · ${isB ? 'bindig' : 'nicht bindig'})</div>
        <div class="kpi-grid">
          <div class="kpi"><div class="kpi__label">Last bei Halt</div><div class="kpi__value">${fmt(k.lastKn,1)} kN</div></div>
          <div class="kpi"><div class="kpi__label">Verschiebung Δs</div><div class="kpi__value">${fmt(k.dS,2)} mm</div></div>
          <div class="kpi"><div class="kpi__label">Kriechmaß k<sub>s</sub></div><div class="kpi__value ${ksOk===true?'kpi__value--good':ksOk===false?'kpi__value--bad':''}">${fmt(k.ks,2)} mm</div></div>
          <div class="kpi"><div class="kpi__label">L<sub>app</sub></div><div class="kpi__value ${lappOk===true?'kpi__value--good':lappOk===false?'kpi__value--bad':''}">${fmt(k.Lapp,2)} m</div></div>
        </div>
        <div class="diag-wrap">${buildLastVerschiebungSvg(z)}</div>
        <div class="diag-wrap">${buildKriechSvg(z)}</div>
      </div>
    `;
  }).join('');
}

/* ═══════════════════════════════════════════════════════
   HISTORY
═══════════════════════════════════════════════════════ */
function renderHistoryList(){
  const host = $('historyList');
  if(!host) return;

  const list = readHistory();
  if(!list.length){
    host.innerHTML = `<div class="empty-state">Noch keine Protokolle gespeichert.</div>`;
    return;
  }

  host.innerHTML = list.map(e => {
    const s = e.snapshot || {};
    return `
      <details class="historyItem" data-hid="${h(e.id)}">
        <summary class="historyItem__head">
          <span class="historyItem__chevron">▸</span>
          <span class="historyItem__title">${h(e.title)}</span>
          <span class="historyItem__date">${h(new Date(e.savedAt).toLocaleString('de-DE'))}</span>
        </summary>
        <div class="historyItem__body">
          Bauvorhaben: <b>${h(s.meta?.bauvorhaben || '—')}</b><br>
          Anker Nr.: <b>${h(s.meta?.ankerNr || '—')}</b><br>
          Bodenart: <b>${h(s.vorgabe?.bodenart || '—')}</b><br>
          Zyklen: <b>${(s.zyklen || []).length}</b>
          <div class="historyBtns">
            <button data-hact="load" data-id="${h(e.id)}">Laden</button>
            <button data-hact="pdf" data-id="${h(e.id)}">PDF</button>
            <button data-hact="export" data-id="${h(e.id)}">JSON Export</button>
            <button data-hact="del" data-id="${h(e.id)}">Löschen</button>
          </div>
        </div>
      </details>
    `;
  }).join('');
}

function hookHistoryDelegation(){
  const host = $('historyList');
  if(!host || host.dataset.bound === '1') return;
  host.dataset.bound = '1';

  host.addEventListener('click', async e => {
    const btn = e.target.closest('[data-hact]');
    if(!btn) return;

    const id = btn.dataset.id;
    const act = btn.dataset.hact;
    const list = readHistory();
    const entry = list.find(x => x.id === id);

    if(!entry && act !== 'del') return;

    if(act === 'del'){
      if(!confirm('Eintrag löschen?')) return;
      writeHistory(list.filter(x => x.id !== id));
      renderHistoryList();
      return;
    }

    if(act === 'load'){
      applySnapshot(entry.snapshot, true);
      saveDraftDebounced();
      document.querySelector('.tab[data-tab="formular"]')?.click();
      return;
    }

    if(act === 'pdf'){
      await exportPdfFromSnapshot(entry.snapshot);
      return;
    }

    if(act === 'export'){
      downloadJson(entry.snapshot, `${dateTag()}_HTB_Anker_${(entry.snapshot.meta?.ankerNr || 'export').replace(/\s+/g,'_')}.json`);
      return;
    }
  });
}

/* ═══════════════════════════════════════════════════════
   TEMPLATE / EXPORT / PDF
═══════════════════════════════════════════════════════ */
function downloadJson(data, filename){
  const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function buildTemplateSnapshot(){
  const snap = collectSnapshot();
  snap.meta = {
    ...snap.meta,
    bauvorhaben:'',
    bauherr:'',
    ankerlage:'',
    ankerNr:'',
    blattNr:'',
    pruefdatum:'',
    anmerkung:''
  };

  snap.zyklen = (snap.zyklen || []).map(z => ({
    ...z,
    elapsedMs:0,
    startzeit:'',
    laststufen:z.laststufen.map(ls => ({ ...ls, druck:'' })),
    messungen:z.messungen.map(m => ({ ...m, druck:'', ablesung:'', versch:'', anm:'' }))
  }));

  return snap;
}

async function exportPdfFromSnapshot(snap){
  if(!window.PDFLib){
    alert('PDF-Bibliothek nicht geladen.');
    return;
  }

  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([595.28, 841.89]);
  const { width:W, height:H } = page.getSize();
  let y = H - 50;

  page.drawRectangle({ x:0, y:H-30, width:W, height:30, color:rgb(0.05,0.18,0.31) });
  page.drawText('HTB Ankerprüfung – Verpreßanker Eignungsprüfung', {
    x:30, y:H-20, size:11, font:fontB, color:rgb(1,1,1)
  });

  y = H - 60;
  const meta = snap.meta || {};
  const vor = snap.vorgabe || {};

  const lines = [
    ['Bauvorhaben',meta.bauvorhaben||''],
    ['Bauherr',meta.bauherr||''],
    ['Anker Nr.',meta.ankerNr||''],
    ['Ankerlage',meta.ankerlage||''],
    ['Prüfdatum',dateDE(meta.pruefdatum)],
    ['Bodenart',vor.bodenart||''],
    ['Ankertyp',vor.ankertyp||''],
    ['LA / Ltb / Ltf / Le [m]',`${vor.LA||''} / ${vor.Ltb||''} / ${vor.Ltf||''} / ${vor.Le||''}`],
    ['Pp / Pa [kN]',`${vor.Pp||''} / ${vor.Pa||''}`],
    ['Et / At',`${vor.Et||''} kN/mm² / ${vor.At||''} mm²`]
  ];

  page.drawText('Stammdaten & Vorgabe',{ x:30, y, size:12, font:fontB, color:rgb(0,0,0) });
  y -= 16;

  lines.forEach(([k,v]) => {
    page.drawText(`${k}:`,{ x:30, y, size:9, font:fontB });
    page.drawText(String(v),{ x:160, y, size:9, font });
    y -= 12;
  });

  y -= 10;
  page.drawText('Lastzyklen',{ x:30, y, size:12, font:fontB });
  y -= 14;

  (snap.zyklen || []).forEach(z => {
    if(y < 140){
      page = pdf.addPage([595.28, 841.89]);
      y = H - 50;
    }

    page.drawText(`Zyklus ${z.nr} · Halt ${z.haltMin} min`,{ x:30, y, size:10, font:fontB });
    y -= 12;
    page.drawText('Stufe   Last   Druck   Min   Messuhr   Versch.   Anm.',{ x:30, y, size:8, font:fontB });
    y -= 10;

    z.messungen.forEach(m => {
      if(y < 80){
        page = pdf.addPage([595.28, 841.89]);
        y = H - 50;
      }

      const stageIdx = m.stageIdx ?? (Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : 0);
      const stage = normalizeLaststufenArray(z.laststufen)[stageIdx] || makeLaststufe('pa');
      const lastKn = (() => {
        if(stage.kind === 'p0') return toNumFlexible(vor.P0);
        if(stage.kind === 'pa') return toNumFlexible(vor.Pa);
        const Pp = toNumFlexible(vor.Pp);
        return Number.isFinite(Pp) ? Pp * Number(stage.faktor || 0) : NaN;
      })();

      page.drawText(
        `${String(stage.label).padEnd(8)} ${String(Number.isFinite(lastKn) ? fmt(lastKn,1) : '').padEnd(8)} ${String(stage.druck || '').padEnd(7)} ${String(m.min).padEnd(4)} ${String(m.ablesung || '').padEnd(8)} ${String(m.versch || '').padEnd(8)} ${m.anm || ''}`,
        { x:30, y, size:8, font }
      );
      y -= 10;
    });

    y -= 6;
  });

  const filiale = meta.filiale || meta.Niederlassung || '';
  const fil = FILIALEN[filiale] || {};
  pdf.getPages().forEach(p => {
    p.drawRectangle({ x:0, y:0, width:W, height:30, color:rgb(0.05,0.18,0.31) });
    p.drawText(`HTB Baugesellschaft m.b.H. – Filiale ${filiale || '—'}`, {
      x:30, y:18, size:8, font:fontB, color:rgb(1,1,1)
    });
    p.drawText(`${fil.adresse || ''} · ${fil.tel || ''} · ${fil.email || ''}`, {
      x:30, y:8, size:7, font, color:rgb(.85,.9,1)
    });
  });

  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type:'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dateTag()}_HTB_Ankerpruefung_${(meta.ankerNr || 'export').replace(/\s+/g,'_')}.pdf`;
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function normalizeBottomActionCards(){
  /* KEIN JS-Override – Sticky kommt nur aus CSS */
}

function normalizeKalibImportInput(){
  const inp = $('kalibImportInput');
  if(inp){
    inp.setAttribute('accept', '.csv,text/csv');
  }
}

/* ═══════════════════════════════════════════════════════
   TABS / INIT
═══════════════════════════════════════════════════════ */
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.tab === name));
  document.querySelectorAll('.pane').forEach(p => p.hidden = p.id !== 'tab-' + name);

  if(name === 'auswertung') renderAuswertung();
  if(name === 'verlauf') renderHistoryList();
}

function init(){
  ensureDynamicStyles();
  initAnkertypSelect();

  loadDraft();
  ensureDefaultZyklen();
  recalcAllVerschiebungen();

  syncMetaToUi();
  syncVorgabeToUi();
  renderAnkertypInfo();
  renderPresseDropdown();
  syncMetaToUi();
  renderKalibInfo();
  renderKalibPreview();
  renderZyklen();
  updateLappPreview();
  renderHistoryList();

  if(state.meta.selectedKalibId){
    syncDruckFromKalib();
  }

  normalizeKalibImportInput();
  updateRequiredFieldStates();

  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab))
  );

  META_FIELDS.forEach(([id,k]) => {
    const el = $(id);
    el?.addEventListener('input', () => {
      state.meta[k] = el.value;
      updateRequiredFieldStates();
      saveDraftDebounced();
    });

    el?.addEventListener('change', () => {
      state.meta[k] = el.value;
      updateRequiredFieldStates();
      saveDraftDebounced();
    });
  });

  VOR_FIELDS.forEach(k => {
    const el = $('vor-' + k);
    if(!el) return;

    const evtName = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evtName, () => {
      if(k !== 'Pp'){
        state.vorgabe[k] = el.value || '';
      }

      if(k === 'ankertyp'){
        applyAnkertypPreset(state.vorgabe.ankertyp, { overwrite:true });
      }

      maybeAutofillVorgabe(k);
      updateLappPreview();
      renderKalibPreview();

      if(findKalibById(state.meta.selectedKalibId)){
        syncDruckFromKalib();
      }else{
        renderZyklen();
      }

      if(!$('tab-auswertung')?.hidden) renderAuswertung();
      updateRequiredFieldStates();
      saveDraftDebounced();
    });
  });

  $('boden-bindig')?.addEventListener('change', () => {
    state.vorgabe.bodenart = 'bindig';

    if(state.settings.zyklenMode === 'norm'){
      applyNormTemplateToState();
      recalcAll
