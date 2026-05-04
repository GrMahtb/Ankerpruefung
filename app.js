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

/* ---------------- dom helpers ---------------- */
const $ = id => document.getElementById(id);
const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => [...root.querySelectorAll(sel)];

/* ---------------- generic helpers ---------------- */
function clone(v){ return JSON.parse(JSON.stringify(v)); }

function h(v){
  return String(v ?? '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function fmt(v, d=2){
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(d).replace('.', ',') : '—';
}

function clamp(n, min, max){
  const x = Number(n);
  if(!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function formatInputNumber(n, d=1){
  if(!Number.isFinite(n)) return '';
  return n.toFixed(d)
    .replace(/\.0+$/,'')
    .replace(/(\.\d*[1-9])0+$/,'$1');
}

function parseIntervalStr(str){
  return [...new Set(
    String(str || '')
      .split(',')
      .map(s => Number(String(s).trim()))
      .filter(n => Number.isFinite(n) && n >= 0)
  )].sort((a,b) => a-b);
}

function normalizeCsvDate(value){
  const s = String(value || '').trim();
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
  if(s.includes(',') && s.includes('.')) return Number(s.replace(/\./g, '').replace(',', '.'));
  if(s.includes(',')) return Number(s.replace(',', '.'));
  return Number(s);
}

function dateDE(iso){
  const s = String(iso || '').trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : s;
}

function dateTag(d=new Date()){
  return `${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${d.getFullYear()}`;
}

function formatElapsed(ms){
  const t = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(t / 3600);
  const mm = Math.floor((t % 3600) / 60);
  const ss = t % 60;
  return hh > 0
    ? `${hh}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
    : `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

function uid(){
  try{ return crypto.randomUUID(); }
  catch{ return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`; }
}

/* ---------------- storage helpers ---------------- */
function readStorage(key, fallback=null){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch{
    return fallback;
  }
}

function writeStorage(key, value){
  try{
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }catch{
    return false;
  }
}

function readHistory(){
  const list = readStorage(STORAGE_HISTORY, []);
  return Array.isArray(list) ? list : [];
}

function writeHistory(list){
  const safe = Array.isArray(list) ? list.slice(0, HISTORY_MAX) : [];
  writeStorage(STORAGE_HISTORY, safe);
}

function readUserKalibs(){
  const list = readStorage(STORAGE_KALIB, []);
  return Array.isArray(list) ? list : [];
}

function writeUserKalibs(list){
  writeStorage(STORAGE_KALIB, Array.isArray(list) ? list : []);
}

/* ---------------- calibration helpers ---------------- */
function sortKalibPunkte(punkte){
  return (Array.isArray(punkte) ? punkte : [])
    .map(p => ({ kN: toNumFlexible(p.kN), bar: toNumFlexible(p.bar) }))
    .filter(p => Number.isFinite(p.kN) && Number.isFinite(p.bar))
    .sort((a,b) => a.kN - b.kN);
}

function sanitizeKalib(kalib){
  const out = {
    id: kalib?.id || uid(),
    displayName: String(kalib?.displayName || '').trim(),
    presseTyp: String(kalib?.presseTyp || '').trim(),
    presseNr: String(kalib?.presseNr || '').trim(),
    manometerTyp: String(kalib?.manometerTyp || '').trim(),
    manometerNr: String(kalib?.manometerNr || '').trim(),
    kalibriertAm: normalizeCsvDate(kalib?.kalibriertAm || ''),
    gueltigMonate: clamp(Number(kalib?.gueltigMonate || 12), 1, 120),
    punkte: sortKalibPunkte(kalib?.punkte || [])
  };

  if(!out.displayName){
    out.displayName = [out.presseTyp, out.presseNr].filter(Boolean).join(' ').trim() || `Kalibrierung ${out.id}`;
  }

  return out;
}

function loadAllKalibs(){
  const map = new Map();

  BUILTIN_KALIBRIERUNGEN
    .map(sanitizeKalib)
    .forEach(k => map.set(k.id, k));

  readUserKalibs()
    .map(sanitizeKalib)
    .forEach(k => map.set(k.id, k));

  return [...map.values()].sort((a,b) => {
    const aa = String(a.displayName || '').toLowerCase();
    const bb = String(b.displayName || '').toLowerCase();
    return aa.localeCompare(bb, 'de');
  });
}

function findKalibById(id){
  if(!id) return null;
  return loadAllKalibs().find(k => k.id === id) || null;
}

function upsertKalib(kalib){
  const safe = sanitizeKalib(kalib);
  const list = readUserKalibs().filter(k => k.id !== safe.id);
  list.unshift(safe);
  writeUserKalibs(list);
  return safe;
}

function removeKalibById(id){
  writeUserKalibs(readUserKalibs().filter(k => k.id !== id));
}

function addMonths(date, months){
  const d = new Date(date);
  if(Number.isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + Number(months || 0));
  return d;
}

function kalibGueltigBis(kalib){
  if(!kalib?.kalibriertAm) return null;
  return addMonths(kalib.kalibriertAm, kalib.gueltigMonate || 12);
}

function kalibStatus(kalib){
  const bis = kalibGueltigBis(kalib);
  if(!bis) return 'warn';

  const today = new Date();
  today.setHours(0,0,0,0);

  const diffDays = Math.floor((bis - today) / 86400000);
  if(diffDays < 0) return 'bad';
  if(diffDays <= 30) return 'warn';
  return 'ok';
}

function lookupStuetzpunkt(kN, punkte){
  const value = toNumFlexible(kN);
  const pts = sortKalibPunkte(punkte);

  if(!Number.isFinite(value) || !pts.length){
    return { bar:null, exact:false, oor:false, basisKn:null };
  }

  const exact = pts.find(p => Math.abs(p.kN - value) < 0.0001);
  if(exact){
    return { bar: exact.bar, exact:true, oor:false, basisKn:exact.kN };
  }

  // Prinzip: besser zu hoch geprüft als zu gering
  // => immer auf den nächsthöheren verfügbaren Stützpunkt gehen
  const nextHigher = pts.find(p => p.kN >= value);
  if(nextHigher){
    return { bar: nextHigher.bar, exact:false, oor:false, basisKn:nextHigher.kN };
  }

  // Oberhalb des größten Stützpunktes => außerhalb des Kalibrierbereichs
  return { bar:null, exact:false, oor:true, basisKn:null };
}

function kNtoBar(kN, kalibId=null){
  const selectedId = kalibId || state?.meta?.selectedKalibId || '';
  const kalib = findKalibById(selectedId);
  if(!kalib) return null;
  return lookupStuetzpunkt(kN, kalib.punkte).bar;
}

function normalizeCsvKey(key){
  return String(key || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'');
}

function buildKalibCsvTemplate(){
  return [
    'displayName;Beispiel Presse',
    'presseTyp;L-HK-DZ-140-250-105-HPR',
    'presseNr;NC123456',
    'manometerTyp;DSI 160/1000',
    'manometerNr;300177',
    'kalibriertAm;2026-01-26',
    'gueltigMonate;12',
    '',
    'kN;bar',
    '5;3',
    '10;5',
    '20;10',
    '50;26',
    '100;51'
  ].join('\n');
}

function kalibToCsv(kalib){
  const k = sanitizeKalib(kalib);
  return [
    `displayName;${k.displayName}`,
    `presseTyp;${k.presseTyp}`,
    `presseNr;${k.presseNr}`,
    `manometerTyp;${k.manometerTyp}`,
    `manometerNr;${k.manometerNr}`,
    `kalibriertAm;${k.kalibriertAm}`,
    `gueltigMonate;${k.gueltigMonate}`,
    '',
    'kN;bar',
    ...k.punkte.map(p => `${String(p.kN).replace('.', ',')};${String(p.bar).replace('.', ',')}`)
  ].join('\n');
}

function parseKalibCsvText(text){
  const lines = String(text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const kalib = {
    id: uid(),
    displayName: '',
    presseTyp: '',
    presseNr: '',
    manometerTyp: '',
    manometerNr: '',
    kalibriertAm: '',
    gueltigMonate: 12,
    punkte: []
  };

  for(const line of lines){
    if(line.startsWith('#')) continue;

    const sep = line.includes(';') ? ';' : (line.includes('\t') ? '\t' : ',');
    const parts = line.split(sep).map(s => s.trim());
    if(parts.length < 2) continue;

    const n1 = toNumFlexible(parts[0]);
    const n2 = toNumFlexible(parts[1]);

    if(Number.isFinite(n1) && Number.isFinite(n2)){
      kalib.punkte.push({ kN:n1, bar:n2 });
      continue;
    }

    const key = normalizeCsvKey(parts[0]);
    const value = parts.slice(1).join(' ').trim();

    if(key === 'displayname') kalib.displayName = value;
    else if(key === 'pressetyp') kalib.presseTyp = value;
    else if(key === 'pressenr' || key === 'pressnr') kalib.presseNr = value;
    else if(key === 'manometertyp') kalib.manometerTyp = value;
    else if(key === 'manometernr') kalib.manometerNr = value;
    else if(key === 'kalibriertam') kalib.kalibriertAm = normalizeCsvDate(value);
    else if(key === 'gueltigmonate') kalib.gueltigMonate = clamp(Number(value || 12), 1, 120);
    else if(key === 'id') kalib.id = value || kalib.id;
  }

  const safe = sanitizeKalib(kalib);
  if(!safe.punkte.length){
    throw new Error('CSV enthält keine gültigen Stützpunkte.');
  }
  return safe;
}

function importKalibrierungCsvText(text){
  const kalib = parseKalibCsvText(text);
  const saved = upsertKalib(kalib);
  state.meta.selectedKalibId = saved.id;
  return saved;
}

function handleKalibDelete(){
  const id = state.meta.selectedKalibId;
  if(!id) return;

  const kalib = findKalibById(id);
  if(!kalib) return;

  const isBuiltin = BUILTIN_KALIBRIERUNGEN.some(x => x.id === id);
  if(isBuiltin){
    alert('Integrierte Kalibrierungen können nicht gelöscht werden.');
    return;
  }

  if(!confirm(`Kalibrierung "${kalib.displayName}" löschen?`)) return;

  removeKalibById(id);
  state.meta.selectedKalibId = '';
}

/* ---------------- dynamic style tweaks ---------------- */
function ensureDynamicStyles(){
  if(document.getElementById('app-dynamic-style-v20')) return;

  const style = document.createElement('style');
  style.id = 'app-dynamic-style-v20';
  style.textContent = `
    html{
      -webkit-text-size-adjust:100%;
      background:#6d6d72 !important;
    }

    body{
      background:#6d6d72 !important;
      color:#fff !important;
    }

    .brand,
    .brand__bar,
    .tabs,
    .pane{
      background:#6d6d72 !important;
      color:#fff !important;
      box-shadow:none !important;
    }

    .card,
    .timer-box,
    .modal-box,
    .photo-box,
    .settings-group,
    .historyItem,
    .auswertung-block,
    .table-wrap,
    .info-box,
    .kalib-preview{
      background:rgba(54,54,58,.92) !important;
      color:#fff !important;
      border-color:rgba(255,255,255,.14) !important;
    }

    .brand__subtitle,
    .hint,
    .field__hint,
    .timer-edit-hint,
    .kalib-info__sub{
      color:rgba(255,255,255,.74) !important;
    }

    .tab,
    .btn,
    .timer-btn,
    .btn-plus{
      border-color:rgba(255,255,255,.18) !important;
    }

    .tab.is-active,
    .btn--save,
    .timer-btn--start,
    .btn-plus{
      background:#3d3d41 !important;
      color:#fff !important;
      border-color:#d4d4d8 !important;
    }

    .btn--ghost,
    .timer-btn--ghost,
    .timer-btn--stop,
    .btn--danger{
      background:#4a4a4f !important;
      color:#fff !important;
      border-color:#d4d4d8 !important;
    }

    .field__input,
    .field__select,
    .field__textarea,
    .mess-input,
    .modal-input{
      font-size:16px !important;
      background:rgba(255,255,255,.06) !important;
      color:#fff !important;
      border-color:rgba(255,255,255,.18) !important;
    }

    .field__input::placeholder{
      color:rgba(255,255,255,.48) !important;
    }

    .field__input--required, .field__select--required, .field__textarea--required{
      background: rgba(255,255,255,.08) !important;
      border-color: rgba(255,255,255,.42) !important;
    }

    .field__input--computed{
      color:#f2f2f4 !important;
      font-weight:800 !important;
    }

    .mess-table{
      width:100%;
      table-layout:fixed;
      border-collapse:collapse;
    }

    .mess-table th,
    .mess-table td{
      padding:2px 3px !important;
      vertical-align:middle;
    }

    .mess-stage-col, .th-stage{
      width:30px !important;
      min-width:30px !important;
      max-width:30px !important;
      text-align:center;
      font-size:9px;
      padding-left:2px !important;
      padding-right:2px !important;
    }

    .mess-load-col, .th-load{
      width:42px !important;
      min-width:42px !important;
      max-width:42px !important;
      text-align:center;
      font-size:9px;
      padding-left:2px !important;
      padding-right:2px !important;
    }

    .mess-druck-col, .th-druck{
      width:48px !important;
      min-width:48px !important;
      max-width:48px !important;
      text-align:center;
      font-size:9px;
      padding-left:2px !important;
      padding-right:2px !important;
    }

    .th-min{
      width:48px !important;
      min-width:48px !important;
      max-width:48px !important;
    }

    .th-mess{
      width:120px !important;
      min-width:120px !important;
    }

    .th-versch{
      width:78px !important;
      min-width:78px !important;
    }

    .th-anm{
      width:40px !important;
      min-width:40px !important;
      max-width:40px !important;
    }

    .mess-stage-pill{
      font-size:9px !important;
      line-height:1.1 !important;
      padding:1px 2px !important;
      border-radius:4px;
      background:rgba(255,255,255,.10) !important;
      color:#fff !important;
    }

    .mess-table .minute-cell{
      min-width:52px;
      display:flex;
      align-items:center;
      gap:3px;
    }

    .mess-table .minute-input{
      min-width:44px;
      width:44px;
    }

    .mess-table [data-role="row-ablesung"]{
      min-width:112px;
      width:112px;
      font-size:16px !important;
      font-weight:700;
    }

    .mess-table [data-role="row-versch"]{
      min-width:72px;
      width:72px;
    }

    .mess-table [data-role="stage-druck"]{
      width:100%;
    }

    .zyklus-load-row{
      display:flex;
      gap:6px;
      flex-wrap:wrap;
    }

    .zyklus-load-row .field{
      min-width:64px !important;
      width:64px !important;
    }

    .field--stage-druck .hint{
      text-align:center !important;
      font-size:10px !important;
    }

    .row-active td{
      background: rgba(255,255,255,.08) !important;
    }

    .row-active .mess-stage-pill{
      background: rgba(255,255,255,.16) !important;
      box-shadow: 0 0 0 1px rgba(255,255,255,.24) inset;
    }

    .current-measurement{
      border:2px solid #d7d7dc !important;
      box-shadow:0 0 0 3px rgba(255,255,255,.12) !important;
      background:rgba(255,255,255,.08) !important;
      animation:currentFieldPulse 1.2s ease-in-out infinite;
    }

    @keyframes currentFieldPulse{
      0%   { box-shadow:0 0 0 0 rgba(255,255,255,.22); }
      70%  { box-shadow:0 0 0 6px rgba(255,255,255,0); }
      100% { box-shadow:0 0 0 0 rgba(255,255,255,0); }
    }

    body[data-layout-mode="tablet"] .pane{
      max-width:1100px;
      margin:0 auto;
      padding-left:10px;
      padding-right:10px;
    }

    body[data-layout-mode="desktop"] .pane{
      max-width:1440px;
      margin:0 auto;
      padding-left:14px;
      padding-right:14px;
    }

    body[data-layout-mode="tablet"] .form-grid{
      grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
    }

    body[data-layout-mode="desktop"] .form-grid{
      grid-template-columns:repeat(3, minmax(0, 1fr)) !important;
    }

    body[data-layout-mode="tablet"] .field--full,
    body[data-layout-mode="desktop"] .field--full{
      grid-column:1 / -1 !important;
    }

    body[data-layout-mode="tablet"] .photo-grid,
    body[data-layout-mode="desktop"] .photo-grid{
      display:grid;
      grid-template-columns:repeat(2, minmax(0, 1fr));
      gap:12px;
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
  if(!stage) return makeStageDef('pa', 0, [1]);

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
alarmSoundEnabled:true,
layoutMode:'auto'
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

/* ---------------- basic model helpers ---------------- */
function getTest(key){
  return state.tests[key];
}

function getAnkertypByKey(key){
  return TYPE_LIBRARY.find(t => t.key === key) || null;
}

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

function getActiveTestKey(){
  return TEST_KEYS.includes(state.activeTest) ? state.activeTest : 'eignung';
}

function getEvalTestKey(){
  return TEST_KEYS.includes(state.evalTest) ? state.evalTest : 'eignung';
}
/* ---------------- labels ---------------- */
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

/* ---------------- type rendering ---------------- */
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

/* ---------------- calculation helpers ---------------- */
function calcStageLoad(stage, testKey){
  const s = getTest(testKey).spec;
  const Pp = toNumFlexible(s.Pp);
  const P0 = toNumFlexible(s.P0);
  const Pa = toNumFlexible(s.Pa);

  if(stage.kind === 'p0') return Number.isFinite(P0) ? P0 : NaN;
  if(stage.kind === 'pa') return Number.isFinite(Pa) ? Pa : NaN;
  return Number.isFinite(Pp) ? Pp * Number(stage.factor || 0) : NaN;
}

function getCycleTotalDisplacement(cycle){
  let cum = 0;
  for(const row of cycle.rows || []){
    const v = toNumFlexible(row.versch);
    if(Number.isFinite(v)) cum += v;
  }
  return cum;
}

function calcLapp(deltaS_mm, Pp_kN, Pa_kN, Et_kNmm2, At_mm2){
  const dF = Pp_kN - Pa_kN;
  if(!Number.isFinite(deltaS_mm) || !Number.isFinite(dF) || dF <= 0 || !Number.isFinite(Et_kNmm2) || !Number.isFinite(At_mm2)) return NaN;
  return (deltaS_mm * Et_kNmm2 * At_mm2) / (dF * 1000);
}

function getMeasuredLappInfo(testKey){
  if(testKey !== 'eignung') return { measuredLapp:NaN, measuredCycle:null };

  const test = getTest(testKey);
  const Pp = toNumFlexible(test.spec.Pp);
  const Pa = toNumFlexible(test.spec.Pa);
  const Et = toNumFlexible(test.spec.Et);
  const At = toNumFlexible(test.spec.At);

  for(const cycle of test.cycles){
    const holdIdx = Number.isInteger(cycle.holdStageIdx) ? cycle.holdStageIdx : 0;
    const holdStage = cycle.stageDefs?.[holdIdx];
    if(!holdStage) continue;

    const load = calcStageLoad(holdStage, testKey);
    if(!Number.isFinite(load) || !Number.isFinite(Pp)) continue;
    if(Math.abs(load - Pp) > 0.001) continue;

    const dS = getCycleTotalDisplacement(cycle);
    const measuredLapp = calcLapp(dS, Pp, Pa, Et, At);
    if(Number.isFinite(measuredLapp)){
      return { measuredLapp, measuredCycle:cycle.nr };
    }
  }

  return { measuredLapp:NaN, measuredCycle:null };
}

function getSpecSummary(testKey){
  const test = getTest(testKey);
  const s = test.spec;

  if(testKey === 'eignung'){
    const Pd = toNumFlexible(s.Pd);
    const gamma = toNumFlexible(s.gamma);
    const Pp = toNumFlexible(s.Pp);
    const Pa = toNumFlexible(s.Pa);
    const Et = toNumFlexible(s.Et);
    const At = toNumFlexible(s.At);
    const Ltf = toNumFlexible(s.Ltf);
    const Le = toNumFlexible(s.Le);
    const Ltb = toNumFlexible(s.Ltb);

    const calcPp = Number.isFinite(Pd) && Number.isFinite(gamma) ? Pd * gamma : NaN;
    const minLapp = Number.isFinite(Ltf) && Number.isFinite(Le) ? (0.8 * Ltf + Le) : NaN;
    const maxLapp = Number.isFinite(Ltf) && Number.isFinite(Le) && Number.isFinite(Ltb) ? (Ltf + Le + 0.5 * Ltb) : NaN;
    const sGrenzA = Number.isFinite(minLapp) ? calcLapp(minLapp * 1000, Pp, Pa, Et, At) : NaN;
    const sGrenzB = Number.isFinite(maxLapp) ? calcLapp(maxLapp * 1000, Pp, Pa, Et, At) : NaN;

    const measured = getMeasuredLappInfo(testKey);

    return {
      calcPp,
      minLapp,
      maxLapp,
      sGrenzA,
      sGrenzB,
      measuredLapp: measured.measuredLapp,
      measuredCycle: measured.measuredCycle
    };
  }

  const Pd = toNumFlexible(s.Pd);
  const k = toNumFlexible(s.k);
  const calcPp = Number.isFinite(Pd) && Number.isFinite(k) ? Pd * k : NaN;

  return {
    calcPp
  };
}

/* ---------------- pressure preview rendering ---------------- */
function getPreviewStages(testKey){
  const test = getTest(testKey);
  const out = [];
  const seen = new Set();

  for(const cycle of test.cycles){
    for(const rawStage of cycle.stageDefs || []){
      const stage = normalizeStageDef(rawStage);
      const key = `${stage.kind}|${stage.label}|${stage.factor}|${stage.intervalsStr}`;
      if(seen.has(key)) continue;
      seen.add(key);

      const kN = calcStageLoad(stage, testKey);
      const lookup = findKalibById(state.meta.selectedKalibId)
        ? lookupStuetzpunkt(kN, findKalibById(state.meta.selectedKalibId).punkte)
        : { bar:null, exact:false, oor:false, basisKn:null };

      out.push({
        label: stage.label,
        kN,
        bar: lookup.bar,
        exact: lookup.exact,
        oor: lookup.oor,
        basisKn: lookup.basisKn
      });
    }
  }

  return out;
}

function renderStutzpunkteControl(testKey){
  return `
    <div id="kalibStuetzpunkteWrap-${testKey}" hidden style="margin-top:14px">
      <div class="settings-group__title" style="margin-bottom:6px">
        Stützpunkte-Kontrolle
        <span style="font-weight:400; font-size:12px; color:rgba(220,235,250,.7)">
          — exakte CSV-Werte, keine Interpolation
        </span>
      </div>

      <label class="field">
        <span class="field__label">Stützpunkt auswählen</span>
        <select id="kalibStuetzpunkteSelect-${testKey}" class="field__select">
          <option value="">Stützpunkt auswählen …</option>
        </select>
      </label>

      <div id="kalibStuetzpunkteResult-${testKey}" class="stuetz-result"></div>
    </div>
  `;
}

function renderPressSection(testKey){
  return `
    <details class="card card--collapsible" open>
      <summary class="card__title">Presse / Kalibrierung</summary>
      <div class="card__body">
        <div class="form-grid">
          <label class="field field--full">
            <span class="field__label">Spannpresse auswählen</span>
            <select id="presseSelect-${testKey}" class="field__select" data-role="kalib-select" data-test="${testKey}"></select>
          </label>
        </div>

        <div class="action-row" style="justify-content:flex-start; margin-top:12px; gap:8px; flex-wrap:wrap">
          <button id="btnKalibImport-${testKey}" class="btn btn--ghost btn--small" type="button">📥 CSV importieren</button>
          <button id="btnKalibExport-${testKey}" class="btn btn--ghost btn--small" type="button">📤 CSV exportieren / Vorlage</button>
          <button id="btnKalibDelete-${testKey}" class="btn btn--danger btn--small" type="button">🗑 Kalibrierung löschen</button>
          <input id="kalibImportInput-${testKey}" type="file" accept=".csv,text/csv" style="display:none" />
        </div>

        <p id="kalibEmptyHint-${testKey}" class="hint" style="text-align:left; margin-top:10px">
          Noch keine Presse ausgewählt. CSV importieren oder Presse aus der Liste wählen.
        </p>

        <div id="kalibInfoBox-${testKey}" class="settings-group kalib-info" hidden style="margin-top:12px">
          <div class="kalib-info__header">
            <div>
              <div id="kalibName-${testKey}" class="kalib-info__name">—</div>
              <div id="kalibSub-${testKey}" class="kalib-info__sub">—</div>
            </div>
            <div id="kalibValidBadge-${testKey}" class="kalib-badge">—</div>
          </div>

          <div class="kalib-info__grid">
            <div class="kalib-info__item"><div class="kalib-info__label">Pressentyp</div><div id="kInfo-presseTyp-${testKey}" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Pressen-Nr.</div><div id="kInfo-presseNr-${testKey}" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Manometertyp</div><div id="kInfo-manTyp-${testKey}" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Manometer-Nr.</div><div id="kInfo-manNr-${testKey}" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Kalibriert am</div><div id="kInfo-kalibAm-${testKey}" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Gültig bis</div><div id="kInfo-gueltigBis-${testKey}" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Stützpunkte</div><div id="kInfo-punkte-${testKey}" class="kalib-info__val">—</div></div>
            <div class="kalib-info__item"><div class="kalib-info__label">Max. Last</div><div id="kInfo-maxKn-${testKey}" class="kalib-info__val">—</div></div>
          </div>

          ${renderStutzpunkteControl(testKey)}
        </div>

        <div id="kalibPreview-${testKey}" class="kalib-preview" hidden>
          <div class="kalib-preview__title">Druckvorschau für aktuelle Vorgaben</div>
          <div id="kalibPreviewTable-${testKey}" class="kalib-preview__table"></div>
        </div>
      </div>
    </details>
  `;
}

function renderPresseDropdown(testKey=null){
  const keys = testKey ? [testKey] : TEST_KEYS;
  const kalibs = loadAllKalibs();

  keys.forEach(k => {
    const sel = $(`presseSelect-${k}`);
    if(!sel) return;

    const current = state.meta.selectedKalibId;
    sel.innerHTML = `<option value="">Bitte wählen</option>`;

    kalibs.forEach(kalib => {
      const opt = document.createElement('option');
      opt.value = kalib.id;
      opt.textContent = `${kalib.displayName}${kalib.kalibriertAm ? ` (${kalib.kalibriertAm})` : ''}`;
      if(kalib.id === current) opt.selected = true;
      sel.appendChild(opt);
    });
  });
}

function renderKalibStuetzpunkte(testKey, kalib){
  const wrap = $(`kalibStuetzpunkteWrap-${testKey}`);
  const sel = $(`kalibStuetzpunkteSelect-${testKey}`);
  const result = $(`kalibStuetzpunkteResult-${testKey}`);

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

function renderKalibInfo(testKey=null){
  const keys = testKey ? [testKey] : TEST_KEYS;
  const kalib = findKalibById(state.meta.selectedKalibId);

  keys.forEach(k => {
    const box = $(`kalibInfoBox-${k}`);
    const emptyHint = $(`kalibEmptyHint-${k}`);
    if(!box) return;

    const setText = (id, value) => {
      const el = $(id);
      if(el) el.textContent = value;
    };

    if(!kalib){
      box.hidden = true;
      if(emptyHint) emptyHint.hidden = false;
      renderKalibStuetzpunkte(k, null);
      return;
    }

    box.hidden = false;
    if(emptyHint) emptyHint.hidden = true;

    setText(`kalibName-${k}`, kalib.displayName);
    setText(`kalibSub-${k}`, `${kalib.presseTyp} · ${kalib.presseNr}`);

    const status = kalibStatus(kalib);
    const bis = kalibGueltigBis(kalib);
    const badge = $(`kalibValidBadge-${k}`);
    const bisStr = bis ? bis.toLocaleDateString('de-DE') : '—';
    const diffDays = bis ? Math.floor((bis - new Date()) / 86400000) : 999;

    if(badge){
      badge.textContent =
        status === 'ok'   ? `✅ Gültig bis ${bisStr}` :
        status === 'warn' ? `⚠️ Läuft ab in ${diffDays} Tagen (${bisStr})` :
                            `❌ Abgelaufen seit ${bisStr}`;
      badge.className = `kalib-badge kalib-badge--${status}`;
    }

    setText(`kInfo-presseTyp-${k}`, kalib.presseTyp || '—');
    setText(`kInfo-presseNr-${k}`, kalib.presseNr || '—');
    setText(`kInfo-manTyp-${k}`, kalib.manometerTyp || '—');
    setText(`kInfo-manNr-${k}`, kalib.manometerNr || '—');
    setText(`kInfo-kalibAm-${k}`, kalib.kalibriertAm ? new Date(kalib.kalibriertAm).toLocaleDateString('de-DE') : '—');
    setText(`kInfo-gueltigBis-${k}`, bisStr);
    setText(`kInfo-punkte-${k}`, `${(kalib.punkte || []).length} Stützpunkte`);
    setText(`kInfo-maxKn-${k}`, `${kalib.punkte?.length ? Math.max(...kalib.punkte.map(p => p.kN)) : 0} kN`);

    renderKalibStuetzpunkte(k, kalib);
  });
}

function renderKalibPreview(testKey=null){
  const keys = testKey ? [testKey] : TEST_KEYS;

  keys.forEach(k => {
    const wrap = $(`kalibPreview-${k}`);
    const table = $(`kalibPreviewTable-${k}`);
    if(!wrap || !table) return;

    const kalib = findKalibById(state.meta.selectedKalibId);
    const test = getTest(k);
    const Pp = toNumFlexible(test.spec.Pp);

    if(!kalib || !Number.isFinite(Pp) || Pp <= 0){
      wrap.hidden = true;
      table.innerHTML = '';
      return;
    }

    wrap.hidden = false;
    const vorschau = getPreviewStages(k);

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
  });
}

/* ---------------- meta rendering ---------------- */
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

/* ---------------- spec rendering ---------------- */
function renderSpecSection(testKey){
  const test = getTest(testKey);
  const s = test.spec;
  const isEignung = testKey === 'eignung';
  const summary = getSpecSummary(testKey);

  const lappCheck = Number.isFinite(summary.measuredLapp) && Number.isFinite(summary.minLapp) && Number.isFinite(summary.maxLapp)
    ? (summary.measuredLapp >= summary.minLapp && summary.measuredLapp <= summary.maxLapp)
    : null;

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
            <label class="field"><span class="field__label">Prüfkraft P<sub>p</sub> [kN]</span><input class="field__input field__input--computed" data-role="spec-Pp" data-test="${testKey}" type="number" step="0.01" value="${h(s.Pp)}" readonly></label>
            <label class="field"><span class="field__label">0,1%-Dehngrenze P<sub>t0,1k</sub> [kN]</span><input class="field__input" data-role="spec-Pt01k" data-test="${testKey}" type="number" step="0.1" value="${h(s.Pt01k)}"></label>
            <label class="field"><span class="field__label">Bemessung P<sub>d</sub> [kN]</span><input class="field__input" data-role="spec-Pd" data-test="${testKey}" type="number" step="0.01" value="${h(s.Pd)}"></label>
            <label class="field"><span class="field__label">Teilsicherheit γ<sub>a</sub> [-]</span><input class="field__input" data-role="spec-gamma" data-test="${testKey}" type="number" step="0.01" value="${h(s.gamma)}"></label>
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
              <div class="auto-card__value">${Number.isFinite(summary.calcPp) ? `${fmt(summary.calcPp,2)} kN` : '—'}</div>
            </div>
            <div class="auto-card">
              <div class="auto-card__label">min. Lapp</div>
              <div class="auto-card__value">${Number.isFinite(summary.minLapp) ? `${fmt(summary.minLapp,2)} m` : '—'}</div>
            </div>
            <div class="auto-card">
              <div class="auto-card__label">max. Lapp</div>
              <div class="auto-card__value">${Number.isFinite(summary.maxLapp) ? `${fmt(summary.maxLapp,2)} m` : '—'}</div>
            </div>
            <div class="auto-card">
              <div class="auto-card__label">s Grenzlinie a (Pp)</div>
              <div class="auto-card__value">${Number.isFinite(summary.sGrenzA) ? `${fmt(summary.sGrenzA,2)} mm` : '—'}</div>
            </div>
            <div class="auto-card">
              <div class="auto-card__label">s Grenzlinie b (Pp)</div>
              <div class="auto-card__value">${Number.isFinite(summary.sGrenzB) ? `${fmt(summary.sGrenzB,2)} mm` : '—'}</div>
            </div>
          </div>

          <div class="info-box">
            <b>Automatisch berechnet</b><br>
            Tatsächlich rechnerische freie Stahllänge L<sub>app</sub>:
            <b>${Number.isFinite(summary.measuredLapp) ? `${fmt(summary.measuredLapp,2)} m${summary.measuredCycle ? ` (Zyklus ${summary.measuredCycle})` : ''}` : '—'}</b><br>
            Grenzwerte freie Stahllänge eingehalten:
            <span class="inline-badge ${lappCheck === true ? 'inline-badge--good' : lappCheck === false ? 'inline-badge--bad' : ''}">
              ${lappCheck === true ? 'OK' : lappCheck === false ? 'nicht OK' : '—'}
            </span>
          </div>
        ` : `
          <div class="info-box">
            <b>Automatisch berechnet</b><br>
            Prüfkraft P<sub>p</sub> = P<sub>d</sub> · k = <b>${Number.isFinite(summary.calcPp) ? `${fmt(summary.calcPp,2)} kN` : '—'}</b>
          </div>
        `}
      </div>
    </details>
  `;
}

/* ---------------- timer rendering ---------------- */
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

/* ---------------- cycle rendering ---------------- */
function renderStageEditor(stage, idx, testKey, cycle){
  const isFree = getTest(testKey).mode === 'frei';
  const autoDruck = !!findKalibById(state.meta.selectedKalibId);
  const lastKn = calcStageLoad(stage, testKey);

  if(!isFree){
  return `
    <div class="field field--stage-druck">
      <input
        class="field__input ${autoDruck ? 'mess-input--auto' : ''}"
        data-role="stage-druck"
        data-test="${testKey}"
        data-cycle="${cycle.id}"
        data-stage="${idx}"
        type="number"
        step="0.1"
        value="${h(stage.druck)}"
        ${autoDruck ? 'readonly' : ''}
        placeholder="${h(stage.label)}"
      >
      <span class="hint" style="font-size:11px;text-align:left;margin-top:2px">
        ≈ ${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'} kN
      </span>
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
      <input class="field__input ${autoDruck ? 'mess-input--auto' : ''}" data-role="stage-druck" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="number" step="0.1" value="${h(stage.druck)}" ${autoDruck ? 'readonly' : ''}>
      <div class="action-row" style="justify-content:flex-start;margin-top:4px">
        <button class="timer-btn timer-btn--ghost" data-role="stage-del" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="button">−</button>
        ${idx === cycle.stageDefs.length - 1 ? `<button class="timer-btn timer-btn--ghost" data-role="stage-add" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${idx}" type="button">+</button>` : ''}
      </div>
      <span class="hint" style="font-size:11px;text-align:left;margin-top:2px">${Number.isFinite(lastKn) ? `≈ ${fmt(lastKn,1)} kN` : '—'}</span>
    </div>
  `;
}

function buildMeasurementBody(cycle, testKey){
  let html = '';
  const isFree = getTest(testKey).mode === 'frei';
  const autoDruck = !!findKalibById(state.meta.selectedKalibId);

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

    html += `<tr data-row="${i}">`;

    if(isFirstInStage){
      html += `<td class="mess-stage-col" rowspan="${rowspan}"><span class="mess-stage-pill">${h(stage.label)}</span></td>`;
      html += `<td class="mess-load-col" rowspan="${rowspan}">${Number.isFinite(lastKn) ? fmt(lastKn,1) : '—'}</td>`;
      html += `<td class="mess-druck-col" rowspan="${rowspan}"><input class="mess-input ${autoDruck ? 'mess-input--auto' : ''}" data-role="stage-druck" data-test="${testKey}" data-cycle="${cycle.id}" data-stage="${row.stageIdx}" type="number" step="0.1" value="${h(stage.druck)}" ${autoDruck ? 'readonly' : ''}></td>`;
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
  const badgeText = `${testKey === 'eignung' ? 'Zyklus' : 'Abschnitt'} ${cycle.nr}`;
  const secondaryTitle = cycle.title && cycle.title !== badgeText ? cycle.title : '';

  return `
    <div class="zyklus-card" data-cycle-card="${cycle.id}">
      <div class="zyklus-card__head">
        <span class="zyklus-badge">${h(badgeText)}</span>
        ${secondaryTitle ? `<span class="zyklus-title">${h(secondaryTitle)}</span>` : ''}
        <span class="zyklus-spacer"></span>
        ${isFree ? `<button class="zyklus-del" data-role="cycle-del" data-test="${testKey}" data-cycle="${cycle.id}" type="button">Löschen</button>` : ''}
      </div>

      ${cycle.criterion ? `<div class="hint" style="text-align:left;margin-bottom:10px">${h(cycle.criterion)}</div>` : ''}

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

/* ---------------- photo rendering ---------------- */
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
            <div class="photo-box__title">Übersichtsfoto / PDF-Cover</div>
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

/* ---------------- test pane rendering ---------------- */
function renderTestPane(testKey){
  const host = $(`content-${testKey}`);
  if(!host) return;

  const activeCycle = getActiveCycle(testKey);

  host.innerHTML = `
    ${renderMetaSection(testKey)}
    ${renderPressSection(testKey)}
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
      <div class="action-row" style="flex-wrap:wrap">
        <button class="btn btn--save btn--small" data-role="save-test" data-test="${testKey}" type="button">Speichern</button>
        <button class="btn btn--ghost btn--small" data-role="pdf-test" data-test="${testKey}" type="button">PDF Protokoll</button>
        <button class="btn btn--ghost btn--small" data-role="export-template" data-test="${testKey}" type="button">Vorlage exportieren</button>
        <button class="btn btn--ghost btn--small" data-role="import-template" data-test="${testKey}" type="button">Vorlage importieren</button>
        <button class="btn btn--ghost btn--small" data-role="reset-test" data-test="${testKey}" type="button">Reset</button>
        <input id="importFileInput-${testKey}" data-role="import-file" data-test="${testKey}" type="file" accept=".json,.htbanker.json,application/json" style="display:none">
      </div>
      <div class="hint">Speichern im Verlauf · PDF mit Filiale in Fußzeile</div>
    </section>
  `;
}

function renderAllTests(){
  TEST_KEYS.forEach(renderTestPane);
  renderPresseDropdown();
  renderKalibInfo();
  renderKalibPreview();
  updateRequiredFieldStates();
}

/* ---------------- evaluation rendering ---------------- */
function buildSimpleCycleSvg(cycle, testKey){
  let cum = 0;
  const pts = cycle.rows
    .filter(r => Number.isFinite(Number(r.min)))
    .map(r => {
      const v = Number(r.versch);
      if(Number.isFinite(v)) cum += v;
      return { min:Number(r.min), s:cum };
    });

  const W = 520;
  const H = 240;
  const ml = 48;
  const mr = 18;
  const mt = 20;
  const mb = 40;
  const pw = W - ml - mr;
  const ph = H - mt - mb;
  const xMax = Math.max(...pts.map(p => p.min), 1);
  const yMin = Math.min(...pts.map(p => p.s), 0);
  const yMax = Math.max(...pts.map(p => p.s), 1);

  const tx = v => ml + (v / xMax) * pw;
  const ty = v => mt + ph - ((v - yMin) / ((yMax - yMin) || 1)) * ph;
  const poly = pts.map(p => `${tx(p.min)},${ty(p.s)}`).join(' ');

  return `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${W}" height="${H}" rx="8" fill="#0b1725"/>
      <rect x="${ml}" y="${mt}" width="${pw}" height="${ph}" fill="none" stroke="rgba(255,255,255,.18)"/>
      ${poly ? `<polyline points="${poly}" fill="none" stroke="#f08a1c" stroke-width="2"/>` : ''}
      ${pts.map(p => `<circle cx="${tx(p.min)}" cy="${ty(p.s)}" r="3" fill="#f08a1c"/>`).join('')}
      <text x="${W/2}" y="14" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${h(TEST_LABELS[testKey])} · ${h(cycle.title)}</text>
      <text x="${W/2}" y="${H-6}" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Zeit [min]</text>
      <text x="14" y="${mt + ph/2}" transform="rotate(-90 14 ${mt + ph/2})" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Verschiebung [mm]</text>
    </svg>
  `;
}

function renderAuswertung(){
  const host = $('auswertungContainer');
  if(!host) return;

  const testKey = getEvalTestKey();
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
/* ---------------- business logic ---------------- */
function applyTypePreset(testKey, typeKey, { overwrite=true } = {}){
  const test = getTest(testKey);
  const typ = getAnkertypByKey(typeKey);

  test.typeKey = typeKey || '';
  test.spec.typKey = typeKey || '';

  if(!typ){
    renderAllTests();
    renderAuswertung();
    saveDraftDebounced();
    return;
  }

  if(typ.At != null && (overwrite || !String(test.spec.At || '').trim())){
    test.spec.At = formatInputNumber(Number(typ.At), 0);
  }

  if(typ.lastStreck != null && (overwrite || !String(test.spec.Pt01k || '').trim())){
    test.spec.Pt01k = formatInputNumber(Number(typ.lastStreck), 1);
  }

  recomputePp(testKey);
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
    return;
  }

  const Pd = toNumFlexible(s.Pd);
  const k = toNumFlexible(s.k);
  s.Pp = (Number.isFinite(Pd) && Number.isFinite(k) && k > 0)
    ? formatInputNumber(Pd * k, 2)
    : '';
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

function recalcDisplacement(testKey, cycleId){
  const cycle = getCycleById(testKey, cycleId);
  if(!cycle) return;

  cycle.rows.forEach((row, idx) => {
    const a = toNumFlexible(row.ablesung);
    if(idx === 0){
      row.versch = Number.isFinite(a) ? '0' : '';
      return;
    }

    const prev = toNumFlexible(cycle.rows[idx - 1].ablesung);
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

  test.cycles.forEach(cycle => {
    cycle.stageDefs = cycle.stageDefs.map(normalizeStageDef);

    cycle.stageDefs.forEach(stage => {
      const kn = calcStageLoad(stage, testKey);
      const lookup = kalib ? lookupStuetzpunkt(kn, kalib.punkte) : { bar:null };
      stage.druck = lookup.bar != null ? String(lookup.bar) : '';
    });
  });

  renderTestPane(testKey);
  renderKalibInfo(testKey);
  renderKalibPreview(testKey);
  renderAuswertung();
  saveDraftDebounced();
}

function updateRequiredFieldStates(){
  const metaRequiredRoles = ['meta-filiale'];
  metaRequiredRoles.forEach(role => {
    qsa(`[data-role="${role}"]`).forEach(el => {
      setRequiredVisual(el, !String(el.value || '').trim());
    });
  });

  const eignungRequired = ['typeKey','spec-LA','spec-Ltb','spec-Ltf','spec-Le','spec-Et','spec-P0','spec-Pa','spec-Pd','spec-gamma'];
  const otherRequired = ['typeKey','spec-L','spec-Lb','spec-Ldb','spec-Ueberstand','spec-Et','spec-P0','spec-Pd','spec-k'];

  qsa('[data-test]').forEach(el => {
    const testKey = el.dataset.test;
    const role = el.dataset.role;
    if(!testKey || !role) return;

    if(testKey === 'eignung'){
      setRequiredVisual(el, eignungRequired.includes(role) && !String(el.value || '').trim());
    }else if(testKey === 'auszieh' || testKey === 'abnahme'){
      setRequiredVisual(el, otherRequired.includes(role) && !String(el.value || '').trim());
    }
  });

  qsa('[data-role="spec-At"],[data-role="spec-Pt01k"],[data-role="spec-Pp"]').forEach(el => {
    setRequiredVisual(el, false);
  });

  qsa('[data-role="spec-Pp"]').forEach(el => applyComputedVisual(el, true));
}

/* ---------------- file helpers ---------------- */
function fileToDataUrl(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadJson(data, filename){
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/* ---------------- snapshot / state io ---------------- */
function collectSnapshot(){
  return {
    v: 20,
    savedAt: Date.now(),
    activeTest: state.activeTest,
    evalTest: state.evalTest,
    settings: clone(state.settings),
    meta: clone(state.meta),
    tests: clone(state.tests)
  };
}

function applySnapshot(snap, doRender=true){
  const fresh = getInitialState();
  const src = snap || {};

  state.activeTest = TEST_KEYS.includes(src.activeTest) ? src.activeTest : fresh.activeTest;
  state.evalTest = TEST_KEYS.includes(src.evalTest) ? src.evalTest : fresh.evalTest;
  state.settings = { ...fresh.settings, ...(src.settings || {}) };
  state.meta = { ...fresh.meta, ...(src.meta || {}) };

  state.tests = {};
  TEST_KEYS.forEach(testKey => {
    const incoming = src.tests?.[testKey] || fresh.tests[testKey];
    const base = makeTestState(testKey);

    state.tests[testKey] = {
      ...base,
      ...incoming,
      spec: { ...base.spec, ...(incoming?.spec || {}) },
      photos: { overview:null, detail:null, ...(incoming?.photos || {}) },
      cycles: Array.isArray(incoming?.cycles)
        ? incoming.cycles.map(c => makeCycleFromDef({
            nr: c.nr,
            title: c.title,
            holdStageIdx: c.holdStageIdx,
            criterion: c.criterion,
            stageDefs: c.stageDefs || []
          }, c))
        : base.cycles
    };

    if(!state.tests[testKey].typeKey && state.tests[testKey].spec?.typKey){
      state.tests[testKey].typeKey = state.tests[testKey].spec.typKey;
    }

    recomputePp(testKey);
    ensureActiveCycle(testKey);
    recalcAllDisplacements(testKey);
  });

  if(doRender){
    renderAllTests();
    renderAuswertung();
    renderHistoryList();
    updateRequiredFieldStates();
  }
}

function saveDraftDebounced(){
  clearTimeout(_saveT);
  _saveT = setTimeout(() => {
    writeStorage(STORAGE_STATE, collectSnapshot());
  }, 250);
}

function loadDraft(){
  const snap = readStorage(STORAGE_STATE, null);
  if(snap) applySnapshot(snap, true);
}

function buildTemplatePayload(testKey){
  return {
    v: 20,
    meta: clone(state.meta),
    settings: clone(state.settings),
    activeTest: testKey,
    evalTest: testKey,
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

  if(payload.settings){
    state.settings = {
      ...getInitialState().settings,
      ...payload.settings
    };
  }

  if(payload.tests?.[testKey]){
    state.tests[testKey] = {
      ...makeTestState(testKey),
      ...payload.tests[testKey],
      spec: { ...makeSpec(testKey), ...(payload.tests[testKey].spec || {}) },
      photos: { overview:null, detail:null, ...(payload.tests[testKey].photos || {}) }
    };

    if(!state.tests[testKey].activeCycleId){
      state.tests[testKey].activeCycleId = state.tests[testKey].cycles[0]?.id || '';
    }

    if(!state.tests[testKey].typeKey && state.tests[testKey].spec?.typKey){
      state.tests[testKey].typeKey = state.tests[testKey].spec.typKey;
    }

    recomputePp(testKey);
    ensureActiveCycle(testKey);
    recalcAllDisplacements(testKey);
  }
}

function buildHistoryTitle(testKey, snapshot){
  const meta = snapshot?.meta || state.meta;
  return `${TEST_LABELS[testKey]} · ${meta.nummer || '—'} · ${meta.bauvorhaben || '—'}`;
}

function saveTestToHistory(testKey){
  const snap = collectSnapshot();
  const list = readHistory();
  list.unshift({
    id: uid(),
    title: buildHistoryTitle(testKey, snap),
    savedAt: snap.savedAt,
    snapshot: snap
  });
  writeHistory(list);
}

function saveCurrentToHistory(){
  saveTestToHistory(getActiveTestKey());
  renderHistoryList();
}

/* ---------------- history ui ---------------- */
function renderHistoryList(){
  const host = $('historyList');
  if(!host) return;

  const list = readHistory();
  if(!list.length){
    host.innerHTML = `<div class="empty-state">Noch keine Protokolle gespeichert.</div>`;
    return;
  }

  host.innerHTML = list.map(entry => {
    const snap = entry.snapshot || {};
    const testKey = TEST_KEYS.includes(snap.activeTest) ? snap.activeTest : 'eignung';
    const test = snap.tests?.[testKey];
    const typ = test ? getAnkertypByKey(test.typeKey)?.label : '—';

    return `
      <details class="historyItem" data-id="${h(entry.id)}">
        <summary class="historyItem__head">
          <span class="historyItem__chevron">▸</span>
          <span class="historyItem__title">${h(entry.title)}</span>
          <span class="historyItem__date">${h(new Date(entry.savedAt).toLocaleString('de-DE'))}</span>
        </summary>
        <div class="historyItem__body">
          Bauvorhaben: <b>${h(snap.meta?.bauvorhaben || '—')}</b><br>
          ${h(getNumberLabel(testKey))}: <b>${h(snap.meta?.nummer || '—')}</b><br>
          Prüfung: <b>${h(TEST_LABELS[testKey])}</b><br>
          Typ: <b>${h(typ || '—')}</b><br>
          Abschnitte: <b>${test?.cycles?.length || 0}</b>
          <div class="historyBtns">
            <button data-role="history-load" data-id="${h(entry.id)}">Laden</button>
            <button data-role="history-pdf" data-id="${h(entry.id)}">PDF</button>
            <button data-role="history-export" data-id="${h(entry.id)}">JSON Export</button>
            <button data-role="history-del" data-id="${h(entry.id)}">Löschen</button>
          </div>
        </div>
      </details>
    `;
  }).join('');
}
/* ---------------- pdf template helpers ---------------- */
const PDF_BRAND = {
  name:'HTB Baugesellschaft m.b.H.',
  slogan:'BAUEN MIT SPEZIALISTEN ALS PARTNER'
};

function pdfSafe(v){
  return String(v ?? '')
    .replace(/[–—]/g,'-')
    .replace(/[•→]/g,'-')
    .replace(/[\u0000-\u001F\u007F]/g,'');
}

function drawTextSafe(page, text, options){
  page.drawText(pdfSafe(text), options);
}

async function loadPdfAssetsAnker(pdf){
  const { StandardFonts } = window.PDFLib;

  let fontR = await pdf.embedFont(StandardFonts.Helvetica);
  let fontB = await pdf.embedFont(StandardFonts.HelveticaBold);

  try{
    const fontkit = window.fontkit || window.PDFLibFontkit;
    if(fontkit){
      pdf.registerFontkit(fontkit);

      const fontBytesR = await fetch(`${BASE_PATH}fonts/arial.ttf?v=1`).then(r => {
        if(!r.ok) throw new Error('arial.ttf fehlt');
        return r.arrayBuffer();
      });

      fontR = await pdf.embedFont(fontBytesR, { subset:true });

      try{
        const fontBytesB = await fetch(`${BASE_PATH}fonts/arialbd.ttf?v=1`).then(r => {
          if(!r.ok) throw new Error('arialbd.ttf fehlt');
          return r.arrayBuffer();
        });
        fontB = await pdf.embedFont(fontBytesB, { subset:true });
      }catch{}
    }
  }catch(err){
    console.warn('PDF-Fonts fallback aktiv:', err);
  }

  let logo = null;
  try{
    const b = await fetch(`${BASE_PATH}logo.png?v=1`).then(r => r.ok ? r.arrayBuffer() : Promise.reject());
    logo = await pdf.embedPng(b);
  }catch{}

  let fusszeile = null;
  try{
    const b = await fetch(`${BASE_PATH}Fu%C3%9Fzeile.png?v=1`).then(r => r.ok ? r.arrayBuffer() : Promise.reject());
    fusszeile = await pdf.embedPng(b);
  }catch{
    try{
      const b = await fetch(`${BASE_PATH}Fusszeile.png?v=1`).then(r => r.ok ? r.arrayBuffer() : Promise.reject());
      fusszeile = await pdf.embedPng(b);
    }catch{}
  }

  return { fontR, fontB, logo, fusszeile };
}

function getPdfCtxAnker(PDFLib, assets, currentMeta){
  const { rgb } = PDFLib;
  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const mm = v => v * 72 / 25.4;
  const K = rgb(0,0,0);
  const GREY = rgb(0.90,0.90,0.90);
  return { PAGE_W, PAGE_H, mm, K, GREY, rgb, ...assets, currentMeta };
}

function getFooterTextSingleLineAnker(meta, subtitle=''){
  const fil = FILIALEN[meta?.filiale] || {};
  return `${PDF_BRAND.name} · ${fil.tel || ''} · ${fil.email || ''} · ${fil.adresse || ''}${subtitle ? ' · ' + subtitle : ''}`;
}

function getFooterFontSize(font, text, maxW, startSize=6.2, minSize=4.4){
  let size = startSize;
  const safe = pdfSafe(text);
  while(size > minSize && font.widthOfTextAtSize(safe, size) > maxW){
    size -= 0.2;
  }
  return size;
}

function drawNewFooterFullAnker(page, ctx, subtitle=''){
  const { PAGE_W, mm, fontR, K, fusszeile, currentMeta } = ctx;

  let imgH = 0;
  if(fusszeile){
    const scale = PAGE_W / fusszeile.width;
    imgH = fusszeile.height * scale;
    page.drawImage(fusszeile, { x:0, y:0, width:PAGE_W, height:imgH });
  }

  const x = mm(8);
  const maxW = PAGE_W - x - mm(8);
  const text = getFooterTextSingleLineAnker(currentMeta || {}, subtitle);
  const size = getFooterFontSize(fontR, text, maxW, 6.0, 4.4);

  drawTextSafe(page, text, {
    x,
    y: imgH + mm(3.4),
    size,
    font: fontR,
    color: K
  });

  return imgH + mm(9.5);
}

function drawHeaderBarAnker(page, ctx, title, sub=''){
  const { mm, fontR, fontB, K, GREY, logo, PAGE_W, PAGE_H } = ctx;
  const margin = mm(8);
  const W = PAGE_W - 2 * margin;
  const H = PAGE_H - 2 * margin;
  const hdrH = mm(13);

  page.drawRectangle({
    x: margin,
    y: margin + H - hdrH,
    width: W,
    height: hdrH,
    color: GREY,
    borderColor: K,
    borderWidth: 0.8
  });

  if(logo){
    const lh = hdrH * 0.75;
    const scale = lh / logo.height;
    page.drawImage(logo, {
      x: margin + mm(2),
      y: margin + H - hdrH + (hdrH - lh) / 2,
      width: logo.width * scale,
      height: lh
    });
  }

  drawTextSafe(page, title, {
    x: margin + mm(32),
    y: margin + H - hdrH + mm(4.2),
    size: 13,
    font: fontB,
    color: K
  });

  if(sub){
    drawTextSafe(page, sub, {
      x: margin + mm(32),
      y: margin + H - hdrH + mm(1.5),
      size: 8,
      font: fontR,
      color: K
    });
  }
}

async function embedDataUrlImageAnker(pdf, dataUrl){
  if(!dataUrl) return null;

  const b64 = String(dataUrl).split(',')[1] || '';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);

  return /^data:image\/png/i.test(dataUrl)
    ? await pdf.embedPng(bytes)
    : await pdf.embedJpg(bytes);
}

async function drawCoverPageAnker(pdf, ctx, testKey, snap){
  const { PAGE_W, PAGE_H, mm, fontR, fontB, K, logo, rgb } = ctx;
  const page = pdf.addPage([PAGE_W, PAGE_H]);

  const footerH = drawNewFooterFullAnker(page, ctx, TEST_LABELS[testKey]);
  const contentBottom = footerH;

  const margin = mm(10);
  const leftW = PAGE_W * 0.52;
  const rightX = leftW + mm(6);
  const rightW = PAGE_W - rightX - margin;

  const headerH = mm(38);
  const headerBotY = PAGE_H - margin - headerH;

  page.drawRectangle({
    x:0, y:headerBotY,
    width:PAGE_W, height:headerH,
    color:rgb(0.82,0.82,0.82)
  });

  page.drawLine({
    start:{ x:0, y:headerBotY + headerH },
    end:{ x:PAGE_W, y:headerBotY + headerH },
    thickness:1.5,
    color:K
  });

  if(logo){
    const maxLogoH = headerH - mm(14);
    const scale = maxLogoH / logo.height;
    const lw = logo.width * scale;
    const lh = logo.height * scale;
    const logoY = headerBotY + mm(10);

    page.drawImage(logo, {
      x:margin,
      y:logoY,
      width:lw,
      height:lh
    });

    drawTextSafe(page, PDF_BRAND.name, {
      x:margin,
      y:logoY - mm(5),
      size:7.5,
      font:fontR,
      color:K
    });
  }

  drawTextSafe(page, TEST_LABELS[testKey], {
    x:rightX,
    y:headerBotY + (headerH / 2) - mm(4),
    size:24,
    font:fontB,
    color:K
  });

  page.drawLine({
    start:{ x:0, y:headerBotY },
    end:{ x:PAGE_W, y:headerBotY },
    thickness:1.5,
    color:K
  });

  const test = snap.tests?.[testKey];
  const fields = [
    { label:'Bauvorhaben / Objekt', value:snap.meta?.bauvorhaben || '—', big:false },
    { label:'Bauherr', value:snap.meta?.bauherr || '—', big:false },
    { label:'Prüfart', value:TEST_LABELS[testKey], big:true },
    { label:'Lage / Nummer', value:`${snap.meta?.lage || '—'} · ${snap.meta?.nummer || '—'}`, big:false },
    { label:'Datum / Filiale', value:`${dateDE(snap.meta?.pruefdatum) || '—'} · ${snap.meta?.filiale || '—'}`, big:false }
  ];

  const lineLeft = margin + mm(6);
  const lineRight = rightX - mm(6);
  const areaTop = headerBotY - mm(4);
  const areaBottom = contentBottom + mm(4);
  const areaH = areaTop - areaBottom;
  const slotH = areaH / fields.length;

  fields.forEach((field, i) => {
    const slotTop = areaTop - i * slotH;
    const slotBottom = slotTop - slotH;
    const textY = slotBottom + slotH / 2;

    if(field.label){
      drawTextSafe(page, field.label.toUpperCase(), {
        x: lineLeft,
        y: textY + mm(5),
        size: 7,
        font: fontR,
        color: rgb(0.45,0.45,0.45)
      });
    }

    drawTextSafe(page, field.value, {
      x: lineLeft,
      y: textY - mm(2),
      size: field.big ? 20 : 12,
      font: fontB,
      color: K
    });

    if(i < fields.length - 1){
      page.drawLine({
        start:{ x:lineLeft, y:slotBottom },
        end:{ x:lineRight, y:slotBottom },
        thickness:0.7,
        color:K
      });
    }
  });

  const overview = test?.photos?.overview || '';
  if(overview){
    try{
      const img = await embedDataUrlImageAnker(pdf, overview);
      const photoTop = headerBotY;
      const photoAreaH = photoTop - contentBottom;
      const ratio = img.width / img.height;

      let dw = rightW;
      let dh = dw / ratio;
      if(dh > photoAreaH){
        dh = photoAreaH;
        dw = dh * ratio;
      }

      page.drawImage(img, {
        x: rightX + (rightW - dw) / 2,
        y: contentBottom,
        width: dw,
        height: dh
      });
    }catch(err){
      console.warn('Cover-Foto konnte nicht eingebettet werden:', err);
    }
  }
}
/* ---------------- pdf template helpers ---------------- */
function pdfSafeAnker(v){
  return String(v ?? '')
    .replace(/[–—]/g,'-')
    .replace(/[•→]/g,'-')
    .replace(/[\u0000-\u001F\u007F]/g,'');
}

function drawTextSafeAnker(page, text, options){
  page.drawText(pdfSafeAnker(text), options);
}

async function loadPdfAssetsAnker(pdf){
  const { StandardFonts } = window.PDFLib;

  const fontR = await pdf.embedFont(StandardFonts.Helvetica);
  const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);

  let logo = null;
  try{
    const b = await fetch(`${BASE_PATH}logo.png?v=1`).then(r => r.ok ? r.arrayBuffer() : Promise.reject());
    logo = await pdf.embedPng(b);
  }catch{}

  let fusszeile = null;
  try{
    const b = await fetch(`${BASE_PATH}Fu%C3%9Fzeile.png?v=1`).then(r => r.ok ? r.arrayBuffer() : Promise.reject());
    fusszeile = await pdf.embedPng(b);
  }catch{
    try{
      const b = await fetch(`${BASE_PATH}Fusszeile.png?v=1`).then(r => r.ok ? r.arrayBuffer() : Promise.reject());
      fusszeile = await pdf.embedPng(b);
    }catch{}
  }

  return { fontR, fontB, logo, fusszeile };
}

function getPdfCtxAnker(PDFLib, assets, currentMeta){
  const { rgb } = PDFLib;
  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const mm = v => v * 72 / 25.4;
  const K = rgb(0,0,0);
  const GREY = rgb(0.90,0.90,0.90);
  return { PAGE_W, PAGE_H, mm, K, GREY, rgb, ...assets, currentMeta };
}

function getFooterTextSingleLineAnker(meta, subtitle=''){
  const fil = FILIALEN[meta?.filiale] || {};
  return `HTB Baugesellschaft m.b.H. · ${fil.tel || ''} · ${fil.email || ''} · ${fil.adresse || ''}${subtitle ? ' · ' + subtitle : ''}`;
}

function getFooterFontSizeAnker(font, text, maxW, startSize=6.0, minSize=4.4){
  let size = startSize;
  const safe = pdfSafeAnker(text);
  while(size > minSize && font.widthOfTextAtSize(safe, size) > maxW){
    size -= 0.2;
  }
  return size;
}

function drawNewFooterFullAnker(page, ctx, subtitle=''){
  const { PAGE_W, mm, fontR, K, fusszeile, currentMeta } = ctx;

  let imgH = 0;
  if(fusszeile){
    const scale = PAGE_W / fusszeile.width;
    imgH = fusszeile.height * scale;
    page.drawImage(fusszeile, { x:0, y:0, width:PAGE_W, height:imgH });
  }

  const x = mm(8);
  const maxW = PAGE_W - x - mm(8);
  const text = getFooterTextSingleLineAnker(currentMeta || {}, subtitle);
  const size = getFooterFontSizeAnker(fontR, text, maxW, 6.0, 4.4);

  drawTextSafeAnker(page, text, {
    x,
    y: imgH + mm(3.4),
    size,
    font: fontR,
    color: K
  });

  return imgH + mm(9.5);
}

function drawHeaderBarAnker(page, ctx, title, sub=''){
  const { mm, fontR, fontB, K, GREY, logo, PAGE_W, PAGE_H } = ctx;
  const margin = mm(8);
  const W = PAGE_W - 2 * margin;
  const H = PAGE_H - 2 * margin;
  const hdrH = mm(13);

  page.drawRectangle({
    x: margin,
    y: margin + H - hdrH,
    width: W,
    height: hdrH,
    color: GREY,
    borderColor: K,
    borderWidth: 0.8
  });

  if(logo){
    const lh = hdrH * 0.75;
    const scale = lh / logo.height;
    page.drawImage(logo, {
      x: margin + mm(2),
      y: margin + H - hdrH + (hdrH - lh) / 2,
      width: logo.width * scale,
      height: lh
    });
  }

  drawTextSafeAnker(page, title, {
    x: margin + mm(32),
    y: margin + H - hdrH + mm(4.2),
    size: 13,
    font: fontB,
    color: K
  });

  if(sub){
    drawTextSafeAnker(page, sub, {
      x: margin + mm(32),
      y: margin + H - hdrH + mm(1.5),
      size: 8,
      font: fontR,
      color: K
    });
  }
}

async function embedDataUrlImageAnker(pdf, dataUrl){
  if(!dataUrl) return null;

  const b64 = String(dataUrl).split(',')[1] || '';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);

  return /^data:image\/png/i.test(dataUrl)
    ? await pdf.embedPng(bytes)
    : await pdf.embedJpg(bytes);
}

async function drawCoverPageAnker(pdf, ctx, testKey, snap){
  const { PAGE_W, PAGE_H, mm, fontR, fontB, K, logo, rgb } = ctx;
  const page = pdf.addPage([PAGE_W, PAGE_H]);

  const footerH = drawNewFooterFullAnker(page, ctx, TEST_LABELS[testKey]);
  const contentBottom = footerH;

  const margin  = mm(10);
  const leftW   = PAGE_W * 0.52;
  const rightX  = leftW + mm(6);
  const rightW  = PAGE_W - rightX - margin;

  const headerH    = mm(38);
  const headerBotY = PAGE_H - margin - headerH;

  page.drawRectangle({
    x:0, y:headerBotY,
    width:PAGE_W, height:headerH,
    color:rgb(0.82,0.82,0.82)
  });

  page.drawLine({
    start:{ x:0, y:headerBotY + headerH },
    end:{ x:PAGE_W, y:headerBotY + headerH },
    thickness:1.5,
    color:K
  });

  let logoY = headerBotY + mm(10);
  if(logo){
    const maxLogoH = headerH - mm(14);
    const scale = maxLogoH / logo.height;
    const lw = logo.width * scale;
    const lh = logo.height * scale;
    logoY = headerBotY + mm(10);

    page.drawImage(logo, {
      x: margin,
      y: logoY,
      width: lw,
      height: lh
    });

    drawTextSafeAnker(page, 'HTB Baugesellschaft m.b.H.', {
      x: margin,
      y: logoY - mm(5),
      size: 7.5,
      font: fontR,
      color: K
    });
  }

  drawTextSafeAnker(page, TEST_LABELS[testKey], {
    x: rightX,
    y: headerBotY + (headerH / 2) - mm(4),
    size: 24,
    font: fontB,
    color: K
  });

  page.drawLine({
    start:{ x:0, y:headerBotY },
    end:{ x:PAGE_W, y:headerBotY },
    thickness:1.5,
    color:K
  });

  const test = snap.tests?.[testKey];
  const fields = [
    { label:'Bauvorhaben / Objekt', value:snap.meta?.bauvorhaben || '—', big:false },
    { label:'Bauherr', value:snap.meta?.bauherr || '—', big:false },
    { label:'Prüfart', value:TEST_LABELS[testKey], big:true },
    { label:'Lage / Nummer', value:`${snap.meta?.lage || '—'} · ${snap.meta?.nummer || '—'}`, big:false },
    { label:'Datum / Filiale', value:`${dateDE(snap.meta?.pruefdatum) || '—'} · ${snap.meta?.filiale || '—'}`, big:false }
  ];

  const lineLeft  = margin + mm(6);
  const lineRight = rightX - mm(6);
  const areaTop = headerBotY - mm(4);
  const areaBottom = contentBottom + mm(4);
  const areaH = areaTop - areaBottom;
  const slotH = areaH / fields.length;

  fields.forEach((field, i) => {
    const slotTop = areaTop - i * slotH;
    const slotBottom = slotTop - slotH;
    const textY = slotBottom + slotH / 2;

    if(field.label){
      drawTextSafeAnker(page, field.label.toUpperCase(), {
        x: lineLeft,
        y: textY + mm(5),
        size: 7,
        font: fontR,
        color: rgb(0.45,0.45,0.45)
      });
    }

    drawTextSafeAnker(page, field.value, {
      x: lineLeft,
      y: textY - mm(2),
      size: field.big ? 20 : 12,
      font: fontB,
      color: K
    });

    if(i < fields.length - 1){
      page.drawLine({
        start:{ x: lineLeft, y: slotBottom },
        end:{ x: lineRight, y: slotBottom },
        thickness:0.7,
        color:K
      });
    }
  });

  const overview = test?.photos?.overview || '';
  if(overview){
    try{
      const img = await embedDataUrlImageAnker(pdf, overview);
      const photoTop   = headerBotY;
      const photoAreaH = photoTop - contentBottom;

      const ratio = img.width / img.height;
      let dw = rightW;
      let dh = dw / ratio;
      if(dh > photoAreaH){
        dh = photoAreaH;
        dw = dh * ratio;
      }

      page.drawImage(img, {
        x: rightX + (rightW - dw) / 2,
        y: contentBottom,
        width: dw,
        height: dh
      });
    }catch(err){
      console.warn('Cover-Foto konnte nicht eingebettet werden:', err);
    }
  }else{
    page.drawRectangle({
      x: rightX,
      y: contentBottom,
      width: rightW,
      height: headerBotY - contentBottom,
      borderColor: K,
      borderWidth: 0.8
    });

    drawTextSafeAnker(page, 'Kein Übersichtsfoto vorhanden.', {
/* ---------------- pdf export ---------------- */
async function exportPdfForTest(testKey, snapshotState=null){
  if(!window.PDFLib){
    alert('PDF-Bibliothek nicht geladen.');
    return;
  }

  const snap = snapshotState || collectSnapshot();
  const meta = snap.meta || state.meta;
  const test = snap.tests?.[testKey] || getTest(testKey);

  const { PDFDocument, rgb } = PDFLib;
  const pdf = await PDFDocument.create();
  const assets = await loadPdfAssetsAnker(pdf);
  const ctx = getPdfCtxAnker(PDFLib, assets, meta);

  await drawCoverPageAnker(pdf, ctx, testKey, snap);

  for(const cycle of (test.cycles || [])){
    let page = pdf.addPage([ctx.PAGE_W, ctx.PAGE_H]);

    const margin = ctx.mm(8);
    const x0 = margin;
    const y0 = margin;
    const W = ctx.PAGE_W - 2 * margin;
    const H = ctx.PAGE_H - 2 * margin;

    page.drawRectangle({
      x:x0, y:y0, width:W, height:H,
      borderColor:ctx.K, borderWidth:1.2
    });

    drawHeaderBarAnker(page, ctx, `${TEST_LABELS[testKey]} – ${cycle.title}`, PDF_BRAND.name);
    drawNewFooterFullAnker(page, ctx, TEST_LABELS[testKey]);

    let y = ctx.PAGE_H - ctx.mm(30);

    const typ = getAnkertypByKey(test.typeKey)?.label || '—';
    const metaLines = [
      `Bauvorhaben: ${meta.bauvorhaben || '—'}`,
      `Bauherr: ${meta.bauherr || '—'}`,
      `${getNumberLabel(testKey)}: ${meta.nummer || '—'}`,
      `Lage: ${meta.lage || '—'}`,
      `Prüfdatum: ${dateDE(meta.pruefdatum) || '—'}`,
      `${getTypeLabel(testKey)}: ${typ}`
    ];

    metaLines.forEach(line => {
      drawTextSafe(page, line, {
        x: x0 + ctx.mm(6),
        y,
        size: 9,
        font: ctx.fontR,
        color: ctx.K
      });
      y -= ctx.mm(6);
    });

    y -= ctx.mm(2);
    drawTextSafe(page, 'Messprotokoll', {
      x: x0 + ctx.mm(6),
      y,
      size: 11,
      font: ctx.fontB,
      color: ctx.K
    });
    y -= ctx.mm(8);

    const colX = [
      x0 + ctx.mm(6),
      x0 + ctx.mm(28),
      x0 + ctx.mm(52),
      x0 + ctx.mm(74),
      x0 + ctx.mm(91),
      x0 + ctx.mm(112)
    ];

    drawTextSafe(page, 'Stufe',   { x:colX[0], y, size:7.5, font:ctx.fontB, color:ctx.K });
    drawTextSafe(page, 'Last',    { x:colX[1], y, size:7.5, font:ctx.fontB, color:ctx.K });
    drawTextSafe(page, 'Druck',   { x:colX[2], y, size:7.5, font:ctx.fontB, color:ctx.K });
    drawTextSafe(page, 'Min',     { x:colX[3], y, size:7.5, font:ctx.fontB, color:ctx.K });
    drawTextSafe(page, 'Messuhr', { x:colX[4], y, size:7.5, font:ctx.fontB, color:ctx.K });
    drawTextSafe(page, 'Versch.', { x:colX[5], y, size:7.5, font:ctx.fontB, color:ctx.K });

    y -= ctx.mm(4);

    page.drawLine({
      start:{ x:x0 + ctx.mm(6), y:y + ctx.mm(2) },
      end:{ x:ctx.PAGE_W - ctx.mm(12), y:y + ctx.mm(2) },
      thickness:0.6,
      color:ctx.K
    });

    y -= ctx.mm(2);

    for(const row of (cycle.rows || [])){
      if(y < ctx.mm(28)){
        page = pdf.addPage([ctx.PAGE_W, ctx.PAGE_H]);
        page.drawRectangle({
          x:x0, y:y0, width:W, height:H,
          borderColor:ctx.K, borderWidth:1.2
        });
        drawHeaderBarAnker(page, ctx, `${TEST_LABELS[testKey]} – ${cycle.title}`, PDF_BRAND.name);
        drawNewFooterFullAnker(page, ctx, TEST_LABELS[testKey]);
        y = ctx.PAGE_H - ctx.mm(34);
      }

      const stage = cycle.stageDefs?.[row.stageIdx];
      const kn = stage ? calcStageLoad(stage, testKey) : NaN;

      drawTextSafe(page, String(stage?.label || ''), {
        x: colX[0], y, size:7.2, font:ctx.fontR, color:ctx.K
      });
      drawTextSafe(page, Number.isFinite(kn) ? `${fmt(kn,1)} kN` : '—', {
        x: colX[1], y, size:7.2, font:ctx.fontR, color:ctx.K
      });
      drawTextSafe(page, String(stage?.druck || '—'), {
        x: colX[2], y, size:7.2, font:ctx.fontR, color:ctx.K
      });
      drawTextSafe(page, String(row.min ?? '—'), {
        x: colX[3], y, size:7.2, font:ctx.fontR, color:ctx.K
      });
      drawTextSafe(page, String(row.ablesung || '—'), {
        x: colX[4], y, size:7.2, font:ctx.fontR, color:ctx.K
      });
      drawTextSafe(page, String(row.versch || '—'), {
        x: colX[5], y, size:7.2, font:ctx.fontR, color:ctx.K
      });

      y -= ctx.mm(5);
    }

    const detail = test.photos?.detail || '';
    if(detail){
      try{
        const img = await embedDataUrlImageAnker(pdf, detail);
        const p = pdf.addPage([ctx.PAGE_W, ctx.PAGE_H]);

        p.drawRectangle({
          x:x0, y:y0, width:W, height:H,
          borderColor:ctx.K, borderWidth:1.2
        });

        drawHeaderBarAnker(p, ctx, `${TEST_LABELS[testKey]} – Detailfoto`, PDF_BRAND.name);
        drawNewFooterFullAnker(p, ctx, TEST_LABELS[testKey]);

        const areaX = x0 + ctx.mm(12);
        const areaY = y0 + ctx.mm(18);
        const areaW = W - ctx.mm(24);
        const areaH = H - ctx.mm(40);

        const ratio = img.width / img.height;
        let dw = areaW;
        let dh = dw / ratio;
        if(dh > areaH){
          dh = areaH;
          dw = dh * ratio;
        }

        p.drawImage(img, {
          x: areaX + (areaW - dw) / 2,
          y: areaY + (areaH - dh) / 2,
          width: dw,
          height: dh
        });
      }catch(err){
        console.warn('Detailfoto konnte nicht eingebettet werden:', err);
      }
    }
  }

  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type:'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dateTag()}_${testKey}_protokoll.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
/* ---------------- audio / alarm ---------------- */
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

    const buf = ctx.createBuffer(1, 1, 22050);
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

function scheduleBeep(ctx, start, duration=0.10, freq=2350, volume=0.52){
  const out = _alarmGain || ctx.destination;

  [freq, freq * 1.015].forEach(f => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(f, start);

    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.005);
    g.gain.setValueAtTime(Math.max(0.0001, volume), start + Math.max(0.03, duration - 0.02));
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(g);
    g.connect(out);

    osc.start(start);
    osc.stop(start + duration + 0.02);
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

  const dur = clamp(Number(state.settings.alarmDurationSec || 4), 1, 30);
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

  ['pointerdown','touchstart','keydown','click'].forEach(evt => {
    window.addEventListener(evt, fn, { passive:true });
  });
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

/* ---------------- timer helpers ---------------- */
function getHoldStage(cycle){
  const idx = Number.isInteger(cycle?.holdStageIdx) ? cycle.holdStageIdx : 0;
  return cycle?.stageDefs?.[idx] || null;
}

function getCycleTimerIntervals(cycle){
  const stage = getHoldStage(cycle);
  return parseIntervalStr(stage?.intervalsStr || '').filter(n => n >= 0);
}

function ensureTimer(cycleId, cycle){
  if(!timerMap[cycleId]){
    const min = Number(cycle?.elapsedMs || 0) / 60000;
    const ints = getCycleTimerIntervals(cycle);
    timerMap[cycleId] = {
      running:false,
      startMs:0,
      accumulatedMs:Number(cycle?.elapsedMs || 0),
      raf:null,
      alarmCount:ints.filter(iv => iv > 0 && min >= iv).length
    };
  }
  return timerMap[cycleId];
}

function getElapsedMs(cycleId, cycle){
  const t = timerMap[cycleId];
  if(!t) return Number(cycle?.elapsedMs || 0);
  return t.running ? t.accumulatedMs + (Date.now() - t.startMs) : t.accumulatedMs;
}

function stopAllOtherTimers(exceptCycleId){
  Object.entries(timerMap).forEach(([id, timer]) => {
    if(id !== exceptCycleId && timer?.running){
      const ctx = getCycleContextById(id);
      if(ctx) stopTimer(ctx.testKey, ctx.cycleId);
    }
  });
}

function getCycleContextById(cycleId){
  for(const testKey of TEST_KEYS){
    const cycle = getCycleById(testKey, cycleId);
    if(cycle) return { testKey, cycleId, cycle };
  }
  return null;
}

function getFirstRunningCycleContext(){
  for(const testKey of TEST_KEYS){
    for(const cycle of getTest(testKey).cycles){
      if(timerMap[cycle.id]?.running){
        return { testKey, cycleId:cycle.id, cycle };
      }
    }
  }
  return null;
}

function highlightActiveMeasurementRow(testKey, cycle){
  const card = qs(`[data-cycle-card="${cycle?.id || ''}"]`);
  if(!card) return;

  qsa('tbody tr', card).forEach(r => r.classList.remove('row-active'));
  qsa('.current-measurement', card).forEach(el => el.classList.remove('current-measurement'));

  if(!cycle) return;

  const holdIdx = Number.isInteger(cycle.holdStageIdx) ? cycle.holdStageIdx : 0;
  const rows = (cycle.rows || [])
    .map((row, idx) => ({ ...row, _idx:idx }))
    .filter(row => row.stageIdx === holdIdx)
    .sort((a,b) => Number(a.min) - Number(b.min));

  if(!rows.length) return;

  const elapsedMin = getElapsedMs(cycle.id, cycle) / 60000;
  let active = rows[0];

  for(const row of rows){
    if(elapsedMin >= Number(row.min)) active = row;
  }

  const rowEl = qs(`tr[data-row="${active._idx}"]`, card);
  if(rowEl) rowEl.classList.add('row-active');

  const strongHighlight = !!timerMap[cycle.id]?.running || Number(cycle.elapsedMs || 0) > 0;
  if(strongHighlight){
    const ablesungInput = qs(`[data-role="row-ablesung"][data-row="${active._idx}"]`, card);
    if(ablesungInput) ablesungInput.classList.add('current-measurement');
  }
}

function triggerIntervalAlarm(testKey){
  const display = $(`globalTimerDisplay-${testKey}`);

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

function updateTimerUi(testKey){
  const cycle = getActiveCycle(testKey);
  const display = $(`globalTimerDisplay-${testKey}`);
  const badge = $(`activeZyklusBadge-${testKey}`);
  const startzeit = $(`globalTimerStartzeit-${testKey}`);
  const nextEl = $(`globalTimerNext-${testKey}`);
  const btnStart = qs(`[data-role="timer-start"][data-test="${testKey}"]`);
  const btnStop = qs(`[data-role="timer-stop"][data-test="${testKey}"]`);

  if(!cycle){
    if(display) display.textContent = '00:00';
    return;
  }

  const t = ensureTimer(cycle.id, cycle);
  const ms = getElapsedMs(cycle.id, cycle);
  cycle.elapsedMs = ms;

  if(display) display.textContent = formatElapsed(ms);
  if(badge) badge.textContent = cycle.title || `Zyklus ${cycle.nr}`;
  if(startzeit) startzeit.textContent = cycle.startzeit ? `Startzeit: ${cycle.startzeit}` : 'Noch nicht gestartet';

  const ints = getCycleTimerIntervals(cycle);
  const eMin = ms / 60000;
  const next = ints.filter(iv => iv > 0).find(iv => eMin < iv);

  if(nextEl){
    nextEl.textContent = next !== undefined
      ? `Nächste Messung: ${next} min (in ${Math.max(0, Math.ceil((next * 60000 - ms) / 1000))}s)`
      : 'Alle Intervalle erreicht';
  }

  if(btnStart){
    btnStart.textContent = t.running ? 'Läuft' : (cycle.elapsedMs > 0 ? 'Weiter' : 'Start');
    btnStart.disabled = t.running;
  }

  if(btnStop){
    btnStop.disabled = !t.running;
  }

  highlightActiveMeasurementRow(testKey, cycle);
}

function updateAllTimerUis(){
  TEST_KEYS.forEach(updateTimerUi);
  updateFloatingTimerWidget();
}

function tickTimer(testKey, cycleId){
  const cycle = getCycleById(testKey, cycleId);
  const t = timerMap[cycleId];
  if(!cycle || !t || !t.running) return;

  cycle.elapsedMs = getElapsedMs(cycleId, cycle);

  const ints = getCycleTimerIntervals(cycle).filter(n => n > 0);
  const passed = ints.filter(iv => cycle.elapsedMs / 60000 >= iv).length;

  if(passed > t.alarmCount){
    t.alarmCount = passed;
    triggerIntervalAlarm(testKey);
  }

  updateTimerUi(testKey);
  updateFloatingTimerWidget();
  t.raf = requestAnimationFrame(() => tickTimer(testKey, cycleId));
}

function startTimer(testKey, cycleId){
  const cycle = getCycleById(testKey, cycleId);
  if(!cycle) return;

  if(state.settings.alarmSoundEnabled !== false) void unlockAlarmAudio();

  stopAllOtherTimers(cycleId);

  const t = ensureTimer(cycleId, cycle);
  if(t.running) return;

  if(!cycle.startzeit) cycle.startzeit = new Date().toLocaleTimeString('de-DE');

  const ints = getCycleTimerIntervals(cycle).filter(n => n > 0);
  t.alarmCount = ints.filter(iv => t.accumulatedMs / 60000 >= iv).length;
  t.running = true;
  t.startMs = Date.now();

  updateTimerUi(testKey);
  tickTimer(testKey, cycleId);
  startFloatingLoop();
  saveDraftDebounced();
}

function stopTimer(testKey, cycleId){
  const cycle = getCycleById(testKey, cycleId);
  const t = timerMap[cycleId];
  if(!cycle || !t || !t.running) return;

  t.accumulatedMs += (Date.now() - t.startMs);
  cycle.elapsedMs = t.accumulatedMs;
  t.running = false;

  if(t.raf) cancelAnimationFrame(t.raf);
  t.raf = null;

  updateTimerUi(testKey);
  updateFloatingTimerWidget();
  stopFloatingLoopIfIdle();
  saveDraftDebounced();
}

function resetTimer(testKey, cycleId){
  const cycle = getCycleById(testKey, cycleId);
  if(!cycle) return;

  const t = ensureTimer(cycleId, cycle);
  if(t.raf) cancelAnimationFrame(t.raf);

  t.running = false;
  t.startMs = 0;
  t.accumulatedMs = 0;
  t.raf = null;
  t.alarmCount = 0;

  cycle.elapsedMs = 0;
  cycle.startzeit = '';

  updateTimerUi(testKey);
  updateFloatingTimerWidget();
  stopFloatingLoopIfIdle();
  saveDraftDebounced();
}

function startActiveTimer(testKey){
  const cycle = getActiveCycle(testKey);
  if(cycle) startTimer(testKey, cycle.id);
}

function stopActiveTimer(testKey){
  const cycle = getActiveCycle(testKey);
  if(cycle) stopTimer(testKey, cycle.id);
}

function resetActiveTimer(testKey){
  const cycle = getActiveCycle(testKey);
  if(cycle && confirm(`Timer für ${cycle.title} zurücksetzen?`)){
    resetTimer(testKey, cycle.id);
  }
}

/* ---------------- floating timer ---------------- */
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

  const ctx = getFirstRunningCycleContext();
  if(!ctx){
    wrap.hidden = true;
    return;
  }

  label.textContent = `${TEST_LABELS[ctx.testKey]} · ${ctx.cycle.title}`;
  display.textContent = formatElapsed(getElapsedMs(ctx.cycleId, ctx.cycle));

  const timerBox = $(`globalTimerBox-${ctx.testKey}`);
  wrap.hidden = isElementVisible(timerBox);
}

function startFloatingLoop(){
  if(_floatingRaf) return;

  const loop = () => {
    updateFloatingTimerWidget();
    if(Object.values(timerMap).some(t => t?.running)){
      _floatingRaf = requestAnimationFrame(loop);
    }else{
      _floatingRaf = null;
    }
  };

  _floatingRaf = requestAnimationFrame(loop);
}

function stopFloatingLoopIfIdle(){
  if(!Object.values(timerMap).some(t => t?.running) && _floatingRaf){
    cancelAnimationFrame(_floatingRaf);
    _floatingRaf = null;
  }
}

/* ---------------- time adjust modal ---------------- */
function openTimeAdjustModal(testKey, cycleId){
  const cycle = getCycleById(testKey, cycleId);
  if(!cycle) return;

  _timeAdjustCtx = { testKey, cycleId };

  if($('timeAdjustInput')) $('timeAdjustInput').value = '0';
  updateTimeAdjustPreview();

  if($('timeAdjustModal')) $('timeAdjustModal').hidden = false;
}

function closeTimeAdjustModal(){
  if($('timeAdjustModal')) $('timeAdjustModal').hidden = true;
  _timeAdjustCtx = null;
}

function updateTimeAdjustPreview(){
  if(!_timeAdjustCtx || !$('timeAdjustPreview')) return;

  const cycle = getCycleById(_timeAdjustCtx.testKey, _timeAdjustCtx.cycleId);
  if(!cycle) return;

  const offset = Number($('timeAdjustInput')?.value || 0);
  const next = Math.max(0, getElapsedMs(cycle.id, cycle) + offset * 1000);
  $('timeAdjustPreview').textContent = `Neue Zeit: ${formatElapsed(next)}`;
}

function applyTimeAdjustment(){
  if(!_timeAdjustCtx) return;

  const { testKey, cycleId } = _timeAdjustCtx;
  const cycle = getCycleById(testKey, cycleId);
  if(!cycle) return;

  const offset = Number($('timeAdjustInput')?.value || 0);
  const t = ensureTimer(cycleId, cycle);
  const next = Math.max(0, getElapsedMs(cycleId, cycle) + offset * 1000);

  if(t.running){
    t.startMs = Date.now();
    t.accumulatedMs = next;
  }else{
    t.accumulatedMs = next;
  }

  cycle.elapsedMs = next;
  if(!cycle.startzeit && next > 0){
    cycle.startzeit = new Date().toLocaleTimeString('de-DE');
  }

  updateTimerUi(testKey);
  updateFloatingTimerWidget();
  saveDraftDebounced();
  closeTimeAdjustModal();
}

/* ---------------- misc ui helpers ---------------- */
function normalizeBottomActionCards(){
  /* Sticky bleibt rein über CSS gesteuert */
}
/* ---------------- refresh helpers ---------------- */
function updateCycleComputedUi(testKey, cycleId){
  const cycle = getCycleById(testKey, cycleId);
  const card = qs(`[data-cycle-card="${cycleId}"]`);
  if(!cycle || !card) return;

  cycle.rows.forEach((row, idx) => {
    const verschInput = qs(`[data-role="row-versch"][data-row="${idx}"]`, card);
    if(verschInput) verschInput.value = row.versch || '';
  });

  highlightActiveMeasurementRow(testKey, cycle);
}

function refreshTestAfterChange(testKey, { renderAll=false } = {}){
  ensureActiveCycle(testKey);
  recomputePp(testKey);
  recalcAllDisplacements(testKey);

  if(findKalibById(state.meta.selectedKalibId)){
    syncPressureFromCalibration(testKey);
    return;
  }

  if(renderAll){
    renderAllTests();
  }else{
    renderTestPane(testKey);
    renderKalibInfo(testKey);
    renderKalibPreview(testKey);
    updateRequiredFieldStates();
  }

  renderAuswertung();
  saveDraftDebounced();
}

function syncPressureFromCalibrationAll(){
  const hasKalib = !!findKalibById(state.meta.selectedKalibId);

  if(hasKalib){
    TEST_KEYS.forEach(testKey => {
      const test = getTest(testKey);
      test.cycles.forEach(cycle => {
        cycle.stageDefs = cycle.stageDefs.map(normalizeStageDef);
        cycle.stageDefs.forEach(stage => {
          const kn = calcStageLoad(stage, testKey);
          const lookup = lookupStuetzpunkt(kn, findKalibById(state.meta.selectedKalibId).punkte);
          stage.druck = lookup.bar != null ? String(lookup.bar) : '';
        });
      });
    });
  }

  renderAllTests();
  renderAuswertung();
  saveDraftDebounced();
}

async function applyPhotoInput(testKey, kind, file){
  if(!file) return;
  const dataUrl = await fileToDataUrl(file);
  getTest(testKey).photos[kind] = dataUrl;
  renderTestPane(testKey);
  updateTimerUi(testKey);
  saveDraftDebounced();
}

async function importTemplateFile(testKey, file){
  if(!file) return;

  const txt = await file.text();
  const payload = JSON.parse(txt);

  const isFullSnapshot = !!(
    payload &&
    payload.tests &&
    TEST_KEYS.every(k => payload.tests[k])
  );

  if(isFullSnapshot){
    applySnapshot(payload, true);
    return;
  }

  importTemplatePayload(testKey, payload);
  state.activeTest = testKey;
  state.evalTest = testKey;

  renderAllTests();
  renderAuswertung();
  renderHistoryList();
  updateRequiredFieldStates();
  saveDraftDebounced();
}

async function importKalibFile(file){
  if(!file) return;
  const txt = await file.text();
  const kalib = importKalibrierungCsvText(txt);
  state.meta.selectedKalibId = kalib.id;
  syncPressureFromCalibrationAll();
}

/* ---------------- click delegation ---------------- */
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-role]');
  if(!el) return;

  const role = el.dataset.role;
  const testKey = el.dataset.test;

  if(role === 'save-test'){
    saveTestToHistory(testKey);
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

  if(role === 'export-template'){
    const payload = buildTemplatePayload(testKey);
    downloadJson(payload, `${dateTag()}_HTB_${testKey}_Vorlage.htbanker.json`);
    return;
  }

  if(role === 'import-template'){
    $(`importFileInput-${testKey}`)?.click();
    return;
  }

  if(role === 'photo-pick-overview'){
    qs(`[data-role="photo-input-overview"][data-test="${testKey}"]`)?.click();
    return;
  }

  if(role === 'photo-pick-detail'){
    qs(`[data-role="photo-input-detail"][data-test="${testKey}"]`)?.click();
    return;
  }

  if(role === 'photo-del-overview'){
    getTest(testKey).photos.overview = null;
    renderTestPane(testKey);
    updateTimerUi(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'photo-del-detail'){
    getTest(testKey).photos.detail = null;
    renderTestPane(testKey);
    updateTimerUi(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'timer-start'){
    startActiveTimer(testKey);
    return;
  }

  if(role === 'timer-stop'){
    stopActiveTimer(testKey);
    return;
  }

  if(role === 'timer-reset'){
    resetActiveTimer(testKey);
    return;
  }

  if(role === 'timer-display'){
    const cycle = getActiveCycle(testKey);
    if(cycle) openTimeAdjustModal(testKey, cycle.id);
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

    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'cycle-del'){
    const cycleId = el.dataset.cycle;
    const test = getTest(testKey);

    if(!confirm(`${TEST_LABELS[testKey]} · ${getCycleById(testKey, cycleId)?.title || 'Abschnitt'} löschen?`)) return;

    test.cycles = test.cycles.filter(c => c.id !== cycleId);
    delete timerMap[cycleId];
    ensureActiveCycle(testKey);

    renderTestPane(testKey);
    renderAuswertung();
    saveDraftDebounced();
    return;
  }

  if(role === 'stage-add'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    if(!cycle) return;

    cycle.stageDefs.push(makeStageDef('factor', 0.4, [0,1]));
    syncRowsFromStageDefs(cycle);
    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'stage-del'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.stage);
    if(!cycle || cycle.stageDefs.length <= 1) return;

    cycle.stageDefs.splice(idx, 1);
    cycle.holdStageIdx = Math.min(cycle.holdStageIdx, cycle.stageDefs.length - 1);
    syncRowsFromStageDefs(cycle);
    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'row-add'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    if(!cycle || getTest(testKey).mode !== 'frei') return;

    const stageIdx = cycle.rows[cycle.rows.length - 1]?.stageIdx ?? cycle.holdStageIdx ?? 0;
    const sameStageRows = cycle.rows.filter(r => r.stageIdx === stageIdx);
    const lastMin = Number(sameStageRows[sameStageRows.length - 1]?.min || 0);

    cycle.rows.push({
      stageIdx,
      min:lastMin + 1,
      ablesung:'',
      versch:'',
      anm:''
    });

    renderTestPane(testKey);
    updateTimerUi(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'row-anm'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.row);
    if(!cycle) return;

    const cur = cycle.rows[idx]?.anm || '';
    const v = prompt('Anmerkung:', cur);
    if(v !== null){
      cycle.rows[idx].anm = v;
      renderTestPane(testKey);
      updateTimerUi(testKey);
      saveDraftDebounced();
    }
    return;
  }

  if(role === 'history-load'){
    const entry = readHistory().find(h => h.id === el.dataset.id);
    if(entry){
      applySnapshot(entry.snapshot, true);
      saveDraftDebounced();
    }
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
    downloadJson(entry.snapshot, `HTB_History_${dateTag()}_${el.dataset.id}.json`);
    return;
  }

  if(role === 'history-pdf'){
    const entry = readHistory().find(h => h.id === el.dataset.id);
    if(!entry) return;

    const testKeyFromSnap = TEST_KEYS.includes(entry.snapshot?.activeTest)
      ? entry.snapshot.activeTest
      : 'eignung';

    await exportPdfForTest(testKeyFromSnap, entry.snapshot);
    return;
  }
});

/* ---------------- change delegation ---------------- */
document.addEventListener('change', async e => {
  const raw = e.target;

  if(raw?.id && raw.id.startsWith('presseSelect-')){
    state.meta.selectedKalibId = raw.value || '';

    if(findKalibById(state.meta.selectedKalibId)){
      syncPressureFromCalibrationAll();
    }else{
      renderAllTests();
      renderAuswertung();
      saveDraftDebounced();
    }
    return;
  }

  if(raw?.id && raw.id.startsWith('kalibImportInput-')){
    const file = raw.files?.[0];
    if(!file) return;

    try{
      await importKalibFile(file);
      alert('Kalibrierung importiert.');
    }catch(err){
      console.error(err);
      alert('CSV konnte nicht importiert werden.');
    }finally{
      raw.value = '';
    }
    return;
  }

  if(raw?.id && raw.id.startsWith('importFileInput-')){
    const testKey = raw.dataset.test;
    const file = raw.files?.[0];
    if(!file || !testKey) return;

    try{
      await importTemplateFile(testKey, file);
      alert('Vorlage importiert.');
    }catch(err){
      console.error(err);
      alert('Vorlage konnte nicht importiert werden.');
    }finally{
      raw.value = '';
    }
    return;
  }

  const fileInput = raw?.closest?.('[data-role="photo-input-overview"], [data-role="photo-input-detail"]');
  if(fileInput){
    const testKey = fileInput.dataset.test;
    const file = fileInput.files?.[0];
    if(!testKey || !file) return;

    try{
      if(fileInput.dataset.role === 'photo-input-overview'){
        await applyPhotoInput(testKey, 'overview', file);
      }else{
        await applyPhotoInput(testKey, 'detail', file);
      }
    }catch(err){
      console.error(err);
      alert('Foto konnte nicht geladen werden.');
    }finally{
      fileInput.value = '';
    }
    return;
  }

  const el = raw?.closest?.('[data-role]');
  if(!el) return;

  const role = el.dataset.role;
  const testKey = el.dataset.test;

  if(role?.startsWith('meta-')){
    setMetaValue(role, el.value);
    updateRequiredFieldStates();
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
    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'test-mode'){
    getTest(testKey).mode = el.value === 'frei' ? 'frei' : 'norm';
    if(getTest(testKey).mode === 'norm') applyNormToTest(testKey);
    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'active-cycle'){
    getTest(testKey).activeCycleId = el.value || '';
    renderTestPane(testKey);
    updateTimerUi(testKey);
    saveDraftDebounced();
    return;
  }

  if(role === 'hold-stage'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    if(!cycle) return;

    cycle.holdStageIdx = Number(el.value || 0);
    syncRowsFromStageDefs(cycle);
    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'stage-kind'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.stage);
    if(!cycle || !cycle.stageDefs[idx]) return;

    const old = normalizeStageDef(cycle.stageDefs[idx]);
    const kind = el.value === 'p0' ? 'p0' : el.value === 'pa' ? 'pa' : 'factor';

    cycle.stageDefs[idx] = {
      ...old,
      kind,
      factor: kind === 'factor' ? Number(old.factor || 0.4) : (kind === 'p0' ? -1 : 0),
      label: kind === 'factor'
        ? factorLabel(Number(old.factor || 0.4))
        : (kind === 'p0' ? 'P0' : 'Pa')
    };

    syncRowsFromStageDefs(cycle);
    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'stage-factor'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.stage);
    if(!cycle || !cycle.stageDefs[idx]) return;

    const stage = normalizeStageDef(cycle.stageDefs[idx]);
    const factor = Number(el.value);

    stage.kind = 'factor';
    stage.factor = Number.isFinite(factor) ? factor : 0.4;
    stage.label = factorLabel(stage.factor);
    cycle.stageDefs[idx] = stage;

    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'stage-intervals'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.stage);
    if(!cycle || !cycle.stageDefs[idx]) return;

    cycle.stageDefs[idx].intervalsStr = el.value || '';
    syncRowsFromStageDefs(cycle);
    refreshTestAfterChange(testKey);
    return;
  }

  if(role === 'stage-druck'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.stage);
    if(!cycle || !cycle.stageDefs[idx]) return;

    cycle.stageDefs[idx].druck = el.value || '';
    saveDraftDebounced();
    return;
  }

  if(role === 'row-min'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.row);
    if(!cycle || !cycle.rows[idx]) return;

    cycle.rows[idx].min = el.value || '';
    saveDraftDebounced();
    return;
  }

  if(role === 'row-ablesung'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.row);
    if(!cycle || !cycle.rows[idx]) return;

    cycle.rows[idx].ablesung = el.value || '';
    recalcDisplacement(testKey, cycle.id);
    renderTestPane(testKey);
    updateTimerUi(testKey);
    renderAuswertung();
    saveDraftDebounced();
    return;
  }

  if(role?.startsWith('spec-') && role !== 'spec-bodenart' && role !== 'spec-Pp'){
    setSpecValue(testKey, role, el.value);
    refreshTestAfterChange(testKey);
    return;
  }

  updateRequiredFieldStates();
});

/* ---------------- input delegation ---------------- */
document.addEventListener('input', e => {
  const el = e.target.closest('[data-role]');
  if(!el) return;

  const role = el.dataset.role;
  const testKey = el.dataset.test;

  if(role?.startsWith('meta-')){
    setMetaValue(role, el.value);
    updateRequiredFieldStates();
    saveDraftDebounced();
    return;
  }

  if(role?.startsWith('spec-') && role !== 'spec-bodenart' && role !== 'spec-Pp'){
    setSpecValue(testKey, role, el.value);
    recomputePp(testKey);
    updateRequiredFieldStates();
    saveDraftDebounced();
    return;
  }

  if(role === 'stage-druck'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.stage);
    if(cycle?.stageDefs[idx]){
      cycle.stageDefs[idx].druck = el.value || '';
      saveDraftDebounced();
    }
    return;
  }

  if(role === 'row-min'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.row);
    if(cycle?.rows[idx]){
      cycle.rows[idx].min = el.value || '';
      saveDraftDebounced();
    }
    return;
  }

  if(role === 'row-ablesung'){
    const cycle = getCycleById(testKey, el.dataset.cycle);
    const idx = Number(el.dataset.row);
    if(cycle?.rows[idx]){
      cycle.rows[idx].ablesung = el.value || '';
      recalcDisplacement(testKey, cycle.id);
      updateCycleComputedUi(testKey, cycle.id);
      if(!$('tab-auswertung')?.hidden) renderAuswertung();
      saveDraftDebounced();
    }
  }
});
/* ---------------- table enter navigation ---------------- */
document.addEventListener('keydown', e => {
  if(e.key !== 'Enter') return;

  const input = e.target.closest('[data-role="row-ablesung"], [data-role="row-min"]');
  if(!input) return;

  e.preventDefault();

  const role = input.dataset.role;
  const testKey = input.dataset.test;
  const cycleId = input.dataset.cycle;
  const nextRow = Number(input.dataset.row) + 1;

  const next = qs(
    `[data-role="${role}"][data-test="${testKey}"][data-cycle="${cycleId}"][data-row="${nextRow}"]`
  );

  if(next){
    next.focus();
    next.select?.();
  }
});
/* ---------------- main tabs ---------------- */
function switchMainTab(name){
  qsa('.tab').forEach(tab => {
    tab.classList.toggle('is-active', tab.dataset.tab === name);
  });

  qsa('.pane').forEach(pane => {
    pane.hidden = pane.id !== `tab-${name}`;
  });

  if(name === 'auswertung') renderAuswertung();
  if(name === 'verlauf') renderHistoryList();
}

/* ---------------- optional test selection ui ---------------- */
function syncTestChoiceUi(){
  qsa('[data-set-active-test]').forEach(el => {
    el.classList.toggle('is-active', el.dataset.setActiveTest === state.activeTest);
  });

  qsa('[data-set-eval-test]').forEach(el => {
    el.classList.toggle('is-active', el.dataset.setEvalTest === state.evalTest);
  });

  qsa('[data-test-pane]').forEach(el => {
    el.hidden = el.dataset.testPane !== state.activeTest;
  });

  const activeSelect = $('activeTestSelect');
  if(activeSelect) activeSelect.value = state.activeTest;

  const evalSelect = $('evalTestSelect');
  if(evalSelect) evalSelect.value = state.evalTest;
}

function setActiveTest(testKey){
  if(!TEST_KEYS.includes(testKey)) return;
  state.activeTest = testKey;
  syncTestChoiceUi();
  saveDraftDebounced();
}

function setEvalTest(testKey){
  if(!TEST_KEYS.includes(testKey)) return;
  state.evalTest = testKey;
  syncTestChoiceUi();
  renderAuswertung();
  saveDraftDebounced();
}
function getResolvedLayoutMode(){
  const pref = state.settings?.layoutMode || 'auto';

  if(pref === 'tablet') return 'tablet';
  if(pref === 'desktop') return 'desktop';

  const w = window.innerWidth || document.documentElement.clientWidth || 0;
  if(w >= 1280) return 'desktop';
  if(w >= 820) return 'tablet';
  return 'mobile';
}

function applyLayoutMode(){
  const resolved = getResolvedLayoutMode();
  document.body.dataset.layoutMode = resolved;
  document.documentElement.dataset.layoutMode = resolved;
}
/* ---------------- delegated ui without data-role ---------------- */
document.addEventListener('click', async e => {
  const activeBtn = e.target.closest('[data-set-active-test]');
  if(activeBtn){
    setActiveTest(activeBtn.dataset.setActiveTest);
    return;
  }

  const evalBtn = e.target.closest('[data-set-eval-test]');
  if(evalBtn){
    setEvalTest(evalBtn.dataset.setEvalTest);
    return;
  }

  const kalibImportBtn = e.target.closest('[id^="btnKalibImport-"]');
  if(kalibImportBtn){
    const testKey = kalibImportBtn.id.replace('btnKalibImport-', '');
    $(`kalibImportInput-${testKey}`)?.click();
    return;
  }

  const kalibExportBtn = e.target.closest('[id^="btnKalibExport-"]');
  if(kalibExportBtn){
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

  const kalibDeleteBtn = e.target.closest('[id^="btnKalibDelete-"]');
  if(kalibDeleteBtn){
    handleKalibDelete();

    if(findKalibById(state.meta.selectedKalibId)){
      syncPressureFromCalibrationAll();
    }else{
      renderAllTests();
      renderAuswertung();
      saveDraftDebounced();
    }
    return;
  }

  const floatingTimer = e.target.closest('#floatingTimer');
  if(floatingTimer){
    const ctx = getFirstRunningCycleContext();
    if(ctx) openTimeAdjustModal(ctx.testKey, ctx.cycleId);
    return;
  }
});

document.addEventListener('change', e => {
  const activeSelect = e.target.closest('#activeTestSelect');
  if(activeSelect){
    setActiveTest(activeSelect.value);
    return;
  }

  const evalSelect = e.target.closest('#evalTestSelect');
  if(evalSelect){
    setEvalTest(evalSelect.value);
  }
});

/* ---------------- static ui bindings ---------------- */
function bindStaticUi(){
  qsa('.tab').forEach(tab => {
    if(tab.dataset.bound === '1') return;
    tab.dataset.bound = '1';

    tab.addEventListener('click', () => {
      switchMainTab(tab.dataset.tab);
    });
  });

  $('btnAlarmSoundToggle')?.addEventListener('click', toggleAlarmSoundByUserGesture);

  $('settings-alarmDuration')?.addEventListener('input', e => {
    state.settings.alarmDurationSec = clamp(Number(e.target.value || 4), 1, 30);
    saveDraftDebounced();
  });

  $('btnSaveSettings')?.addEventListener('click', () => {
    state.settings.alarmDurationSec = clamp(Number($('settings-alarmDuration')?.value || 4), 1, 30);
    saveDraftDebounced();
    alert('Einstellungen gespeichert.');
  });
  $('settings-layoutMode')?.addEventListener('change', e => {
  state.settings.layoutMode = e.target.value || 'auto';
  applyLayoutMode();
  saveDraftDebounced();
});

$('btnExportTemplate')?.addEventListener('click', () => {
  const testKey = getActiveTestKey();
  const payload = buildTemplatePayload(testKey);
  downloadJson(payload, `${dateTag()}_HTB_${testKey}_Vorlage.htbanker.json`);
});

$('btnImportTemplate')?.addEventListener('click', () => {
  $('importTemplateGlobalInput')?.click();
});

$('importTemplateGlobalInput')?.addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if(!file) return;

  try{
    await importTemplateFile(getActiveTestKey(), file);
    alert('Vorlage importiert.');
  }catch(err){
    console.error(err);
    alert('Vorlage konnte nicht importiert werden.');
  }finally{
    e.target.value = '';
  }
});

$('btnExportFull')?.addEventListener('click', () => {
  downloadJson(collectSnapshot(), `${dateTag()}_HTB_Ankerpruefung_Export.json`);
});

$('btnImportFull')?.addEventListener('click', () => {
  $('importFullGlobalInput')?.click();
});

$('importFullGlobalInput')?.addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if(!file) return;

  try{
    const txt = await file.text();
    const snap = JSON.parse(txt);
    applySnapshot(snap, true);
    saveDraftDebounced();
    alert('Vollständiger Import erfolgreich.');
  }catch(err){
    console.error(err);
    alert('Datei konnte nicht importiert werden.');
  }finally{
    e.target.value = '';
  }
});
$('btnExportTemplate')?.addEventListener('click', () => {
  const testKey = getActiveTestKey();
  const payload = buildTemplatePayload(testKey);
  downloadJson(payload, `${dateTag()}_HTB_${testKey}_Vorlage.htbanker.json`);
});

$('btnImportTemplate')?.addEventListener('click', () => {
  $('importTemplateGlobalInput')?.click();
});

$('importTemplateGlobalInput')?.addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if(!file) return;

  try{
    await importTemplateFile(getActiveTestKey(), file);
    alert('Vorlage importiert.');
  }catch(err){
    console.error(err);
    alert('Vorlage konnte nicht importiert werden.');
  }finally{
    e.target.value = '';
  }
});

$('btnExportFull')?.addEventListener('click', () => {
  downloadJson(collectSnapshot(), `${dateTag()}_HTB_Ankerpruefung_Export.json`);
});

$('btnImportFull')?.addEventListener('click', () => {
  $('importFullGlobalInput')?.click();
});

$('importFullGlobalInput')?.addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if(!file) return;

  try{
    const txt = await file.text();
    const snap = JSON.parse(txt);
    applySnapshot(snap, true);
    saveDraftDebounced();
    alert('Vollständiger Import erfolgreich.');
  }catch(err){
    console.error(err);
    alert('Datei konnte nicht importiert werden.');
  }finally{
    e.target.value = '';
  }
});
 $('timeAdjustInput')?.addEventListener('input', updateTimeAdjustPreview);

const timeApplyBtn = $('btnTimeAdjustApply') || $('timeAdjustApply');
const timeCancelBtn = $('btnTimeAdjustCancel') || $('timeAdjustCancel');
const timeCloseBtn = $('btnTimeAdjustClose');

timeApplyBtn?.addEventListener('click', applyTimeAdjustment);
timeCancelBtn?.addEventListener('click', closeTimeAdjustModal);
timeCloseBtn?.addEventListener('click', closeTimeAdjustModal);

  $('timeAdjustModal')?.addEventListener('click', e => {
    if(e.target === $('timeAdjustModal')){
      closeTimeAdjustModal();
    }
  });

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && !$('timeAdjustModal')?.hidden){
      closeTimeAdjustModal();
    }
  });

  ['btnSaveFormular','btnSaveAuswertung','btnSaveVerlauf'].forEach(id => {
    $(id)?.addEventListener('click', saveCurrentToHistory);
  });

  window.addEventListener('resize', () => {
  applyLayoutMode();
  updateFloatingTimerWidget();
}, { passive:true });
  window.addEventListener('scroll', updateFloatingTimerWidget, { passive:true });

  document.addEventListener('visibilitychange', () => {
    updateAllTimerUis();
  });

  window.addEventListener('beforeunload', () => {
    writeStorage(STORAGE_STATE, collectSnapshot());
  });
}

