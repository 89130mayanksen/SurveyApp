import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; // 👈 ADD THIS
import { postFeedbackForm } from '../../api/surveyForm';

const initialFormData = {
  mobileServicePerformance: {
    voiceCall: '1',
    internetPerformance: '1',
  },
  broadbandServicePerformance: {
    provisioning: '1',
    speed: '1',
    resolution: '1',
  },
  mobileNetworkCoverage: {
    indoor: '1',
    outdoor: '1',
  },
  overallExperience: '1',
  suggestions: '',
};

export default function NewFeedbackScreen({ route, navigation }) {
  const { surveyId, buildingId } = route.params;
  const [formData, setFormData] = useState(initialFormData);

  const handleRatingChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleSingleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateAndSubmit = async () => {
    const requiredCategories = [
      'mobileServicePerformance',
      'broadbandServicePerformance',
      'mobileNetworkCoverage',
    ];
    let isValid = true;
    let finalPayload = {};

    // 1. Validate Overall Experience
    const overall = parseInt(formData.overallExperience);
    if (overall < 1 || overall > 5 || isNaN(overall)) {
      isValid = false;
    }

    // 2. Validate Nested Categories
    requiredCategories.forEach(category => {
      finalPayload[category] = {};
      Object.entries(formData[category]).forEach(([field, ratingStr]) => {
        const ratingNum = parseInt(ratingStr);
        if (ratingNum < 1 || ratingNum > 5 || isNaN(ratingNum)) {
          isValid = false;
        }
        finalPayload[category][field] = ratingNum;
      });
    });

    if (!isValid) {
      Alert.alert(
        'Validation Error',
        'All rating fields must be between 1 and 5.',
      );
      return;
    }

    const finalSubmissionBody = {
      ...finalPayload,
      overallExperience: overall,
      suggestions: formData.suggestions,
    };

    const result = await postFeedbackForm(
      surveyId,
      buildingId,
      finalSubmissionBody,
    );

    if (result) {
      console.log('✅ FINAL API PAYLOAD:', finalSubmissionBody);
      Alert.alert('Success', 'Feedback submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const renderPicker = (selectedValue, onValueChange) => (
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#007AFF"
      >
        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="5" value="5" />
      </Picker>
    </View>
  );

  const renderCategoryInputs = (categoryKey, title) => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {Object.keys(formData[categoryKey]).map(fieldKey => (
        <View key={fieldKey} style={styles.inputRow}>
          <Text style={styles.inputLabel}>
            {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
          </Text>
          {renderPicker(formData[categoryKey][fieldKey], value =>
            handleRatingChange(categoryKey, fieldKey, value),
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnTxt}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback Form</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Survey ID: {surveyId.slice(-6)} | Building: {buildingId.slice(-6)}
        </Text>

        {/* Overall Experience */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overall Experience</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Rating</Text>
            {renderPicker(
              formData.overallExperience,
              value => handleSingleFieldChange('overallExperience', value),
            )}
          </View>
        </View>

        {/* Suggestions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Suggestions (Optional)</Text>
          <TextInput
            style={styles.suggestionInput}
            multiline
            numberOfLines={4}
            placeholder="Write any suggestions or additional feedback..."
            placeholderTextColor="#aaa"
            onChangeText={text => handleSingleFieldChange('suggestions', text)}
            value={formData.suggestions}
          />
        </View>

        {/* Categories */}
        {renderCategoryInputs(
          'mobileServicePerformance',
          'Mobile Service Performance',
        )}
        {renderCategoryInputs(
          'broadbandServicePerformance',
          'Broadband Service Performance',
        )}
        {renderCategoryInputs(
          'mobileNetworkCoverage',
          'Mobile Network Coverage',
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={validateAndSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  scrollView: { padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
    elevation: 3,
  },
  backBtnTxt: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginVertical: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputLabel: { fontSize: 15, color: '#374151', flex: 2 },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#111827',
  },
  suggestionInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    minHeight: 100,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
    backgroundColor: '#f9fafb',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 40,
    alignItems: 'center',
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
