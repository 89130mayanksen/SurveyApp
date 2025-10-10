import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute } from '@react-navigation/native';

export default function FeedbackDetailScreen() {
  const route = useRoute();
  const { user, feedbacks } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      {/* <Text style={styles.title}>Feedback Details</Text> */}

      {/* User Info */}
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.iconCircle}>
            <Icon name="user" size={24} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.userName}>{user?.name || 'Unknown User'}</Text>
            <Text style={styles.userEmail}>{user?.email || '-'}</Text>
          </View>
        </View>
      </View>

      {/* Feedback Data */}
      {feedbacks.map((fb, idx) => (
        <View key={idx} style={styles.feedbackCard}>
          <View style={styles.sectionHeader}>
            <Icon name="home" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>
              {fb.buildingInfo?.building_name || 'Unnamed Building'}
            </Text>
          </View>
          <Text style={styles.sectionSub}>
            {fb.buildingInfo?.location_address || 'Address not available'}
          </Text>

          {fb.feedbacks.map((inner, i) => (
            <View key={i} style={styles.innerFeedback}>
              <View style={styles.row}>
                <Icon name="phone-call" size={16} color="#3B82F6" />
                <Text style={styles.detailText}>
                  Voice Call Quality: {inner.mobileServicePerformance?.voiceCall}/5
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="wifi" size={16} color="#3B82F6" />
                <Text style={styles.detailText}>
                  Internet Performance: {inner.mobileServicePerformance?.internetPerformance}/5
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="download-cloud" size={16} color="#3B82F6" />
                <Text style={styles.detailText}>
                  Broadband Speed: {inner.broadbandServicePerformance?.speed}/5
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="map-pin" size={16} color="#3B82F6" />
                <Text style={styles.detailText}>
                  Indoor Coverage: {inner.mobileNetworkCoverage?.indoor}/5
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="navigation" size={16} color="#3B82F6" />
                <Text style={styles.detailText}>
                  Outdoor Coverage: {inner.mobileNetworkCoverage?.outdoor}/5
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="star" size={16} color="#3B82F6" />
                <Text style={styles.detailText}>
                  Overall Experience: {inner.overallExperience}/5
                </Text>
              </View>

              <View style={styles.suggestionBox}>
                <Icon name="message-circle" size={16} color="#2563EB" />
                <Text style={styles.suggestionText}>
                  {inner.suggestions || 'No suggestions provided.'}
                </Text>
              </View>

              <Text style={styles.timestamp}>
                Submitted: {new Date(inner.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC', // very light blue-gray background
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    shadowColor: '#93C5FD',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    shadowColor: '#93C5FD',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginLeft: 6,
  },
  sectionSub: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 26,
  },
  innerFeedback: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 8,
  },
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#1E3A8A',
    marginLeft: 6,
    flexShrink: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'right',
  },
});
