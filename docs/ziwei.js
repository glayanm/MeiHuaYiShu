const ZW_PALACE_NAMES=['命宮','兄弟','夫妻','子女','財帛','疾厄','遷移','交友','事業','田宅','福德','父母'];
const ZW_PALACE_NAMES_2=['命宮','兄弟','夫妻','子女','財帛','疾厄','遷移','僕役','官祿','田宅','福德','父母'];
const ZW_BRANCH_NAMES=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const ZW_MAIN_STARS=['紫微','天機','太陽','武曲','天同','廉貞','天府','太陰','貪狼','巨門','天相','天梁','七殺','破軍'];
const ZW_AUX_STARS=['文昌','文曲','左輔','右弼','天魁','天鉞'];

// 五行局數（1=水二局,2=火六局,3=木三局,4=金四局,5=土五局）
const ZW_WUXING_NAMES=['','水二局','火六局','木三局','金四局','土五局'];
const ZW_WUXING_NUMS=[0,2,6,3,4,5];

// 天干對應五行：甲乙木,丙丁火,戊己土,庚辛金,壬癸水
const ZW_GAN_WUXING=[3,3,2,2,5,5,4,4,1,1]; // 五行局索引

// 命宮地支 × 天干 → 五行局
const ZW_WUXING_TABLE=[
  [3,3,2,2,5,5,4,4,1,1], // 子
  [4,4,3,3,1,1,5,5,2,2], // 丑
  [5,5,4,4,2,2,1,1,3,3], // 寅
  [1,1,5,5,3,3,2,2,4,4], // 卯
  [2,2,1,1,4,4,3,3,5,5], // 辰
  [3,3,2,2,5,5,4,4,1,1], // 巳
  [4,4,3,3,1,1,5,5,2,2], // 午
  [5,5,4,4,2,2,1,1,3,3], // 未
  [1,1,5,5,3,3,2,2,4,4], // 申
  [2,2,1,1,4,4,3,3,5,5], // 酉
  [3,3,2,2,5,5,4,4,1,1], // 戌
  [4,4,3,3,1,1,5,5,2,2], // 亥
];

// 紫微星位置表：五行局[wuxing][日數] → 紫微所在宮位(0-11)
// wuxing: 1=水二局,2=火六局,3=木三局,4=金四局,5=土五局
const ZW_ZIWEI_POS={
  1:[0,1,2,3,4,5,6,7,8,9,10,11], // 水二局：每2日進一宮
  2:[0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11], // 火六局
  3:[0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9,10], // 木三局
  4:[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7], // 金四局
  5:[0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6,7], // 土五局
};

function zwGetZiweiPos(wuxing,day){
  const table=ZW_ZIWEI_POS[wuxing];
  if(!table||day<1||day>30)return 0;
  return table[Math.min(day-1,table.length-1)];
}

function zwCalculate(){
  const year=parseInt(document.getElementById('zwYear').value);
  const month=parseInt(document.getElementById('zwMonth').value);
  const day=parseInt(document.getElementById('zwDay').value);
  const hour=parseInt(document.getElementById('zwHour').value);
  const gender=document.getElementById('zwGender').value;

  // Convert to lunar
  const lunar=Lunar.solarToLunar(year,month,day);
  const lMonth=lunar.month;
  const lDay=lunar.day;

  // Calculate 命宮 (birth month + birth hour)
  // 命宮 = (13 - month - hour) % 12
  let mingGong=(13-lMonth-hour)%12;
  if(mingGong<0)mingGong+=12;

  // 身宮 = (13 - month + hour) % 12
  let shenGong=(13-lMonth+hour)%12;
  if(shenGong>=12)shenGong-=12;

  // 天干
  const gan=(year-4)%10;
  const zhi=(year-4)%12;

  // 五行局
  const wuxing=ZW_WUXING_TABLE[mingGong][gan];
  const wuxingName=ZW_WUXING_NAMES[wuxing];
  const wuxingNum=ZW_WUXING_NUMS[wuxing];

  // 紫微星位置
  const ziweiPos=zwGetZiweiPos(wuxing,lDay);

  // 安紫微星系（紫微、天機、太陽、武曲、天同、廉貞）
  const ziweiStars=zwPlaceZiweiStars(ziweiPos);

  // 安天府星系（天府、太陰、貪狼、巨門、天相、天梁、七殺、破軍）
  const tianfuStars=zwPlaceTianfuStars(ziweiPos);

  // 安輔星
  const auxStars=zwPlaceAuxStars(gan,mingGong);

  // Build palace data
  const palaces=[];
  for(let i=0;i<12;i++){
    const branchIdx=(mingGong+i)%12;
    const stars=[];
    // Main stars
    if(ziweiStars[i])stars.push({name:ziweiStars[i],type:'main'});
    if(tianfuStars[i])stars.push({name:tianfuStars[i],type:'main'});
    // Aux stars
    if(auxStars[i])stars.push(...auxStars[i].map(s=>({name:s,type:'aux'})));
    palaces.push({
      name:ZW_PALACE_NAMES[i],
      branch:ZW_BRANCH_NAMES[branchIdx],
      branchIdx,
      stars,
      isMing:i===0,
      isShen:branchIdx===shenGong,
      palaceIdx:i
    });
  }

  // Display
  zwDisplayResult(palaces,year,month,day,hour,gender,lunar,wuxingName,ziweiPos,mingGong,shenGong);
}

