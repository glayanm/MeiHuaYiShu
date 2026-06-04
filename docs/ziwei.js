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

  // 天德月德（按年干）
  const tiandeTable = {'甲':'酉','乙':'申','丙':'子','丁':'亥','戊':'寅','己':'卯','庚':'午','辛':'巳','壬':'未','癸':'丑'};
  const yuedeTable =  {'甲':'巳','乙':'午','丙':'未','丁':'申','戊':'酉','己':'戌','庚':'亥','辛':'子','壬':'丑','癸':'寅'};
  const BR = {'子':0,'丑':1,'寅':2,'卯':3,'辰':4,'巳':5,'午':6,'未':7,'申':8,'酉':9,'戌':10,'亥':11};
  if (tiandeTable[yearGan]) stars[BR[tiandeTable[yearGan]]].push({name:'天德', type:'helper'});
  if (yuedeTable[yearGan]) stars[BR[yuedeTable[yearGan]]].push({name:'月德', type:'helper'});

  // 紅鸞天喜（按年支）
  const hongluanIdx = (3 - yearZhi + 12) % 12; // 卯起子逆數
  const tianxiIdx = (hongluanIdx + 6) % 12;
  stars[hongluanIdx].push({name:'紅鸞', type:'flower'});
  stars[tianxiIdx].push({name:'天喜', type:'flower'});

  // 天姚天刑（按月）
  const tianyaoIdx = (1 + lunarMonth - 1) % 12; // 丑起正月順數
  const tianxingIdx = (9 + lunarMonth - 1) % 12; // 酉起正月順數
  stars[tianyaoIdx].push({name:'天姚', type:'flower'});
  stars[tianxingIdx].push({name:'天刑', type:'adjective'});

  // 華蓋咸池（按年支）
  const hgTable = {'寅':10,'午':10,'戌':10,'申':4,'子':4,'辰':4,'巳':1,'丑':1,'酉':1,'亥':7,'卯':7,'未':7};
  const xcTable = {'寅':3,'午':3,'戌':3,'申':9,'子':9,'辰':9,'巳':6,'丑':6,'酉':6,'亥':0,'卯':0,'未':0};
  const yz = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][yearZhi];
  if (hgTable[yz] !== undefined) stars[hgTable[yz]].push({name:'華蓋', type:'adjective'});
  if (xcTable[yz] !== undefined) stars[xcTable[yz]].push({name:'咸池', type:'flower'});

  // 孤辰寡宿（按年支）
  const guTable = {'寅':5,'卯':5,'辰':5,'巳':8,'午':8,'未':8,'申':11,'酉':11,'戌':11,'亥':2,'子':2,'丑':2};
  const guaTable = {'寅':1,'卯':1,'辰':1,'巳':4,'午':4,'未':4,'申':7,'酉':7,'戌':7,'亥':10,'子':10,'丑':10};
  if (guTable[yz] !== undefined) stars[guTable[yz]].push({name:'孤辰', type:'adjective'});
  if (guaTable[yz] !== undefined) stars[guaTable[yz]].push({name:'寡宿', type:'adjective'});

  // 天馬（按年支）- 只在四馬地
  const maTable = {'寅':8,'午':8,'戌':8,'申':2,'子':2,'辰':2,'巳':11,'丑':11,'酉':11,'亥':5,'卯':5,'未':5};
  if (maTable[yz] !== undefined) stars[maTable[yz]].push({name:'天馬', type:'adjective'});

  // 龍池鳳閣（按年支）
  stars[(4 + yearZhi) % 12].push({name:'龍池', type:'adjective'});
  stars[(10 - yearZhi + 12) % 12].push({name:'鳳閣', type:'adjective'});

  // 天哭天虛（按年支）
  stars[(6 - yearZhi + 12) % 12].push({name:'天哭', type:'adjective'});
  stars[(6 + yearZhi) % 12].push({name:'天虛', type:'adjective'});

  // 天才天壽（按命宮、身宮 + 年支）
  stars[(soulIndex + yearZhi) % 12].push({name:'天才', type:'adjective'});
  stars[(bodyIndex + yearZhi) % 12].push({name:'天壽', type:'adjective'});

  return stars;
}

