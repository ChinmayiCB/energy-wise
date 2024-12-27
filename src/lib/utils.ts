import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MONTH_MAP: any = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};
export const constructChartData = (billdata: any[]) => {
  const chartData = [
    { month: "January", water: 0, electricity: 0 },
    { month: "February", water: 0, electricity: 0 },
    { month: "March", water: 0, electricity: 0 },
    { month: "April", water: 0, electricity: 0 },
    { month: "May", water: 0, electricity: 0 },
    { month: "June", water: 0, electricity: 0 },
    { month: "July", water: 0, electricity: 0 },
    { month: "August", water: 0, electricity: 0 },
    { month: "September", water: 0, electricity: 0 },
    { month: "October", water: 0, electricity: 0 },
    { month: "November", water: 0, electricity: 0 },
    { month: "December", water: 0, electricity: 0 },
  ];

  billdata.forEach((bill: { month: any; type: any; amount: any }) => {
    const { month, type, amount } = bill;
    const index = month - 1;

    if (type === "WATER") {
      chartData[index].water += amount;
    } else if (type === "ELECTRICITY") {
      chartData[index].electricity += amount;
    }
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  chartData.forEach((data, index) => {
    data.month = months[index];
  });

  return chartData;
};
