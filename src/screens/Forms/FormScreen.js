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
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FormScreen({ navigation }) {
  const route = useRoute();
  const { form, surveyId, buildingId, allForms = [] } = route.params;
  console.log(form);

  // Find current form index and get next form (if available)
  const currentIndex = allForms.findIndex(f => f._id === form._id);
  const nextForm = currentIndex !== -1 ? allForms[currentIndex + 1] : null;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={22} color="#1E3A8A" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        {/* Home Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Icon name="home" size={22} color="#1E3A8A" />
        </TouchableOpacity>

        {/* Next Button */}
        {nextForm ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              navigation.push('FormScreen', {
                form: nextForm,
                surveyId,
                buildingId,
                allForms: item.forms,
              })
            }
          >
            <Text style={styles.buttonText}>Next</Text>
            <Icon name="arrow-forward" size={22} color="#1E3A8A" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} /> // keeps header aligned
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{form.formName || form.name}</Text>
      <View style={styles.divider} />

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
    backgroundColor: '#F4F8FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: '#E3EEFF',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  homeButton: {
    backgroundColor: '#EAF2FF',
    borderRadius: 50,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    marginTop: 10,
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
