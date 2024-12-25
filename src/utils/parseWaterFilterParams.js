import { monthList } from "../constants/water.js";

export const parseMonth = (value, array) => {
  if (typeof value === "string" && !isNaN(value)) {
    const numericMonth = parseInt(value, 10);
    if (numericMonth >= 1 && numericMonth <= 12) {
      return numericMonth; 
    }
  }
  if (typeof value === "string" && array.includes(value)) {
    return array.indexOf(value) + 1;
  }
  return null;
};

export const parseYear = (value) => {
  if (typeof value === "string" && value.length === 4 && !isNaN(value)) {
    return parseInt(value, 10);
  }
  return null;
};

const parseWaterFilterParams = ({ month, year }) => {
  const parsedMonth = parseMonth(month, monthList);
  const parsedYear = parseYear(year);

  return {
    month: parsedMonth,
    year: parsedYear,
  };
};

export default parseWaterFilterParams;
