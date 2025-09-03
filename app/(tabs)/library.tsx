import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>라이브러리</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20 },
});
