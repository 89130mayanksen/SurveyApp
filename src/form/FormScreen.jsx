import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { pick, isCancel } from '@react-native-documents/picker';
import { uploadSurveyField } from '../functions/uploadFile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FormScreen({
  form,
  navigation,
  buildingDetails,
  route,
}) {
  const { index, totalForms } = route.params;
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  // deviation toggle state
  const [showDeviation, setShowDeviation] = useState(false);
  const [deviationText, setDeviationText] = useState('');

  ///////////
  const [deviationFields, setDeviationFields] = useState({});
  ///////////

  ///////////
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  ///////////

  ///////////
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('');
  ///////////

  const addFeedback = () => {
    if (feedback.trim() === '') return;
    setFeedbackList(prev => [...prev, feedback.trim()]);
    setFeedback('');
  };

  const toggleDeviation = fieldId => {
    setDeviationFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId], // toggle only this field
    }));
  };

  const pickDocument = async (formId, partId, fieldId, comment) => {
    try {
      setLoading(true);
      const [res] = await pick({ type: ['*/*'] });
      console.log(comment);
      handleUpload(res, formId, partId, fieldId, comment);
    } catch (err) {
      if (!isCancel(err)) console.error(err);
      setLoading(false);
    }
  };

  const openCamera = async (formId, partId, fieldId) => {
    try {
      setLoading(true);
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(false);
          return;
        }
      }

      ImagePicker.launchCamera(
        { mediaType: 'photo', includeBase64: false, saveToPhotos: true },
        response => {
          if (response?.assets?.length > 0) {
            Alert.alert('Upload declined', 'File size > 2MB');
            setLoading(false);
            return;
            handleUpload(response.assets[0], formId, partId, fieldId);
          } else {
            setLoading(false);
          }
        },
      );
    } catch (err) {
      console.warn(err);
      setLoading(false);
    }
  };

  const handleUpload = async (file, formId, partId, fieldId, comment) => {
    try {
      if (!file?.uri) {
        Alert.alert('Error', 'No file selected.');
        return;
      }
      if (file.size > 2097152) {
        Alert.alert('Upload declined', 'File size > 2MB');
        return;
      }
      await uploadSurveyField(file, formId, partId, fieldId, comment);
      Alert.alert('✅ Success', 'File uploaded!');
    } catch (err) {
      Alert.alert('❌ Error', err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadRating = (formId, partId, rating) => {
    const rate = {"formId": formId, "partId": partId, 'rating': rating};

    try {
      const response = handleUpload(rate);
      console.log(response);
      if(!response.ok){
        console.log(response.message);
      }
    } catch (error) {
      
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{ marginTop: 10, color: '#4CAF50' }}>Uploading...</Text>
        </View>
      )}

      <ScrollView style={styles.container}>
        {/* Building details */}
        {buildingDetails && (
          <View style={styles.buildingCard}>
            <Text style={styles.cardTitle}>Building Info</Text>
            <Text style={styles.detail}>
              Name: {buildingDetails.property_manager_name}
            </Text>
            <Text style={styles.detail}>
              Building name: {buildingDetails.building_name}
            </Text>
            <Text style={styles.detail}>
              Category: {buildingDetails.category}
            </Text>
            <Text style={styles.detail}>
              Address: {buildingDetails.location_address}
            </Text>
            <Text style={styles.detail}>
              Floors: {buildingDetails.building_floors}
            </Text>
            <Text style={styles.detail}>
              Property: {buildingDetails.type_property}
            </Text>
            <Text style={styles.detail}>
              URIN: {buildingDetails.URIN_NUMBER}
            </Text>
          </View>
        )}

        {/* Form Parts */}
        {form.parts.map((part, pIndex) => (
          <View key={part._id || pIndex} style={styles.partCard}>
            <Text style={styles.partTitle}>{part.name}</Text>
            {part.fields.map((field, fIndex) => (
              <View key={field._id || fIndex} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{field.name}</Text>

                <View style={styles.buttonRow}>
                  {/* Document Upload */}
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: '#6C63FF' }]}
                    onPress={() =>
                      pickDocument(form._id, part._id, field._id, comment)
                    }
                  >
                    <Icon name="file-upload-outline" size={20} color="#fff" />
                  </TouchableOpacity>

                  {/* Camera Upload */}
                  <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() =>
                      openCamera(form._id, part._id, field._id, comment)
                    }
                  >
                    <Icon name="camera-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Add Deviation Toggle */}
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => toggleDeviation(field._id)}
                >
                  <Text style={styles.toggleText}>+ Add Deviation</Text>
                </TouchableOpacity>

                {/* Only render input if this field's deviation is true */}
                {deviationFields[field._id] && (
                  <View style={{ marginTop: 10 }}>
                    <TextInput
                      style={styles.deviationInput}
                      placeholder="Enter deviation..."
                      placeholderTextColor="#ccc"
                      value={comment}
                      onChangeText={value => setComment(value)}
                    />
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => toggleDeviation(field._id)}
                    >
                      <Text style={{ color: '#fff' }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
            {/* Rating Input */}
            <View style={styles.ratingCard}>
              <Text style={styles.ratingLabel}>Enter your Rating</Text>
              <TextInput
                style={styles.ratingInput}
                placeholder="e.g. 4"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                value={rating}
                onChangeText={value => setRating(value)}
              />
            </View>
          </View>
        ))}

        {/* Feedback Section */}
        {index === totalForms - 1 && (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>💬 Feedback Reviews</Text>

            {/* Input row */}
            <View style={styles.feedbackRow}>
              <TextInput
                style={styles.feedbackInput}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Write your feedback..."
                placeholderTextColor="#aaa"
                multiline
              />
              <TouchableOpacity style={styles.addButton} onPress={addFeedback}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* List of feedback */}
            {feedbackList.map((item, idx) => (
              <View key={idx} style={styles.feedbackItem}>
                <Text style={styles.feedbackText}>• {item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Submit button */}
        {index === totalForms - 1 && (
          <>
            {!submit ? (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => setSubmit(true)}
              >
                <Text style={styles.submitText}>Submit Survey</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.reportCard}>
                <Text style={styles.reportTitle}>Submitted Successfully</Text>
                <Text style={styles.reportText}>Your form rating: 25</Text>

                {/* Stars */}
                <View style={styles.starsRow}>
                  {[...Array(1)].map((_, i) => (
                    <Text key={i} style={styles.star}>
                      ★
                    </Text>
                  ))}
                </View>

                <Text style={styles.thankYou}>
                  Thank you for completing the survey!
                </Text>
              </View>
            )}
          </>
        )}

        {/* Navigation buttons */}
        <View style={styles.navContainer}>
          {index > 0 && (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: '#555' }]}
              onPress={() => navigation.replace(`Form${index}`)}
            >
              <Text style={styles.navText}>← Previous</Text>
            </TouchableOpacity>
          )}
          {index < totalForms - 1 && (
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: '#2196F3' }]}
              onPress={() => navigation.replace(`Form${index + 2}`)}
            >
              <Text style={styles.navText}>Next →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,18,18,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  buildingCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#fff',
  },
  detail: { fontSize: 14, marginBottom: 4, color: '#bbb' },

  partCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
  },
  partTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#eee',
  },

  fieldRow: { marginBottom: 18 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#ddd',
  },

  buttonRow: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ratingInput: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 80,
    color: '#fff',
    backgroundColor: '#2a2a2a',
  },

  // toggle deviation
  toggleButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  toggleText: { color: '#bbb', fontWeight: '600' },
  deviationInput: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    color: '#fff',
    backgroundColor: '#2a2a2a',
    textAlignVertical: 'top',
  },
  doneButton: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  doneText: { color: '#fff', fontWeight: '600' },

  submitButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#BB86FC',
    alignItems: 'center',
    elevation: 3,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 25,
  },
  navButton: {
    flex: 0.45,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    backgroundColor: '#333',
  },
  navText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  reportCard: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  reportTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  reportText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  star: {
    color: '#FFD700', // gold stars
    fontSize: 24,
    marginHorizontal: 2,
  },
  thankYou: {
    marginTop: 10,
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
  },
  feedbackCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    backgroundColor: '#2a2a2a',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  feedbackItem: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 6,
  },
  feedbackText: {
    color: '#ddd',
    fontSize: 14,
  },
  ratingCard: {
    backgroundColor: '#1E1E1E', // dark card
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#9c9c9cff',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 3 },
    elevation: 4,
    borderWidth: 0.3,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0', // light gray text
  },
});
