const ZW_PALACE=['命宮','兄弟','夫妻','子女','財帛','疾厄','遷移','交友','事業','田宅','福德','父母'];
const ZW_BRANCH=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ZW_HOUR_NAMES=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 五行局：命宮地支(0-11) × 年天干(0-9) → 五行局(1-5)
// 1=水二局,2=火六局,3=木三局,4=金四局,5=土五局
// 來源: cubshuang/ZiWeiDouShu FiveEleArr + FiveElements 對照
const ZW_WXJ=[
[4,4,3,3,2,2,1,1,5,5],[2,2,1,1,5,5,4,4,3,3],[3,3,2,2,1,1,5,5,4,4],
[5,5,4,4,3,3,2,2,1,1],[1,1,5,5,4,4,3,3,2,2],[4,4,3,3,2,2,1,1,5,5],
[2,2,1,1,5,5,4,4,3,3],[3,3,2,2,1,1,5,5,4,4],[5,5,4,4,3,3,2,2,1,1],
[1,1,5,5,4,4,3,3,2,2],[4,4,3,3,2,2,1,1,5,5],[2,2,1,1,5,5,4,4,3,3]];
const ZW_WXJ_NAMES=['','水二局','火六局','木三局','金四局','土五局'];

// 紫微位置：五行局(1-5) × 農曆日(1-30) → 宮位(0-11)
// 來源: cubshuang/ZiWeiDouShu FiveEleTable
const ZW_ZIWEI_POS=[[],
[1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,0,0,1,1,2,2,3,3,4], // 水二局
[9,6,11,4,1,2,10,7,0,5,2,3,11,8,1,6,3,4,0,9,2,7,4,5,1,10,3,8,5,6], // 火六局
[6,11,4,1,2,7,0,5,2,3,8,1,6,3,4,9,2,7,4,5,10,3,8,5,6,11,4,9,6,7], // 土五局
[4,1,2,5,2,3,6,3,4,7,4,5,8,5,6,9,6,7,10,7,8,11,8,9,0,9,10,1,10,11], // 木三局
[11,4,1,2,0,5,2,3,1,6,3,4,2,7,4,5,3,8,5,6,4,9,6,7,5,10,7,8,6,11]]; // 金四局

// 紫微星系：紫微位置 → [紫微,天機,太陽,武曲,天同,廉貞]
// 來源: cubshuang/ZiWeiDouShu Star_Z06
const ZW_ZW_GROUP=[
  [0,11,9,8,7,4],[1,0,10,9,8,5],[2,1,11,10,9,6],[3,2,0,11,10,7],
  [4,3,1,0,11,8],[5,4,2,1,0,9],[6,5,3,2,1,10],[7,6,4,3,2,11],
  [8,7,5,4,3,0],[9,8,6,5,4,1],[10,9,7,6,5,2],[11,10,8,7,6,3]];
const ZW_ZW_NAMES=['紫微','天機','太陽','武曲','天同','廉貞'];

// 天府星系：紫微位置 → [天府,太陰,貪狼,巨門,天相,天梁,七殺,破軍]
// 來源: cubshuang/ZiWeiDouShu Star_T08
const ZW_TF_GROUP=[
  [6,7,8,9,10,11,0,5],[7,8,9,10,11,0,1,6],[8,9,10,11,0,1,2,7],
  [9,10,11,0,1,2,3,8],[10,11,0,1,2,3,4,9],[11,0,1,2,3,4,5,10],
  [0,1,2,3,4,5,6,11],[1,2,3,4,5,6,7,0],[2,3,4,5,6,7,8,1],
  [3,4,5,6,7,8,9,2],[4,5,6,7,8,9,10,3],[5,6,7,8,9,10,11,4]];
const ZW_TF_NAMES=['天府','太陰','貪狼','巨門','天相','天梁','七殺','破軍'];