function zwPlaceZiweiStars(ziweiPos){
  // 紫微星系：紫微、天機、太陽、武曲、天同、廉貞
  // 天機在紫微逆行1宮，太陽在紫微順行2宮，武曲在紫微順行3宮，天同在紫微順行4宮，廉貞在紫微順行5宮
  const grid=new Array(12).fill(null);
  const offsets=[
    {name:'紫微',offset:0,direction:1},
    {name:'天機',offset:-1,direction:-1},
    {name:'太陽',offset:2,direction:1},
    {name:'武曲',offset:3,direction:1},
    {name:'天同',offset:4,direction:1},
    {name:'廉貞',offset:5,direction:1},
  ];
  for(const s of offsets){
    let pos=(ziweiPos+s.offset+12)%12;
    if(s.direction===-1)pos=(ziweiPos+s.offset+12)%12;
    grid[pos]=s.name;
  }
  return grid;
}

function zwPlaceTianfuStars(ziweiPos){
  // 天府在紫微的對宮（相差6宮）
  // 天府星系：天府、太陰、貪狼、巨門、天相、天梁、七殺、破軍
  const grid=new Array(12).fill(null);
  const tianfuPos=(ziweiPos+6)%12;
  const offsets=[
    {name:'天府',offset:0},
    {name:'太陰',offset:-1},
    {name:'貪狼',offset:-2},
    {name:'巨門',offset:-3},
    {name:'天相',offset:-4},
    {name:'天梁',offset:-5},
    {name:'七殺',offset:-6},
    {name:'破軍',offset:3},
  ];
  for(const s of offsets){
    const pos=(tianfuPos+s.offset+12)%12;
    grid[pos]=s.name;
  }
  return grid;
}

function zwPlaceAuxStars(gan,mingGong){
  const grid={};
  // 文昌：根據出生年天干確定位置
  const wenchangPos=(gan+1)%12;
  if(!grid[wenchangPos])grid[wenchangPos]=[];
  grid[wenchangPos].push('文昌');

  // 文曲：根據出生年天干確定位置
  const wenquPos=(12-gan)%12;
  if(!grid[wenquPos])grid[wenquPos]=[];
  grid[wenquPos].push('文曲');

  // 左輔：根據出生月確定
  const zuofuPos=(mingGong+2)%12;
  if(!grid[zuofuPos])grid[zuofuPos]=[];
  grid[zuofuPos].push('左輔');

  // 右弼：根據出生月確定
  const youbiPos=(12-mingGong+2)%12;
  if(!grid[youbiPos])grid[youbiPos]=[];
  grid[youbiPos].push('右弼');

  // 天魁、天鉞：根據年干
  const kuiPos=[1,0,11,10,9,8,7,6,5,4][gan];
  const yuePos=[7,6,5,4,3,2,1,0,11,10][gan];
  if(!grid[kuiPos])grid[kuiPos]=[];
  grid[kuiPos].push('天魁');
  if(!grid[yuePos])grid[yuePos]=[];
  grid[yuePos].push('天鉞');

  return grid;
}

