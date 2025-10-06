import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getAllUsers } from '../functions/getDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        if (!result.success) {
          console.log('Failed to fetch users: ', result);
        } else {
          setUsers(result.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken'); // clear token
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // reset stack to Login
      });
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <Text style={styles.userAvatar}>
            {item.firstName[0]}
            {item.lastName[0]}
          </Text>
          <View>
            <Text style={styles.userName}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>

        <View style={styles.userInfoRow}>
          <Text style={styles.icon}>Phone Number: </Text>
          <Text style={styles.userInfoText}>{item.phonenumber}</Text>
        </View>

        <View style={styles.userInfoRow}>
          <Text style={styles.icon}>Survey Started At: </Text>
          <Text style={styles.userInfoText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const handleTopButton = () => {
    navigation.navigate('InfoScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>

        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.topButton} onPress={handleTopButton}>
            <Text style={styles.buttonText}>New Form</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loader or User List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // dark theme
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  topButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#bbb',
    fontSize: 16,
  },
  userCard: {
    backgroundColor: '#1E1E2E',
    padding: 18,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width: 45,
    height: 45,
    borderRadius: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 2,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
    color: '#4CAF50',
  },
  userInfoText: {
    fontSize: 14,
    color: '#ccc',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutButton: {
    backgroundColor: '#E53935', // red for logout
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
