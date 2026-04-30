'use strict';

const BASE_PATH = '/Ankerpruefung/';
console.log('HTB Ankerprüfung app.js loaded');

const STORAGE_DRAFT   = 'htb-anker-draft-v1';
const STORAGE_HISTORY = 'htb-anker-history-v1';
const STORAGE_KALIB   = 'htb-anker-kalibrierungen-v1';
const HISTORY_MAX     = 30;

/* ──────────────────────────────────────────────────────
   EINGEBAUTE KALIBRIERUNGEN
────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────
   TECHNISCHE DATEN ANKERTYPEN
   Quelle: Technische Daten.xlsx [1]
────────────────────────────────────────────────────── */
const ANKER_TYPEN = [
  // GEWI [T]
  { key:'GEWI_T_25',     group:'GEWI [T] 550/620', label:'GEWI [T] 25',     nenndurchmesser:25,  muffe:40,  streckZug:'550/620', At:491,  lastStreck:270,  lastStreck90:243,   bruchlast:304,  bruch80:243.2 },
  { key:'GEWI_T_28',     group:'GEWI [T] 550/620', label:'GEWI [T] 28',     nenndurchmesser:28,  muffe:45,  streckZug:'550/620', At:616,  lastStreck:340,  lastStreck90:306,   bruchlast:382,  bruch80:305.6 },
  { key:'GEWI_T_32',     group:'GEWI [T] 550/620', label:'GEWI [T] 32',     nenndurchmesser:32,  muffe:52,  streckZug:'550/620', At:804,  lastStreck:440,  lastStreck90:396,   bruchlast:499,  bruch80:399.2 },
  { key:'GEWI_T_40',     group:'GEWI [T] 550/620', label:'GEWI [T] 40',     nenndurchmesser:40,  muffe:65,  streckZug:'550/620', At:1257, lastStreck:693,  lastStreck90:623.7, bruchlast:781,  bruch80:624.8 },
  { key:'GEWI_T_50',     group:'GEWI [T] 550/620', label:'GEWI [T] 50',     nenndurchmesser:50,  muffe:80,  streckZug:'550/620', At:1963, lastStreck:1080, lastStreck90:972,   bruchlast:1215, bruch80:972 },
  { key:'GEWI_T_57_5',   group:'GEWI [T] 555/700', label:'GEWI [T] 57,5',   nenndurchmesser:57.5,muffe:102, streckZug:'555/700', At:2597, lastStreck:1441, lastStreck90:1296.9,bruchlast:1818, bruch80:1454.4 },

  // GEWI Plus [TR]
  { key:'GEWI_TR_25',    group:'GEWI Plus [TR] 670/800', label:'GEWI Plus [TR] 25',   nenndurchmesser:25,  muffe:45,  streckZug:'670/800', At:491,  lastStreck:329,  lastStreck90:296.1, bruchlast:393,  bruch80:314.4 },
  { key:'GEWI_TR_30',    group:'GEWI Plus [TR] 670/800', label:'GEWI Plus [TR] 30',   nenndurchmesser:30,  muffe:55,  streckZug:'670/800', At:707,  lastStreck:474,  lastStreck90:426.6, bruchlast:565,  bruch80:452 },
  { key:'GEWI_TR_35',    group:'GEWI Plus [TR] 670/800', label:'GEWI Plus [TR] 35',   nenndurchmesser:35,  muffe:65,  streckZug:'670/800', At:962,  lastStreck:645,  lastStreck90:580.5, bruchlast:770,  bruch80:616 },
  { key:'GEWI_TR_43',    group:'GEWI Plus [TR] 670/800', label:'GEWI Plus [TR] 43',   nenndurchmesser:43,  muffe:80,  streckZug:'670/800', At:1452, lastStreck:973,  lastStreck90:875.7, bruchlast:1162, bruch80:929.6 },
  { key:'GEWI_TR_50',    group:'GEWI Plus [TR] 670/800', label:'GEWI Plus [TR] 50',   nenndurchmesser:50,  muffe:90,  streckZug:'670/800', At:1936, lastStreck:1315, lastStreck90:1183.5,bruchlast:1570, bruch80:1256 },
  { key:'GEWI_TR_57_5',  group:'GEWI Plus [TR] 670/800', label:'GEWI Plus [TR] 57,5', nenndurchmesser:57.5,muffe:102, streckZug:'670/800', At:2597, lastStreck:1740, lastStreck90:1566,  bruchlast:2077, bruch80:1661.6 },

  // GEWI hochfest [WR]
  { key:'GEWI_WR_26_5',  group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 26,5', nenndurchmesser:26.5, muffe:50, streckZug:'950/1050', At:552,  lastStreck:525,  lastStreck90:472.5, bruchlast:580,  bruch80:464 },
  { key:'GEWI_WR_32',    group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 32',   nenndurchmesser:32,   muffe:60, streckZug:'950/1050', At:804,  lastStreck:760,  lastStreck90:684,   bruchlast:845,  bruch80:676 },
  { key:'GEWI_WR_36',    group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 36',   nenndurchmesser:36,   muffe:68, streckZug:'950/1050', At:1018, lastStreck:960,  lastStreck90:864,   bruchlast:1070, bruch80:856 },
  { key:'GEWI_WR_40',    group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 40',   nenndurchmesser:40,   muffe:70, streckZug:'950/1050', At:1257, lastStreck:1190, lastStreck90:1071,  bruchlast:1320, bruch80:1056 },
  { key:'GEWI_WR_47',    group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 47',   nenndurchmesser:47,   muffe:83, streckZug:'950/1050', At:1735, lastStreck:1650, lastStreck90:1485,  bruchlast:1820, bruch80:1456 },

  // IBO
  { key:'IBO_R32_280',   group:'IBO', label:'IBO R32-280 (R32N)', nenndurchmesser:42, muffe:null, streckZug:null, At:410,  lastStreck:220, lastStreck90:198, bruchlast:280, bruch80:224 },
  { key:'IBO_R32_360',   group:'IBO', label:'IBO R32-360 (R32S)', nenndurchmesser:42, muffe:null, streckZug:null, At:510,  lastStreck:280, lastStreck90:252, bruchlast:360, bruch80:288 },
  { key:'IBO_R38_500',   group:'IBO', label:'IBO R38-500 (R38N)', nenndurchmesser:51, muffe:null, streckZug:null, At:750,  lastStreck:400, lastStreck90:360, bruchlast:500, bruch80:400 },
  { key:'IBO_R51_550',   group:'IBO', label:'IBO R51-550 (R51L)', nenndurchmesser:63, muffe:null, streckZug:null, At:890,  lastStreck:450, lastStreck90:405, bruchlast:550, bruch80:440 },
  { key:'IBO_R51_800',   group:'IBO', label:'IBO R51-800 (R51N)', nenndurchmesser:63, muffe:null, streckZug:null, At:1150, lastStreck:640, lastStreck90:576, bruchlast:800, bruch80:640 },

  // Ischebeck TITAN
  { key:'TITAN_30_11',   group:'Ischebeck TITAN', label:'Ischebeck TITAN 30/11',  nenndurchmesser:29,   muffe:null, streckZug:'542', At:415,  lastStreck:null, lastStreck90:null, bruchlast:225,  bruch80:180 },
  { key:'TITAN_40_20',   group:'Ischebeck TITAN', label:'Ischebeck TITAN 40/20',  nenndurchmesser:40.5, muffe:null, streckZug:'515', At:730,  lastStreck:null, lastStreck90:null, bruchlast:372,  bruch80:297.6 },
  { key:'TITAN_40_16',   group:'Ischebeck TITAN', label:'Ischebeck TITAN 40/16',  nenndurchmesser:40.5, muffe:null, streckZug:'544', At:900,  lastStreck:null, lastStreck90:null, bruchlast:490,  bruch80:392 },
  { key:'TITAN_52_26',   group:'Ischebeck TITAN', label:'Ischebeck TITAN 52/26',  nenndurchmesser:50.3, muffe:null, streckZug:'520', At:1250, lastStreck:null, lastStreck90:null, bruchlast:650,  bruch80:520 },
  { key:'TITAN_73_53',   group:'Ischebeck TITAN', label:'Ischebeck TITAN 73/53',  nenndurchmesser:72.4, muffe:null, streckZug:'557', At:1615, lastStreck:null, lastStreck90:null, bruchlast:900,  bruch80:720 },
  { key:'TITAN_73_45',   group:'Ischebeck TITAN', label:'Ischebeck TITAN 73/45',  nenndurchmesser:72.4, muffe:null, streckZug:'544', At:2240, lastStreck:null, lastStreck90:null, bruchlast:1218, bruch80:974.4 },
  { key:'TITAN_73_35',   group:'Ischebeck TITAN', label:'Ischebeck TITAN 73/35',  nenndurchmesser:72.4, muffe:null, streckZug:'510', At:2710, lastStreck:null, lastStreck90:null, bruchlast:1386, bruch80:1108.8 },
  { key:'TITAN_103_78',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 103/78', nenndurchmesser:101,  muffe:null, streckZug:'518', At:3140, lastStreck:null, lastStreck90:null, bruchlast:1626, bruch80:1300.8 },
  { key:'TITAN_103_51',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 103/51', nenndurchmesser:101,  muffe:null, streckZug:'440', At:5680, lastStreck:null, lastStreck90:null, bruchlast:2500, bruch80:2000 }
];

function getAnkertypByKey(key){
  return ANKER_TYPEN.find(t => t.key === key) || null;
}

/* ──────────────────────────────────────────────────────
   UTIL HELPER
────────────────────────────────────────────────────── */
function slugify(v){
  return String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/* ──────────────────────────────────────────────────────
   UPDATE-BANNER
────────────────────────────────────────────────────── */
function ensureUpdateBanner(){}

/* ──────────────────────────────────────────────────────
   ANKERTYP UI
────────────────────────────────────────────────────── */
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

  if(current){
    const exists = ANKER_TYPEN.some(t => t.key === current);
    if(exists){
      select.value = current;
    }
  }
}

function ensureAnkertypInfoBox(){
  const field = $('vor-ankertyp')?.closest('.field');
  if(!field) return null;

  let box = $('ankertypInfoBox');
  if(box) return box;

  box = document.createElement('div');
  box.id = 'ankertypInfoBox';
  box.className = 'info-box field--full';
  box.style.marginTop = '12px';

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
    ['Durchmesser über Muffe', typ.muffe != null ? `${typ.muffe} mm` : '—'],
    ['Streckgrenze / Zugfestigkeit', typ.streckZug || '—'],
    ['Querschnittsfläche At', typ.At != null ? `${fmt(typ.At,0)} mm²` : '—'],
    ['Last an der Streckgrenze', typ.lastStreck != null ? `${fmt(typ.lastStreck,1)} kN` : '—'],
    ['90% Streckgrenze', typ.lastStreck90 != null ? `${fmt(typ.lastStreck90,1)} kN` : '—'],
    ['Bruchlast', typ.bruchlast != null ? `${fmt(typ.bruchlast,1)} kN` : '—'],
    ['80% Bruchlast', typ.bruch80 != null ? `${fmt(typ.bruch80,1)} kN` : '—']
  ];

  box.hidden = false;
  box.innerHTML = `
    <b>Technische Daten Ankertyp</b><br>
    ${rows.map(([k,v]) => `${h(k)}: <b>${h(v)}</b>`).join('<br>')}
  `;
}

function applyAnkertypPreset(key, { overwrite=true } = {}){
  const typ = getAnkertypByKey(key);
  state.vorgabe.ankertyp = key || '';

  if(!typ){
    renderAnkertypInfo();
    return;
  }

  if(overwrite || !state.vorgabe.At || String(state.vorgabe.At).trim() === ''){
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

/* ──────────────────────────────────────────────────────
   TIMER DEFINITIONS / DEFAULTS
────────────────────────────────────────────────────── */
function defaultZyklus(nr){
  const defs = getNormZyklusDefs(state.vorgabe.bodenart);
  const def = defs[nr - 1] || defs[0];

  return {
    id: uid(),
    nr,
    haltMin: def.haltMin,
    haltLaststufeIdx: def.haltLaststufeIdx,
    intervalleStr: def.intervals.join(', '),
    elapsedMs: 0,
    startzeit: '',
    laststufen: def.laststufen.map(ls => ({ ...ls })),
    messungen: def.intervals.map(min => ({
      min,
      druck:'',
      ablesung:'',
      versch:'',
      anm:''
    }))
  };
}

function makeZyklusFromDefinition(def, oldZ=null){
  const oldMap = Object.fromEntries((oldZ?.messungen || []).map(m => [Number(m.min), m]));
  const oldLaststufen = normalizeLaststufenArray(oldZ?.laststufen || []);

  const laststufen = def.laststufen.map((ls, i) => {
    const old = oldLaststufen[i];
    if(old && old.kind === ls.kind && Number(old.faktor || 0) === Number(ls.faktor || 0)){
      return { ...ls, druck: old.druck || '' };
    }
    return { ...ls };
  });

  const messungen = def.intervals.map(min => {
    const old = oldMap[min];
    return old ? { ...old, min } : { min, druck:'', ablesung:'', versch:'', anm:'' };
  });

  return {
    id: oldZ?.id || uid(),
    nr: def.nr,
    haltMin: def.haltMin,
    haltLaststufeIdx: def.haltLaststufeIdx,
    intervalleStr: def.intervals.join(', '),
    elapsedMs: oldZ?.elapsedMs || 0,
    startzeit: oldZ?.startzeit || '',
    laststufen,
    messungen
  };
}

function applyNormTemplateToState(){
  const defs = getNormZyklusDefs(state.vorgabe.bodenart);
  const oldByNr = new Map((state.zyklen || []).map(z => [z.nr, z]));
  state.zyklen = defs.map(def => makeZyklusFromDefinition(def, oldByNr.get(def.nr) || null));
  ensureActiveZyklus();
}

function setZyklenMode(mode){
  const next = mode === 'frei' ? 'frei' : 'norm';
  if(next === state.settings.zyklenMode) return;

  if(next === 'norm'){
    if(
      state.settings.zyklenMode === 'frei' &&
      !confirm('Auf Norm / Vorlage zurücksetzen?\nFreie Änderungen in den Lastzyklen werden überschrieben.')
    ){
      renderZyklen();
      return;
    }

    state.settings.zyklenMode = 'norm';
    applyNormTemplateToState();
  }else{
    state.settings.zyklenMode = 'frei';

    if(!state.zyklen.length){
      state.zyklen = getNormZyklusDefs(state.vorgabe.bodenart).map(def => makeZyklusFromDefinition(def));
    }

    state.zyklen = state.zyklen.map((z, i) => {
      const ls = normalizeLaststufenArray(z.laststufen);
      return {
        ...z,
        nr: i + 1,
        laststufen: ls,
        haltLaststufeIdx: Number.isInteger(z.haltLaststufeIdx)
          ? Math.min(z.haltLaststufeIdx, ls.length - 1)
          : defaultHoldIdxFromLaststufen(ls),
        haltMin: parseIntervalStr(z.intervalleStr).slice(-1)[0] || z.haltMin || 0
      };
    });

    ensureActiveZyklus();
  }

  recalcAllVerschiebungen();
  renderZyklen();
  renderKalibPreview();
  syncDruckFromKalib();
  updateLappPreview();
  saveDraftDebounced();
}

function ensureDefaultZyklen(){
  if(state.settings.zyklenMode !== 'frei'){
    state.settings.zyklenMode = 'norm';
  }

  if(state.settings.zyklenMode === 'norm'){
    applyNormTemplateToState();
  }else{
    if(!Array.isArray(state.zyklen) || state.zyklen.length === 0){
      state.zyklen = getNormZyklusDefs(state.vorgabe.bodenart).map(def => makeZyklusFromDefinition(def));
    }

    state.zyklen = state.zyklen.map((z, i) => {
      const ls = normalizeLaststufenArray(z.laststufen);
      return {
        ...z,
        nr: i + 1,
        laststufen: ls,
        haltLaststufeIdx: Number.isInteger(z.haltLaststufeIdx)
          ? Math.min(z.haltLaststufeIdx, ls.length - 1)
          : defaultHoldIdxFromLaststufen(ls),
        haltMin: parseIntervalStr(z.intervalleStr).slice(-1)[0] || z.haltMin || 0
      };
    });

    ensureActiveZyklus();
  }
}

function ensureActiveZyklus(){
  if(!state.zyklen.length){
    state.meta.activeZyklusId = '';
    return null;
  }

  let z = state.zyklen.find(x => x.id === state.meta.activeZyklusId) || null;
  if(!z){
    z = state.zyklen[0];
    state.meta.activeZyklusId = z.id;
  }
  return z;
}

function getActiveZyklus(){
  return ensureActiveZyklus();
}

function getZyklusById(id){
  return state.zyklen.find(z => z.id === id);
}

/* ──────────────────────────────────────────────────────
   PERSISTENCE
────────────────────────────────────────────────────── */
function saveDraftDebounced(){
  clearTimeout(_saveT);
  _saveT = setTimeout(() => {
    try{ localStorage.setItem(STORAGE_DRAFT, JSON.stringify(state)); }
    catch(e){ console.warn(e); }
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
  try{ return JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]'); }
  catch{ return []; }
}

function writeHistory(list){
  try{ localStorage.setItem(STORAGE_HISTORY, JSON.stringify(list.slice(0, HISTORY_MAX))); }
  catch(e){ console.warn(e); }
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

  initAnkertypSelect();
  ensureDefaultZyklen();
  recalcAllVerschiebungen();

  syncMetaToUi();
  syncVorgabeToUi();
  renderAnkertypInfo();
  renderPresseDropdown();
  renderKalibInfo();
  renderKalibPreview();
  renderZyklen();
  updateLappPreview();
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
  list.unshift({ id:uid(), title, savedAt:snap.savedAt, snapshot:snap });
  writeHistory(list);

  alert('Im Verlauf gespeichert.');
  renderHistoryList();
  return true;
}

/* ──────────────────────────────────────────────────────
   UI-SYNC
────────────────────────────────────────────────────── */
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

  renderAnkertypInfo();
}

function collectVorgabeFromUi(){
  VOR_FIELDS.forEach(k => {
    const el = $('vor-' + k);
    if(el) state.vorgabe[k] = el.value || '';
  });

  state.vorgabe.bodenart = $('boden-bindig')?.checked ? 'bindig' : 'nichtbindig';
}

/* ──────────────────────────────────────────────────────
   VERSCHIEBUNG — RELATIV ZUM VORHERIGEN WERT
────────────────────────────────────────────────────── */
function recalcVerschiebung(z){
  if(!z?.messungen) return;

  z.messungen.forEach((m, idx) => {
    const a = Number(m.ablesung);

    if(idx === 0){
      m.versch = Number.isFinite(a) ? '0' : '';
      return;
    }

    const prev = Number(z.messungen[idx - 1].ablesung);
    if(Number.isFinite(a) && Number.isFinite(prev)){
      m.versch = formatInputNumber(a - prev, 2);
    }else{
      m.versch = '';
    }
  });
}

function recalcAllVerschiebungen(){
  state.zyklen.forEach(recalcVerschiebung);
}

function updateComputedRowsForCard(card, z){
  if(!card || !z) return;

  z.messungen.forEach((m, idx) => {
    const verschInput = card.querySelector(`[data-role="m-versch"][data-row="${idx}"]`);
    if(verschInput){
      verschInput.value = m.versch || '';
      verschInput.readOnly = true;
      verschInput.classList.add('mess-input--auto');
      verschInput.title = idx === 0
        ? 'Referenzwert (erste Ablesung = 0)'
        : 'Δ zur vorherigen Ablesung (automatisch)';
    }
  });
}

/* ──────────────────────────────────────────────────────
   AUTO-BERECHNUNG VORGABEN
────────────────────────────────────────────────────── */
function getMeasuredLappForDisplay(){
  const zs = [...state.zyklen].sort((a,b) => b.nr - a.nr);
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

  const minLapp = (Number.isFinite(Ltf) && Number.isFinite(Le)) ? (0.8 * Ltf + Le) : NaN;
  const maxLapp = (Number.isFinite(Ltf) && Number.isFinite(Le) && Number.isFinite(Ltb)) ? (Ltf + Le + 0.5 * Ltb) : NaN;
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

  const PpFromPd = (Number.isFinite(Pd) && Number.isFinite(gamma) && gamma > 0) ? (Pd * gamma) : NaN;
  const PdFromPp = (Number.isFinite(Pp) && Number.isFinite(gamma) && gamma > 0) ? (Pp / gamma) : NaN;

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

  const hintPp = $('hint-vor-Pp');
  if(hintPp){
    hintPp.textContent = Number.isFinite(a.PpFromPd)
      ? `Auto aus Pd · γa = ${fmt(a.PpFromPd,1)} kN`
      : '';
  }

  const hintPd = $('hint-vor-Pd');
  if(hintPd){
    hintPd.textContent = Number.isFinite(a.PdFromPp)
      ? `Auto aus Pp / γa = ${fmt(a.PdFromPp,1)} kN`
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
    if(Number.isFinite(a.measuredLapp) && Number.isFinite(a.minLapp) && Number.isFinite(a.maxLapp)){
      const ok = a.measuredLapp >= a.minLapp && a.measuredLapp <= a.maxLapp;
      checkEl.textContent = ok ? 'OK' : 'nicht OK';
      checkEl.className = `inline-badge ${ok ? 'inline-badge--good' : 'inline-badge--bad'}`;
    }else{
      checkEl.textContent = '—';
      checkEl.className = 'inline-badge';
    }
  }
}

/* ──────────────────────────────────────────────────────
   AUDIO / ALARM
────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────
   TIMER (GLOBAL ÜBER ALLE ZYKLEN)
────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────
   FLOATING TIMER
────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────
   TIME ADJUST MODAL
────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────
   PRESSE UI
────────────────────────────────────────────────────── */
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
      const barCls = v.oor ? 'prev-bar prev-bar--oor' : v.noKalib ? 'prev-bar prev-bar--nokalib' : 'prev-bar';
      const barStr = v.bar !== null ? fmt(v.bar,1) + ' bar' : (v.oor ? '⚠ außerhalb' : '—');

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

/* ──────────────────────────────────────────────────────
   DRUCK AUS KALIBRIERUNG
────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────
   GLOBALER TIMER HTML
────────────────────────────────────────────────────── */
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
        <b>Norm / Vorlage:</b> 5 fixe Lastzyklen nach Vorlage.
        <br>
        <b>Freie Eingabe:</b> Intervalle, Laststufen und Haltelaststufe veränderbar.
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────
   ZYKLUS-RENDERING
────────────────────────────────────────────────────── */
function buildLaststufenHtml(z){
  const isFree = state.settings.zyklenMode === 'frei';
  z.laststufen = normalizeLaststufenArray(z.laststufen);

  const Pp = Number(state.vorgabe.Pp);
  const Pa = Number(state.vorgabe.Pa);
  const P0 = Number(state.vorgabe.P0);

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
          placeholder="z.B. 0.55"
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
      <td><input class="mess-input mess-input--auto" data-role="m-versch" data-row="${idx}" type="number" step="0.01" inputmode="decimal" value="${h(row.versch)}" readonly title="${idx===0 ? 'Referenzwert (erste Ablesung = 0)' : 'Δ zur vorherigen Ablesung (automatisch)'}"></td>
      <td><button class="row-anm-btn ${row.anm ? 'has-anm' : ''}" data-role="m-anm-btn" data-row="${idx}" type="button" title="${h(row.anm || 'Anmerkung hinzufügen')}">+</button></td>
    </tr>
  `;
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
          value="${h(z.intervalleStr)}"
          ${isFree ? '' : 'readonly'}
        >
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

function updatePlusButtonVisibility(){
  const plusWrap = document.querySelector('.plus-wrap');
  if(!plusWrap) return;

  if(state.settings.zyklenMode === 'norm'){
    plusWrap.style.display = 'none';
    return;
  }

  plusWrap.style.display = '';
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

      z.laststufen[lsIdx] = makeLaststufe(kind, factor, old.druck || '');
      z.haltLaststufeIdx = Math.min(
        Number.isInteger(z.haltLaststufeIdx) ? z.haltLaststufeIdx : defaultHoldIdxFromLaststufen(z.laststufen),
        z.laststufen.length - 1
      );

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

      z.laststufen[lsIdx] = makeLaststufe(
        'factor',
        Number.isFinite(factor) ? factor : 0.4,
        old.druck || ''
      );

      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
      return;
    }

    if(role === 'intervalle'){
      z.intervalleStr = el.value;
      reconcileMessungen(z);

      const ints = parseIntervalStr(z.intervalleStr);
      z.haltMin = ints.length ? ints[ints.length - 1] : z.haltMin;

      recalcVerschiebung(z);

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
      z.laststufen.push(makeLaststufe('factor', 0.4, ''));
      z.haltLaststufeIdx = defaultHoldIdxFromLaststufen(z.laststufen);
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

      renderZyklen();
      if(findKalibById(state.meta.selectedKalibId)) syncDruckFromKalib();
      saveDraftDebounced();
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
      z.haltMin = Number(z.messungen[z.messungen.length - 1].min) || z.haltMin;

      recalcVerschiebung(z);

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

/* ──────────────────────────────────────────────────────
   TEMPLATE / EXPORT / PDF HELPERS
────────────────────────────────────────────────────── */
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

function normalizeBottomActionCards(){
  document.querySelectorAll('.card--actions-bottom').forEach(el => {
    el.style.position = 'static';
    el.style.bottom = 'auto';
    el.style.zIndex = 'auto';
  });
}

function normalizeKalibImportInput(){
  const inp = $('kalibImportInput');
  if(inp) inp.setAttribute('accept', '.csv,text/csv');
}

/* ──────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────── */
function init(){
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

  normalizeBottomActionCards();
  normalizeKalibImportInput();

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

    const evtName = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evtName, () => {
      state.vorgabe[k] = el.value || '';

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

    // WICHTIG: freie IDs / keine Überschreibung
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

  /* PRESSE / CSV */
  $('presseSelect')?.addEventListener('change', e => {
    state.meta.selectedKalibId = e.target.value;
    renderKalibInfo();
    renderKalibPreview();
    syncDruckFromKalib();
    if(!$('tab-auswertung')?.hidden) renderAuswertung();
    saveDraftDebounced();
  });

  $('btnKalibImport')?.addEventListener('click', () => $('kalibImportInput')?.click());
  $('kalibImportInput')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if(!file) return;

    try{
      const text = await file.text();
      const kalib = parseKalibCsv(text);

      // WICHTIG: neue Kalibrierung immer als eigener Datensatz, nichts überschreiben
      const existing = loadAllKalibs();
      const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));
      const userKalibs = existing.filter(k => !builtinIds.has(k.id));

      const baseId = [slugify(kalib.displayName), slugify(kalib.presseNr), kalib.kalibriertAm].filter(Boolean).join('_') || uid();
      let newId = baseId;
      let counter = 2;
      while(existing.some(k => k.id === newId) || userKalibs.some(k => k.id === newId)){
        newId = `${baseId}_${counter++}`;
      }

      kalib.id = newId;
      userKalibs.push(kalib);
      saveUserKalibs(userKalibs);

      // direkt die neu importierte auswählen
      state.meta.selectedKalibId = kalib.id;

      renderPresseDropdown();
      syncMetaToUi();
      renderKalibInfo();
      renderKalibPreview();
      syncDruckFromKalib();
      saveDraftDebounced();

      alert(`CSV-Import erfolgreich:\n${kalib.displayName}`);
    }catch(err){
      console.error('Kalibrierungs-CSV-Importfehler:', err);
      alert('CSV-Import fehlgeschlagen:\n' + err.message);
    }finally{
      e.target.value = '';
    }
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
    const z = getFirstRunningZyklus() || getActiveZyklus();
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
