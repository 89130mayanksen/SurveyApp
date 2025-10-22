import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Field from './Field';
import { postRating, getRating } from '../api/surveyForm';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Part({ part, formId, surveyId, buildingId }) {
  const [rating, setRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRated, setIsRated] = useState(false);

  // ✅ Fetch rating and set it in state
  async function handleGetRating() {
    try {
      const result = await getRating(surveyId, buildingId, formId, part._id);
      console.log('GET RATING RESULT:', result);

      if (result?.data?.rating !== undefined) {
        setRating(result.data.rating.toString());
        setIsRated(true); // mark as rated if value exists
      }
    } catch (err) {
      console.log('Error fetching rating:', err);
    }
  }

  useEffect(() => {
    handleGetRating();
  }, []);

  const handleRatingSubmit = async () => {
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 10) {
      Alert.alert(
        'Invalid Rating',
        'Please enter a valid number between 0 and 10.',
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await postRating(
        surveyId,
        buildingId,
        formId,
        part._id,
        parsedRating,
      );
      console.log('Rating Submission Result:', result);
      Alert.alert(`${result.message}`);
      setIsRated(true);
    } catch (error) {
      console.error('Rating Submission Error:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
      setIsRated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{part.name}</Text>

      {part.fields.map(field => (
        <View key={field._id}>
          <Field
            field={field}
            partId={part._id}
            formId={formId}
            surveyId={surveyId}
            buildingId={buildingId}
          />
        </View>
      ))}

      {/* RATING SECTION */}
      <View style={styles.ratingSection}>
        <Text style={styles.ratingLabel}>Max Rating {part.ratingRule}</Text>

        <View style={styles.ratingInputContainer}>
          <TextInput
            style={[
              styles.ratingInput,
              isRated && { borderColor: '#28A745', backgroundColor: '#F0FFF4' }, // ✅ slight green tint if rated
            ]}
            placeholder="Enter Rating"
            placeholderTextColor={'#666'}
            keyboardType="numeric"
            value={rating}
            onChangeText={text => {
              setRating(text);
              setIsRated(false);
            }}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={handleRatingSubmit}
            style={[
              styles.ratingButton,
              isRated && styles.ratingButtonSuccess,
              isLoading && styles.ratingButtonLoading,
            ]}
            disabled={isLoading || isRated}
          >
            {isLoading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}> Saving...</Text>
              </View>
            ) : isRated ? (
              <View style={styles.buttonContent}>
                <Icon name="check-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}> Rated</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Icon name="star" size={20} color="#fff" />
                <Text style={styles.buttonText}> Submit</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#D6E4FF',
    shadowColor: '#1E90FF',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: '#1E3A8A',
    borderBottomWidth: 2,
    borderBottomColor: '#D6E4FF',
    paddingBottom: 10,
  },
  ratingSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  ratingInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F7F9FC',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    fontSize: 16,
  },
  ratingButton: {
    backgroundColor: '#1E90FF',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    flexDirection: 'row',
  },
  ratingButtonSuccess: {
    backgroundColor: '#28A745',
  },
  ratingButtonLoading: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
