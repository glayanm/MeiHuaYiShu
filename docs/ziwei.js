const ZW_PALACE=['命宮','兄弟','夫妻','子女','財帛','疾厄','遷移','交友','事業','田宅','福德','父母'];
const ZW_BRANCH=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ZW_GAN=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZW_HOUR_NAMES=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 五行局查找表：命宮地支(0-11) × 年天干(0-9) → 五行局(1-5)
// 1=水二局,2=火六局,3=木三局,4=金四局,5=土五局
const ZW_WXJ=[
[3,3,2,2,5,5,4,4,1,1],[4,4,3,3,1,1,5,5,2,2],[5,5,4,4,2,2,1,1,3,3],
[1,1,5,5,3,3,2,2,4,4],[2,2,1,1,4,4,3,3,5,5],[3,3,2,2,5,5,4,4,1,1],
[4,4,3,3,1,1,5,5,2,2],[5,5,4,4,2,2,1,1,3,3],[1,1,5,5,3,3,2,2,4,4],
[2,2,1,1,4,4,3,3,5,5],[3,3,2,2,5,5,4,4,1,1],[4,4,3,3,1,1,5,5,2,2]];
const ZW_WXJ_NAMES=['','水二局','火六局','木三局','金四局','土五局'];

// 紫微位置：五行局(1-5) × 農曆日(1-30) → 紫微宮位(0-11)
const ZW_ZIWEI_POS=[
  [], // placeholder
  [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,0,0,1,1,2,2], // 水二局
  [0,0,0,0,0,0,1,1,1,1,1,1,2,2,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5], // 火六局
  [0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9], // 木三局
  [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7], // 金四局
  [0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,5,5,5,5,5]  // 土五局
];

// 紫微星系位置表：紫微宮位(0-11) → [紫微,天機,太陽,武曲,天同,廉貞]
const ZW_ZIWEI_GROUP=[
  [0,11,1,2,3,8],[1,0,2,3,4,9],[2,1,3,4,5,10],[3,2,4,5,6,11],
  [4,3,5,6,7,0],[5,4,7,8,9,2],[6,5,8,9,10,3],[7,6,9,10,11,4],
  [8,7,10,11,0,5],[9,8,11,0,1,6],[10,9,0,1,2,7],[11,10,1,2,3,8]
];

// 天府星系位置表：紫微宮位(0-11) → [天府,太陰,貪狼,巨門,天相,天梁,七殺,破軍]
const ZW_TIANGFU_GROUP=[
  [6,5,4,3,2,1,0,9],[7,6,5,4,3,2,1,10],[8,7,6,5,4,3,2,11],
  [9,8,7,6,5,4,3,0],[10,9,8,7,6,5,4,1],[11,10,9,8,7,6,5,2],
  [0,11,10,9,8,7,6,3],[1,0,11,10,9,8,7,4],[2,1,0,11,10,9,8,5],
  [3,2,1,0,11,10,9,6],[4,3,2,1,0,11,10,7],[5,4,3,2,1,0,11,8]
];

// 輔星：文昌文曲左右魁鉞
function zwPlaceAux(gan,lunarMonth,mingGongBranch){
  const grid={};
  const add=(pos,name)=>{pos=((pos%12)+12)%12;if(!grid[pos])grid[pos]=[];grid[pos].push(name)};
  // 文昌：根據年干
  const wcPos=[9,8,7,6,5,4,3,2,1,0][gan];
  add(wcPos,'文昌');
  // 文曲：根據年干
  const wqPos=[5,6,7,8,9,10,11,0,1,2][gan];
  add(wqPos,'文曲');
  // 左輔：根據農曆月
  add(lunarMonth+1,'左輔');
  // 右弼：根據農曆月
  add(12-lunarMonth+1,'右弼');
  // 天魁天鉞：根據年干
  const kuiPos=[1,0,11,10,9,8,7,6,5,4][gan];
  const yuePos=[7,6,5,4,3,2,1,0,11,10][gan];
  add(kuiPos,'天魁');
  add(yuePos,'天鉞');
  return grid;
}

const ZW_STAR_MEANING={
  '紫微':'帝王星，主尊貴、權威、領導力',
  '天機':'智慧星，主聰明、機變、謀略',
  '太陽':'光明星，主博愛、熱情、正直',
  '武曲':'財星，主剛毅、果斷、理財',
  '天同':'福星，主安逸、享受、隨和',
  '廉貞':'次桃花星，主事業、感情、變化',
  '天府':'財庫星，主穩重、保守、理財',
  '太陰':'田宅主，主陰柔、細膩、內斂',
  '貪狼':'桃花星，主慾望、才華、交際',
  '巨門':'口舌星，主口才、分析、是非',
  '天相':'印星，主公正、服務、輔佐',
  '天梁':'蔭星，主壽命、化解、庇蔭',
  '七殺':'將星，主衝勁、冒險、開創',
  '破軍':'耗星，主破壞、變動、先破後立'
};

