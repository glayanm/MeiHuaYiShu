const JG_LOSHU=[4,9,2,3,5,7,8,1,6];
const JG_DIRS=['東南','南','西南','東','中','西','東北','北','西北'];
const JG_NAMES={1:'一白貪狼',2:'二黑巨門',3:'三碧祿存',4:'四綠文曲',5:'五黃廉貞',6:'六白武曲',7:'七赤破軍',8:'八白左輔',9:'九紫右弼'};
const JG_NATURE={1:'水·吉',2:'土·凶',3:'木·凶',4:'木·吉',5:'土·大凶',6:'金·吉',7:'金·凶',8:'土·大吉',9:'火·大吉'};
const JG_MEANING={
  1:{name:'桃花星',desc:'主事業、人緣、桃花',color:'#60a5fa'},
  2:{name:'病符星',desc:'主疾病、健康問題',color:'#ef4444'},
  3:{name:'是非星',desc:'主口舌、是非、官訟',color:'#f97316'},
  4:{name:'文昌星',desc:'主學業、考試、智慧',color:'#34d399'},
  5:{name:'五黃煞',desc:'主災禍、意外、凶險',color:'#dc2626'},
  6:{name:'武曲星',desc:'主權力、地位、偏財',color:'#a78bfa'},
  7:{name:'破軍星',desc:'主盜賊、破財、口舌',color:'#fb923c'},
  8:{name:'財帛星',desc:'主財運、置業、喜事',color:'#fbbf24'},
  9:{name:'喜慶星',desc:'主喜事、姻緣、添丁',color:'#f472b6'}
};

const JG_YEAR_STARS=[1,7,4,6,3,9,2,8,5]; // 年飛星起始（2000年中宮為6白）
// 年飛星：每年中宮星 = (年份尾數對應) 按三元九運推算
// 簡化算法：中宮星 = (45 - (year - 2000) % 9) % 9，若為0則為9
function jgYearCenter(year){let n=(45-(year-2000)%9)%9;return n===0?9:n}

// 洛書飛行順序：中→西北→西→東北→南→北→西南→東→東南
const JG_FLIGHT_ORDER=[4,8,3,1,5,0,2,6,7]; // 九宮格索引（0-8），順飛路線

// 月飛星：根據年干支確定正月起始星
// 甲己年：正月一白起，乙庚年：正月二黑起，丙辛年：正月三碧起，丁壬年：正月四綠起，戊癸年：正月五黃起
function jgMonthStart(year){
  const gan=(year-4)%10;
  const starts=[1,2,3,4,5,1,2,3,4,5]; // 甲乙丙丁戊己庚辛壬癸
  return starts[gan]
}

function jgFly(centerStar){
  // 從中宮開始，按洛書順序放置9顆星
  const grid=new Array(9);
  const order=[4,8,3,1,5,0,2,6,7]; // 中→西北→西→東北→南→北→西南→東→東南
  for(let i=0;i<9;i++){
    let star=(centerStar-1+i)%9+1;
    grid[order[i]]=star;
  }
  return grid
}

function jgFlyReverse(centerStar){
  const grid=new Array(9);
  const order=[4,7,6,2,0,5,1,3,8]; // 逆飛
  for(let i=0;i<9;i++){
    let star=(centerStar-1+i)%9+1;
    grid[order[i]]=star;
  }
  return grid
}

function jgInit(){
  const ys=document.getElementById('jgYear'),ms=document.getElementById('jgMonth');
  for(let y=2000;y<=2100;y++)ys.add(new Option(y+'年',y));
  for(let m=1;m<=12;m++)ms.add(new Option(m+'月',m));
  ys.value=new Date().getFullYear();
  ms.value=new Date().getMonth()+1;
  document.getElementById('jgDay').value=new Date().toISOString().slice(0,10);
  jgRender();
}

function jgUpdateMode(){
  const mode=document.getElementById('jgMode').value;
  document.getElementById('jgMonthGroup').classList.toggle('hidden',mode==='year');
  document.getElementById('jgDayGroup').classList.toggle('hidden',mode!=='day');
  jgRender();
}

