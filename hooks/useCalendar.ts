import { useMemo } from "react";

export function useCalendar(year: number, month: number) {
  return useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    const startDayOfWeek = firstDay.getDay(); // 이번 달 1일의 요일
    const daysInMonth = lastDay.getDate(); // 이번 달 총 일수

    const weeks: { day: number; isOutside: boolean; monthOffset: number }[][] = [];
    let currentWeek: { day: number; isOutside: boolean; monthOffset: number }[] = [];

    // 이전 달
    for (let i = 0; i < startDayOfWeek; i++) {
      const prevDate = new Date(year, month - 1, -(startDayOfWeek - i - 1));
      currentWeek.push({ day: prevDate.getDate(), isOutside: true, monthOffset: -1 });
    }

    // 이번 달
    for (let d = 1; d <= daysInMonth; d++) {
      currentWeek.push({ day: d, isOutside: false, monthOffset: 0 });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // 마지막 주
    if (currentWeek.length > 0) {
      const nextCount = 7 - currentWeek.length;
      for (let i = 1; i <= nextCount; i++) {
        currentWeek.push({ day: i, isOutside: true, monthOffset: 1 });
      }
      weeks.push(currentWeek);
    }
    return weeks;
  }, [year, month]);
}