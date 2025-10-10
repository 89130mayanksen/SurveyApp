import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { getAllUsers, deleteUser } from '../../api/admin';

export default function AllUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const result = await getAllUsers();
      const data = result?.data || [];
      if (data.length === 0) {
        Alert.alert('No Users', 'There are no users available.');
      }
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(id);
            setUsers(users.filter((u) => u._id !== id));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete user.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!users.length) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>No users available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>All Users</Text> */}

      {users.map((user, index) => (
        <View key={user._id || index} style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userHeader}>
              <Icon name="user" size={22} color="#2563EB" />
              <Text style={styles.name}>{user?.name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(user._id)}>
              <Icon name="trash-2" size={22} color="#DC2626" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Details */}
          <View style={styles.detailRow}>
            <Icon name="mail" size={18} color="#64748B" />
            <Text style={styles.info}>{user?.email}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="phone" size={18} color="#64748B" />
            <Text style={styles.info}>{user?.phone || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="briefcase" size={18} color="#64748B" />
            <Text style={styles.info}>Company: {user?.companyCode || '-'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="shield" size={18} color="#64748B" />
            <Text style={styles.info}>Role: {user?.role}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon
              name={user?.status === 'approved' ? 'check-circle' : 'x-circle'}
              size={18}
              color={user?.status === 'approved' ? '#16A34A' : '#DC2626'}
            />
            <Text
              style={[
                styles.info,
                {
                  color: user?.status === 'approved' ? '#16A34A' : '#DC2626',
                },
              ]}
            >
              Status: {user?.status}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statBox, { backgroundColor: '#E0F2FE' }]}>
              <Icon name="check-square" size={18} color="#2563EB" />
              <Text style={styles.statText}>
                Submitted: {user?.surveyStats?.submitted || 0}
              </Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="clock" size={18} color="#CA8A04" />
              <Text style={styles.statText}>
                Pending: {user?.surveyStats?.pending || 0}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    padding: 16,
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
    color: '#1E3A8A',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  info: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: '#1E3A8A',
  },
});
