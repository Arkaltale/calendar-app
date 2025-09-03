import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaProvider>
  );
}
