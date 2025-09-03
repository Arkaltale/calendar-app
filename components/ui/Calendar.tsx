import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useCalendarState } from "../../hooks/useCalendarState";
import { useCalendar } from "../../hooks/useCalendar";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type CalendarGridProps = {
  weeks: { day: number; isOutside: boolean; monthOffset: number }[][];
  year: number;
  month: number;
  selected: number | null;
  setSelected: (day: number) => void;
  changeMonth: (offset: number, selectDay?: number) => void;
};

function CalendarGrid({ weeks, year, month, selected, setSelected, changeMonth }: CalendarGridProps) {
  const today = new Date();
  return (
    <View>
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.row}>
          {week.map((dateObj, di) => {
            const { day, isOutside, monthOffset } = dateObj;
            const isToday = !isOutside && year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();
            const isSelected = !isOutside && selected === day;

            return (
              <View key={di} style={styles.cell}>
                <TouchableOpacity
                  onPress={() => {
                    if (isOutside) {
                      changeMonth(monthOffset, day);
                    } else {
                      setSelected(day);
                    }
                  }}
                  activeOpacity={0.7}
                  style={{ borderRadius: 18 }}
                >
                  <View style={[styles.circle, isToday && styles.circleToday, isSelected && styles.circleSelected]}>
                    <Text style={[styles.dayText, isOutside && styles.dayTextOutside]}>
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
  const {
    currentDate,
    targetDate,
    selectedDate,
    direction,
    animValue,
    panHandlers,
    setSelectedDate,
    changeMonth,
  } = useCalendarState();

  const currentWeeks = useCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  const targetWeeks = useCalendar(targetDate.getFullYear(), targetDate.getMonth() + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
           <Ionicons name="chevron-back" size={24} color="#56e5f8ff" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={24} color="#56e5f8ff" />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {days.map((d, i) => (
          <Text key={d} style={[styles.weekday, i === 0 && { color: "#E74C3C" }, i === 6 && { color: "#3B82F6" }]}>
            {d}
          </Text>
        ))}
      </View>

      <View style={{ height: 6 * 50, overflow: "hidden" }} {...panHandlers}>
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            transform: [{
              translateX: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -direction * width],
              }),
            }],
          }}
        >
          <CalendarGrid
            weeks={currentWeeks}
            year={currentDate.getFullYear()}
            month={currentDate.getMonth() + 1}
            selected={selectedDate}
            setSelected={setSelectedDate}
            changeMonth={changeMonth}
          />
        </Animated.View>

        {direction !== 0 && (
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              transform: [{
                translateX: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [direction * width, 0],
                }),
              }],
            }}
          >
            <CalendarGrid
              weeks={targetWeeks}
              year={targetDate.getFullYear()}
              month={targetDate.getMonth() + 1}
              selected={selectedDate}
              setSelected={setSelectedDate}
              changeMonth={changeMonth}
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: "600" },
  navButton: { padding: 10,},
  row: { flexDirection: "row" },
  weekday: { flex: 1, textAlign: "center", fontWeight: "500", fontSize: 14, marginBottom: 8 },
  cell: { flex: 1, aspectRatio: 1, justifyContent: "center", alignItems: "center" },
  circle: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  circleToday: { borderWidth: 1, borderColor: "#999", borderRadius: 18, },
  circleSelected: { borderWidth: 1.5, borderColor: "#007AFF", borderRadius: 18, backgroundColor: "rgba(0, 122, 255, 0.1)" },
  dayText: { fontSize: 16, color: "#000" },
  dayTextOutside: { color: "#CCC" },
});