import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Field from './Field';

export default function Part({ part }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Part</Text>

      {part.fields.length > 0 ? (
        part.fields.map((field) => <Field key={field._id} field={field} />)
      ) : (
        <Text style={styles.empty}>No fields available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  empty: { fontSize: 14, color: '#999' },
});
