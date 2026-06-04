// 紫微斗數排盤 - 基於 iztro (SylarLong/iztro) 算法

const ZW_PALACE=['命宮','父母','福德','田宅','官祿','交友','遷移','疾厄','財帛','子女','夫妻','兄弟'];
const ZW_BRANCH=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ZW_HOUR_NAMES=['早子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥','晚子'];

// 五虎遁：年干→寅宮天干
const TIGER_RULE={'甲':'丙','乙':'戊','丙':'庚','丁':'壬','戊':'甲','己':'丙','庚':'戊','辛':'庚','壬':'壬','癸':'甲'};
const TIANGAN=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

// ===================== 核心計算 =====================

// 命宮：以寅宮為 0，monthIndex(0-indexed) - timeIndex
function calcSoulIndex(lunarMonth, timeIdx) {
  return ((lunarMonth - 1 - timeIdx) % 12 + 12) % 12;
}

// 身宮：monthIndex + timeIndex
function calcBodyIndex(lunarMonth, timeIdx) {
  return (lunarMonth - 1 + timeIdx) % 12;
}

// 五行局（納音五行）
function calcFiveElements(heavenlyStem, earthlyBranch) {
  const ganNum = Math.floor(TIANGAN.indexOf(heavenlyStem) / 2) + 1;
  const zhiTable = [1,1,2,2,3,3,1,1,2,2,3,3]; // 子丑午未=1, 寅申卯酉=2, 辰戌巳亥=3
  const zhiNum = zhiTable[ZW_BRANCH.indexOf(earthlyBranch)];
  let idx = ganNum + zhiNum;
  while (idx > 5) idx -= 5;
  const table = {1:'木三局',2:'金四局',3:'水二局',4:'火六局',5:'土五局'};
  const numTable = {1:3,2:4,3:2,4:6,5:5};
  return { name: table[idx], num: numTable[idx] };
}

// 五虎遁：年干→命宮天干
function getPalaceStem(yearStem, soulIndex) {
  const startStem = TIGER_RULE[yearStem];
  const startIdx = TIANGAN.indexOf(startStem);
  return TIANGAN[(startIdx + soulIndex) % 10];
}

// 起紫微星
function calcZiweiIndex(lunarDay, wxjNum) {
  let offset = -1;
  let quotient, remainder;
  do {
    offset++;
    const divisor = lunarDay + offset;
    quotient = Math.floor(divisor / wxjNum);
    remainder = divisor % wxjNum;
  } while (remainder !== 0);

  quotient %= 12;
  let ziweiIdx = quotient - 1;

  if (offset % 2 === 0) {
    ziweiIdx += offset;
  } else {
    ziweiIdx -= offset;
  }
  ziweiIdx = ((ziweiIdx % 12) + 12) % 12;

  const tianfuIdx = (12 - ziweiIdx) % 12;
  return { ziweiIdx, tianfuIdx };
}

// ===================== 安星 =====================

function placeMajorStars(ziweiIdx, tianfuIdx) {
  const stars = Array.from({length:12}, () => []);

  // 紫微星系（逆時針）
  const zwGroup = ['紫微','天機','','太陽','武曲','天同','','','廉貞'];
  zwGroup.forEach((s, i) => {
    if (s) stars[(ziweiIdx - i + 12) % 12].push({name:s, type:'main'});
  });

  // 天府星系（順時針）- iztro 原始算法
  // 天府+1=太陰, +2=貪狼, +3=巨門, +4=天相, +5=天梁, +6=七殺, +10=破軍
  const tfGroup = ['天府','太陰','貪狼','巨門','天相','天梁','七殺','','','','破軍'];
  tfGroup.forEach((s, i) => {
    if (s) stars[(tianfuIdx + i) % 12].push({name:s, type:'main'});
  });

  return stars;
}