/* ---------------- normalization on startup ---------------- */
function normalizeLoadedState(){
  TEST_KEYS.forEach(testKey => {
    if(!state.tests[testKey]){
      state.tests[testKey] = makeTestState(testKey);
    }

    const test = getTest(testKey);

    if(!test.typeKey && test.spec?.typKey){
      test.typeKey = test.spec.typKey;
    }

    if(test.mode === 'norm'){
      applyNormToTest(testKey);
    }else{
      test.cycles = (test.cycles || []).map(cycle => makeCycleFromDef({
        nr: cycle.nr,
        title: cycle.title,
        holdStageIdx: cycle.holdStageIdx,
        criterion: cycle.criterion,
        stageDefs: cycle.stageDefs || []
      }, cycle));
    }

    recomputePp(testKey);
    ensureActiveCycle(testKey);
    recalcAllDisplacements(testKey);
  });
}

function applyCalibrationToStateWithoutRender(){
  const kalib = findKalibById(state.meta.selectedKalibId);
  if(!kalib) return;

  TEST_KEYS.forEach(testKey => {
    const test = getTest(testKey);
    test.cycles.forEach(cycle => {
      cycle.stageDefs = cycle.stageDefs.map(normalizeStageDef);
      cycle.stageDefs.forEach(stage => {
        const kn = calcStageLoad(stage, testKey);
        const lookup = lookupStuetzpunkt(kn, kalib.punkte);
        stage.druck = lookup.bar != null ? String(lookup.bar) : '';
      });
    });
  });
}

/* ---------------- init ---------------- */
function initApp(){
  ensureDynamicStyles();

  try{
    loadDraft();
  }catch(err){
    console.warn('Draft konnte nicht geladen werden:', err);
  }

  normalizeLoadedState();
  applyCalibrationToStateWithoutRender();

  bindStaticUi();
  renderAllTests();
  renderAuswertung();
  renderHistoryList();
  renderPresseDropdown();
  renderKalibInfo();
  renderKalibPreview();
  updateRequiredFieldStates();
  updateAllTimerUis();
  syncTestChoiceUi();
  if($('settings-layoutMode')){
  $('settings-layoutMode').value = state.settings.layoutMode || 'auto';
}

applyLayoutMode();
  if($('settings-alarmDuration')){
    $('settings-alarmDuration').value = String(
      clamp(Number(state.settings.alarmDurationSec || 4), 1, 30)
    );
  }

  updateAlarmSoundButton();
  installAudioUnlock();
  normalizeBottomActionCards();

  const initialTab = qs('.tab.is-active')?.dataset.tab || 'formular';
  switchMainTab(initialTab);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initApp, { once:true });
}else{
  initApp();
}
