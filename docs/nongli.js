const NL_YI_ITEMS=['祭祀','祈福','求嗣','開光','出行','解除','伐木','蓋屋','起基','修造','造畜稠','教牛馬','造車器','進人口','修造','動土','豎柱','上樑','開市','交易','立券','掛匾','納財','栽種','牧養','納畜','安葬','入殮','移柩','破土','啟鑽','立碑','修墳','入宅','移徙','安床','拆卸','出火','掛匾','開池','掘井','開渠','造船'];
const NL_JI_ITEMS=['嫁娶','納采','訂盟','造廟','開市','安葬','行喪','伐木','造橋','造船','破土','動土','入宅','移徙','安床','開倉','出貨財','詞訟','分居','置產'];

function nlInit(){
  const ys=document.getElementById('nlYear'),ms=document.getElementById('nlMonth');
  for(let y=2000;y<=2100;y++)ys.add(new Option(y+'年',y));
  for(let m=1;m<=12;m++)ms.add(new Option(m+'月',m));
  const now=new Date();
  ys.value=now.getFullYear();
  ms.value=now.getMonth()+1;
  nlRender();
}

function nlRender(){
  const year=parseInt(document.getElementById('nlYear').value);
  const month=parseInt(document.getElementById('nlMonth').value);
  const gan=(year-4)%10,zhi=(year-4)%12;
  const ganzhi=Lunar.TIANGAN[gan]+Lunar.DIZHI[zhi];
  const sx=Lunar.SHENGXIAO[zhi];

  // Header
  document.getElementById('nlHeader').innerHTML=`<h3>${year}年 ${month}月 · ${ganzhi}年（${sx}年）</h3><p>五行：${Lunar.WUXING[Lunar.TIANGAN[gan]]} | 生肖：${sx}</p>`;

  // 節氣
  const jieqi=nlGetJieqi(year,month);

  // Calendar grid
  const firstDay=new Date(year,month-1,1).getDay();
  const daysInMonth=new Date(year,month,0).getDate();
  const today=new Date();
  const isCurrentMonth=today.getFullYear()===year&&today.getMonth()+1===month;

  // Previous month days
  const prevMonth=month===1?12:month-1;
  const prevYear=month===1?year-1:year;
  const prevDays=new Date(prevYear,prevMonth,0).getDate();

  let html='';
  // Fill previous month
  for(let i=firstDay-1;i>=0;i--){
    const d=prevDays-i;
    const lunar=Lunar.solarToLunar(prevYear,prevMonth,d);
    const yiji=nlGetYiji(prevYear,prevMonth,d);
    html+=`<div class="nl-day other-month"><div class="nl-day-solar">${d}</div><div class="nl-day-lunar">${lunar.dayName}</div></div>`;
  }

  // Current month
  for(let d=1;d<=daysInMonth;d++){
    const lunar=Lunar.solarToLunar(year,month,d);
    const isToday=isCurrentMonth&&d===today.getDate();
    const jq=nlFindJieqi(year,month,d);
    const yiji=nlGetYiji(year,month,d);
    const lunarClass=jq?'nl-day-lunar nl-day-jieqi':'nl-day-lunar';
    const lunarText=jq||lunar.dayName;
    let yijiHtml='';
    if(yiji){
      yijiHtml=`<div class="nl-day-yiji"><span class="nl-day-yi">宜${yiji.yi[0]}</span><br><span class="nl-day-ji">忌${yiji.ji[0]}</span></div>`;
    }
    html+=`<div class="nl-day${isToday?' today':''}" onclick="nlShowDetail(${year},${month},${d})"><div class="nl-day-solar">${d}</div><div class="${lunarClass}">${lunarText}</div>${yijiHtml}</div>`;
  }

  // Fill next month
  const totalCells=firstDay+daysInMonth;
  const remaining=totalCells%7===0?0:7-totalCells%7;
  for(let d=1;d<=remaining;d++){
    const nextMonth=month===12?1:month+1;
    const nextYear=month===12?year+1:year;
    const lunar=Lunar.solarToLunar(nextYear,nextMonth,d);
    html+=`<div class="nl-day other-month"><div class="nl-day-solar">${d}</div><div class="nl-day-lunar">${lunar.dayName}</div></div>`;
  }

  document.getElementById('nlGrid').innerHTML=html;
  document.getElementById('nlDetail').classList.add('hidden');
}

