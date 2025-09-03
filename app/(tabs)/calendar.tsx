// app/(tabs)/calendar.tsx
import { SafeAreaView } from "react-native-safe-area-context";
import Calendar from "../../components/ui/Calendar";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <Calendar />
    </SafeAreaView>
  );
}