// 輔星：文昌文曲左右魁鉞
// 來源: cubshuang/ZiWeiDouShu Star_G07
function zwPlaceAux(gan,month,mingBranch){
  const g={};
  const add=(p,n)=>{p=((p%12)+12)%12;if(!g[p])g[p]=[];g[p].push(n)};
  // 文昌: 時辰對照 (參考 Star_G07[0])
  const wcTable=[10,9,8,7,6,5,4,3,2,1,0,11];
  add(wcTable[mingBranch],'文昌'); // 暫用命宮地支,正規應用地支時辰
  // 文曲: 時辰對照 (參考 Star_G07[1])
  const wqTable=[4,5,6,7,8,9,10,11,0,1,2,3];
  add(wqTable[mingBranch],'文曲');
  // 左輔: 月 (參考 Star_G07[2])
  const zfTable=[4,5,6,7,8,9,10,11,0,1,2,3];
  add(zfTable[month-1],'左輔');
  // 右弼: 月 (參考 Star_G07[3])
  const ybTable=[10,9,8,7,6,5,4,3,2,1,0,11];
  add(ybTable[month-1],'右弼');
  // 天魁: 年干 (參考 Star_G07[4])
  const tkTable=[1,0,11,11,1,0,1,6,3,3];
  add(tkTable[gan],'天魁');
  // 天鉞: 年干 (參考 Star_G07[5])
  const tyTable=[7,8,9,9,7,8,7,2,5,5];
  add(tyTable[gan],'天鉞');
  return g;
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

function zwCalculate(){
  const year=+document.getElementById('zwYear').value;
  const month=+document.getElementById('zwMonth').value;
  const day=+document.getElementById('zwDay').value;
  const hour=+document.getElementById('zwHour').value;
  const gender=document.getElementById('zwGender').value;
  const lunar=Lunar.solarToLunar(year,month,day);
  const gan=(year-4)%10;
  // 命宮: 和 click108/劍靈 對齊，時辰索引=1~12（子時=1）
  const mingBranch=(14-lunar.month-hour+24)%12;
  // 身宮: (12+month+hour-1)%12
  const shenBranch=(12+lunar.month+hour-1)%12;
  const wxj=ZW_WXJ[mingBranch][gan];
  const ziweiPos=ZW_ZIWEI_POS[wxj][Math.min(lunar.day-1,29)];
  const zwg=ZW_ZW_GROUP[ziweiPos];
  const tfg=ZW_TF_GROUP[ziweiPos];
  const aux=zwPlaceAux(gan,lunar.month,mingBranch);

  const palaces=[];
  for(let i=0;i<12;i++){
    const br=(mingBranch+i)%12;
    const stars=[];
    for(let j=0;j<6;j++){
      if(zwg[j]===br){
        const n=ZW_ZW_NAMES[j];
        stars.push({name:n,type:'main'});
      }
    }
    for(let j=0;j<8;j++){
      if(tfg[j]===br){
        const n=ZW_TF_NAMES[j];
        stars.push({name:n,type:'main'});
      }
    }
    if(aux[br])stars.push(...aux[br].map(n=>({name:n,type:'aux'})));
    palaces.push({name:ZW_PALACE[i],branch:ZW_BRANCH[br],brIdx:br,stars,isMing:i===0,isShen:br===shenBranch});
  }
  zwDisplay(palaces,year,month,day,hour,gender,lunar,ZW_WXJ_NAMES[wxj],ziweiPos,mingBranch,shenBranch);
}

function zwDisplay(palaces,year,month,day,hour,gender,lunar,wxjName,ziweiPos,mingBranch,shenBranch){
  document.getElementById('zwResult').classList.remove('hidden');
  let info=`<p><span>出生：</span>${year}年${month}月${day}日 ${ZW_HOUR_NAMES[hour]}時 | <span>農曆：</span>${lunar.ganzhi} ${lunar.monthName} ${lunar.dayName}</p>`;
  info+=`<p><span>性別：</span>${gender==='M'?'男':'女'} | <span>五行局：</span>${wxjName} | <span>紫微：</span>${ZW_BRANCH[ziweiPos]}</p>`;
  info+=`<p><span>命宮：</span>${ZW_BRANCH[mingBranch]} | <span>身宮：</span>${ZW_BRANCH[shenBranch]}</p>`;
  document.getElementById('zwInfo').innerHTML=info;

  const cells=[
    {pal:5,r:1,c:1},{pal:6,r:1,c:2},{pal:7,r:1,c:3},{pal:8,r:1,c:4},
    {pal:4,r:2,c:1},{center:true},{pal:9,r:2,c:4},
    {pal:3,r:3,c:1},{pal:10,r:3,c:4},
    {pal:2,r:4,c:1},{pal:1,r:4,c:2},{pal:0,r:4,c:3},{pal:11,r:4,c:4}
  ];

  let html='';
  for(const cell of cells){
    if(cell.center){
      html+=`<div class="zw-center" style="grid-row:2/4;grid-column:2/3"><div class="zw-center-inner">
        <div class="zw-center-title">${lunar.ganzhi}</div>
        <div>${wxjName}</div>
        <div>${gender==='M'?'男':'女'}命</div>
        <div>命宮：${ZW_BRANCH[mingBranch]}</div>
        <div>身宮：${ZW_BRANCH[shenBranch]}</div>
        <div>紫微在${ZW_BRANCH[ziweiPos]}</div>
      </div></div>`;
      continue;
    }
    const p=palaces[cell.pal];
    let starHtml='';
    for(const s of p.stars){
      const nameClass=s.type==='main'?'zw-sm':'zw-sa';
      starHtml+=`<div class="zw-s-main"><span class="zw-s-name ${nameClass}">${s.name}</span></div>`;
    }
    const tag=p.isMing?'<span class="zw-tag">命</span>':p.isShen?'<span class="zw-tag">身</span>':'';
    html+=`<div class="zw-cell${p.isMing?' zw-ming':''}" style="grid-row:${cell.r};grid-column:${cell.c}"><div class="zw-cell-name">${p.name}${tag}</div><div class="zw-cell-br">${p.branch}</div><div class="zw-cell-stars">${starHtml||'<span class="zw-empty">—</span>'}</div></div>`;
  }
  document.getElementById('zwGrid').innerHTML=html;

  let a='<h4>命盤概要</h4>';
  const mp=palaces[0];
  const ms=mp.stars.filter(s=>s.type==='main');
  a+=`<p><strong>命宮主星：</strong>${ms.map(s=>s.name).join('、')||'空宮'}</p>`;
  if(ms.length)for(const s of ms)a+=`<p><strong>${s.name}：</strong>${ZW_MEANING[s.name]||''}</p>`;
  a+='<h4>十二宮星曜</h4>';
  for(const p of palaces){
    const starList=p.stars.length?p.stars.map(s=>s.name).join('、'):'空宮';
    a+=`<p><strong>${p.name}（${p.branch}）：</strong>${starList}</p>`;
  }
  document.getElementById('zwAnalysis').innerHTML=a;
}