function placeMinorStars(lunarMonth, timeIdx, yearGan, yearZhi, soulIndex, bodyIndex) {
  const stars = Array.from({length:12}, () => []);

  // 左輔右弼（按月）
  const zuoIdx = (2 + lunarMonth - 1) % 12; // 辰起正月順數
  const youIdx = (10 - lunarMonth + 1 + 12) % 12; // 戌起正月逆數
  stars[zuoIdx].push({name:'左輔', type:'aux'});
  stars[youIdx].push({name:'右弼', type:'aux'});

  // 文昌文曲（按時）
  const changIdx = (10 - timeIdx + 12) % 12; // 戌起子時逆數
  const quIdx = (2 + timeIdx) % 12;           // 辰起子時順數
  stars[changIdx].push({name:'文昌', type:'aux'});
  stars[quIdx].push({name:'文曲', type:'aux'});

  // 天魁天鉞（按年干）
  const kuiTable = {'甲':[1,7],'乙':[0,8],'丙':[11,9],'丁':[11,9],'戊':[1,7],'己':[0,8],'庚':[1,7],'辛':[6,2],'壬':[3,5],'癸':[3,5]};
  const [kui, yue] = kuiTable[yearGan] || [0,0];
  stars[kui].push({name:'天魁', type:'aux'});
  stars[yue].push({name:'天鉞', type:'aux'});

  // 祿存擎羊陀羅（按年干）
  const luTable = {'甲':2,'乙':3,'丙':5,'丁':6,'戊':5,'己':6,'庚':8,'辛':9,'壬':11,'癸':0};
  const lu = luTable[yearGan];
  if (lu !== undefined) {
    stars[lu].push({name:'祿存', type:'aux'});
    stars[(lu+1)%12].push({name:'擎羊', type:'aux'});
    stars[(lu-1+12)%12].push({name:'陀羅', type:'aux'});
  }

  // 地空地劫（按時）
  const hai = 11;
  stars[(hai - timeIdx + 12) % 12].push({name:'地空', type:'aux'});
  stars[(hai + timeIdx) % 12].push({name:'地劫', type:'aux'});

  return stars;
}

// ===================== 主流程 =====================

function zwCalculate() {
  const year = +document.getElementById('zwYear').value;
  const month = +document.getElementById('zwMonth').value;
  const day = +document.getElementById('zwDay').value;
  const hour = +document.getElementById('zwHour').value;
  const gender = document.getElementById('zwGender').value;

  const lunar = Lunar.solarToLunar(year, month, day);
  const yearGan = lunar.yearGan;
  const yearZhi = lunar.yearZhi;

  // 命宮身宮
  const soulIndex = calcSoulIndex(lunar.month, hour);
  const bodyIndex = calcBodyIndex(lunar.month, hour);

  // 命宮天干地支
  const palaceStem = getPalaceStem(yearGan, soulIndex);
  const palaceBranch = ZW_BRANCH[(soulIndex + 2) % 12]; // +2 因為寅宮是起點

  // 五行局
  const wxj = calcFiveElements(palaceStem, palaceBranch);

  // 紫微天府位置
  const { ziweiIdx, tianfuIdx } = calcZiweiIndex(lunar.day, wxj.num);

  // 安主星
  const majorStars = placeMajorStars(ziweiIdx, tianfuIdx);

  // 安輔星
  const minorStars = placeMinorStars(lunar.month, hour, yearGan, yearZhi, soulIndex, bodyIndex);

  // 合併星曜 - 主星用寅宮基準，宮位用命宮基準，需轉換
  const palaces = [];
  for (let i = 0; i < 12; i++) {
    const br = (soulIndex + i + 2) % 12; // 命宮起，對應到地支
    // 轉換：寅宮基準的星曜索引 → 命宮基準的宮位索引
    const convertedMajor = [];
    majorStars.forEach((starList, starIdx) => {
      const palaceIdx = ((starIdx - soulIndex) % 12 + 12) % 12;
      if (palaceIdx === i) convertedMajor.push(...starList);
    });
    const convertedMinor = [];
    minorStars.forEach((starList, starIdx) => {
      const palaceIdx = ((starIdx - soulIndex) % 12 + 12) % 12;
      if (palaceIdx === i) convertedMinor.push(...starList);
    });
    palaces.push({
      name: ZW_PALACE[i],
      branch: ZW_BRANCH[br],
      stars: [...convertedMajor, ...convertedMinor],
      isMing: i === 0,
      isShen: i === ((bodyIndex - soulIndex) % 12 + 12) % 12
    });
  }

  zwDisplay(palaces, year, month, day, hour, gender, lunar, wxj.name, ziweiIdx, tianfuIdx, soulIndex, bodyIndex);
}

const ZW_MEANING={
  '紫微':'帝王星，主尊貴、權威、領導力。坐命者氣質出眾，有領導才能。',
  '天機':'智慧星，主聰明、機變、謀略。坐命者反應敏捷，善於思考。',
  '太陽':'光明星，主博愛、熱情、正直。坐命者光明磊落，樂於助人。',
  '武曲':'財星，主剛毅、果斷、理財。坐命者重視金錢，做事果斷。',
  '天同':'福星，主安逸、享受、隨和。坐命者性格溫和，喜歡安逸。',
  '廉貞':'次桃花星，主事業、感情、變化。坐命者事業心強，感情豐富。',
  '天府':'財庫星，主穩重、保守、理財。坐命者穩重可靠，善於守財。',
  '太陰':'田宅主，主陰柔、細膩、內斂。坐命者心思細膩，注重家庭。',
  '貪狼':'桃花星，主慾望、才華、交際。坐命者多才多藝，善於交際。',
  '巨門':'口舌星，主口才、分析、是非。坐命者口才佳，但易招是非。',
  '天相':'印星，主公正、服務、輔佐。坐命者公正無私，適合服務業。',
  '天梁':'蔭星，主壽命、化解、庇蔭。坐命者有化解災厄之力。',
  '七殺':'將星，主衝勁、冒險、開創。坐命者個性強勢，有開創力。',
  '破軍':'耗星，主破壞、變動、先破後立。坐命者勇於改變。'
};

