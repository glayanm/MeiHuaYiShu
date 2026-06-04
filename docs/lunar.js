const Lunar=(()=>{
const TIANGAN=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DIZHI=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SHENGXIAO=['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'];
const MONTH_NAMES=['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
const DAY_NAMES=['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];

const LUNAR_DATA=[
0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, // 1900-1909
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, // 1910-1919
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, // 1920-1929
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, // 1930-1939
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, // 1940-1949
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0, // 1950-1959
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, // 1960-1969
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6, // 1970-1979
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, // 1980-1989
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0, // 1990-1999
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, // 2000-2009
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, // 2010-2019
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, // 2020-2029
0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, // 2030-2039
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, // 2040-2049
0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06aa0,0x1a6c4,0x0aae0, // 2050-2059
0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, // 2060-2069
0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, // 2070-2079
0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, // 2080-2089
0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252, // 2090-2099
0x0d520 // 2100
];

function lYearDays(y){let s=0;for(let i=0x8000;i>0x8;i>>=1)s+=(LUNAR_DATA[y-1900]&i)?30:29;return s+leapDays(y)}
function leapMonth(y){return LUNAR_DATA[y-1900]&0xf}
function leapDays(y){if(leapMonth(y)){return(LUNAR_DATA[y-1900]&0x10000)?30:29}return 0}
function monthDays(y,m){return(LUNAR_DATA[y-1900]&(0x10000>>m))?30:29}

function solarToLunar(yy,mm,dd){
  let offset=Math.floor((Date.UTC(yy,mm-1,dd)-Date.UTC(1900,0,31))/86400000);
  let y=1900;
  for(;y<2101&&offset>0;y++){offset-=lYearDays(y)}
  if(offset<0){offset+=lYearDays(--y)}
  let leap=leapMonth(y),isLeap=false,lm=1;
  for(let i=1;i<13&&offset>0;i++){
    if(leap>0&&i===leap+1&&!isLeap){--i;isLeap=true;let d=leapDays(y);if(offset<d){break}offset-=d;isLeap=false}
    let d=monthDays(y,i);if(offset<d){lm=i;break}offset-=d
  }
  if(offset===0&&leap>0&&lm===leap+1){isLeap=true}
  let ld=offset+1;
  let gan=(y-4)%10,zhi=(y-4)%12;
  return{year:y,month:lm,day:ld,isLeap,yearGan:TIANGAN[gan],yearZhi:DIZHI[zhi],shengxiao:SHENGXIAO[zhi],
    monthName:(isLeap?'閏':'')+MONTH_NAMES[lm-1],dayName:DAY_NAMES[ld-1],
    ganzhi:TIANGAN[gan]+DIZHI[zhi]+'年'}
}

function lunarToSolar(yy,mm,dd,isLeap){
  let offset=0;
  for(let i=1900;i<yy;i++)offset+=lYearDays(i);
  let leap=leapMonth(yy),isBeforeLeap=!isLeap||mm<leap+(leap&&isLeap?1:0);
  for(let i=1;i<mm;i++){offset+=monthDays(yy,i);if(i===leap)offset+=leapDays(yy)}
  if(isLeap&&mm===leap)offset+=leapDays(yy);
  offset+=dd-1;
  let d=new Date(1900,0,31);
  d.setDate(d.getDate()+offset);
  return{year:d.getFullYear(),month:d.getMonth()+1,day:d.getDate()}
}

const SOLAR_TERMS_NAMES=['小寒','大寒','立春','雨水','驚蟄','春分','清明','穀雨','立夏','小滿','芒種','夏至','小暑','大暑','立秋','處暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];
const SOLAR_TERMS_BASE=[
  [6,14,19,4,6,21,5,20,6,21,6,22,7,23,7,23,8,23,8,23,7,22,7,22], // 2000
  [6,19,4,19,6,21,5,20,6,21,6,22,7,23,8,23,8,23,8,23,7,22,7,22], // 2001
];
function getSolarTermDay(year,idx){
  let base=SOLAR_TERMS_BASE[0];
  let yOff=year-2000;
  let d=base[idx]+Math.floor(yOff*0.2422);
  if(year>2000)d+=Math.floor((year-2000)/4);
  return Math.min(d,28+(idx%2===0?0:1))
}

const JIEQI_SEASON=[
  {name:'春',terms:['立春','雨水','驚蟄','春分','清明','穀雨']},
  {name:'夏',terms:['立夏','小滿','芒種','夏至','小暑','大暑']},
  {name:'秋',terms:['立秋','處暑','白露','秋分','寒露','霜降']},
  {name:'冬',terms:['立冬','小雪','大雪','冬至','小寒','大寒']}
];

const WUXING={甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const DIZHI_WUXING={子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};

return{TIANGAN,DIZHI,SHENGXIAO,MONTH_NAMES,DAY_NAMES,WUXING,DIZHI_WUXING,
  solarToLunar,lunarToSolar,lYearDays,leapMonth,leapDays,monthDays,
  SOLAR_TERMS_NAMES,getSolarTermDay,JIEQI_SEASON}
})();
