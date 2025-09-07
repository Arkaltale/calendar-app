import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useCalendar } from "../../hooks/useCalendar";
import { useInteractiveCalendar } from "../../hooks/useInteractiveCalendar";

const { width } = Dimensions.get("window");
const days = ["일", "월", "화", "수", "목", "금", "토"];
const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

type GridProps = {
  weeks: { day: number; isOutside: boolean; monthOffset: number }[][];
  baseDate: Date;
  selectedDate: Date | null;
  onDatePress: (date: Date) => void;
};

function CalendarGrid({ weeks, baseDate, selectedDate, onDatePress }: GridProps) {
  const today = new Date();
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  return (
    <View>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.row}>
          {week.map((cell, di) => {
            if (!cell) return <View key={di} style={styles.cell} />;
            const { day, isOutside, monthOffset } = cell;
            const date = new Date(year, month + monthOffset, day);

            const isToday = !isOutside &&
              date.getFullYear() === today.getFullYear() &&
              date.getMonth() === today.getMonth() &&
              date.getDate() === today.getDate();

            const isSelected = !isOutside &&
              selectedDate &&
              date.getFullYear() === selectedDate.getFullYear() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getDate() === selectedDate.getDate();

            return (
              <View key={di} style={styles.cell}>
                <TouchableOpacity onPress={() => onDatePress(date)} activeOpacity={0.7} style={styles.touchable}>
                  <View style={[styles.circle, isToday && styles.circleToday, isSelected && styles.circleSelected]}>
                    <Text style={[styles.dayText, isOutside && styles.dayTextOutside, isSelected && styles.selectedDayText]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default function Calendar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    viewDate,
    selectedDate,
    selectDate,
    changeMonth,
    gesture,
    animatedContainerStyle,
    animatedWrapperStyle,
    prevDate,
    centerDate,
    nextDate,
  } = useInteractiveCalendar();


  const prevWeeks = useCalendar(prevDate.getFullYear(), prevDate.getMonth() + 1);
  const currentWeeks = useCalendar(centerDate.getFullYear(), centerDate.getMonth() + 1);
  const nextWeeks = useCalendar(nextDate.getFullYear(), nextDate.getMonth() + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {viewDate.getFullYear()}년 {months[viewDate.getMonth()]}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      {/* 요일 */}
      <View style={styles.row}>
        {days.map((d, i) => <Text key={d} style={[styles.weekday, (i === 0 || i === 6) && styles.weekendText]}>{d}</Text>)}
      </View>
      {/* 달력 본문 */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.calendarContainer, animatedContainerStyle]}>
          <Animated.View style={animatedWrapperStyle}>
            <View style={{ width: width * 3, flexDirection: 'row', left: -width }}>
              <View style={{ width }}>
                <CalendarGrid weeks={prevWeeks} baseDate={prevDate} selectedDate={selectedDate} onDatePress={selectDate} />
              </View>
              <View style={{ width }}>
                <CalendarGrid weeks={currentWeeks} baseDate={centerDate} selectedDate={selectedDate} onDatePress={selectDate} />
              </View>
              <View style={{ width }}>
                <CalendarGrid weeks={nextWeeks} baseDate={nextDate} selectedDate={selectedDate} onDatePress={selectDate} />
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", paddingTop: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingHorizontal: 10 },
  title: { fontSize: 20, fontWeight: "bold" },
  navButton: { padding: 10 },
  row: { flexDirection: "row", height: 50, alignItems: "center" },
  weekday: { flex: 1, textAlign: "center", fontWeight: "500", fontSize: 13, color: "#999" },
  weekendText: { color: "#333" },
  cell: { flex: 1, height: "100%", justifyContent: "center", alignItems: "center" },
  touchable: { flex: 1, width: "100%", justifyContent: "center", alignItems: "center" },
  circle: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  circleToday: { borderWidth: 1.5, borderColor: "#ccc", borderRadius: 18, },
  circleSelected: { backgroundColor: "#007AFF", borderRadius: 18, },
  dayText: { fontSize: 16, color: "#000" },
  selectedDayText: { color: '#fff', fontWeight: 'bold' },
  dayTextOutside: { color: "#CCC" },
  calendarContainer: { overflow: 'hidden' },
});