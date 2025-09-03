import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function MyPageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>마이 페이지</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20 },
});
