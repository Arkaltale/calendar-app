import { useState, useCallback, useEffect, useMemo } from "react";
import { Dimensions } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { useCalendar } from "./useCalendar";

const { width } = Dimensions.get("window");
const WEEK_HEIGHT = 50;
const MONTH_HEIGHT = 6 * WEEK_HEIGHT;
const SWIPE_THRESHOLD = width / 4;

type UseInteractiveCalendarProps = {
  onCollapseChange?: (isCollapsed: boolean) => void;
};

const getWeekIndexForDate = (date: Date, monthWeeks: any[][]) =>
  monthWeeks.findIndex(week =>
    week.some(cell => cell && !cell.isOutside && cell.day === date.getDate())
  ) ?? 0;

export function useInteractiveCalendar({ onCollapseChange }: UseInteractiveCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const currentWeeks = useCalendar(viewDate.getFullYear(), viewDate.getMonth() + 1);
  const monthHeight = currentWeeks.length * WEEK_HEIGHT;
  const calendarHeight = useSharedValue(MONTH_HEIGHT);
  const translateX = useSharedValue(0);
  const activeWeekIndex = useSharedValue(0);
  const startHeight = useSharedValue(0);
  const [renderDate, setRenderDate] = useState(viewDate); 

  const isWeekView = calendarHeight.value < MONTH_HEIGHT / 2;

  const [prevDate, centerDate, nextDate] = useMemo(() => {
    const center = viewDate;

    if (isWeekView) {
      const prev = new Date(center);
      prev.setDate(prev.getDate() - 7);
      const next = new Date(center);
      next.setDate(next.getDate() + 7);
      return [prev, center, next];
    } else {
      const prev = new Date(center.getFullYear(), center.getMonth() - 1, 1);
      const next = new Date(center.getFullYear(), center.getMonth() + 1, 1);
      return [prev, center, next];
    }
  }, [viewDate, isWeekView]);

  useEffect(() => {
    if (!selectedDate) return;

    const targetDate = new Date(selectedDate);
    targetDate.setDate(targetDate.getDate() + weekOffset * 7);

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth() + 1;

    if (isWeekView) {
      if (viewDate.getFullYear() !== targetYear || viewDate.getMonth() + 1 !== targetMonth) {
        setViewDate(new Date(targetYear, targetMonth - 1, 1));
        return;
      }
      const weekIndex = getWeekIndexForDate(targetDate, currentWeeks);
      activeWeekIndex.value = weekIndex;
      console.log(`selectedDate: ${selectedDate.toDateString()}, weekOffset: ${weekOffset}, targetDate: ${targetDate.toDateString()}, weekIndex: ${weekIndex}`);
    }
    // console.log(`selectedDate: ${selectedDate.toDateString()}, weekOffset: ${weekOffset}, targetDate: ${targetDate.toDateString()}}`);

  }, [selectedDate, weekOffset, viewDate, currentWeeks]);

  useEffect(() => {
    translateX.value = 0;
  }, [viewDate]);

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
    setWeekOffset(0);
  }, []);

  const changeViewDate = useCallback(
    (offset: number) => {
      if (isWeekView) {
        setWeekOffset(current => current + offset);
      } else {
        setViewDate((current) => {
          const newDate = new Date(current);
          newDate.setMonth(newDate.getMonth() + offset);
          return newDate;
        });
      }
    },
    [calendarHeight]
  );

  const changeMonthWithAnimation = useCallback(
    (offset: number) => {
      if (translateX.value !== 0) return;
      translateX.value = withTiming(-offset * width, { duration: 250 }, (isFinished) => {
        if (isFinished) {
          runOnJS(changeViewDate)(offset);
        }
      });
    },
    [changeViewDate, translateX]
  );

  const verticalPan = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .failOffsetX([-15, 15])
    .onBegin(() => {
      startHeight.value = calendarHeight.value;
    })
    .onUpdate((event) => {
      const newHeight = startHeight.value + event.translationY;
      calendarHeight.value = Math.max(WEEK_HEIGHT, Math.min(monthHeight, newHeight));
    })
    .onEnd(() => {
      if (calendarHeight.value < monthHeight / 2) {
        calendarHeight.value = withSpring(WEEK_HEIGHT, { damping: 15 });
        if (onCollapseChange) runOnJS(onCollapseChange)(true);
      } else {
        calendarHeight.value = withSpring(monthHeight, { damping: 15 });
        runOnJS(setWeekOffset)(0);
        if (onCollapseChange) runOnJS(onCollapseChange)(false);
      }
    });

  const horizontalPan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const offset = e.translationX > 0 ? -1 : 1;
        translateX.value = withTiming(-offset * width, { duration: 400 }, (isFinished) => {
          if (isFinished) {
            runOnJS(changeViewDate)(offset);
          }
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: calendarHeight.value
  }));

  const animatedWrapperStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      calendarHeight.value,
      [WEEK_HEIGHT, monthHeight],
      [-activeWeekIndex.value * WEEK_HEIGHT, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }, { translateX: translateX.value }]
    };
  });

  return {
    viewDate,
    selectedDate,
    selectDate,
    changeMonth: changeMonthWithAnimation,
    gesture: Gesture.Race(verticalPan, horizontalPan),
    animatedContainerStyle,
    animatedWrapperStyle,
    isCollapsed: isWeekView,
    prevDate,
    centerDate,
    nextDate
  };
}