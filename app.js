'use strict';

const BASE_PATH = '/Ankerpruefung/';
console.log('HTB Ankerprüfung app.js loaded');

const STORAGE_DRAFT  = 'htb-anker-draft-v1';
const STORAGE_HISTORY= 'htb-anker-history-v1';
const STORAGE_KALIB  = 'htb-anker-kalibrierungen-v1';
const HISTORY_MAX    = 30;

/* ═══════════════════════════════════════════════════════
   EINGEBAUTE KALIBRIERUNGEN
═══════════════════════════════════════════════════════ */
const BUILTIN_KALIBRIERUNGEN = [
  {
    id: 'NC41333832_2026-01-26',
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

/* ═══════════════════════════════════════════════════════
   FILIALEN
═══════════════════════════════════════════════════════ */
const FILIALEN = {
  Arzl:{adresse:'A-6471 Arzl im Pitztal, Gewerbepark Pitztal 16',tel:'+43 5412 / 63975',email:'office.arzl@htb-bau.at'},
  'Nüziders':{adresse:'A-6714 Nüziders, Landstraße 19',tel:'+43 5552 / 34 739',email:'office.nueziders@htb-bau.at'},
  Zirl:{adresse:'A-6170 Zirl, Neuraut 1',tel:'+43 5238 / 58 873 1',email:'office.ibk@htb-bau.at'},
  Schwoich:{adresse:'A-6334 Schwoich, Kufsteiner Wald 28',tel:'+43 5372 / 63 600',email:'office.schwoich@htb-bau.at'},
  Fusch:{adresse:'A-5672 Fusch a.d. Großglocknerstraße, Achenstraße 2',tel:'+43 6546 / 40 116',email:'office.fusch@htb-bau.at'},
  Wels:{adresse:'A-4600 Wels, Hans-Sachs-Straße 103',tel:'+43 7242 / 601 600',email:'office.wels@htb-bau.at'},
  Klagenfurt:{adresse:'A-9020 Klagenfurt, Josef-Sablatnig-Straße 251',tel:'+43 463 / 33 533 700',email:'office.klagenfurt@htb-bau.at'}
};

/* ═══════════════════════════════════════════════════════
   UPDATE-BANNER
═══════════════════════════════════════════════════════ */
function showUpdateBanner() {
  if (document.getElementById('updateBanner')) return;

  const banner = document.createElement('div');
  banner.id = 'updateBanner';
  banner.style.cssText = [
    'position:fixed',
    'bottom:70px',
    'left:50%',
    'transform:translateX(-50%)',
    'background:#173f66',
    'color:#fff',
    'border:2px solid #f08a1c',
    'border-radius:10px',
    'padding:10px 16px',
    'z-index:999',
    'display:flex',
    'align-items:center',
    'gap:10px',
    'box-shadow:0 4px 12px rgba(0,0,0,.4)',
    'font-size:14px',
    'font-weight:700'
  ].join(';');

  banner.innerHTML = `
    <span>Update verfügbar</span>
    <button
      onclick="navigator.serviceWorker.getRegistration().then(r=>r?.waiting?.postMessage({action:'skipWaiting'}));this.closest('#updateBanner').remove();"
      style="background:#f08a1c;color:#fff;border:0;border-radius:6px;padding:6px 12px;cursor:pointer;font-weight:700;font-size:13px"
    >Jetzt laden</button>
    <button
      onclick="this.closest('#updateBanner').remove();"
      style="background:transparent;border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:12px"
    >Später</button>
  `;

  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 12000);
}

/* ═══════════════════════════════════════════════════════
   STANDARD-INTERVALLE / ZYKLEN
═══════════════════════════════════════════════════════ */
const STD_INTERVALS_15  = [0,1,2,3,4,5,7,10,15];
const STD_INTERVALS_30  = [0,1,2,3,4,5,7,10,15,20,30];
const STD_INTERVALS_60  = [0,1,2,3,4,5,7,10,15,20,30,45,60];
const STD_INTERVALS_180 = [0,1,2,3,4,5,7,10,15,20,30,45,60,90,120,150,180];

const ZYKLUS_DEF = [
  {nr:1,laststufen:[{label:'Pa',f:0},{label:'0,4·Pp',f:0.4},{label:'Pa',f:0}],haltLaststufeIdx:1,haltMin:15,intervals:STD_INTERVALS_15},
  {nr:2,laststufen:[{label:'Pa',f:0},{label:'0,4·Pp',f:0.4},{label:'0,55·Pp',f:0.55},{label:'Pa',f:0}],haltLaststufeIdx:2,haltMin:15,intervals:STD_INTERVALS_15},
  {nr:3,laststufen:[{label:'Pa',f:0},{label:'0,4·Pp',f:0.4},{label:'0,55·Pp',f:0.55},{label:'0,7·Pp',f:0.7},{label:'Pa',f:0}],haltLaststufeIdx:3,haltMin:30,intervals:STD_INTERVALS_30},
  {nr:4,laststufen:[{label:'Pa',f:0},{label:'0,4·Pp',f:0.4},{label:'0,55·Pp',f:0.55},{label:'0,7·Pp',f:0.7},{label:'0,85·Pp',f:0.85},{label:'Pa',f:0}],haltLaststufeIdx:4,haltMin:60,intervals:STD_INTERVALS_60},
  {nr:5,laststufen:[{label:'Pa',f:0},{label:'0,4·Pp',f:0.4},{label:'0,55·Pp',f:0.55},{label:'0,7·Pp',f:0.7},{label:'0,85·Pp',f:0.85},{label:'Pp',f:1.0},{label:'0,85·Pp',f:0.85},{label:'0,7·Pp',f:0.7},{label:'0,55·Pp',f:0.55},{label:'0,4·Pp',f:0.4},{label:'Pa',f:0},{label:'P0',f:0}],haltLaststufeIdx:5,haltMin:60,intervals:STD_INTERVALS_60}
];

/* ═══════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

function h(v){
  return String(v ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function uid(){
  try { return crypto.randomUUID(); }
  catch { return 'id_' + Date.now() + '_' + Math.random().toString(16).slice(2); }
}

function clone(v){ return JSON.parse(JSON.stringify(v)); }
function clamp(n,lo,hi){ return Math.max(lo, Math.min(hi, n)); }

function fmt(v,d=2){
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(d).replace('.',',') : '—';
}

function formatInputNumber(n,d=1){
  if(!Number.isFinite(n)) return '';
  const s = n.toFixed(d);
  return s.replace(/\.0+$/,'').replace(/(\.\d*[1-9])0+$/,'$1');
}

function formatTimeHHMMSS(d=new Date()){
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}

function formatElapsed(ms){
  const t  = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(t / 3600);
  const mm = Math.floor((t % 3600) / 60);
  const ss = t % 60;
  return hh > 0
    ? `${hh}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
    : `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

function dateTag(d=new Date()){
  return `${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${d.getFullYear()}`;
}

function dateDE(iso){
  const s = String(iso || '').trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : s;
}

function parseIntervalStr(str){
  return [...new Set(
    String(str || '')
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => Number.isFinite(n) && n >= 0)
  )].sort((a,b)=>a-b);
}

/* ═══════════════════════════════════════════════════════
   KALIBRIERUNGS-MANAGEMENT
═══════════════════════════════════════════════════════ */
function loadAllKalibs(){
  let local = [];
  try{
    local = JSON.parse(localStorage.getItem(STORAGE_KALIB) || '[]');
  }catch{}

  const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));

  return [
    ...BUILTIN_KALIBRIERUNGEN,
    ...local.filter(k => !builtinIds.has(k.id))
  ];
}

function saveUserKalibs(kalibs){
  const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));
  const userOnly = kalibs.filter(k => !builtinIds.has(k.id));
  try{
    localStorage.setItem(STORAGE_KALIB, JSON.stringify(userOnly));
  }catch(e){
    console.warn(e);
  }
}