function zwDisplayResult(palaces,year,month,day,hour,gender,lunar,wuxingName,ziweiPos,mingGong,shenGong){
  document.getElementById('zwResult').classList.remove('hidden');

  // Info
  const gan=(year-4)%10,zhi=(year-4)%12;
  const hourNames=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  let info=`<p><span>出生：</span>${year}年${month}月${day}日 ${hourNames[hour]}時</p>`;
  info+=`<p><span>農曆：</span>${lunar.ganzhi} ${lunar.monthName} ${lunar.dayName}</p>`;
  info+=`<p><span>性別：</span>${gender==='M'?'男':'女'}</p>`;
  info+=`<p><span>五行局：</span>${wuxingName}</p>`;
  info+=`<p><span>命宮：</span>${ZW_BRANCH_NAMES[mingGong]}宮 | <span>身宮：</span>${ZW_BRANCH_NAMES[shenGong]}宮</p>`;
  document.getElementById('zwInfo').innerHTML=info;

  // Grid - 4x4 with center being the chart info
  // Layout: 12 palaces around the outside
  // Row 0: 巳 午 未 申
  // Row 1: 辰 [center] 酉
  // Row 2: 卯 [center] 戌
  // Row 3: 寅 丑 子 亥
  const layout=[
    [5,6,7,8],
    [4,-1,9,-1],
    [3,-1,10,-1],
    [2,1,0,11]
  ];

  let gridHtml='';
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      const pIdx=layout[r][c];
      if(pIdx===-1){
        if(r===1&&c===1){
          gridHtml+=`<div class="zw-palace center-palace" style="grid-row:span 2"><div style="text-align:center;font-size:.72rem;color:var(--gold);line-height:1.8"><strong>${lunar.ganzhi}</strong><br>${wuxingName}<br>${gender==='M'?'男':'女'}命<br>命宮：${ZW_BRANCH_NAMES[mingGong]}<br>身宮：${ZW_BRANCH_NAMES[shenGong]}</div></div>`;
        }
        continue;
      }
      const p=palaces[pIdx];
      let starHtml='';
      for(const s of p.stars){
        const cls=s.type==='main'?'main':s.type==='aux'?'aux':'minor';
        starHtml+=`<span class="zw-star ${cls}">${s.name}</span> `;
      }
      const isMing=p.isMing?'（命）':'';
      const isShen=p.isShen?'（身）':'';
      gridHtml+=`<div class="zw-palace${p.isMing?' highlight':''}"><div class="zw-palace-name">${p.name}${isMing}${isShen}</div><div class="zw-palace-branch">${p.branch}</div><div>${starHtml}</div></div>`;
    }
  }
  document.getElementById('zwGrid').innerHTML=gridHtml;

  // Analysis
  let analysis='<h4>命盤概要</h4>';
  const mingPalace=palaces[0];
  analysis+=`<p><strong>命宮主星：</strong>${mingPalace.stars.filter(s=>s.type==='main').map(s=>s.name).join('、')||'無主星'}</p>`;
  analysis+=`<p><strong>命宮在${mingPalace.branch}宮：</strong></p>`;

  // Star analysis
  analysis+='<h4>主要星曜</h4>';
  for(const p of palaces){
    if(p.stars.length>0){
      const mainStars=p.stars.filter(s=>s.type==='main');
      if(mainStars.length>0){
        analysis+=`<p><strong>${p.name}（${p.branch}）：</strong>${mainStars.map(s=>s.name).join('、')} — ${zwStarMeaning(mainStars[0].name)}</p>`;
      }
    }
  }

  document.getElementById('zwAnalysis').innerHTML=analysis;
}

function zwStarMeaning(name){
  const meanings={
    '紫微':'帝王之星，主尊貴、權威、領導力。紫微坐命者氣質出眾，有領導才能。',
    '天機':'智慧之星，主聰明、機變、謀略。天機坐命者反應敏捷，善於思考。',
    '太陽':'光明之星，主博愛、熱情、正直。太陽坐命者光明磊落，樂於助人。',
    '武曲':'財星之首，主剛毅、果斷、理財。武曲坐命者重視金錢，做事果斷。',
    '天同':'福星，主安逸、享受、隨和。天同坐命者性格溫和，喜歡安逸生活。',
    '廉貞':'次桃花星，主事業、感情、變化。廉貞坐命者事業心強，感情豐富。',
    '天府':'財庫之星，主穩重、保守、理財。天府坐命者穩重可靠，善於守財。',
    '太陰':'田宅主，主陰柔、細膩、內斂。太陰坐命者心思細膩，注重家庭。',
    '貪狼':'桃花星，主慾望、才華、交際。貪狼坐命者多才多藝，善於交際。',
    '巨門':'口舌星，主口才、分析、是非。巨門坐命者口才佳，但易招是非。',
    '天相':'印星，主公正、服務、輔佐。天相坐命者公正無私，適合服務業。',
    '天梁':'蔭星，主壽命、化解、庇蔭。天梁坐命者有化解災厄之力，長壽。',
    '七殺':'將星，主衝勁、冒險、開創。七殺坐命者個性強勢，有開創力。',
    '破軍':'耗星，主破壞、變動、先破後立。破軍坐命者不喜受約束，勇於改變。'
  };
  return meanings[name]||''
}
