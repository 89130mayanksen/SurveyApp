import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Part from '../../components/Part';
import Icon from 'react-native-vector-icons/Ionicons'; // Using Ionicons for back arrow
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FormScreen({ navigation }) {
  const route = useRoute();
  const { form, surveyId, buildingId } = route.params;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Correct navigation
        >
          <View style={styles.backButtonContainer}>
            <Icon name="arrow-back" size={24} color="#1E3A8A" />
            <Text style={styles.backText}>Back</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>{form.name}</Text>
        <View style={styles.divider} />
      </View>

      {/* Parts */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {form.parts.map(part => (
          <Part
            key={part._id}
            part={part}
            formId={form._id}
            surveyId={surveyId}
            buildingId={buildingId}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F8FF', // soft blue-white background
  },
  header: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#1E90FF',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderColor: '#E3EEFF',
  },
  backButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(228, 228, 228, 0.81)',
    borderRadius: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10',
  },
  backText: {
    color: '#1E3A8A',
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  divider: {
    height: 3,
    width: 60,
    backgroundColor: '#1E90FF',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
});
