import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getCompanySurveys, getDcraPdf } from '../../api/admin';

export default function SubmittedSurveysScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmittedSurveys();
  }, []);

  const fetchSubmittedSurveys = async () => {
    try {
      const result = await getCompanySurveys();
      const fetchedData = result?.data || [];
      setData(fetchedData);
      if (fetchedData.length === 0) {
        Alert.alert(
          'No Submitted Surveys',
          'There are no submitted surveys available.',
        );
      }
    } catch (error) {
      console.error('Error fetching submitted surveys:', error);
      Alert.alert('Error', 'Failed to fetch submitted surveys.');
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

  if (!data.length) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>No submitted surveys available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Submitted Surveys</Text> */}

      {data.map((item, index) => (
        <View key={item.user._id || index} style={styles.userSection}>
          {/* 👤 User Info */}
          <View style={styles.userHeader}>
            <Icon name="user" size={20} color="#4A90E2" />
            <Text style={styles.userName}>{item.user.name}</Text>
          </View>
          <View style={styles.userEmailRow}>
            <Icon name="mail" size={18} color="#64748B" />
            <Text style={styles.userEmail}>{item.user.email}</Text>
          </View>

          {/* 📑 Submitted Surveys */}
          {item.submittedSurveys?.length > 0 ? (
            item.submittedSurveys.map((survey, idx) => (
              <View key={idx} style={styles.surveyCard}>
                <View style={styles.row}>
                  <Icon name="calendar" size={18} color="#555" />
                  <Text style={styles.dateText}>
                    Submitted At:{' '}
                    {new Date(survey.submittedAt).toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => Linking.openURL(survey.pdfUrl)}
                >
                  <Icon name="file-text" size={18} color="#fff" />
                  <Text style={styles.linkText}>TRAI PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      const res = await getDcraPdf(survey.surveyId);
                      console.log('====================================');
                      console.log('====================================');
                      console.log(res);
                      if (res?.dcraPdfUrl) {
                        Linking.openURL(res.dcraPdfUrl);
                      } else {
                        Alert.alert('Error', 'PDF URL not found.');
                      }
                    } catch (err) {
                      console.error('Error opening DCRA PDF:', err);
                      Alert.alert('Error', 'Failed to open DCRA PDF.');
                    }
                  }}
                  style={styles.linkButton}
                >
                  <Icon name="file-text" size={18} color="#fff" />
                  <Text style={styles.linkText}>DCRA PDF</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noSurveyCard}>
              <Icon name="x-circle" size={18} color="#E74C3C" />
              <Text style={styles.noSurveyText}>No submitted surveys</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    paddingBottom: 30,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 20,
  },
  userSection: {
    marginBottom: 25,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  userEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userEmail: {
    fontSize: 16,
    color: '#475569',
    marginLeft: 8,
  },
  surveyCard: {
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 15,
    color: '#1E293B',
    marginLeft: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 6,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  noSurveyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCEAEA',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 6,
  },
  noSurveyText: {
    fontSize: 15,
    color: '#E74C3C',
    marginLeft: 6,
  },
});
