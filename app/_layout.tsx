import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
