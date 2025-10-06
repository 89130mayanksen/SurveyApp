// FeedbackFormHub.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFeedbackForm, submitFeedback } from '../../api/surveyForm'; // <-- adjust path if needed

// Helper to render ratings
const renderRatings = ratings => {
  if (!ratings) return null;
  return Object.entries(ratings).map(([key, value]) => (
    <View key={key} style={styles.ratingItem}>
      <Text style={styles.ratingKey}>
        {key.replace(/([A-Z])/g, ' $1').trim()}:
      </Text>
      <Text style={styles.ratingValue}>{value} / 5</Text>
    </View>
  ));
};

export default function FeedbackFormHub({ route, navigation }) {
  const { userId, surveyId, buildingId, Feedback } = route.params || {};
  console.log(userId);

  // initial feedbacks (if passed via navigation)
  const [feedbacks, setFeedbacks] = useState(Feedback?.existingFeedbacks || []);
  const [loading, setLoading] = useState(false); // used for Reload button / full-screen loader
  const [refreshing, setRefreshing] = useState(false); // used for pull-to-refresh

  const [reportUrl, setReportUrl] = useState(null);

  // Fetch using your API helper. We try multiple places in the returned object for safety.
  const fetchFeedbacks = useCallback(
    async (opts = { showAlert: true, pullRefresh: false }) => {
      const { showAlert, pullRefresh } = opts;

      try {
        if (pullRefresh) setRefreshing(true);
        else setLoading(true);

        const res = await getFeedbackForm(surveyId, buildingId);

        // support a few common shapes: res, res.data, res.data.existingFeedbacks, res.existingFeedbacks
        const list =
          res?.existingFeedbacks ??
          res?.data?.existingFeedbacks ??
          res?.data ??
          res;

        if (!list || !Array.isArray(list)) {
          // If the API returns an object with a "feedbacks" key or different structure, try common keys:
          const alt =
            res?.feedbacks ??
            res?.data?.feedbacks ??
            (res && Array.isArray(res) ? res : null);
          setFeedbacks(Array.isArray(alt) ? alt : []);
        } else {
          setFeedbacks(list);
        }
      } catch (err) {
        console.error('fetchFeedbacks error:', err);
        if (showAlert) {
          Alert.alert(
            'Error',
            'Unable to reload feedbacks. Check console for details.',
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [surveyId, buildingId],
  );

  // Fetch on mount
  useEffect(() => {
    fetchFeedbacks({ showAlert: false });
  }, [fetchFeedbacks]);

  // Auto-refresh when screen comes into focus (e.g., after adding new feedback)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchFeedbacks({ showAlert: false });
    });
    return unsubscribe;
  }, [navigation, fetchFeedbacks]);

  const navigateToNewFeedback = () => {
    navigation.navigate('NewFeedback', {
      surveyId,
      buildingId,
    });
  };

  async function handleFeedbackSubmit(surveyId, buildingId) {
    try {
      const result = await submitFeedback(userId, surveyId, buildingId);
      console.log('Submit result:', result);

      if (result?.pdfUrl) {
        setReportUrl(result.pdfUrl);
        Alert.alert('Success', 'Feedback submitted successfully!');
      } else {
        Alert.alert(
          'Notice',
          'Feedback submitted, but no report was generated.',
        );
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Feedback Submission #{index + 1}</Text>
      <Text style={styles.submissionDate}>
        Submitted on: {new Date(item.createdAt).toLocaleDateString()}
      </Text>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Experience</Text>
        <Text style={styles.overallRating}>
          {item.overallExperience} / 5 ⭐
        </Text>
      </View>

      {item.suggestions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <Text style={styles.suggestionText}>{item.suggestions}</Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mobile Service Performance</Text>
        {renderRatings(item.mobileServicePerformance)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Broadband Service Performance</Text>
        {renderRatings(item.broadbandServicePerformance)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mobile Network Coverage</Text>
        {renderRatings(item.mobileNetworkCoverage)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.backBtn}
      >
        <Text style={styles.backBtnTxt}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Feedback Hub</Text>
      <Text style={styles.headerSubtitle}>
        Survey: {String(surveyId).slice(-6)} | Building:{' '}
        {String(buildingId).slice(-6)}
      </Text>

      {reportUrl && (
        <TouchableOpacity
          onPress={() => Linking.openURL(reportUrl)}
          activeOpacity={0.8}
          style={styles.reportCard}
        >
          <Text style={styles.reportTitle}>📄 Your Feedback Report</Text>
          <Text style={styles.reportSubtitle}>Tap to view PDF</Text>
          <Text numberOfLines={1} style={styles.reportUrl}>
            {reportUrl}
          </Text>
        </TouchableOpacity>
      )}

      {/* List with pull-to-refresh */}
      <FlatList
        data={feedbacks}
        keyExtractor={(item, idx) => item._id ?? String(idx)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() =>
          !loading ? (
            <Text style={styles.noFeedbackText}>
              No existing feedback found for this survey.
            </Text>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              fetchFeedbacks({ showAlert: true, pullRefresh: true })
            }
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
      />

      {/* Add new feedback */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <TouchableOpacity
          onPress={() => handleFeedbackSubmit(surveyId, buildingId)}
          style={styles.getButton}
        >
          <Text style={styles.getButtonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToNewFeedback}
          style={styles.getButton}
        >
          <Text style={styles.getButtonText}>Add New Feedback</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ----------------------------------------------------------------
// STYLES (kept similar to what you had)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { paddingHorizontal: 15, paddingBottom: 24 },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  backBtn: { alignSelf: 'flex-start', marginLeft: 10, marginTop: 10 },
  backBtnTxt: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
    padding: 20,
    backgroundColor: 'rgba(220, 220, 220, 0.45)',
    borderRadius: 20,
  },

  reloadButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  submissionDate: { fontSize: 12, color: '#999', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#555',
    marginBottom: 8,
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginVertical: 2,
  },
  ratingKey: { fontSize: 14, color: '#333', textTransform: 'capitalize' },
  ratingValue: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  overallRating: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#e9ffe9',
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  noFeedbackText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
  getButton: {
    width: '40%',
    height: 70,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  getButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reportCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16,
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cce4ff',
    shadowColor: '#007AFF',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  reportUrl: {
    fontSize: 12,
    color: '#0066cc',
    textDecorationLine: 'underline',
    textAlign: 'center',
    maxWidth: '100%',
  },
});
