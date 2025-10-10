import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

export default function SurveyDetailScreen() {
  const route = useRoute();
  const { survey, user } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🗂️ Survey Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Survey Information</Text>

        <View style={styles.row}>
          <Icon name="file-text" size={18} color="#2563EB" />
          <Text style={styles.infoText}>
            Survey ID: {survey?._id || survey?.surveyId}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="home" size={18} color="#2563EB" />
          <Text style={styles.infoText}>
            Building: {survey?.building?.building_name}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="map-pin" size={18} color="#2563EB" />
          <Text style={styles.infoText}>
            Location: {survey?.building?.location_address}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="calendar" size={18} color="#2563EB" />
          <Text style={styles.infoText}>
            Created At: {new Date(survey?.createdAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="clipboard" size={18} color="#2563EB" />
          <Text style={styles.infoText}>
            Total Forms: {survey?.forms?.length || 0}
          </Text>
        </View>
      </View>

      {/* 📑 Forms */}
      {survey?.forms?.map((form, fIndex) => (
        <View key={form.formId || fIndex} style={styles.formCard}>
          <Text style={styles.formTitle}>
            {fIndex + 1}. {form?.formName}
          </Text>
          <Text style={styles.formSubtitle}>
            Total Parts: {form?.parts?.length || 0}
          </Text>

          {form?.parts?.map((part, pIndex) => (
            <View key={part.partId || pIndex} style={styles.partCard}>
              <View style={styles.partHeader}>
                <Icon name="layers" size={18} color="#1E40AF" />
                <Text style={styles.partTitle}>
                  {pIndex + 1}. {part?.partName}
                </Text>
              </View>

              <Text style={styles.partRating}>
                Rating:{' '}
                {part?.rating !== null ? `${part.rating}/5` : 'Not Rated'}
              </Text>

              {/* 📁 Fields */}
              {part?.fields?.map((field, fieldIndex) => (
                <View
                  key={field.fieldId || fieldIndex}
                  style={styles.fieldCard}
                >
                  <Text style={styles.fieldName}>
                    {fieldIndex + 1}. {field?.fieldName}
                  </Text>

                  {field?.uploadedDocs?.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(field.uploadedDocs[0])}
                    >
                      <Text style={styles.fieldLink}>View Document</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.noDoc}>No document uploaded</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1E293B',
  },
  userText: { fontSize: 16, color: '#4B5563', marginBottom: 4 },

  infoCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E293B',
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: 15, color: '#4B5563', marginLeft: 8 },

  formCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  formSubtitle: { fontSize: 15, color: '#6B7280', marginBottom: 14 },

  partCard: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  partHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  partTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 6,
  },
  partRating: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 10,
    marginLeft: 24,
  },

  fieldCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fieldName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 6,
  },
  fieldLink: {
    fontSize: 15,
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  noDoc: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic' },
});
