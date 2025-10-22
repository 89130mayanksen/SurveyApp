import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getAllPendingSurveys } from '../../api/admin';

export default function PendingSurveysScreen() {
  const [pendingData, setPendingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingSurveys();
  }, []);

  const fetchPendingSurveys = async () => {
    try {
      const result = await getAllPendingSurveys();
      setPendingData(result?.data || []);
    } catch (error) {
      console.error('❌ Error fetching pending surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!pendingData.length) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>No pending surveys available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pendingData}
      keyExtractor={(item) => item.user._id}
      contentContainerStyle={styles.container}
      renderItem={({ item: userGroup }) => (
        <View style={styles.userCard}>
          {/* 👤 User Info */}
          <View style={styles.userInfo}>
            <View style={styles.row}>
              <Icon name="user" size={18} color="#2563EB" />
              <Text style={styles.userName}>{userGroup.user.name}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="mail" size={16} color="#6B7280" />
              <Text style={styles.userEmail}>{userGroup.user.email}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="phone" size={16} color="#6B7280" />
              <Text style={styles.userPhone}>{userGroup.user.phone}</Text>
            </View>
          </View>

          {/* 📊 Summary */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Icon name="check-circle" size={18} color="#16A34A" />
              <Text style={styles.summaryText}>
                Submitted: {userGroup.submittedSurveys}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Icon name="clock" size={18} color="#F59E0B" />
              <Text style={styles.summaryText}>
                Pending: {userGroup.pendingCount}
              </Text>
            </View>
          </View>

          {/* 🏢 Pending Surveys */}
          {userGroup.pendingSurveys.length > 0 ? (
            userGroup.pendingSurveys.map((survey, idx) => {
              const total = survey.progress?.totalFields || 0;
              const completed = survey.progress?.completedFields || 0;
              const percentage =
                total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <View key={idx} style={styles.surveyCard}>
                  <View style={styles.row}>
                    <Icon name="home" size={18} color="#1E293B" />
                    <Text style={styles.buildingName}>
                      {survey.buildingName || 'Unnamed Building'}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Icon name="map-pin" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>
                      {survey.locationAddress || 'Unknown Location'}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Icon name="calendar" size={16} color="#6B7280" />
                    <Text style={styles.infoText}>
                      Created: {new Date(survey.createdAt).toLocaleString()}
                    </Text>
                  </View>

                  {/* 📈 Progress */}
                  <View style={[styles.row, { marginTop: 8 }]}>
                    <Icon name="bar-chart-2" size={16} color="#2563EB" />
                    <Text style={styles.progressText}>
                      Progress: {percentage}% ({completed}/{total} fields)
                    </Text>
                  </View>

                  {/* 🔵 Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${percentage}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.noSurveyCard}>
              <Icon name="x-circle" size={16} color="#E74C3C" />
              <Text style={styles.noSurveyText}>No pending surveys</Text>
            </View>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userInfo: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
  },
  userPhone: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#1E3A8A',
    marginLeft: 6,
  },
  surveyCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buildingName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
  },
  progressText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  noSurveyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  noSurveyText: {
    color: '#E11D48',
    fontSize: 14,
    marginLeft: 6,
  },
});
