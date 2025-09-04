import { useState, useCallback } from "react";
import { Dimensions } from "react-native";
import { useSharedValue, withTiming, Easing, runOnJS } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

export function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());
  const [outgoingDate, setOutgoingDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const animValue = useSharedValue(0);

  const changeMonth = useCallback((offset: number, selectDay?: number) => {
    if (animValue.value !== 0 && animValue.value !== 1) {
      return;
    }

    setOutgoingDate(currentDate);
    setDirection(offset);

    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
    setSelectedDate(selectDay ?? null);
    
    animValue.value = 0;
    animValue.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    }, (isFinished) => {
      if (isFinished) {
        runOnJS(setOutgoingDate)(null);
      }
    });
  }, [currentDate, animValue]);

  const gesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onEnd((event) => {
      if (event.translationX > 50) {
        runOnJS(changeMonth)(-1);
      } else if (event.translationX < -50) {
        runOnJS(changeMonth)(1);
      }
    });

  return {
    currentDate,
    outgoingDate,
    selectedDate,
    direction,
    animValue,
    setSelectedDate,
    changeMonth,
    gesture,
    width,
  };
}