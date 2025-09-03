import { useState, useRef, useMemo } from "react";
import { Animated, Easing, Dimensions, PanResponder } from "react-native";

const { width } = Dimensions.get("window");

export function useCalendarState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());

  const [targetDate, setTargetDate] = useState(currentDate);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setAnimating] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  const changeMonth = (offset: number, selectDay?: number) => {
    if (isAnimating || offset === 0) return;

    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);

    setAnimating(true);
    setDirection(offset);
    setTargetDate(newDate);

    animValue.setValue(0);

    Animated.timing(animValue, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setCurrentDate(newDate);
      setSelectedDate(selectDay ?? null);
      setDirection(0);
      setAnimating(false);
    });
  };

  const panResponder = useMemo( // useMemo 미사용 시 좌우 스와이프 시 특정 달만 반복됨
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          !isAnimating && Math.abs(gestureState.dx) > 20,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 50) {
            changeMonth(-1);
          } else if (gestureState.dx < -50) {
            changeMonth(1);
          }
        },
      }),
    [isAnimating, currentDate]
  );

  return {
    currentDate,
    targetDate,
    selectedDate,
    direction,
    animValue,
    panHandlers: panResponder.panHandlers,
    setSelectedDate,
    changeMonth,
  };
}