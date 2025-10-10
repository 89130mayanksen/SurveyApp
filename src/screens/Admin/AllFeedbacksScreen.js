import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getAllFeedbacksSurveys } from '../../api/admin';
import { useNavigation } from '@react-navigation/native';

export default function AllFeedbacksScreen() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    handleFetchAllFeedbacks();
  }, []);

  async function handleFetchAllFeedbacks() {
    try {
      const result = await getAllFeedbacksSurveys();
      const data = result?.data || [];
      setFeedbackData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      Alert.alert('Error', 'Failed to fetch feedbacks.');
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = text => {
    setSearchText(text);
    const filtered = feedbackData.filter(item => {
      const name = item.user?.name?.toLowerCase() || '';
      const email = item.user?.email?.toLowerCase() || '';
      return name.includes(text.toLowerCase()) || email.includes(text.toLowerCase());
    });
    setFilteredData(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ color: '#64748B', marginTop: 10 }}>Loading feedbacks...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.header}>User Feedback Overview</Text> */}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email"
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="inbox" size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Feedback Available</Text>
          <Text style={styles.emptySubtitle}>No users match your search.</Text>
        </View>
      ) : (
        filteredData.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.userHeader}>
              <View style={styles.iconWrapper}>
                <Icon name="user" size={24} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.userName}>{item.user?.name || 'Unknown User'}</Text>
                <Text style={styles.userEmail}>{item.user?.email || '-'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon name="message-square" size={18} color="#475569" />
              <Text style={styles.feedbackCount}>
                {item.feedbacks?.length || 0} Feedback Entries
              </Text>
            </View>

            {item.feedbacks?.length > 0 ? (
              <TouchableOpacity
                style={styles.viewButton}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('FeedbackDetailScreen', {
                    user: item.user,
                    feedbacks: item.feedbacks,
                  })
                }
              >
                <Text style={styles.viewButtonText}>View Details</Text>
                <Icon name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="inbox" size={16} color="#9CA3AF" />
                <Text style={styles.emptyText}>No feedback submitted yet</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 15,
    color: '#111827',
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    shadowColor: '#93C5FD',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconWrapper: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackCount: {
    fontSize: 15,
    color: '#334155',
    marginLeft: 6,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 6,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
});