function findKalibById(id){
  return loadAllKalibs().find(k => k.id === id) || null;
}

function kalibGueltigBis(k){
  if(!k?.kalibriertAm) return null;
  const d = new Date(k.kalibriertAm);
  d.setMonth(d.getMonth() + (Number(k.gueltigMonate || 12)));
  return d;
}

function kalibStatus(k){
  const bis = kalibGueltigBis(k);
  if(!bis) return 'ok';
  const diffDays = Math.floor((bis - new Date()) / 86400000);
  if(diffDays < 0) return 'expired';
  if(diffDays < 30) return 'warn';
  return 'ok';
}

/* ═══════════════════════════════════════════════════════
   INTERPOLATION kN → bar
═══════════════════════════════════════════════════════ */
function interpoliereBar(zielKn, punkte){
  if(!Array.isArray(punkte) || punkte.length < 2){
    return { bar: null, oor: true };
  }

  const sorted = [...punkte]
    .map(p => ({ kN:Number(p.kN), bar:Number(p.bar) }))
    .filter(p => Number.isFinite(p.kN) && Number.isFinite(p.bar))
    .sort((a,b) => a.kN - b.kN);

  if(sorted.length < 2){
    return { bar: null, oor: true };
  }

  const minKn = sorted[0].kN;
  const maxKn = sorted[sorted.length - 1].kN;

  if(!Number.isFinite(zielKn) || zielKn < minKn || zielKn > maxKn){
    return { bar: null, oor: true };
  }

  const exact = sorted.find(p => p.kN === zielKn);
  if(exact) return { bar: exact.bar, oor: false };

  let lo = sorted[0];
  let hi = sorted[sorted.length - 1];

  for(let i=0;i<sorted.length-1;i++){
    if(sorted[i].kN <= zielKn && sorted[i+1].kN >= zielKn){
      lo = sorted[i];
      hi = sorted[i+1];
      break;
    }
  }

  const t = (zielKn - lo.kN) / (hi.kN - lo.kN);
  const bar = lo.bar + t * (hi.bar - lo.bar);

  return { bar: Math.round(bar * 10) / 10, oor: false };
}

function berechneDruckvorschau(){
  const kalib = findKalibById(state.meta.selectedKalibId);
  const Pp = Number(state.vorgabe.Pp);
  const Pa = Number(state.vorgabe.Pa);
  const P0 = Number(state.vorgabe.P0);

  const stufen = [
    { label:'Pa',        kN: Pa },
    { label:'0,4 · Pp',  kN: Number.isFinite(Pp) ? Pp * 0.40 : NaN },
    { label:'0,55 · Pp', kN: Number.isFinite(Pp) ? Pp * 0.55 : NaN },
    { label:'0,7 · Pp',  kN: Number.isFinite(Pp) ? Pp * 0.70 : NaN },
    { label:'0,85 · Pp', kN: Number.isFinite(Pp) ? Pp * 0.85 : NaN },
    { label:'Pp',        kN: Pp },
    { label:'P0',        kN: P0 }
  ];

  return stufen.map(s => {
    if(!kalib || !Number.isFinite(s.kN) || s.kN < 0){
      return { ...s, bar:null, oor:false, noKalib:!kalib };
    }
    const { bar, oor } = interpoliereBar(s.kN, kalib.punkte);
    return { ...s, bar, oor };
  });
}

function kNtoBar(kN){
  const kalib = findKalibById(state.meta.selectedKalibId);
  if(!kalib || !Number.isFinite(kN)) return null;
  const { bar, oor } = interpoliereBar(kN, kalib.punkte);
  return oor ? null : bar;
}