function zwCalculate(){
  const year=+document.getElementById('zwYear').value;
  const month=+document.getElementById('zwMonth').value;
  const day=+document.getElementById('zwDay').value;
  const hour=+document.getElementById('zwHour').value;
  const gender=document.getElementById('zwGender').value;

  const lunar=Lunar.solarToLunar(year,month,day);
  const gan=(year-4)%10;

  // 命宮 = (13 - 農曆月 - 時辰) mod 12
  const mingBranch=(13-lunar.month-hour+24)%12;
  // 身宮 = (13 - 農曆月 + 時辰) mod 12
  const shenBranch=(13-lunar.month+hour)%12;

  // 五行局
  const wxj=ZW_WXJ[mingBranch][gan];
  const wxjName=ZW_WXJ_NAMES[wxj];

  // 紫微位置
  const ziweiPos=ZW_ZIWEI_POS[wxj][Math.min(lunar.day-1,29)];

  // 星曜位置
  const ziweiGroup=ZW_ZIWEI_GROUP[ziweiPos];
  const tianfuGroup=ZW_TIANGFU_GROUP[ziweiPos];
  const auxGrid=zwPlaceAux(gan,lunar.month,mingBranch);

  // 建立12宮資料
  const palaces=[];
  for(let i=0;i<12;i++){
    const branch=(mingBranch+i)%12;
    const stars=[];
    // 紫微星系
    const zwNames=['紫微','天機','太陽','武曲','天同','廉貞'];
    for(let j=0;j<6;j++){
      if(ziweiGroup[j]===branch)stars.push({name:zwNames[j],type:'main'});
    }
    // 天府星系
    const tfNames=['天府','太陰','貪狼','巨門','天相','天梁','七殺','破軍'];
    for(let j=0;j<8;j++){
      if(tianfuGroup[j]===branch)stars.push({name:tfNames[j],type:'main'});
    }
    // 輔星
    if(auxGrid[branch])stars.push(...auxGrid[branch].map(n=>({name:n,type:'aux'})));

    palaces.push({
      name:ZW_PALACE[i],
      branch:ZW_BRANCH[branch],
      branchIdx:branch,
      stars,
      isMing:i===0,
      isShen:branch===shenBranch
    });
  }

  zwDisplay(palaces,year,month,day,hour,gender,lunar,wxjName,ziweiPos,mingBranch,shenBranch);
}

function zwDisplay(palaces,year,month,day,hour,gender,lunar,wxjName,ziweiPos,mingBranch,shenBranch){
  document.getElementById('zwResult').classList.remove('hidden');

  // Info
  const gan=(year-4)%10;
  let info=`<p><span>出生：</span>${year}年${month}月${day}日 ${ZW_HOUR_NAMES[hour]}時</p>`;
  info+=`<p><span>農曆：</span>${lunar.ganzhi} ${lunar.monthName} ${lunar.dayName}</p>`;
  info+=`<p><span>性別：</span>${gender==='M'?'男':'女'} | <span>五行局：</span>${wxjName}</p>`;
  info+=`<p><span>命宮：</span>${ZW_BRANCH[mingBranch]} | <span>身宮：</span>${ZW_BRANCH[shenBranch]} | <span>紫微：</span>${ZW_BRANCH[ziweiPos]}</p>`;
  document.getElementById('zwInfo').innerHTML=info;

  // 4x4 Grid layout
  // 巳(5) 午(6) 未(7) 申(8)
  // 辰(4) [center]   酉(9)
  // 卯(3) [center]   戌(10)
  // 寅(2) 丑(1) 子(0) 亥(11)
  const layout=[[5,6,7,8],[4,-1,9,-1],[3,-1,10,-1],[2,1,0,11]];
  let html='';
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      const idx=layout[r][c];
      if(idx===-1){
        if(r===1&&c===1){
          html+=`<div class="zw-palace center-palace" style="grid-row:span 2;grid-column:span 1;display:flex;align-items:center;justify-content:center"><div style="text-align:center;font-size:.72rem;color:var(--gold);line-height:2"><strong>${lunar.ganzhi}</strong><br>${wxjName}<br>${gender==='M'?'男':'女'}命<br>命宮：${ZW_BRANCH[mingBranch]}<br>身宮：${ZW_BRANCH[shenBranch]}<br>紫微：${ZW_BRANCH[ziweiPos]}</div></div>`;
        }
        continue;
      }
      const p=palaces[idx];
      let starHtml='';
      for(const s of p.stars){
        const cls=s.type==='main'?'main':'aux';
        starHtml+=`<span class="zw-star ${cls}">${s.name}</span> `;
      }
      const tag=p.isMing?'（命）':p.isShen?'（身）':'';
      html+=`<div class="zw-palace${p.isMing?' ming':''}"><div class="zw-palace-name">${p.name}${tag}</div><div class="zw-palace-branch">${p.branch}</div><div class="zw-stars">${starHtml||'<span style="color:var(--t2);font-size:.68rem">—</span>'}</div></div>`;
    }
  }
  document.getElementById('zwGrid').innerHTML=html;

  // Analysis
  let a='<h4>命盤概要</h4>';
  const mingP=palaces[0];
  const mainStars=mingP.stars.filter(s=>s.type==='main');
  a+=`<p><strong>命宮主星：</strong>${mainStars.map(s=>s.name).join('、')||'空宮（無主星）'}</p>`;
  if(mainStars.length>0)a+=`<p>${mainStars.map(s=>`<strong>${s.name}：</strong>${ZW_STAR_MEANING[s.name]||''}`).join('<br>')}</p>`;
  a+='<h4>十二宮星曜</h4>';
  for(const p of palaces){
    if(p.stars.length>0){
      a+=`<p><strong>${p.name}（${p.branch}）：</strong>${p.stars.map(s=>s.name).join('、')}</p>`;
    }
  }
  document.getElementById('zwAnalysis').innerHTML=a;
}
