import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Field({ field }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>• {field.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  text: { fontSize: 16, color: '#333' },
});
