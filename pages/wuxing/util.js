function getTianGanDiZhiFromDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript 的月份从 0 开始
  const day = date.getDate();
  const hour = date.getHours();

  // **极其简化的天干地支推算，仅供演示，不准确**
  const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // **警告：以下计算方式是高度简化的，实际干支推算涉及复杂的农历和节气**
  const yearGanIndex = (year - 4) % 10;
  const yearZhiIndex = (year - 4) % 12;
  const monthGanIndex = (month - 1) % 10;
  const monthZhiIndex = (month - 1) % 12;
  const dayGanIndex = (day - 1) % 10;
  const dayZhiIndex = (day - 1) % 12;
  const hourZhiIndex = Math.floor(hour / 2) % 12;
  const hourGanIndex = (dayGanIndex * 2 + Math.floor(hour / 2)) % 10; // 简化时干推算

  return {
    yearGan: tianGan[yearGanIndex < 0 ? yearGanIndex + 10 : yearGanIndex],
    yearZhi: diZhi[yearZhiIndex < 0 ? yearZhiIndex + 12 : yearZhiIndex],
    monthGan: tianGan[monthGanIndex < 0 ? monthGanIndex + 10 : monthGanIndex],
    monthZhi: diZhi[monthZhiIndex < 0 ? monthZhiIndex + 12 : monthZhiIndex],
    dayGan: tianGan[dayGanIndex < 0 ? dayGanIndex + 10 : dayGanIndex],
    dayZhi: diZhi[dayZhiIndex < 0 ? dayZhiIndex + 12 : dayZhiIndex],
    hourGan: tianGan[hourGanIndex < 0 ? hourGanIndex + 10 : hourGanIndex],
    hourZhi: diZhi[hourZhiIndex < 0 ? hourZhiIndex + 12 : hourZhiIndex],
  };
}

function getWuXingOfGanZhi(gan, zhi) {
  const tianGanWuXing = {
    甲: '木',
    乙: '木',
    丙: '火',
    丁: '火',
    戊: '土',
    己: '土',
    庚: '金',
    辛: '金',
    壬: '水',
    癸: '水',
  };
  const diZhiWuXing = {
    寅: '木',
    卯: '木',
    巳: '火',
    午: '火',
    辰: '土',
    戌: '土',
    丑: '土',
    未: '土',
    申: '金',
    酉: '金',
    亥: '水',
    子: '水',
  };

  const ganWuXing = tianGanWuXing[gan] || null;
  const zhiWuXing = diZhiWuXing[zhi] || null;

  return { gan: ganWuXing, zhi: zhiWuXing };
}

function getPrimaryWuXingFromDate(date) {
  const ganZhi = getTianGanDiZhiFromDate(date);

  const wuXingCounts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  const yearWuXing = getWuXingOfGanZhi(ganZhi.yearGan, ganZhi.yearZhi);
  const monthWuXing = getWuXingOfGanZhi(ganZhi.monthGan, ganZhi.monthZhi);
  const dayWuXing = getWuXingOfGanZhi(ganZhi.dayGan, ganZhi.dayZhi);
  const hourWuXing = getWuXingOfGanZhi(ganZhi.hourGan, ganZhi.hourZhi);

  if (yearWuXing.gan) wuXingCounts[yearWuXing.gan]++;
  if (yearWuXing.zhi) wuXingCounts[yearWuXing.zhi]++;
  if (monthWuXing.gan) wuXingCounts[monthWuXing.gan]++;
  if (monthWuXing.zhi) wuXingCounts[monthWuXing.zhi]++;
  if (dayWuXing.gan) wuXingCounts[dayWuXing.gan]++;
  if (dayWuXing.zhi) wuXingCounts[dayWuXing.zhi]++;
  if (hourWuXing.gan) wuXingCounts[hourWuXing.gan]++;
  if (hourWuXing.zhi) wuXingCounts[hourWuXing.zhi]++;

  let primaryWuXing = '未知';
  let maxCount = -1;

  for (const wuXing in wuXingCounts) {
    if (wuXingCounts[wuXing] > maxCount) {
      maxCount = wuXingCounts[wuXing];
      primaryWuXing = wuXing;
    }
  }

  return primaryWuXing;
}

export function getGeneratingWuXing(generatedWuXing) {
  switch (generatedWuXing) {
    case '火':
      return '木';
    case '土':
      return '火';
    case '金':
      return '土';
    case '水':
      return '金';
    case '木':
      return '水';
    default:
      return '未知';
  }
}

export function getWuXingResult(dateString) {
  return getPrimaryWuXingFromDate(new Date(dateString));
}