// 十二宮描述
const ZW_PALACE_DESC = {
  '命宮': '命宮代表先天性格、外貌、能力、整體命運格局。是命盤的核心，決定一個人的基本特質與人生方向。',
  '父母': '父母宮代表與父母的緣分、上司關係、遺傳特質、教育背景。也反映父母的健康與事業狀況。',
  '福德': '福德宮代表精神生活、興趣嗜好、內心世界、祖德福蔭。反映一個人的幸福感與心靈狀態。',
  '田宅': '田宅宮代表不動產、居住環境、家庭根基、庫藏財。也反映與家人的關係和家庭運勢。',
  '官祿': '官祿宮代表事業運、工作能力、考試運、社會地位。是判斷事業發展的重要宮位。',
  '交友': '交友宮代表下屬、朋友、同事關係、社交能力。也反映受人擁戴的程度。',
  '遷移': '遷移宮代表外出運、旅行、貴人、社會環境。也反映在外的適應能力和際遇。',
  '疾厄': '疾厄宮代表健康狀況、疾病類型、意外災厄。是判斷身體狀況的重要宮位。',
  '財帛': '財帛宮代表財運、理財能力、收入來源、賺錢方式。反映一個人的經濟狀況。',
  '子女': '子女宮代表子女緣分、生育狀況、性生活、學生緣分。也反映與晚輩的關係。',
  '夫妻': '夫妻宮代表婚姻感情、配偶特質、戀愛運勢。是判斷感情生活的重要宮位。',
  '兄弟': '兄弟宮代表兄弟姐妹緣分、同事朋友關係、合夥運勢。也反映同輩之間的互動。'
};

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

// 星曜亮度（依寅宮起排列）：廟>旺>得>利>平>不>陷
// 來源: iztro STARS_INFO
const ZW_BRIGHTNESS = {
  '紫微': ['旺','旺','得','旺','廟','廟','旺','旺','得','旺','平','廟'],
  '天機': ['得','旺','利','平','廟','陷','得','旺','利','平','廟','陷'],
  '太陽': ['旺','廟','旺','旺','旺','得','得','陷','不','陷','陷','不'],
  '武曲': ['得','利','廟','平','旺','廟','得','利','廟','平','旺','廟'],
  '天同': ['利','平','平','廟','陷','不','旺','平','平','廟','旺','不'],
  '廉貞': ['廟','平','利','陷','平','利','廟','平','利','陷','平','利'],
  '天府': ['廟','得','廟','得','旺','廟','得','旺','廟','得','廟','廟'],
  '太陰': ['旺','陷','陷','陷','不','不','利','不','旺','廟','廟','廟'],
  '貪狼': ['平','利','廟','陷','旺','廟','平','利','廟','陷','旺','廟'],
  '巨門': ['廟','廟','陷','旺','旺','不','廟','廟','陷','旺','旺','不'],
  '天相': ['廟','陷','得','得','廟','得','廟','陷','得','得','廟','廟'],
  '天梁': ['廟','廟','廟','陷','廟','旺','陷','得','廟','陷','廟','旺'],
  '七殺': ['廟','旺','廟','平','旺','廟','廟','廟','廟','平','旺','廟'],
  '破軍': ['得','陷','旺','平','廟','旺','得','陷','旺','平','廟','旺'],
  '文昌': ['陷','利','得','廟','陷','利','得','廟','陷','利','得','廟'],
  '文曲': ['平','旺','得','廟','陷','旺','得','廟','陷','旺','得','廟']
};

const ZW_BRI_LABELS = {'miao':'廟','wang':'旺','de':'得','li':'利','ping':'平','bu':'不','xian':'陷'};

function getBrightness(starName, branchIdx) {
  const arr = ZW_BRIGHTNESS[starName];
  if (!arr) return '';
  // branchIdx 是地支索引(0=子...11=亥)，亮度表以寅(2)為起點
  const briIdx = ((branchIdx - 2) % 12 + 12) % 12;
  return arr[briIdx] || '';
}

function getBriClass(bri) {
  if (bri === '廟' || bri === '旺') return 'bri-best';
  if (bri === '得' || bri === '利') return 'bri-good';
  if (bri === '平') return 'bri-mid';
  if (bri === '不' || bri === '陷') return 'bri-bad';
  return '';
}

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
      const bri = getBrightness(s.name, cell.br);
      const briClass = getBriClass(bri);
      const briTag = bri ? `<span class="zw-bri ${briClass}">${bri}</span>` : '';
      starHtml += `<div class="zw-s-main"><span class="zw-s-name ${cls}">${s.name}</span>${briTag}</div>`;
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

  a += '<h4>十二宮詳解</h4>';
  for (const p of palaces) {
    const mainStars = p.stars.filter(s => s.type === 'main').map(s => s.name);
    const auxStars = p.stars.filter(s => s.type === 'aux' || s.type === 'helper' || s.type === 'flower').map(s => s.name);
    const desc = ZW_PALACE_DESC[p.name] || '';

    a += `<div class="palace-analysis">`;
    a += `<h5>${p.name}（${p.branch}）${p.isMing ? ' ★命宮' : ''}${p.isShen ? ' ★身宮' : ''}</h5>`;
    a += `<p class="palace-desc">${desc}</p>`;
    if (mainStars.length) a += `<p><strong>主星：</strong>${mainStars.join('、')}</p>`;
    if (auxStars.length) a += `<p><strong>輔星：</strong>${auxStars.join('、')}</p>`;
    if (!mainStars.length && !auxStars.length) a += `<p><em>空宮（無主星輔星）</em></p>`;
    a += `</div>`;
  }
  document.getElementById('zwAnalysis').innerHTML = a;
}