function nlGetJieqi(year,month){
  // Get solar terms for the month
  const terms=[];
  const termNames=Lunar.SOLAR_TERMS_NAMES;
  // Each month has 2 solar terms
  const idx1=(month-1)*2;
  const idx2=idx1+1;
  if(idx1<24)terms.push({name:termNames[idx1],day:Lunar.getSolarTermDay(year,idx1)});
  if(idx2<24)terms.push({name:termNames[idx2],day:Lunar.getSolarTermDay(year,idx2)});
  return terms;
}

function nlFindJieqi(year,month,day){
  const terms=nlGetJieqi(year,month);
  for(const t of terms)if(t.day===day)return t.name;
  return null;
}

function nlGetYiji(year,month,day){
  // Simplified 宜忌 based on day's 干支
  const lunar=Lunar.solarToLunar(year,month,day);
  const dayGanIdx=(year*5+Math.floor(year/4)+lunar.month*7+lunar.day)%10;
  const dayZhiIdx=(year+Math.floor(year/4)+lunar.month*9+lunar.day)%12;
  const seed=dayGanIdx*12+dayZhiIdx;
  const yi=[],ji=[];
  // Use deterministic pseudo-random based on date
  for(let i=0;i<4;i++){
    yi.push(NL_YI_ITEMS[(seed+i*7)%NL_YI_ITEMS.length]);
    ji.push(NL_JI_ITEMS[(seed+i*5+3)%NL_JI_ITEMS.length]);
  }
  return{yi:[...new Set(yi)],ji:[...new Set(ji)]};
}

function nlShowDetail(year,month,day){
  const lunar=Lunar.solarToLunar(year,month,day);
  const jq=nlFindJieqi(year,month,day);
  const yiji=nlGetYiji(year,month,day);
  const gan=(year-4)%10,zhi=(year-4)%12;
  const dayGanIdx=(year*5+Math.floor(year/4)+lunar.month*7+lunar.day)%10;
  const dayZhiIdx=(year+Math.floor(year/4)+lunar.month*9+lunar.day)%12;
  const dayGan=Lunar.TIANGAN[dayGanIdx];
  const dayZhi=Lunar.DIZHI[dayZhiIdx];

  let html=`<h4>${year}年${month}月${day}日 農民曆</h4>`;
  html+=`<p><strong>農曆：</strong>${lunar.ganzhi} ${lunar.monthName} ${lunar.dayName}${lunar.isLeap?'（閏月）':''}</p>`;
  html+=`<p><strong>日干支：</strong>${dayGan}${dayZhi}日</p>`;
  html+=`<p><strong>五行：</strong>日主 ${Lunar.WUXING[dayGan]} · 地支 ${Lunar.DIZHI_WUXING[dayZhi]}</p>`;
  if(jq)html+=`<p><strong>節氣：</strong><span style="color:var(--gold)">${jq}</span></p>`;
  html+=`<p><strong>生肖：</strong>${Lunar.SHENGXIAO[(year-4)%12]}</p>`;
  html+=`<p><strong>沖煞：</strong>沖${Lunar.SHENGXIAO[(dayZhiIdx+6)%12]}煞${dayZhiIdx<6?'南':'北'}</p>`;
  html+=`<p class="yi-list"><strong>宜：</strong>${yiji.yi.join('、')}</p>`;
  html+=`<p class="ji-list"><strong>忌：</strong>${yiji.ji.join('、')}</p>`;

  const d=document.getElementById('nlDetail');
  d.innerHTML=html;
  d.classList.remove('hidden');
  d.scrollIntoView({behavior:'smooth',block:'nearest'});
}
