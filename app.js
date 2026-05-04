'use strict';

const BASE_PATH = '/Ankerpruefung/';
console.log('HTB Ankerprüfung app.js loaded');

const STORAGE_DRAFT   = 'htb-anker-draft-v1';
const STORAGE_HISTORY = 'htb-anker-history-v1';
const STORAGE_KALIB   = 'htb-anker-kalibrierungen-v1';
const HISTORY_MAX     = 30;

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
  Arzl:       { adresse:'A-6471 Arzl im Pitztal, Gewerbepark Pitztal 16',        tel:'+43 5412 / 63975',      email:'office.arzl@htb-bau.at'      },
  'Nüziders': { adresse:'A-6714 Nüziders, Landstraße 19',                        tel:'+43 5552 / 34 739',     email:'office.nueziders@htb-bau.at'  },
  Zirl:       { adresse:'A-6170 Zirl, Neuraut 1',                                tel:'+43 5238 / 58 873 1',   email:'office.ibk@htb-bau.at'        },
  Schwoich:   { adresse:'A-6334 Schwoich, Kufsteiner Wald 28',                   tel:'+43 5372 / 63 600',     email:'office.schwoich@htb-bau.at'   },
  Fusch:      { adresse:'A-5672 Fusch a.d. Großglocknerstraße, Achenstraße 2',   tel:'+43 6546 / 40 116',     email:'office.fusch@htb-bau.at'      },
  Wels:       { adresse:'A-4600 Wels, Hans-Sachs-Straße 103',                    tel:'+43 7242 / 601 600',    email:'office.wels@htb-bau.at'       },
  Klagenfurt: { adresse:'A-9020 Klagenfurt, Josef-Sablatnig-Straße 251',         tel:'+43 463 / 33 533 700',  email:'office.klagenfurt@htb-bau.at' }
};

