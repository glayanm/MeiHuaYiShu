// Wrapper for lunar-javascript library (6tail/lunar-javascript)
// Same library used by iztro's lunar-lite

function solarToLunarSW(yy, mm, dd) {
  var solar = Solar.fromYmd(yy, mm, dd);
  var lunar = solar.getLunar();
  
  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeap: lunar.getMonth() < 0,
    yearGan: lunar.getYearGan(),
    yearZhi: lunar.getYearZhi(),
    shengxiao: lunar.getYearShengXiao(),
    monthName: (lunar.getMonth() < 0 ? '閏' : '') + Math.abs(lunar.getMonth()) + '月',
    dayName: lunar.getDayInChinese(),
    ganzhi: lunar.getYearGan() + lunar.getYearZhi() + '年'
  };
}

// Compatibility object for nongli.js, jiugong.js, meihua.js
var Lunar = {
  TIANGAN: ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
  DIZHI: ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'],
  SHENGXIAO: ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'],
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