/* ═══════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════ */
function getInitialState(){
  return {
    meta:{
      filiale:'',
      bauvorhaben:'',
      bauherr:'',
      bauleitung:'',
      ankerlage:'',
      ankerNr:'',
      blattNr:'',
      pruefdatum:'',
      pumpeNr:'',
      anmerkung:'',
      selectedKalibId:''
    },
    vorgabe:{
      bodenart:'nichtbindig',
      ankertyp:'',
      LA:'',
      Ltb:'',
      Ltf:'',
      Le:'',
      Et:'195',
      At:'',
      P0:'',
      Pa:'0',
      Pp:'',
      Pt01k:'',
      Pd:'',
      gamma:'1.1'
    },
    zyklen:[],
    settings:{
      alarmDurationSec:4,
      alarmSoundEnabled:true
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
let _timeAdjustVid = null;

/* ═══════════════════════════════════════════════════════
   ZYKLUS-FACTORY
═══════════════════════════════════════════════════════ */
function defaultZyklus(nr){
  const def = ZYKLUS_DEF[nr - 1] || ZYKLUS_DEF[0];
  return {
    id: uid(),
    nr,
    haltMin: def.haltMin,
    intervalleStr: def.intervals.join(', '),
    elapsedMs: 0,
    startzeit: '',
    laststufen: def.laststufen.map(ls => ({
      label: ls.label,
      faktor: ls.f,
      druck: ''
    })),
    messungen: def.intervals.map(min => ({
      min,
      druck:'',
      ablesung:'',
      versch:'',
      anm:''
    }))
  };
}

/* ═══════════════════════════════════════════════════════
   PERSISTENCE
═══════════════════════════════════════════════════════ */
function saveDraftDebounced(){
  clearTimeout(_saveT);
  _saveT = setTimeout(() => {
    try{
      localStorage.setItem(STORAGE_DRAFT, JSON.stringify(state));
    }catch(e){
      console.warn(e);
    }
  }, 500);
}

function loadDraft(){
  try{
    const raw = localStorage.getItem(STORAGE_DRAFT);
    if(!raw) return;
    const obj = JSON.parse(raw);
    Object.assign(state.meta, obj.meta || {});
    Object.assign(state.vorgabe, obj.vorgabe || {});
    Object.assign(state.settings, obj.settings || {});
    state.zyklen = Array.isArray(obj.zyklen) ? obj.zyklen : [];
  }catch(e){
    console.warn(e);
  }
}

function readHistory(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
  }catch{
    return [];
  }
}

function writeHistory(list){
  try{
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  }catch(e){
    console.warn(e);
  }
}

function collectSnapshot(){
  return {
    savedAt: Date.now(),
    meta: clone(state.meta),
    vorgabe: clone(state.vorgabe),
    zyklen: clone(state.zyklen),
    settings: clone(state.settings)
  };
}

function applySnapshot(snap, replace=true){
  if(!snap) return;

  if(replace){
    Object.assign(state.meta, getInitialState().meta, snap.meta || {});
    Object.assign(state.vorgabe, getInitialState().vorgabe, snap.vorgabe || {});
    state.zyklen = Array.isArray(snap.zyklen) ? clone(snap.zyklen) : [];
  }

  syncMetaToUi();
  syncVorgabeToUi();
  renderZyklen();
  updateLappPreview();
  renderPresseDropdown();
  syncMetaToUi();
  renderKalibInfo();
  renderKalibPreview();
  syncDruckFromKalib();
}

function saveCurrentToHistory(){
  if(!state.meta.filiale){
    alert('Bitte Filiale wählen.');
    return false;
  }

  const snap = collectSnapshot();
  const title = `Anker ${state.meta.ankerNr || '?'} · ${state.meta.bauvorhaben || '—'}`;
  const list = readHistory();
  list.unshift({
    id: uid(),
    title,
    savedAt: snap.savedAt,
    snapshot: snap
  });
  writeHistory(list);
  alert('Im Verlauf gespeichert.');
  renderHistoryList();
  return true;
}

/* ═══════════════════════════════════════════════════════
   UI-SYNC
═══════════════════════════════════════════════════════ */
const META_FIELDS = [
  ['meta-filiale','filiale'],
  ['meta-bauvorhaben','bauvorhaben'],
  ['meta-bauherr','bauherr'],
  ['meta-bauleitung','bauleitung'],
  ['meta-ankerlage','ankerlage'],
  ['meta-ankerNr','ankerNr'],
  ['meta-blattNr','blattNr'],
  ['meta-pruefdatum','pruefdatum'],
  ['meta-pumpeNr','pumpeNr'],
  ['meta-anmerkung','anmerkung']
];

const VOR_FIELDS = ['ankertyp','LA','Ltb','Ltf','Le','Et','At','P0','Pa','Pp','Pt01k','Pd','gamma'];

function syncMetaToUi(){
  META_FIELDS.forEach(([id,k]) => {
    const el = $(id);
    if(el) el.value = state.meta[k] || '';
  });

  const sel = $('presseSelect');
  if(sel) sel.value = state.meta.selectedKalibId || '';
}

function collectMetaFromUi(){
  META_FIELDS.forEach(([id,k]) => {
    const el = $(id);
    if(el) state.meta[k] = el.value || '';
  });

  const sel = $('presseSelect');
  if(sel) state.meta.selectedKalibId = sel.value || '';
}

function syncVorgabeToUi(){
  VOR_FIELDS.forEach(k => {
    const el = $('vor-' + k);
    if(el) el.value = state.vorgabe[k] || '';
  });

  if($('boden-bindig')) $('boden-bindig').checked = state.vorgabe.bodenart === 'bindig';
  if($('boden-nichtbindig')) $('boden-nichtbindig').checked = state.vorgabe.bodenart !== 'bindig';
}

function collectVorgabeFromUi(){
  VOR_FIELDS.forEach(k => {
    const el = $('vor-' + k);
    if(el) state.vorgabe[k] = el.value || '';
  });

  state.vorgabe.bodenart = $('boden-bindig')?.checked ? 'bindig' : 'nichtbindig';
}

/* ═══════════════════════════════════════════════════════
   AUTO-BERECHNUNG VORGABEN
═══════════════════════════════════════════════════════ */
function getMeasuredLappForDisplay(){
  const zs = [...state.zyklen].sort((a,b)=>b.nr-a.nr);
  for(const z of zs){
    const k = getZyklusKpis(z);
    if(Number.isFinite(k.Lapp)){
      return { Lapp:k.Lapp, zyklus:z.nr, dS:k.dS };
    }
  }
  return { Lapp:NaN, zyklus:null, dS:NaN };
}

function computeVorgabeAuto(){
  const Ltf   = Number(state.vorgabe.Ltf);
  const Ltb   = Number(state.vorgabe.Ltb);
  const Le    = Number(state.vorgabe.Le);
  const Et    = Number(state.vorgabe.Et);
  const At    = Number(state.vorgabe.At);
  const Pa    = Number(state.vorgabe.Pa);
  const Pp    = Number(state.vorgabe.Pp);
  const Pd    = Number(state.vorgabe.Pd);
  const gamma = Number(state.vorgabe.gamma);

  const minLapp = (Number.isFinite(Ltf) && Number.isFinite(Le))
    ? (0.8 * Ltf + Le)
    : NaN;

  const maxLapp = (Number.isFinite(Ltf) && Number.isFinite(Le) && Number.isFinite(Ltb))
    ? (Ltf + Le + 0.5 * Ltb)
    : NaN;

  const deltaF = Pp - Pa;

  const sGrenzB = (
    Number.isFinite(minLapp) &&
    Number.isFinite(deltaF) && deltaF > 0 &&
    Number.isFinite(Et) && Et > 0 &&
    Number.isFinite(At) && At > 0
  ) ? (minLapp * deltaF * 1000) / (Et * At) : NaN;

  const sGrenzA = (
    Number.isFinite(maxLapp) &&
    Number.isFinite(deltaF) && deltaF > 0 &&
    Number.isFinite(Et) && Et > 0 &&
    Number.isFinite(At) && At > 0
  ) ? (maxLapp * deltaF * 1000) / (Et * At) : NaN;

  const PpFromPd = (Number.isFinite(Pd) && Number.isFinite(gamma) && gamma > 0)
    ? (Pd * gamma)
    : NaN;

  const PdFromPp = (Number.isFinite(Pp) && Number.isFinite(gamma) && gamma > 0)
    ? (Pp / gamma)
    : NaN;

  const measured = getMeasuredLappForDisplay();

  return {
    minLapp,
    maxLapp,
    sGrenzB,
    sGrenzA,
    PpFromPd,
    PdFromPp,
    measuredLapp: measured.Lapp,
    measuredZyklus: measured.zyklus
  };
}

function maybeAutofillVorgabe(changedKey){
  const a = computeVorgabeAuto();

  if(
    (changedKey === 'Pd' || changedKey === 'gamma') &&
    (!state.vorgabe.Pp || String(state.vorgabe.Pp).trim() === '') &&
    Number.isFinite(a.PpFromPd)
  ){
    state.vorgabe.Pp = formatInputNumber(a.PpFromPd,1);
    if($('vor-Pp')) $('vor-Pp').value = state.vorgabe.Pp;
  }

  if(
    (changedKey === 'Pp' || changedKey === 'gamma') &&
    (!state.vorgabe.Pd || String(state.vorgabe.Pd).trim() === '') &&
    Number.isFinite(a.PdFromPp)
  ){
    state.vorgabe.Pd = formatInputNumber(a.PdFromPp,1);
    if($('vor-Pd')) $('vor-Pd').value = state.vorgabe.Pd;
  }
}

function updateLappPreview(){
  const a = computeVorgabeAuto();

  const put = (id,val,unit='',digits=2) => {
    const el = $(id);
    if(!el) return;
    el.textContent = Number.isFinite(val) ? `${fmt(val,digits)}${unit}` : '—';
  };

  put('calc-minLapp', a.minLapp, ' m', 2);
  put('calc-maxLapp', a.maxLapp, ' m', 2);
  put('calc-sGrenzB', a.sGrenzB, ' mm', 2);
  put('calc-sGrenzA', a.sGrenzA, ' mm', 2);
  put('calc-PpFromPd', a.PpFromPd, ' kN', 1);
  put('calc-PdFromPp', a.PdFromPp, ' kN', 1);

  const hintPp = $('hint-vor-Pp');
  if(hintPp){
    hintPp.textContent = Number.isFinite(a.PpFromPd)
      ? `Auto aus Pd·γa: ${fmt(a.PpFromPd,1)} kN`
      : '';
  }

  const hintPd = $('hint-vor-Pd');
  if(hintPd){
    hintPd.textContent = Number.isFinite(a.PdFromPp)
      ? `Auto aus Pp/γa: ${fmt(a.PdFromPp,1)} kN`
      : '';
  }

  const lappEl = $('calc-LappMeasured');
  if(lappEl){
    lappEl.textContent = Number.isFinite(a.measuredLapp)
      ? `${fmt(a.measuredLapp,2)} m${a.measuredZyklus ? ` (Zyklus ${a.measuredZyklus})` : ''}`
      : '—';
  }

  const checkEl = $('calc-LappCheck');
  if(checkEl){
    if(
      Number.isFinite(a.measuredLapp) &&
      Number.isFinite(a.minLapp) &&
      Number.isFinite(a.maxLapp)
    ){
      const ok = a.measuredLapp >= a.minLapp && a.measuredLapp <= a.maxLapp;
      checkEl.textContent = ok ? 'OK' : 'nicht OK';
      checkEl.className = `inline-badge ${ok ? 'inline-badge--good' : 'inline-badge--bad'}`;
    }else{
      checkEl.textContent = '—';
      checkEl.className = 'inline-badge';
    }
  }
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
    const tot = Math.max(1, Math.round(Number(state.settings.alarmDurationSec || 4) / 0.9));
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
      : (enabledPref
        ? 'Für iPhone: einmal hier oder vor dem Start direkt antippen.'
        : 'Alarmton ist ausgeschaltet.');
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
   TIMER
═══════════════════════════════════════════════════════ */
function getZyklusById(id){
  return state.zyklen.find(z => z.id === id);
}

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

function updateTimerUi(card,z){
  if(!card || !z) return;

  const t = ensureTimer(z.id,z);
  const ms = getElapsedMs(z.id,z);
  z.elapsedMs = ms;

  const el = card.querySelector('[data-role="elapsed"]');
  const sb = card.querySelector('[data-role="timer-start"]');
  const tb = card.querySelector('[data-role="timer-stop"]');
  const sz = card.querySelector('[data-role="startzeit"]');
  const nx = card.querySelector('[data-role="naechstes"]');

  if(el) el.textContent = formatElapsed(ms);
  if(sz) sz.textContent = z.startzeit ? `Startzeit: ${z.startzeit}` : 'Noch nicht gestartet';

  if(sb){
    sb.textContent = t.running ? 'Läuft' : (z.elapsedMs > 0 ? 'Weiter' : 'Start');
    sb.disabled = t.running;
  }
  if(tb) tb.disabled = !t.running;

  const ints = parseIntervalStr(z.intervalleStr);
  const eMin = ms / 60000;
  const next = ints.filter(iv => iv > 0).find(iv => eMin < iv);

  if(nx){
    nx.textContent = next !== undefined
      ? `Nächste Messung: ${next} min (in ${Math.max(0,Math.ceil((next*60000-ms)/1000))}s)`
      : 'Alle Intervalle erreicht';
  }

  card.querySelectorAll('tbody tr').forEach(r => r.classList.remove('row-active'));
  const passed = ints.filter(iv => eMin >= iv);
  const last = passed.length ? passed[passed.length - 1] : ints[0];
  const idx = z.messungen.findIndex(m => Number(m.min) === Number(last));
  if(idx >= 0){
    const r = card.querySelector(`tr[data-row="${idx}"]`);
    if(r) r.classList.add('row-active');
  }
}

function triggerIntervalAlarm(zid){
  const card = document.querySelector(`.zyklus-card[data-zid="${zid}"]`);
  const display = card?.querySelector('[data-role="elapsed"]');

  document.body.classList.remove('screen-flash');
  void document.body.offsetWidth;
  document.body.classList.add('screen-flash');

  if(card){
    card.classList.remove('zyklus-card--alarm');
    void card.offsetWidth;
    card.classList.add('zyklus-card--alarm');
  }

  if(display){
    display.classList.remove('timer-display--alarm');
    void display.offsetWidth;
    display.classList.add('timer-display--alarm');
  }

  void playIntervalBeep();

  setTimeout(() => document.body.classList.remove('screen-flash'), 1800);
  setTimeout(() => {
    if(card) card.classList.remove('zyklus-card--alarm');
    if(display) display.classList.remove('timer-display--alarm');
  }, Math.max(2400, Number(state.settings.alarmDurationSec || 4) * 1000 + 600));
}

function tickTimer(zid){
  const z = getZyklusById(zid);
  const t = timerMap[zid];
  if(!z || !t || !t.running) return;

  const card = document.querySelector(`.zyklus-card[data-zid="${zid}"]`);
  z.elapsedMs = getElapsedMs(zid,z);
  if(card) updateTimerUi(card,z);

  const ints = parseIntervalStr(z.intervalleStr).filter(n => n > 0);
  const passed = ints.filter(iv => z.elapsedMs / 60000 >= iv).length;

  if(passed > t.alarmCount){
    t.alarmCount = passed;
    triggerIntervalAlarm(zid);
  }

  updateFloatingTimerWidget();
  t.raf = requestAnimationFrame(() => tickTimer(zid));
}

function startTimer(zid){
  const z = getZyklusById(zid);
  if(!z) return;

  if(state.settings.alarmSoundEnabled !== false) void unlockAlarmAudio();

  const t = ensureTimer(zid,z);
  if(t.running) return;

  if(!z.startzeit) z.startzeit = formatTimeHHMMSS(new Date());

  const ints = parseIntervalStr(z.intervalleStr).filter(n => n > 0);
  t.alarmCount = ints.filter(iv => t.accumulatedMs / 60000 >= iv).length;
  t.running = true;
  t.startMs = Date.now();

  const card = document.querySelector(`.zyklus-card[data-zid="${zid}"]`);
  updateTimerUi(card,z);
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

  const card = document.querySelector(`.zyklus-card[data-zid="${zid}"]`);
  updateTimerUi(card,z);
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

  const card = document.querySelector(`.zyklus-card[data-zid="${z.id}"]`);
  updateTimerUi(card,z);
  updateFloatingTimerWidget();
  stopFloatingLoopIfIdle();
  saveDraftDebounced();
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

  const card = document.querySelector(`.zyklus-card[data-zid="${z.id}"]`);
  const timerBox = card?.querySelector('.timer-box');

  label.textContent = `Zyklus ${z.nr}`;
  display.textContent = formatElapsed(getElapsedMs(z.id,z));
  wrap.hidden = isElementVisible(timerBox);
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

  const card = document.querySelector(`.zyklus-card[data-zid="${z.id}"]`);
  updateTimerUi(card,z);
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

  sel.innerHTML = `<option value="">— keine ausgewählt —</option>`;

  kalibs.forEach(k => {
    const status = kalibStatus(k);
    const icon = status === 'ok' ? '✅' : status === 'warn' ? '⚠️' : '❌';
    const opt = document.createElement('option');
    opt.value = k.id;
    opt.textContent = `${icon} ${k.displayName} (${k.kalibriertAm})`;
    if(k.id === current) opt.selected = true;
    sel.appendChild(opt);
  });
}

function renderKalibInfo(){
  const box = $('kalibInfoBox');
  const emptyHint = $('kalibEmptyHint');
  const preview = $('kalibPreview');

  if(!box) return;

  const kalib = findKalibById(state.meta.selectedKalibId);

  const setText = (id, value) => {
    const el = $(id);
    if(el) el.textContent = value;
  };

  if(!kalib){
    box.hidden = true;
    if(emptyHint) emptyHint.hidden = false;
    if(preview) preview.hidden = true;
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

  renderKalibPreview();
}

function renderKalibPreview(){
  const wrap = $('kalibPreview');
  const table = $('kalibPreviewTable');
  if(!wrap || !table) return;

  const Pp = Number(state.vorgabe.Pp);
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
      const barCls = v.oor
        ? 'prev-bar prev-bar--oor'
        : v.noKalib
          ? 'prev-bar prev-bar--nokalib'
          : 'prev-bar';
      const barStr = v.bar !== null
        ? fmt(v.bar,1) + ' bar'
        : (v.oor ? '⚠ außerhalb' : '—');

      return `
        <div class="kalib-prev-row">
          <span class="prev-label">${h(v.label)}</span>
          <span class="prev-kn">${knStr}</span>
          <span class="${barCls}">${barStr}</span>
        </div>
      `;
    }).join('')}
  `;
}

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

  const Pp = Number(state.vorgabe.Pp);
  const Pa = Number(state.vorgabe.Pa);
  const P0 = Number(state.vorgabe.P0);

  state.zyklen.forEach(z => {
    const def = ZYKLUS_DEF[z.nr - 1] || ZYKLUS_DEF[0];

    z.laststufen.forEach((ls, lsIdx) => {
      let kN = NaN;

      if(ls.faktor === 0){
        kN = ls.label === 'P0' ? P0 : Pa;
      }else{
        kN = Number.isFinite(Pp) ? Pp * ls.faktor : NaN;
      }

      const bar = kNtoBar(kN);
      ls.druck = bar !== null ? String(bar) : '';
    });

    const haltIdx = def.haltLaststufeIdx ?? (z.laststufen.length - 2);
    const haltLs = z.laststufen[haltIdx];
    let haltKn = NaN;

    if(haltLs){
      haltKn = haltLs.faktor === 0
        ? (haltLs.label === 'P0' ? P0 : Pa)
        : (Number.isFinite(Pp) ? Pp * haltLs.faktor : NaN);
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
   KALIBRIERUNG IMPORT / EXPORT / DELETE
═══════════════════════════════════════════════════════ */
async function handleKalibImport(file){
  if(!file) return;

  try{
    const text = await file.text();
    const raw = JSON.parse(text);
    const list = Array.isArray(raw) ? raw : [raw];

    const valid = list
      .map(k => ({
        ...k,
        gueltigMonate: Number(k.gueltigMonate || 12),
        punkte: Array.isArray(k.punkte)
          ? k.punkte
              .map(p => ({ kN:Number(p.kN), bar:Number(p.bar) }))
              .filter(p => Number.isFinite(p.kN) && Number.isFinite(p.bar))
              .sort((a,b) => a.kN - b.kN)
          : []
      }))
      .filter(k =>
        k.id &&
        k.displayName &&
        k.presseNr &&
        Array.isArray(k.punkte) &&
        k.punkte.length >= 2
      );

    if(!valid.length){
      alert('Keine gültigen Kalibrierungen in der Datei gefunden.\n\nBitte JSON-Format prüfen.');
      return;
    }

    const existing = loadAllKalibs();
    const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));
    const userKalibs = existing.filter(k => !builtinIds.has(k.id));

    let addedCount = 0;
    let updatedCount = 0;
    let lastImportedId = '';

    valid.forEach(k => {
      const idx = userKalibs.findIndex(u => u.id === k.id);
      if(idx >= 0){
        userKalibs[idx] = k;
        updatedCount++;
      }else{
        userKalibs.push(k);
        addedCount++;
      }
      lastImportedId = k.id;
    });

    saveUserKalibs(userKalibs);

    if(lastImportedId){
      state.meta.selectedKalibId = lastImportedId;
    }

    renderPresseDropdown();
    syncMetaToUi();
    renderKalibInfo();
    renderKalibPreview();
    syncDruckFromKalib();
    if(!$('tab-auswertung')?.hidden) renderAuswertung();
    saveDraftDebounced();

    const msg = [];
    if(addedCount) msg.push(`${addedCount} neue Kalibrierung(en) hinzugefügt.`);
    if(updatedCount) msg.push(`${updatedCount} bestehende aktualisiert.`);

    alert('Import erfolgreich!\n' + (msg.join('\n') || 'Kalibrierung geladen.'));
  }catch(e){
    alert('Import fehlgeschlagen: ' + e.message);
    console.error('Kalibrierungs-Importfehler:', e);
  }
}

function handleKalibExport(){
  const id = state.meta.selectedKalibId;
  if(!id){
    alert('Bitte zuerst eine Presse auswählen.');
    return;
  }

  const kalib = findKalibById(id);
  if(!kalib){
    alert('Kalibrierung nicht gefunden.');
    return;
  }

  downloadJson(kalib, `HTB_Kalib_${kalib.presseNr}_${kalib.kalibriertAm}.json`);
}

function handleKalibDelete(){
  const id = state.meta.selectedKalibId;
  if(!id){
    alert('Bitte zuerst eine Presse auswählen.');
    return;
  }

  const kalib = findKalibById(id);
  if(!kalib){
    alert('Kalibrierung nicht gefunden.');
    return;
  }

  const isBuiltin = BUILTIN_KALIBRIERUNGEN.some(k => k.id === id);
  if(isBuiltin){
    alert('Eingebaute Kalibrierungen können nicht gelöscht werden.');
    return;
  }

  if(!confirm(`Kalibrierung "${kalib.displayName}" wirklich löschen?`)) return;

  const existing = loadAllKalibs();
  const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));

  const userKalibs = existing
    .filter(k => !builtinIds.has(k.id))
    .filter(k => k.id !== id);

  saveUserKalibs(userKalibs);

  if(state.meta.selectedKalibId === id){
    state.meta.selectedKalibId = '';
  }

  renderPresseDropdown();
  syncMetaToUi();
  renderKalibInfo();
  renderKalibPreview();
  syncDruckFromKalib();
  saveDraftDebounced();

  alert('Kalibrierung gelöscht.');
}

/* ═══════════════════════════════════════════════════════
   ZYKLUS-RENDERING
═══════════════════════════════════════════════════════ */
function buildLaststufenHtml(z){
  const Pp = Number(state.vorgabe.Pp);
  const Pa = Number(state.vorgabe.Pa);
  const P0 = Number(state.vorgabe.P0);

  return z.laststufen.map((ls,i) => {
    let lastKn = NaN;

    if(ls.label === 'P0'){
      lastKn = P0;
    }else if(ls.faktor === 0){
      lastKn = Pa;
    }else{
      lastKn = Number.isFinite(Pp) ? (Pp * ls.faktor) : NaN;
    }

    return `
      <div class="field">
        <span class="field__label">${h(ls.label)}</span>
        <input class="field__input" data-role="ls-druck" data-idx="${i}" type="number" step="0.1" placeholder="bar" value="${h(ls.druck)}" />
        <span class="hint" style="font-size:11px;text-align:left;margin-top:2px">≈ ${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'} kN</span>
      </div>
    `;
  }).join('');
}

function buildTableRow(z,row,idx){
  const isLast = idx === z.messungen.length - 1;
  return `
    <tr data-row="${idx}">
      <td>
        <div class="minute-cell">
          <input class="mess-input minute-input" data-role="m-min" data-row="${idx}" type="number" step="1" inputmode="numeric" value="${h(row.min)}">
          ${isLast ? `<button class="row-plus" data-role="row-plus" data-row="${idx}" type="button">+</button>` : ''}
        </div>
      </td>
      <td><input class="mess-input" data-role="m-druck" data-row="${idx}" type="number" step="0.1" inputmode="decimal" value="${h(row.druck)}"></td>
      <td><input class="mess-input" data-role="m-ablesung" data-row="${idx}" type="number" step="0.01" inputmode="decimal" value="${h(row.ablesung)}"></td>
      <td><input class="mess-input" data-role="m-versch" data-row="${idx}" type="number" step="0.01" inputmode="decimal" value="${h(row.versch)}"></td>
      <td><button class="row-anm-btn ${row.anm ? 'has-anm' : ''}" data-role="m-anm-btn" data-row="${idx}" type="button" title="${h(row.anm || 'Anmerkung hinzufügen')}">+</button></td>
    </tr>
  `;
}

function buildZyklusHtml(z){
  return `
    <div class="zyklus-card" data-zid="${h(z.id)}">
      <div class="zyklus-card__head">
        <span class="zyklus-badge">Zyklus ${z.nr}</span>
        <span class="zyklus-title">Halt ${z.haltMin} min</span>
        <span class="zyklus-spacer"></span>
        <button class="zyklus-del" data-role="zyklus-del" type="button">Löschen</button>
      </div>

      <div class="zyklus-load-row">${buildLaststufenHtml(z)}</div>

      <div class="interval-row">
        <span class="interval-label">Intervalle [min]</span>
        <input class="field__input" data-role="intervalle" type="text" value="${h(z.intervalleStr)}">
      </div>

      <div class="timer-box">
        <div class="timer-row">
          <div class="timer-display" data-role="elapsed" title="Tippen zum Anpassen">${formatElapsed(z.elapsedMs || 0)}</div>
          <span class="timer-edit-hint">tippen = anpassen</span>
          <div class="timer-buttons">
            <button class="timer-btn timer-btn--start" data-role="timer-start" type="button">Start</button>
            <button class="timer-btn timer-btn--stop" data-role="timer-stop" type="button">Stop</button>
            <button class="timer-btn timer-btn--ghost" data-role="timer-reset" type="button">Reset</button>
          </div>
        </div>
        <div class="timer-info" data-role="startzeit">${z.startzeit ? 'Startzeit: ' + h(z.startzeit) : 'Noch nicht gestartet'}</div>
        <div class="timer-info timer-next" data-role="naechstes"></div>
      </div>

      <div class="table-wrap">
        <table class="mess-table">
          <thead>
            <tr>
              <th class="th-min">Min</th>
              <th class="th-druck">Druck<br><small>bar</small></th>
              <th class="th-mess">Mess&shy;uhr<br><small>mm</small></th>
              <th class="th-versch">Verschieb.<br><small>Anker&shy;kopf [mm]</small></th>
              <th class="th-anm">Anm.</th>
            </tr>
          </thead>
          <tbody>${z.messungen.map((r,i)=>buildTableRow(z,r,i)).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderZyklen(){
  const host = $('zyklenContainer');
  if(!host) return;

  if(!state.zyklen.length){
    host.innerHTML = `<div class="empty-state">Noch kein Lastzyklus angelegt. Über den Plus-Button hinzufügen.</div>`;
    updateFloatingTimerWidget();
    updateLappPreview();
    renderKalibPreview();
    return;
  }

  host.innerHTML = state.zyklen.map(buildZyklusHtml).join('');
  document.querySelectorAll('.zyklus-card').forEach(card => {
    const z = getZyklusById(card.dataset.zid);
    if(z) updateTimerUi(card,z);
  });

  updateFloatingTimerWidget();
  updateLappPreview();
  renderKalibPreview();
}

function hookZyklenDelegation(){
  const host = $('zyklenContainer');
  if(!host || host.dataset.bound === '1') return;
  host.dataset.bound = '1';

  host.addEventListener('input', e => {
    const el = e.target.closest('[data-role]');
    if(!el) return;

    const card = el.closest('.zyklus-card');
    if(!card) return;

    const z = getZyklusById(card.dataset.zid);
    if(!z) return;

    const role = el.dataset.role;
    const idx = Number(el.dataset.row);
    const lsIdx = Number(el.dataset.idx);

    if(role === 'ls-druck'){
      if(z.laststufen[lsIdx]) z.laststufen[lsIdx].druck = el.value;
      saveDraftDebounced();
      return;
    }

    if(role === 'intervalle'){
      z.intervalleStr = el.value;
      reconcileMessungen(z);
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      else renderZyklen();
      saveDraftDebounced();
      return;
    }

    if(role === 'm-min'){
      if(z.messungen[idx]) z.messungen[idx].min = el.value;
      updateLappPreview();
      saveDraftDebounced();
      return;
    }

    if(role === 'm-druck'){
      if(z.messungen[idx]) z.messungen[idx].druck = el.value;
      updateLappPreview();
      saveDraftDebounced();
      return;
    }

    if(role === 'm-ablesung'){
      if(z.messungen[idx]) z.messungen[idx].ablesung = el.value;
      updateLappPreview();
      saveDraftDebounced();
      return;
    }

    if(role === 'm-versch'){
      if(z.messungen[idx]) z.messungen[idx].versch = el.value;
      updateLappPreview();
      if(!$('tab-auswertung')?.hidden) renderAuswertung();
      saveDraftDebounced();
      return;
    }
  });

  host.addEventListener('click', e => {
    const el = e.target.closest('[data-role]');
    if(!el) return;

    const card = el.closest('.zyklus-card');
    if(!card) return;

    const z = getZyklusById(card.dataset.zid);
    if(!z) return;

    const role = el.dataset.role;
    const idx = Number(el.dataset.row);

    if(role === 'timer-start') return startTimer(z.id);
    if(role === 'timer-stop') return stopTimer(z.id);

    if(role === 'timer-reset'){
      if(confirm('Timer zurücksetzen?')) resetTimer(z.id);
      return;
    }

    if(role === 'elapsed') return openTimeAdjustModal(z.id);

    if(role === 'zyklus-del'){
      if(confirm(`Zyklus ${z.nr} löschen?`)){
        state.zyklen = state.zyklen.filter(x => x.id !== z.id);
        delete timerMap[z.id];
        renderZyklen();
        saveDraftDebounced();
      }
      return;
    }

    if(role === 'row-plus'){
      const last = Number(z.messungen[z.messungen.length - 1]?.min || 0);
      const ints = parseIntervalStr(z.intervalleStr);
      const step = ints.length >= 2 ? (ints[ints.length - 1] - ints[ints.length - 2]) : 15;

      z.messungen.push({
        min: last + step,
        druck:'',
        ablesung:'',
        versch:'',
        anm:''
      });

      z.intervalleStr = z.messungen.map(m => m.min).join(', ');

      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      else renderZyklen();

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

function reconcileMessungen(z){
  const ints = parseIntervalStr(z.intervalleStr);
  const map = Object.fromEntries((z.messungen || []).map(m => [Number(m.min), m]));
  z.messungen = ints.map(min => map[min] || {
    min,
    druck:'',
    ablesung:'',
    versch:'',
    anm:''
  });
}

/* ═══════════════════════════════════════════════════════
   BERECHNUNGEN
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
  const Pp = Number(state.vorgabe.Pp);
  const Pa = Number(state.vorgabe.Pa);
  const Et = Number(state.vorgabe.Et);
  const At = Number(state.vorgabe.At);
  const halt = z.haltMin;

  const versch0 = Number(z.messungen[0]?.versch);
  const verschHalt = Number(z.messungen[z.messungen.length - 1]?.versch);
  let dS = NaN;

  const m0 = z.messungen.find(m => Number(m.min) === 0);
  const mH = z.messungen.find(m => Number(m.min) === halt);

  if(m0 && mH && Number.isFinite(Number(m0.versch)) && Number.isFinite(Number(mH.versch))){
    dS = Number(mH.versch) - Number(m0.versch);
  }else if(Number.isFinite(versch0) && Number.isFinite(verschHalt)){
    dS = verschHalt - versch0;
  }

  const haltLs = z.laststufen[ZYKLUS_DEF[z.nr-1]?.haltLaststufeIdx ?? (z.laststufen.length - 2)];
  const lastKn = Number.isFinite(Pp) ? Pp * (haltLs?.faktor || 0) : NaN;
  const Lapp = (haltLs?.faktor === 1.0) ? calcLapp(dS,Pp,Pa,Et,At) : NaN;

  const isB = state.vorgabe.bodenart === 'bindig';
  const tMin = isB ? 60 : 20;
  const tMax = isB ? 180 : 60;
  const krPts = z.messungen
    .filter(m => Number(m.min) >= tMin && Number(m.min) <= tMax)
    .map(m => ({ min:Number(m.min), s_mm:Number(m.versch) }));

  const ks = calcKriechmass(krPts);

  return {
    lastKn,
    dS,
    Lapp,
    ks,
    haltLabel: haltLs?.label || '—'
  };
}

/* ═══════════════════════════════════════════════════════
   DIAGRAMME
═══════════════════════════════════════════════════════ */
function buildLastVerschiebungSvg(z){
  const Pp  = Number(state.vorgabe.Pp);
  const Pa  = Number(state.vorgabe.Pa);
  const Et  = Number(state.vorgabe.Et);
  const At  = Number(state.vorgabe.At);
  const Ltf = Number(state.vorgabe.Ltf);
  const Le  = Number(state.vorgabe.Le);
  const Ltb = Number(state.vorgabe.Ltb);

  const minLapp = 0.8 * Ltf + Le;
  const maxLapp = Ltf + Le + 0.5 * Ltb;

  const m0 = z.messungen.find(m => Number(m.min) === 0);
  const haltMs = z.messungen[z.messungen.length - 1];
  const lastHalt = Pp * (z.laststufen[ZYKLUS_DEF[z.nr-1]?.haltLaststufeIdx ?? (z.laststufen.length-2)]?.faktor || 0);
  const sHalt = Number(haltMs?.versch);

  const W=520,H=300,ml=58,mr=20,mt=20,mb=46,pw=W-ml-mr,ph=H-mt-mb;
  const xMax = Number.isFinite(Pp) ? Pp * 1.1 : 1;
  const sMaxData = Math.max(...z.messungen.map(m => Number(m.versch)).filter(Number.isFinite), 1);
  const yMax = Math.max(sMaxData * 1.2, 5);

  const tx = v => ml + (v / xMax) * pw;
  const ty = v => mt + ph - (v / yMax) * ph;

  function sFor(F,Lapp){
    if(!Number.isFinite(F) || !Number.isFinite(Lapp) || !Number.isFinite(Et) || !Number.isFinite(At)) return NaN;
    return (Lapp * (F - Pa) * 1000) / (Et * At);
  }

  const linePts = [];
  for(let f=Pa;f<=xMax;f+=Math.max(0.1, xMax/40)) linePts.push(f);

  const polyMin = linePts
    .map(f => {
      const s = sFor(f,minLapp);
      return Number.isFinite(s) ? `${tx(f)},${ty(Math.max(0,Math.min(yMax,s)))}` : null;
    })
    .filter(Boolean)
    .join(' ');

  const polyMax = linePts
    .map(f => {
      const s = sFor(f,maxLapp);
      return Number.isFinite(s) ? `${tx(f)},${ty(Math.max(0,Math.min(yMax,s)))}` : null;
    })
    .filter(Boolean)
    .join(' ');

  const xTicks = [0,0.25,0.5,0.75,1].map(p => p * xMax);
  const yTicks = [0,0.25,0.5,0.75,1].map(p => p * yMax);

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${W}" height="${H}" rx="8" fill="#0b1725"/>
    ${yTicks.map(v=>`<line x1="${ml}" y1="${ty(v)}" x2="${W-mr}" y2="${ty(v)}" stroke="rgba(255,255,255,.08)"/><text x="${ml-6}" y="${ty(v)+4}" text-anchor="end" fill="rgba(220,240,255,.7)" font-size="10">${fmt(v,1)}</text>`).join('')}
    ${xTicks.map(v=>`<line x1="${tx(v)}" y1="${mt}" x2="${tx(v)}" y2="${mt+ph}" stroke="rgba(255,255,255,.05)"/><text x="${tx(v)}" y="${H-22}" text-anchor="middle" fill="rgba(220,240,255,.7)" font-size="10">${fmt(v,0)}</text>`).join('')}
    <rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="rgba(255,255,255,.18)"/>
    ${polyMin?`<polyline points="${polyMin}" fill="none" stroke="#56b7ff" stroke-width="2" stroke-dasharray="6 4"/>`:''}
    ${polyMax?`<polyline points="${polyMax}" fill="none" stroke="#ffb45a" stroke-width="2" stroke-dasharray="6 4"/>`:''}
    ${Number.isFinite(lastHalt)&&Number.isFinite(sHalt)?`<circle cx="${tx(lastHalt)}" cy="${ty(sHalt)}" r="5" fill="#f08a1c" stroke="#fff" stroke-width="1.5"/>`:''}
    <text x="${ml+pw/2}" y="${H-4}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Last [kN]</text>
    <text x="14" y="${mt+ph/2}" transform="rotate(-90 14 ${mt+ph/2})" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Verschiebung [mm]</text>
    <g font-size="10">
      <rect x="${W-150}" y="${mt+6}" width="140" height="38" fill="rgba(0,0,0,.45)" stroke="rgba(255,255,255,.18)"/>
      <line x1="${W-140}" y1="${mt+18}" x2="${W-118}" y2="${mt+18}" stroke="#56b7ff" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="${W-114}" y="${mt+22}" fill="#fff">min Lapp = ${fmt(minLapp,2)} m</text>
      <line x1="${W-140}" y1="${mt+34}" x2="${W-118}" y2="${mt+34}" stroke="#ffb45a" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="${W-114}" y="${mt+38}" fill="#fff">max Lapp = ${fmt(maxLapp,2)} m</text>
    </g>
  </svg>`;
}

function buildKriechSvg(z){
  const W=520,H=260,ml=58,mr=20,mt=20,mb=42,pw=W-ml-mr,ph=H-mt-mb;
  const pts = z.messungen
    .filter(m => Number(m.min) > 0 && Number.isFinite(Number(m.versch)))
    .map(m => ({ t:Number(m.min), s:Number(m.versch) }))
    .sort((a,b) => a.t - b.t);

  const tMax = Math.max(...pts.map(p => p.t), z.haltMin || 60);
  const sMin = Math.min(...pts.map(p => p.s), 0);
  const sMax = Math.max(...pts.map(p => p.s), sMin + 1);
  const tMin = 1;

  const tx = t => ml + ((Math.log10(Math.max(t,tMin)) - Math.log10(tMin)) / (Math.log10(tMax) - Math.log10(tMin) || 1)) * pw;
  const ty = s => mt + ph - ((s - sMin) / ((sMax - sMin) || 1)) * ph;
  const poly = pts.map(p => `${tx(p.t)},${ty(p.s)}`).join(' ');
  const ticks = [1,2,5,10,20,30,60,120,180].filter(t => t <= tMax * 1.2);

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${W}" height="${H}" rx="8" fill="#0b1725"/>
    ${ticks.map(t=>`<line x1="${tx(t)}" y1="${mt}" x2="${tx(t)}" y2="${mt+ph}" stroke="rgba(255,255,255,.08)"/><text x="${tx(t)}" y="${H-20}" text-anchor="middle" fill="rgba(220,240,255,.7)" font-size="10">${t}</text>`).join('')}
    <rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="rgba(255,255,255,.18)"/>
    ${pts.length?`<polyline points="${poly}" fill="none" stroke="#f08a1c" stroke-width="2"/>`:''}
    ${pts.map(p=>`<circle cx="${tx(p.t)}" cy="${ty(p.s)}" r="3" fill="#f08a1c"/>`).join('')}
    <text x="${ml+pw/2}" y="${H-4}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">log Zeit [min]</text>
    <text x="14" y="${mt+ph/2}" transform="rotate(-90 14 ${mt+ph/2})" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Verschiebung [mm]</text>
  </svg>`;
}

/* ═══════════════════════════════════════════════════════
   AUSWERTUNG
═══════════════════════════════════════════════════════ */
function renderAuswertung(){
  const host = $('auswertungContainer');
  if(!host) return;

  collectVorgabeFromUi();

  if(!state.zyklen.length){
    host.innerHTML = `<div class="empty-state">Noch keine Lastzyklen vorhanden.</div>`;
    return;
  }

  const isB = state.vorgabe.bodenart === 'bindig';
  const ksLimit = 2;

  host.innerHTML = state.zyklen.map(z => {
    const k = getZyklusKpis(z);
    const Ltf = Number(state.vorgabe.Ltf);
    const Le  = Number(state.vorgabe.Le);
    const Ltb = Number(state.vorgabe.Ltb);
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
   EXPORT / IMPORT
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

/* ═══════════════════════════════════════════════════════
   PDF EXPORT
═══════════════════════════════════════════════════════ */
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
    ['Bauvorhaben', meta.bauvorhaben || ''],
    ['Bauherr', meta.bauherr || ''],
    ['Anker Nr.', meta.ankerNr || ''],
    ['Ankerlage', meta.ankerlage || ''],
    ['Prüfdatum', dateDE(meta.pruefdatum)],
    ['Bodenart', vor.bodenart || ''],
    ['Ankertyp', vor.ankertyp || ''],
    ['LA / Ltb / Ltf / Le [m]', `${vor.LA || ''} / ${vor.Ltb || ''} / ${vor.Ltf || ''} / ${vor.Le || ''}`],
    ['Pp / Pa [kN]', `${vor.Pp || ''} / ${vor.Pa || ''}`],
    ['Et / At', `${vor.Et || ''} kN/mm² / ${vor.At || ''} mm²`]
  ];

  page.drawText('Stammdaten & Vorgabe', { x:30, y, size:12, font:fontB, color:rgb(0,0,0) });
  y -= 16;

  lines.forEach(([k,v]) => {
    page.drawText(`${k}:`, { x:30, y, size:9, font:fontB });
    page.drawText(String(v), { x:160, y, size:9, font });
    y -= 12;
  });

  y -= 10;
  page.drawText('Lastzyklen', { x:30, y, size:12, font:fontB });
  y -= 14;

  (snap.zyklen || []).forEach(z => {
    if(y < 140){
      page = pdf.addPage([595.28,841.89]);
      y = H - 50;
    }

    page.drawText(`Zyklus ${z.nr} · Halt ${z.haltMin} min`, { x:30, y, size:10, font:fontB });
    y -= 12;
    page.drawText('Min   Druck   Mess.   Verschieb.   Anm.', { x:30, y, size:8, font:fontB });
    y -= 10;

    z.messungen.forEach(m => {
      if(y < 80){
        page = pdf.addPage([595.28,841.89]);
        y = H - 50;
      }

      page.drawText(
        `${String(m.min).padEnd(5)} ${String(m.druck || '').padEnd(7)} ${String(m.ablesung || '').padEnd(7)} ${String(m.versch || '').padEnd(11)} ${m.anm || ''}`,
        { x:30, y, size:8, font }
      );
      y -= 10;
    });

    y -= 6;
  });

  const fil = FILIALEN[meta.filiale] || {};
  const pages = pdf.getPages();

  pages.forEach(p => {
    p.drawRectangle({ x:0, y:0, width:W, height:30, color:rgb(0.05,0.18,0.31) });
    p.drawText(`HTB Baugesellschaft m.b.H. – Filiale ${meta.filiale || '—'}`, {
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
  loadDraft();

  syncMetaToUi();
  syncVorgabeToUi();
  renderZyklen();
  updateLappPreview();
  renderHistoryList();
  renderPresseDropdown();
  syncMetaToUi();
  renderKalibInfo();
  renderKalibPreview();

  if(state.meta.selectedKalibId){
    syncDruckFromKalib();
  }

  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab))
  );

  META_FIELDS.forEach(([id,k]) => {
    const el = $(id);
    el?.addEventListener('input', () => {
      state.meta[k] = el.value;
      saveDraftDebounced();
    });
  });

  VOR_FIELDS.forEach(k => {
    const el = $('vor-' + k);
    if(!el) return;

    el.addEventListener('input', () => {
      state.vorgabe[k] = el.value || '';
      maybeAutofillVorgabe(k);
      updateLappPreview();
      renderKalibPreview();

      if(findKalibById(state.meta.selectedKalibId)){
        syncDruckFromKalib();
      }else{
        renderZyklen();
      }

      if(!$('tab-auswertung')?.hidden) renderAuswertung();
      saveDraftDebounced();
    });
  });

  $('boden-bindig')?.addEventListener('change', () => {
    state.vorgabe.bodenart = 'bindig';
    if(!$('tab-auswertung')?.hidden) renderAuswertung();
    saveDraftDebounced();
  });

  $('boden-nichtbindig')?.addEventListener('change', () => {
    state.vorgabe.bodenart = 'nichtbindig';
    if(!$('tab-auswertung')?.hidden) renderAuswertung();
    saveDraftDebounced();
  });

  $('btnAddZyklus')?.addEventListener('click', () => {
    const nr = Math.min(5, state.zyklen.length + 1);
    state.zyklen.push(defaultZyklus(nr));
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
      if(t.raf) cancelAnimationFrame(t.raf);
      delete timerMap[k];
    });

    syncMetaToUi();
    syncVorgabeToUi();
    renderPresseDropdown();
    syncMetaToUi();
    renderKalibInfo();
    renderKalibPreview();
    renderZyklen();
    updateLappPreview();
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
    const s = buildTemplateSnapshot();
    downloadJson(s, `${dateTag()}_HTB_Anker_Vorlage.htbanker.json`);
  });

  $('btnImportTemplate')?.addEventListener('click', () => $('importFileInput')?.click());
  $('importFileInput')?.addEventListener('change', async e => {
    const f = e.target.files?.[0];
    if(!f) return;
    try{
      const t = await f.text();
      applySnapshot(JSON.parse(t), true);
      saveDraftDebounced();
      alert('Vorlage importiert.');
    }catch{
      alert('Import fehlgeschlagen.');
    }finally{
      e.target.value = '';
    }
  });

  $('btnExportFull')?.addEventListener('click', () =>
    downloadJson(collectSnapshot(), `${dateTag()}_HTB_Anker_Export.json`)
  );

  $('btnImportFull')?.addEventListener('click', () => $('importFullInput')?.click());
  $('importFullInput')?.addEventListener('change', async e => {
    const f = e.target.files?.[0];
    if(!f) return;
    try{
      const t = await f.text();
      applySnapshot(JSON.parse(t), true);
      saveDraftDebounced();
      alert('Vollständig importiert.');
    }catch{
      alert('Import fehlgeschlagen.');
    }finally{
      e.target.value = '';
    }
  });

  /* ── PRESSE & KALIBRIERUNG ── */
  $('presseSelect')?.addEventListener('change', e => {
    state.meta.selectedKalibId = e.target.value;
    renderKalibInfo();
    renderKalibPreview();
    syncDruckFromKalib();
    if(!$('tab-auswertung')?.hidden) renderAuswertung();
    saveDraftDebounced();
  });

  $('btnKalibImport')?.addEventListener('click', () => {
    $('kalibImportInput')?.click();
  });

  $('kalibImportInput')?.addEventListener('change', async e => {
    await handleKalibImport(e.target.files?.[0]);
    e.target.value = '';
  });

  $('btnKalibExport')?.addEventListener('click', handleKalibExport);
  $('btnKalibDelete')?.addEventListener('click', handleKalibDelete);

  installAudioUnlock();
  updateAlarmSoundButton();

  $('timeAdjustInput')?.addEventListener('input', updateTimeAdjustPreview);

  document.querySelectorAll('.modal-adj-btn').forEach(b =>
    b.addEventListener('click', () => {
      const input = $('timeAdjustInput');
      if(!input) return;
      input.value = String(Number(input.value || 0) + Number(b.dataset.adj || 0));
      updateTimeAdjustPreview();
    })
  );

  $('timeAdjustApply')?.addEventListener('click', applyTimeAdjustment);
  $('timeAdjustCancel')?.addEventListener('click', closeTimeAdjustModal);
  $('timeAdjustModal')?.addEventListener('click', e => {
    if(e.target.id === 'timeAdjustModal') closeTimeAdjustModal();
  });

  $('floatingTimer')?.addEventListener('click', () => {
    const z = getFirstRunningZyklus();
    if(z) openTimeAdjustModal(z.id);
  });

  hookHistoryDelegation();

  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if($('btnInstall')) $('btnInstall').hidden = false;
  });

  $('btnInstall')?.addEventListener('click', async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    if($('btnInstall')) $('btnInstall').hidden = true;
  });

  if('serviceWorker' in navigator){
    navigator.serviceWorker
      .register(`${BASE_PATH}sw.js?v=1`)
      .then(reg => {
        console.log('[Anker] SW registriert, scope:', reg.scope);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if(newWorker.state === 'installed' && navigator.serviceWorker.controller){
              showUpdateBanner();
            }
          });
        });
      })
      .catch(err => console.error('[Anker] SW Fehler:', err));

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if(!refreshing){
        refreshing = true;
        location.reload();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
