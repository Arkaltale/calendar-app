import { useMemo } from "react";

export function useCalendar(year: number, month: number) {
  return useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const weeks: { day: number; isOutside: boolean; monthOffset: number }[][] = [];
    let currentDay = 1 - firstDay;

    // 이전 달의 날짜 표시를 위해 루프 조건 설정
    while (weeks.length < 6) {
      const week: { day: number; isOutside: boolean; monthOffset: number }[] = [];
      for (let i = 0; i < 7; i++) {
        if (currentDay < 1) {
          week.push({ day: prevMonthDays + currentDay, isOutside: true, monthOffset: -1 });
        } else if (currentDay > daysInMonth) {
          week.push({ day: currentDay - daysInMonth, isOutside: true, monthOffset: 1 });
        } else {
          week.push({ day: currentDay, isOutside: false, monthOffset: 0 });
        }
        currentDay++;
      }
      weeks.push(week);
    }
    return weeks;
  }, [year, month]);
}