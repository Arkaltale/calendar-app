import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import Calendar from '../../components/ui/Calendar';

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Calendar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
});