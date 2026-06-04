// Save reference Lunar() function before overwriting
var _refLunarFn = Lunar;

function solarToLunarSW(yy, mm, dd) {
  _refLunarFn(0, yy, mm, dd);
  return {
    year: lunar.y,
    month: lunar.m,
    day: lunar.d,
    isLeap: lunar.l ? true : false,
    yearGan: GanGB[gan.y],
    yearZhi: ZhiGB[zhi.y],
    shengxiao: ShengXiaoGB[zhi.y],
    monthName: (lunar.l ? '閏' : '') + lunar.m + '月',
    dayName: LunarDayNames[lunar.d - 1] || lunar.d + '日',
    ganzhi: GanGB[gan.y] + ZhiGB[zhi.y] + '年'
  };
}

var LunarDayNames = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
];

// Compatibility object - overwrites the Lunar function
var Lunar = {
  TIANGAN: GanGB,
  DIZHI: ZhiGB,
  SHENGXIAO: ShengXiaoGB,
  WUXING: {'甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水'},
  DIZHI_WUXING: {'子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'},
  SOLAR_TERMS_NAMES: ['小寒','大寒','立春','雨水','驚蟄','春分','清明','穀雨','立夏','小滿','芒種','夏至','小暑','大暑','立秋','處暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'],
  solarToLunar: solarToLunarSW,
  getSolarTermDay: function(year, idx) {
    var base = [6,20,4,19,6,21,5,20,6,21,6,22,7,23,7,23,8,23,8,23,7,22,7,22];
    var d = base[idx] + Math.floor((year - 2000) * 0.2422);
    return Math.min(d, 28 + (idx % 2 === 0 ? 0 : 1));
  }
};