function zwDisplay(palaces, year, month, day, hour, gender, lunar, wxjName, ziweiIdx, tianfuIdx, soulIndex, bodyIndex) {
  document.getElementById('zwResult').classList.remove('hidden');

  let info = `<p><span>出生：</span>${year}年${month}月${day}日 ${ZW_HOUR_NAMES[hour]}時 | <span>農曆：</span>${lunar.ganzhi} ${lunar.monthName} ${lunar.dayName}</p>`;
  info += `<p><span>性別：</span>${gender==='M'?'男':'女'} | <span>五行局：</span>${wxjName} | <span>紫微：</span>${ZW_BRANCH[(ziweiIdx+2)%12]} | <span>天府：</span>${ZW_BRANCH[(tianfuIdx+2)%12]}</p>`;
  info += `<p><span>命宮：</span>${palaces[0].branch} | <span>身宮：</span>${palaces.find(p=>p.isShen)?.branch||''}</p>`;
  document.getElementById('zwInfo').innerHTML = info;

  // 建立地支→宮位對照表
  const palaceByBranch = {};
  palaces.forEach(p => { palaceByBranch[p.branch] = p; });

  // 命盤格位 - 固定格子對應固定地支
  // 巳(5) 午(6) 未(7) 申(8)
  // 辰(4) [中心]    酉(9)
  // 卯(3) [中心]    戌(10)
  // 寅(2) 丑(1) 子(0) 亥(11)
  const gridLayout = [
    {r:1,c:1,br:5},{r:1,c:2,br:6},{r:1,c:3,br:7},{r:1,c:4,br:8},
    {r:2,c:1,br:4},{center:true},{r:2,c:4,br:9},
    {r:3,c:1,br:3},{r:3,c:4,br:10},
    {r:4,c:1,br:2},{r:4,c:2,br:1},{r:4,c:3,br:0},{r:4,c:4,br:11}
  ];

  let html = '';
  for (const cell of gridLayout) {
    if (cell.center) {
      html += `<div class="zw-center" style="grid-row:2/4;grid-column:2/3"><div class="zw-center-inner">
        <div class="zw-center-title">${lunar.ganzhi}</div>
        <div>${wxjName}</div>
        <div>${gender==='M'?'男':'女'}命</div>
        <div>命宮：${palaces[0].branch}</div>
        <div>身宮：${palaces.find(p=>p.isShen)?.branch||''}</div>
        <div>紫微：${ZW_BRANCH[(ziweiIdx+2)%12]}</div>
      </div></div>`;
      continue;
    }
    const branchName = ZW_BRANCH[cell.br];
    const p = palaceByBranch[branchName];
    if (!p) continue;

    let starHtml = '';
    for (const s of p.stars) {
      const cls = s.type === 'main' ? 'zw-sm' : 'zw-sa';
      starHtml += `<div class="zw-s-main"><span class="zw-s-name ${cls}">${s.name}</span></div>`;
    }
    const tag = p.isMing ? '<span class="zw-tag">命</span>' : p.isShen ? '<span class="zw-tag">身</span>' : '';
    html += `<div class="zw-cell${p.isMing?' zw-ming':''}" style="grid-row:${cell.r};grid-column:${cell.c}">
      <div class="zw-cell-name">${p.name}${tag}</div>
      <div class="zw-cell-br">${branchName}</div>
      <div class="zw-cell-stars">${starHtml || '<span class="zw-empty">—</span>'}</div>
    </div>`;
  }
  document.getElementById('zwGrid').innerHTML = html;

  let a = '<h4>命盤概要</h4>';
  const mp = palaces[0];
  const ms = mp.stars.filter(s => s.type === 'main');
  a += `<p><strong>命宮主星：</strong>${ms.map(s=>s.name).join('、')||'空宮'}</p>`;
  if (ms.length) for (const s of ms) a += `<p><strong>${s.name}：</strong>${ZW_MEANING[s.name]||''}</p>`;
  a += '<h4>十二宮星曜</h4>';
  for (const p of palaces) {
    const list = p.stars.length ? p.stars.map(s=>s.name).join('、') : '空宮';
    a += `<p><strong>${p.name}（${p.branch}）：</strong>${list}</p>`;
  }
  document.getElementById('zwAnalysis').innerHTML = a;
}