/* ═══════════════════════════════════════════════════════
   UPDATE-BANNER
═══════════════════════════════════════════════════════ */
function showUpdateBanner() {
  if (document.getElementById('updateBanner')) return;

  const banner = document.createElement('div');
  banner.id = 'updateBanner';
  banner.style.cssText = [
    'position:fixed','bottom:70px','left:50%','transform:translateX(-50%)',
    'background:#173f66','color:#fff','border:2px solid #f08a1c',
    'border-radius:10px','padding:10px 16px','z-index:999',
    'display:flex','align-items:center','gap:10px',
    'box-shadow:0 4px 12px rgba(0,0,0,.4)','font-size:14px','font-weight:700'
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
   TECHNISCHE DATEN ANKERTYPEN
═══════════════════════════════════════════════════════ */
const ANKER_TYPEN = [
  // GEWI [T] 550/620
  { key:'GEWI_T_25',    group:'GEWI [T] 550/620',            label:'GEWI [T] 25',             nenndurchmesser:25,   muffe:40,  streckZug:'550/620', At:491,  lastStreck:270,  lastStreck90:243,    bruchlast:304,  bruch80:243.2  },
  { key:'GEWI_T_28',    group:'GEWI [T] 550/620',            label:'GEWI [T] 28',             nenndurchmesser:28,   muffe:45,  streckZug:'550/620', At:616,  lastStreck:340,  lastStreck90:306,    bruchlast:382,  bruch80:305.6  },
  { key:'GEWI_T_32',    group:'GEWI [T] 550/620',            label:'GEWI [T] 32',             nenndurchmesser:32,   muffe:52,  streckZug:'550/620', At:804,  lastStreck:440,  lastStreck90:396,    bruchlast:499,  bruch80:399.2  },
  { key:'GEWI_T_40',    group:'GEWI [T] 550/620',            label:'GEWI [T] 40',             nenndurchmesser:40,   muffe:65,  streckZug:'550/620', At:1257, lastStreck:693,  lastStreck90:623.7,  bruchlast:781,  bruch80:624.8  },
  { key:'GEWI_T_50',    group:'GEWI [T] 550/620',            label:'GEWI [T] 50',             nenndurchmesser:50,   muffe:80,  streckZug:'550/620', At:1963, lastStreck:1080, lastStreck90:972,    bruchlast:1215, bruch80:972    },
  { key:'GEWI_T_57_5',  group:'GEWI [T] 555/700',            label:'GEWI [T] 57,5',           nenndurchmesser:57.5, muffe:102, streckZug:'555/700', At:2597, lastStreck:1441, lastStreck90:1296.9, bruchlast:1818, bruch80:1454.4 },
  // GEWI Plus [TR] 670/800
  { key:'GEWI_TR_25',   group:'GEWI Plus [TR] 670/800',      label:'GEWI Plus [TR] 25',       nenndurchmesser:25,   muffe:45,  streckZug:'670/800', At:491,  lastStreck:329,  lastStreck90:296.1,  bruchlast:393,  bruch80:314.4  },
  { key:'GEWI_TR_30',   group:'GEWI Plus [TR] 670/800',      label:'GEWI Plus [TR] 30',       nenndurchmesser:30,   muffe:55,  streckZug:'670/800', At:707,  lastStreck:474,  lastStreck90:426.6,  bruchlast:565,  bruch80:452    },
  { key:'GEWI_TR_35',   group:'GEWI Plus [TR] 670/800',      label:'GEWI Plus [TR] 35',       nenndurchmesser:35,   muffe:65,  streckZug:'670/800', At:962,  lastStreck:645,  lastStreck90:580.5,  bruchlast:770,  bruch80:616    },
  { key:'GEWI_TR_43',   group:'GEWI Plus [TR] 670/800',      label:'GEWI Plus [TR] 43',       nenndurchmesser:43,   muffe:80,  streckZug:'670/800', At:1452, lastStreck:973,  lastStreck90:875.7,  bruchlast:1162, bruch80:929.6  },
  { key:'GEWI_TR_50',   group:'GEWI Plus [TR] 670/800',      label:'GEWI Plus [TR] 50',       nenndurchmesser:50,   muffe:90,  streckZug:'670/800', At:1936, lastStreck:1315, lastStreck90:1183.5, bruchlast:1570, bruch80:1256   },
  { key:'GEWI_TR_57_5', group:'GEWI Plus [TR] 670/800',      label:'GEWI Plus [TR] 57,5',     nenndurchmesser:57.5, muffe:102, streckZug:'670/800', At:2597, lastStreck:1740, lastStreck90:1566,   bruchlast:2077, bruch80:1661.6 },
  // GEWI hochfest [WR] 950/1050
  { key:'GEWI_WR_26_5', group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 26,5', nenndurchmesser:26.5, muffe:50,  streckZug:'950/1050', At:552,  lastStreck:525,  lastStreck90:472.5, bruchlast:580,  bruch80:464    },
  { key:'GEWI_WR_32',   group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 32',   nenndurchmesser:32,   muffe:60,  streckZug:'950/1050', At:804,  lastStreck:760,  lastStreck90:684,   bruchlast:845,  bruch80:676    },
  { key:'GEWI_WR_36',   group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 36',   nenndurchmesser:36,   muffe:68,  streckZug:'950/1050', At:1018, lastStreck:960,  lastStreck90:864,   bruchlast:1070, bruch80:856    },
  { key:'GEWI_WR_40',   group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 40',   nenndurchmesser:40,   muffe:70,  streckZug:'950/1050', At:1257, lastStreck:1190, lastStreck90:1071,  bruchlast:1320, bruch80:1056   },
  { key:'GEWI_WR_47',   group:'GEWI hochfest [WR] 950/1050', label:'GEWI hochfest [WR] 47',   nenndurchmesser:47,   muffe:83,  streckZug:'950/1050', At:1735, lastStreck:1650, lastStreck90:1485,  bruchlast:1820, bruch80:1456   },
  // IBO
  { key:'IBO_R32_280',  group:'IBO', label:'IBO R32-280 (R32N)', nenndurchmesser:42,   muffe:null, streckZug:null, At:410,  lastStreck:220, lastStreck90:198, bruchlast:280,  bruch80:224    },
  { key:'IBO_R32_360',  group:'IBO', label:'IBO R32-360 (R32S)', nenndurchmesser:42,   muffe:null, streckZug:null, At:510,  lastStreck:280, lastStreck90:252, bruchlast:360,  bruch80:288    },
  { key:'IBO_R38_500',  group:'IBO', label:'IBO R38-500 (R38N)', nenndurchmesser:51,   muffe:null, streckZug:null, At:750,  lastStreck:400, lastStreck90:360, bruchlast:500,  bruch80:400    },
  { key:'IBO_R51_550',  group:'IBO', label:'IBO R51-550 (R51L)', nenndurchmesser:63,   muffe:null, streckZug:null, At:890,  lastStreck:450, lastStreck90:405, bruchlast:550,  bruch80:440    },
  { key:'IBO_R51_800',  group:'IBO', label:'IBO R51-800 (R51N)', nenndurchmesser:63,   muffe:null, streckZug:null, At:1150, lastStreck:640, lastStreck90:576, bruchlast:800,  bruch80:640    },
  // Ischebeck TITAN
  { key:'TITAN_30_11',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 30/11',  nenndurchmesser:29,   muffe:null, streckZug:'542', At:415,  lastStreck:null, lastStreck90:null, bruchlast:225,  bruch80:180    },
  { key:'TITAN_40_20',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 40/20',  nenndurchmesser:40.5, muffe:null, streckZug:'515', At:730,  lastStreck:null, lastStreck90:null, bruchlast:372,  bruch80:297.6  },
  { key:'TITAN_40_16',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 40/16',  nenndurchmesser:40.5, muffe:null, streckZug:'544', At:900,  lastStreck:null, lastStreck90:null, bruchlast:490,  bruch80:392    },
  { key:'TITAN_52_26',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 52/26',  nenndurchmesser:50.3, muffe:null, streckZug:'520', At:1250, lastStreck:null, lastStreck90:null, bruchlast:650,  bruch80:520    },
  { key:'TITAN_73_53',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 73/53',  nenndurchmesser:72.4, muffe:null, streckZug:'557', At:1615, lastStreck:null, lastStreck90:null, bruchlast:900,  bruch80:720    },
  { key:'TITAN_73_45',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 73/45',  nenndurchmesser:72.4, muffe:null, streckZug:'544', At:2240, lastStreck:null, lastStreck90:null, bruchlast:1218, bruch80:974.4  },
  { key:'TITAN_73_35',  group:'Ischebeck TITAN', label:'Ischebeck TITAN 73/35',  nenndurchmesser:72.4, muffe:null, streckZug:'510', At:2710, lastStreck:null, lastStreck90:null, bruchlast:1386, bruch80:1108.8 },
  { key:'TITAN_103_78', group:'Ischebeck TITAN', label:'Ischebeck TITAN 103/78', nenndurchmesser:101,  muffe:null, streckZug:'518', At:3140, lastStreck:null, lastStreck90:null, bruchlast:1626, bruch80:1300.8 },
  { key:'TITAN_103_51', group:'Ischebeck TITAN', label:'Ischebeck TITAN 103/51', nenndurchmesser:101,  muffe:null, streckZug:'440', At:5680, lastStreck:null, lastStreck90:null, bruchlast:2500, bruch80:2000   }
];

function getAnkertypByKey(key){
  return ANKER_TYPEN.find(t => t.key === key) || null;
}

/* ═══════════════════════════════════════════════════════
   ANKERTYP UI
═══════════════════════════════════════════════════════ */
function slugify(v){
  return String(v || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

function initAnkertypSelect(){
  const old = $('vor-ankertyp');
  if(!old) return;

  if(old.tagName === 'SELECT'){
    fillAnkertypOptions(old);
    return;
  }

  const select = document.createElement('select');
  select.id = old.id;
  select.className = old.className.replace('field__input','field__select');
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
    ['Typ',                        typ.label],
    ['Nenndurchmesser',            typ.nenndurchmesser != null ? `${typ.nenndurchmesser} mm` : '—'],
    ['Ø über Muffe',               typ.muffe != null ? `${typ.muffe} mm` : '—'],
    ['Streckgrenze / Zugfestigkeit', typ.streckZug || '—'],
    ['Querschnittsfläche At',      typ.At != null ? `${fmt(typ.At,0)} mm²` : '—'],
    ['Last an der Streckgrenze',   typ.lastStreck != null ? `${fmt(typ.lastStreck,1)} kN` : '—'],
    ['90 % Streckgrenze',          typ.lastStreck90 != null ? `${fmt(typ.lastStreck90,1)} kN` : '—'],
    ['Bruchlast',                  typ.bruchlast != null ? `${fmt(typ.bruchlast,1)} kN` : '—'],
    ['80 % Bruchlast',             typ.bruch80 != null ? `${fmt(typ.bruch80,1)} kN` : '—']
  ];

  box.hidden = false;
  box.innerHTML = `<b style="display:block;margin-bottom:4px">Technische Daten</b>${rows.map(([k,v])=>`${h(k)}: <b>${h(v)}</b>`).join('<br>')}`;
}

function applyAnkertypPreset(key, { overwrite = true } = {}){
  const typ = getAnkertypByKey(key);
  state.vorgabe.ankertyp = key || '';

  if(!typ){
    renderAnkertypInfo();
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
   NORM / VORLAGE
═══════════════════════════════════════════════════════ */
const STD_INTERVALS_15  = [0,1,2,3,4,5,7,10,15];
const STD_INTERVALS_30  = [0,1,2,3,4,5,7,10,15,20,30];
const STD_INTERVALS_60  = [0,1,2,3,4,5,7,10,15,20,30,45,60];
const STD_INTERVALS_180 = [0,1,2,3,4,5,7,10,15,20,30,45,60,90,120,150,180];

function factorToLabel(f){
  return `${formatInputNumber(Number(f), 2).replace('.', ',')}·Pp`;
}

function makeLaststufe(kind='factor', factor=1, druck=''){
  const k = kind === 'p0' ? 'p0' : kind === 'pa' ? 'pa' : 'factor';
  const f = k === 'factor' && Number.isFinite(Number(factor)) ? Number(factor) : 0;

  return {
    kind: k,
    faktor: k === 'factor' ? f : 0,
    label: k === 'p0' ? 'P0' : k === 'pa' ? 'Pa' : factorToLabel(f),
    druck: String(druck || '')
  };
}

function normalizeLaststufe(ls){
  if(!ls) return makeLaststufe('pa', 0, '');

  const inferredKind =
    ls.kind ||
    (ls.label === 'P0'
      ? 'p0'
      : (Number(ls.faktor || 0) === 0 ? 'pa' : 'factor'));

  return makeLaststufe(inferredKind, ls.faktor, ls.druck);
}

function normalizeLaststufenArray(arr){
  return (arr || []).map(normalizeLaststufe);
}

function defaultHoldIdxFromLaststufen(laststufen){
  const arr = normalizeLaststufenArray(laststufen);
  let max = -Infinity;
  let idx = 0;

  arr.forEach((ls, i) => {
    const value = ls.kind === 'factor' ? Number(ls.faktor || 0) : 0;
    if(value > max){
      max = value;
      idx = i;
    }
  });

  return idx;
}

function getNormZyklusDefs(bodenart='nichtbindig'){
  const zyklus5Intervals = bodenart === 'bindig' ? STD_INTERVALS_180 : STD_INTERVALS_60;

  return [
    {
      nr:1,
      laststufen:[
        makeLaststufe('pa'),
        makeLaststufe('factor',0.4),
        makeLaststufe('pa')
      ],
      haltLaststufeIdx:1,
      haltMin:15,
      intervals:STD_INTERVALS_15
    },
    {
      nr:2,
      laststufen:[
        makeLaststufe('factor',0.4),
        makeLaststufe('factor',0.55),
        makeLaststufe('factor',0.4),
        makeLaststufe('pa')
      ],
      haltLaststufeIdx:1,
      haltMin:15,
      intervals:STD_INTERVALS_15
    },
    {
      nr:3,
      laststufen:[
        makeLaststufe('factor',0.4),
        makeLaststufe('factor',0.55),
        makeLaststufe('factor',0.7),
        makeLaststufe('factor',0.55),
        makeLaststufe('factor',0.4),
        makeLaststufe('pa')
      ],
      haltLaststufeIdx:2,
      haltMin:30,
      intervals:STD_INTERVALS_30
    },
    {
      nr:4,
      laststufen:[
        makeLaststufe('factor',0.4),
        makeLaststufe('factor',0.55),
        makeLaststufe('factor',0.7),
        makeLaststufe('factor',0.85),
        makeLaststufe('factor',0.7),
        makeLaststufe('factor',0.55),
        makeLaststufe('factor',0.4),
        makeLaststufe('pa')
      ],
      haltLaststufeIdx:3,
      haltMin:60,
      intervals:STD_INTERVALS_60
    },
    {
      nr:5,
      laststufen:[
        makeLaststufe('factor',0.4),
        makeLaststufe('factor',0.55),
        makeLaststufe('factor',0.7),
        makeLaststufe('factor',0.85),
        makeLaststufe('factor',1.0),
        makeLaststufe('factor',0.85),
        makeLaststufe('factor',0.7),
        makeLaststufe('factor',0.55),
        makeLaststufe('factor',0.4),
        makeLaststufe('pa'),
        makeLaststufe('p0')
      ],
      haltLaststufeIdx:4,
      haltMin: zyklus5Intervals[zyklus5Intervals.length - 1],
      intervals: zyklus5Intervals
    }
  ];
}

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
  const s=n.toFixed(d);
  return s.replace(/\.0+$/,'').replace(/(\.\d*[1-9])0+$/,'$1');
}

function formatTimeHHMMSS(d=new Date()){
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}

function formatElapsed(ms){
  const t = Math.max(0,Math.floor(ms/1000));
  const hh = Math.floor(t/3600);
  const mm = Math.floor((t%3600)/60);
  const ss = t%60;
  return hh>0
    ? `${hh}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`
    : `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

function dateTag(d=new Date()){
  return `${String(d.getDate()).padStart(2,'0')}${String(d.getMonth()+1).padStart(2,'0')}${d.getFullYear()}`;
}

function dateDE(iso){
  const s=String(iso||'').trim();
  const m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m?`${m[3]}.${m[2]}.${m[1]}`:s;
}

function parseIntervalStr(str){
  return [...new Set(
    String(str||'')
      .split(',')
      .map(s=>Number(s.trim()))
      .filter(n=>Number.isFinite(n)&&n>=0)
  )].sort((a,b)=>a-b);
}

function toNumFlexible(v){
  const s = String(v ?? '').trim();
  if(!s) return NaN;
  if(s.includes(',') && s.includes('.')){
    return Number(s.replace(/\./g,'').replace(',', '.'));
  }
  if(s.includes(',')){
    return Number(s.replace(',', '.'));
  }
  return Number(s);
}

function normalizeCsvDate(value){
  const s = String(value || '').trim();
  if(!s) return '';

  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if(m){
    return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
  }

  m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);
  if(m){
    return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  }

  m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2})$/);
  if(m){
    const yy = Number(m[3]);
    const yyyy = yy >= 70 ? `19${m[3]}` : `20${m[3]}`;
    return `${yyyy}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
  }

  return s;
}

function downloadText(text, filename, type='text/plain;charset=utf-8'){
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/* ═══════════════════════════════════════════════════════
   CSV IMPORT / EXPORT
═══════════════════════════════════════════════════════ */
function kalibToCsv(kalib){
  const lines = [
    'displayName;'   + (kalib.displayName   || ''),
    'presseTyp;'     + (kalib.presseTyp     || ''),
    'presseNr;'      + (kalib.presseNr      || ''),
    'manometerTyp;'  + (kalib.manometerTyp  || ''),
    'manometerNr;'   + (kalib.manometerNr   || ''),
    'kalibriertAm;'  + (kalib.kalibriertAm  || ''),
    'gueltigMonate;' + (kalib.gueltigMonate || 12),
    '',
    'kN;bar'
  ];

  (kalib.punkte || []).forEach(p => {
    lines.push(`${String(p.kN).replace('.',',')};${String(p.bar).replace('.',',')}`);
  });

  return lines.join('\n');
}

function buildKalibCsvTemplate(){
  return [
    'displayName;Neue Presse',
    'presseTyp;z.B. L-HK-DZ-140-250-105-HPR',
    'presseNr;z.B. NC00000000',
    'manometerTyp;z.B. DSI 160/1000',
    'manometerNr;z.B. 300000',
    'kalibriertAm;2026-01-01',
    'gueltigMonate;12',
    '',
    'kN;bar',
    '5;3',
    '10;5',
    '50;26',
    '100;51',
    '200;102',
    '400;204',
    '600;306',
    '800;407',
    '1000;510',
    '1400;712'
  ].join('\n');
}

function parseKalibCsv(text){
  const lines = String(text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l !== '');

  const meta = {};
  const punkte = [];
  let inPoints = false;

  for(const line of lines){
    const parts = line.split(';').map(s => s.trim());

    if(!inPoints){
      if(parts.length >= 2 && parts[0].toLowerCase() === 'kn' && parts[1].toLowerCase() === 'bar'){
        inPoints = true;
        continue;
      }
      if(parts.length >= 2){
        meta[parts[0]] = parts.slice(1).join(';');
      }
    }else{
      if(parts.length >= 2){
        const kN  = toNumFlexible(parts[0]);
        const bar = toNumFlexible(parts[1]);
        if(Number.isFinite(kN) && Number.isFinite(bar)){
          punkte.push({ kN, bar });
        }
      }
    }
  }

  punkte.sort((a,b) => a.kN - b.kN);

  const displayName   = meta.displayName || meta.name || '';
  const presseTyp     = meta.presseTyp || '';
  const presseNr      = meta.presseNr || '';
  const manometerTyp  = meta.manometerTyp || '';
  const manometerNr   = meta.manometerNr || '';
  const kalibriertAm  = normalizeCsvDate(meta.kalibriertAm || '');
  const gueltigMonate = Number(meta.gueltigMonate || 12);

  if(!displayName || !presseNr || !kalibriertAm || punkte.length < 2){
    throw new Error('CSV unvollständig. Pflichtfelder: displayName, presseNr, kalibriertAm, mindestens 2 Punkte.');
  }

  return {
    id: `${presseNr}_${kalibriertAm}`,
    displayName,
    presseTyp,
    presseNr,
    manometerTyp,
    manometerNr,
    kalibriertAm,
    gueltigMonate: Number.isFinite(gueltigMonate) ? gueltigMonate : 12,
    punkte
  };
}

/* ═══════════════════════════════════════════════════════
   KALIBRIERUNGS-MANAGEMENT
═══════════════════════════════════════════════════════ */
function loadAllKalibs(){
  let local = [];
  try{ local = JSON.parse(localStorage.getItem(STORAGE_KALIB) || '[]'); }catch{}
  const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));
  return [
    ...BUILTIN_KALIBRIERUNGEN,
    ...local.filter(k => !builtinIds.has(k.id))
  ];
}

function saveUserKalibs(kalibs){
  const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));
  const userOnly = kalibs.filter(k => !builtinIds.has(k.id));
  try{ localStorage.setItem(STORAGE_KALIB, JSON.stringify(userOnly)); }
  catch(e){ console.warn(e); }
}

function findKalibById(id){
  return loadAllKalibs().find(k => k.id === id) || null;
}

function kalibGueltigBis(k){
  if(!k?.kalibriertAm) return null;
  const iso = normalizeCsvDate(k.kalibriertAm);
  const d = new Date(iso);
  if(isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + Number(k.gueltigMonate || 12));
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

/* NEU: handleKalibImport erzeugt immer eine eindeutige ID,
   überschreibt nie eine bestehende Kalibrierung [1] */
async function handleKalibImport(file){
  if(!file) return;

  try{
    const text = await file.text();
    const kalib = parseKalibCsv(text);

    const existing  = loadAllKalibs();
    const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));
    const userKalibs = existing.filter(k => !builtinIds.has(k.id));

    /* Eindeutige ID erzeugen — nie überschreiben */
    const baseId = [
      slugify(kalib.displayName),
      slugify(kalib.presseNr),
      kalib.kalibriertAm
    ].filter(Boolean).join('_') || uid();

    let newId = baseId;
    let counter = 2;
    while(existing.some(k => k.id === newId)){
      newId = `${baseId}_${counter++}`;
    }

    kalib.id = newId;
    userKalibs.push(kalib);
    saveUserKalibs(userKalibs);

    /* Neu importierte Presse direkt auswählen */
    state.meta.selectedKalibId = kalib.id;

    renderPresseDropdown();
    syncMetaToUi();
    renderKalibInfo();
    renderKalibPreview();
    syncDruckFromKalib();
    saveDraftDebounced();

    alert(`CSV-Import erfolgreich:\n${kalib.displayName}`);
  }catch(e){
    console.error('Kalibrierungs-CSV-Importfehler:', e);
    alert('CSV-Import fehlgeschlagen:\n' + e.message);
  }
}

function handleKalibExport(){
  const kalib = findKalibById(state.meta.selectedKalibId);
  if(!kalib){
    downloadText(buildKalibCsvTemplate(), 'HTB_Kalibrierung_Vorlage.csv', 'text/csv;charset=utf-8');
    alert('Keine Presse ausgewählt.\nCSV-Vorlage wurde exportiert.');
    return;
  }
  downloadText(kalibToCsv(kalib), `HTB_Kalib_${kalib.presseNr}_${kalib.kalibriertAm}.csv`, 'text/csv;charset=utf-8');
}

function handleKalibDelete(){
  const id = state.meta.selectedKalibId;
  if(!id){ alert('Bitte zuerst eine Presse auswählen.'); return; }

  const kalib = findKalibById(id);
  if(!kalib){ alert('Kalibrierung nicht gefunden.'); return; }

  if(BUILTIN_KALIBRIERUNGEN.some(k => k.id === id)){
    alert('Eingebaute Kalibrierungen können nicht gelöscht werden.');
    return;
  }

  if(!confirm(`Kalibrierung "${kalib.displayName}" wirklich löschen?`)) return;

  const builtinIds = new Set(BUILTIN_KALIBRIERUNGEN.map(k => k.id));
  saveUserKalibs(loadAllKalibs().filter(k => !builtinIds.has(k.id) && k.id !== id));

  state.meta.selectedKalibId = '';
  renderPresseDropdown();
  syncMetaToUi();
  renderKalibInfo();
  renderKalibPreview();
  syncDruckFromKalib();
  saveDraftDebounced();

  alert('Kalibrierung gelöscht.');
}

/* ═══════════════════════════════════════════════════════
   INTERPOLATION kN → bar
═══════════════════════════════════════════════════════ */
function interpoliereBar(zielKn, punkte){
  if(!Array.isArray(punkte) || punkte.length < 1){
    return { bar: null, oor: true };
  }

  const exact = punkte.find(
    p => Number(p.kN) === Number(zielKn)
  );

  if(!exact){
    // Kein exakter Stützpunkt → kein Druckwert
    return { bar: null, oor: true };
  }

  return {
    bar: Number(exact.bar),
    oor: false
  };
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
      selectedKalibId:'',
      activeZyklusId:''
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
      alarmSoundEnabled:true,
      zyklenMode:'norm'
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
   ZYKLEN / MODE
═══════════════════════════════════════════════════════ */
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
    return old
      ? { ...old, min }
      : { min, druck:'', ablesung:'', versch:'', anm:'' };
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

/* ═══════════════════════════════════════════════════════
   PERSISTENCE
═══════════════════════════════════════════════════════ */
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

  renderAnkertypInfo();
}

function collectVorgabeFromUi(){
  VOR_FIELDS.forEach(k => {
    const el = $('vor-' + k);
    if(el) state.vorgabe[k] = el.value || '';
  });

  state.vorgabe.bodenart = $('boden-bindig')?.checked ? 'bindig' : 'nichtbindig';
}

/* ═══════════════════════════════════════════════════════
   VERSCHIEBUNG — RELATIV ZUM VORHERIGEN WERT
═══════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════
   AUTO-BERECHNUNG VORGABEN
   Pp nicht doppelt anzeigen
═══════════════════════════════════════════════════════ */
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

  const minLapp = (Number.isFinite(Ltf)&&Number.isFinite(Le)) ? (0.8*Ltf + Le) : NaN;
  const maxLapp = (Number.isFinite(Ltf)&&Number.isFinite(Le)&&Number.isFinite(Ltb)) ? (Ltf + Le + 0.5*Ltb) : NaN;
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

  const PpFromPd = (Number.isFinite(Pd)&&Number.isFinite(gamma)&&gamma>0) ? (Pd * gamma) : NaN;
  const PdFromPp = (Number.isFinite(Pp)&&Number.isFinite(gamma)&&gamma>0) ? (Pp / gamma) : NaN;

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
/* ──────────────────────────────────────────────────────
   PRESSE UI
   NEU: Stützpunkte-Dropdown + Löschen-Button
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
function renderKalibPreview(){
  // Vorschau ist optional – leere Funktion verhindert Initialisierungsfehler
  return;
}
``
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

  /* NEU: Stützpunkte-Dropdown befüllen */
  renderKalibStuetzpunkte(kalib);
  renderKalibPreview();
}

/* ──────────────────────────────────────────────────────
   STÜTZPUNKTE-DROPDOWN (NEU)
   Zeigt alle exakten CSV-Werte — keine Interpolation
────────────────────────────────────────────────────── */
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

  /* Nur exakte Werte aus der CSV — keinerlei Interpolation */
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
   BERECHNUNGEN / AUSWERTUNG
────────────────────────────────────────────────────── */
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

  const m0 = z.messungen.find(m => Number(m.min) === 0);
  const mH = z.messungen.find(m => Number(m.min) === halt);

  let dS = NaN;

  if(m0 && mH){
    const idx0 = z.messungen.findIndex(m => Number(m.min) === 0);
    const idxH = z.messungen.findIndex(m => Number(m.min) === halt);

    if(idx0 >= 0 && idxH >= idx0){
      dS = z.messungen.slice(idx0, idxH + 1)
        .map(m => Number(m.versch))
        .filter(Number.isFinite)
        .reduce((a,b) => a + b, 0);
    }
  }

  z.laststufen = normalizeLaststufenArray(z.laststufen);

  const haltIdx = Number.isInteger(z.haltLaststufeIdx)
    ? Math.min(z.haltLaststufeIdx, z.laststufen.length - 1)
    : defaultHoldIdxFromLaststufen(z.laststufen);

  const haltLs = z.laststufen[haltIdx];

  let lastKn = NaN;
  if(haltLs){
    if(haltLs.kind === 'pa'){
      lastKn = Pa;
    }else if(haltLs.kind === 'factor'){
      lastKn = Number.isFinite(Pp) ? Pp * Number(haltLs.faktor || 0) : NaN;
    }
  }

  const isPpHold = haltLs?.kind === 'factor' && Math.abs(Number(haltLs.faktor || 0) - 1) < 0.0001;
  const Lapp = isPpHold ? calcLapp(dS,Pp,Pa,Et,At) : NaN;

  const isB = state.vorgabe.bodenart === 'bindig';
  const tMin = isB ? 60 : 20;
  const tMax = isB ? 180 : 60;

  let cum = 0;
  const cumPts = z.messungen.map(m => {
    const v = Number(m.versch);
    if(Number.isFinite(v)) cum += v;
    return { min:Number(m.min), s_mm: cum };
  });

  const krPts = cumPts.filter(m => Number(m.min) >= tMin && Number(m.min) <= tMax);
  const ks = calcKriechmass(krPts);

  return {
    lastKn,
    dS,
    Lapp,
    ks,
    haltLabel: haltLs?.label || '—'
  };
}

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

  let cum = 0;
  const cumulative = z.messungen.map(m => {
    const v = Number(m.versch);
    if(Number.isFinite(v)) cum += v;
    return { min:Number(m.min), s:cum };
  });

  z.laststufen = normalizeLaststufenArray(z.laststufen);

  const haltIdx = Number.isInteger(z.haltLaststufeIdx)
    ? Math.min(z.haltLaststufeIdx, z.laststufen.length - 1)
    : defaultHoldIdxFromLaststufen(z.laststufen);

  const haltLs = z.laststufen[haltIdx];
  const haltMs = cumulative[cumulative.length - 1];

  let lastHalt = NaN;
  if(haltLs?.kind === 'pa'){
    lastHalt = Pa;
  }else if(haltLs?.kind === 'factor'){
    lastHalt = Pp * Number(haltLs.faktor || 0);
  }

  const sHalt = Number(haltMs?.s);

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

/* ──────────────────────────────────────────────────────
   HISTORY
────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────
   TEMPLATE / EXPORT / PDF HELPERS
────────────────────────────────────────────────────── */
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
    page.drawText('Min   Druck   Mess.   Verschieb.   Anm.',{ x:30, y, size:8, font:fontB });
    y -= 10;

    z.messungen.forEach(m => {
      if(y < 80){
        page = pdf.addPage([595.28, 841.89]);
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
  pdf.getPages().forEach(p => {
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

function normalizeBottomActionCards(){
  /* Sticky-Verhalten wird ausschließlich über CSS gesteuert.
     Kein JS-Override — sonst scrollt das Speicher-Panel mit. */
}

function normalizeKalibImportInput(){
  const inp = $('kalibImportInput');
  if(inp){
    inp.setAttribute('accept', '.csv,text/csv');
  }
}

/* ──────────────────────────────────────────────────────
   TABS / INIT
────────────────────────────────────────────────────── */
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('is-active', t.dataset.tab === name)
  );

  document.querySelectorAll('.pane').forEach(p =>
    p.hidden = p.id !== 'tab-' + name
  );

  // ✅ Aktion‑ / Speicher‑Balken nur im Formular anzeigen
  const bottomBar = document.querySelector('.bottom-actions');
  if(bottomBar){
    bottomBar.style.display = (name === 'formular') ? '' : 'none';
  }

  if(name === 'auswertung') renderAuswertung();
  if(name === 'verlauf') renderHistoryList();
}
``

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
    await handleKalibImport(file);
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
