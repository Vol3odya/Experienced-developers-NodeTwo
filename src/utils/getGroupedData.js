import { monthList } from "../constants/water.js";

export const getGroupedData = async (data, userWaterRate) => {
  const groupedData = new Map();

  await data.forEach(item => {
      const date = new Date(item.date);
      const dayKey = `${date.getDate()}, ${monthList[date.getMonth()]}`;

      if (groupedData.has(dayKey)) {
          const existingData = groupedData.get(dayKey);
          existingData.waterRate += 0;
          existingData.waterVolume += item.waterVolume;
          existingData.count += 1;
          groupedData.set(dayKey, existingData);
      } else {
          groupedData.set(dayKey, {
              date: dayKey,
              waterRate: userWaterRate,
              waterVolume: item.waterVolume,
              count: 1
          });
      }
  });

  const result = Array.from(groupedData.values()).map(entry => {
      const waterRateLiters = (entry.waterRate / 1000).toFixed(1);
      const waterVolumeLiters = (entry.waterVolume / 1000).toFixed(1);
      const percent = Math.min(100, Math.ceil((entry.waterVolume / entry.waterRate) * 100));

      return {
          date: entry.date,
          waterRate: `${waterRateLiters} L`,
          waterVolume: `${waterVolumeLiters} L`,
          count: entry.count,
          percent: `${percent.toFixed(0)}%`
      };
  });

  return result;
};