function jgRender(){
  const mode=document.getElementById('jgMode').value;
  const year=parseInt(document.getElementById('jgYear').value);
  let grid,title;

  if(mode==='year'){
    const center=jgYearCenter(year);
    grid=jgFly(center);
    title=`${year}年 九宮飛星圖（中宮：${JG_NAMES[center]}）`;
  }else if(mode==='month'){
    const month=parseInt(document.getElementById('jgMonth').value);
    const yearStar=jgYearCenter(year);
    const monthStart=jgMonthStart(year);
    // 月飛星：從正月開始，每月+1
    const monthCenter=(monthStart-1+month-1)%9+1;
    grid=jgFly(monthCenter);
    title=`${year}年${month}月 九宮飛星圖（中宮：${JG_NAMES[monthCenter]}）`;
  }else{
    const dayStr=document.getElementById('jgDay').value;
    if(!dayStr)return;
    const[dy,dm,dd]=dayStr.split('-').map(Number);
    // 日飛星簡化算法：以2000年1月1日為基準（一白水星入中宮）
    const baseDate=Date.UTC(2000,0,1);
    const targetDate=Date.UTC(dy,dm-1,dd);
    const daysDiff=Math.floor((targetDate-baseDate)/86400000);
    const dayCenter=((1-1+daysDiff)%9+9)%9+1;
    grid=jgFly(dayCenter);
    title=`${dy}年${dm}月${dd}日 九宮飛星圖（中宮：${JG_NAMES[dayCenter]}）`;
  }

  document.getElementById('jgGridTitle').textContent=title;
  renderJgGrid(grid);
  renderJgLegend();
  renderJgAnalysis(grid,mode,year);
}

function renderJgGrid(grid){
  const g=document.getElementById('jgGrid');
  // 洛書排列：4 9 2 / 3 5 7 / 8 1 6
  const loShuOrder=[3,8,1,2,4,6,7,0,5]; // 從左上到右下的格子索引
  let html='';
  for(let i=0;i<9;i++){
    const idx=loShuOrder[i];
    const star=grid[idx];
    const m=JG_MEANING[star];
    const isCenter=idx===4;
    html+=`<div class="jg-cell${isCenter?' highlight':''}">
      <div class="jg-cell-num" style="color:${m.color}">${star}</div>
      <div class="jg-cell-name">${JG_NAMES[star]}</div>
      <div class="jg-cell-dir">${JG_DIRS[idx]}</div>
    </div>`;
  }
  g.innerHTML=html;
}

function renderJgLegend(){
  const l=document.getElementById('jgLegend');
  let html='';
  for(let i=1;i<=9;i++){
    const m=JG_MEANING[i];
    html+=`<div class="jg-legend-item"><strong style="color:${m.color}">${i} ${JG_NAMES[i]}</strong> ${m.name} · ${JG_NATURE[i]}<br><span style="color:var(--t2);font-size:.72rem">${m.desc}</span></div>`;
  }
  l.innerHTML=html;
}

function renderJgAnalysis(grid,mode,year){
  const a=document.getElementById('jgAnalysis');
  // 找出各宮吉凶
  let good=[],bad=[],great=[];
  for(let i=0;i<9;i++){
    const star=grid[i];
    if(star===1||star===4||star===6||star===8||star===9)good.push({dir:JG_DIRS[i],star:JG_NAMES[star],name:JG_MEANING[star].name});
    if(star===2||star===3||star===7)bad.push({dir:JG_DIRS[i],star:JG_NAMES[star],name:JG_MEANING[star].name});
    if(star===8||star===9)great.push({dir:JG_DIRS[i],star:JG_NAMES[star],name:JG_MEANING[star].name});
    if(star===5)bad.push({dir:JG_DIRS[i],star:JG_NAMES[star],name:JG_MEANING[star].name});
  }
  let html='<h4>風水布局建議</h4>';
  html+=`<p><strong style="color:var(--good)">吉利方位：</strong>${good.map(g=>`${g.dir}（${g.star}·${g.name}）`).join('、')}</p>`;
  html+=`<p><strong style="color:var(--bad)">凶煞方位：</strong>${bad.map(b=>`${b.dir}（${b.star}·${b.name}）`).join('、')}</p>`;
  html+='<br><h4>各星詳細解析</h4>';
  for(let i=0;i<9;i++){
    const star=grid[i];
    const m=JG_MEANING[star];
    html+=`<p><strong style="color:${m.color}">${JG_DIRS[i]}方：${star} ${JG_NAMES[star]}</strong>（${JG_NATURE[star]}）— ${m.desc}</p>`;
  }
  a.innerHTML=html;
}
