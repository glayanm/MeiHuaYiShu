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

// Compatibility object
var LunarData = {
  TIANGAN: ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
  DIZHI: ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'],
  SHENGXIAO: ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'],
  solarToLunar: solarToLunarSW
};

var Lunar = LunarData;
