import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getAllFeedbacksSurveys } from '../../api/admin';
import Icon from 'react-native-vector-icons/Feather';
import { useContext } from 'react';

export default function AdminDashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [surveyCount, setSurveyCount] = useState(0);
  const [licenseCount, setLicenseCount] = useState(0); // Placeholder

  // ✅ Add logout + reload button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <TouchableOpacity onPress={logout}>
            <Icon name="log-out" size={24} color="#e24a4a" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 👤 All Users */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('AllUsersScreen')}
        >
          <Icon name="users" size={22} color="#fff" />
          <Text style={styles.tabText}>All Users</Text>
        </TouchableOpacity>

        {/* ✅ Submitted Surveys */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('SubmittedSurveysScreen')}
        >
          <Icon name="check-circle" size={22} color="#fff" />
          <Text style={styles.tabText}>Submitted Surveys</Text>
        </TouchableOpacity>

        {/* 🕒 Pending Surveys */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('PendingSurveysScreen')}
        >
          <Icon name="clock" size={22} color="#fff" />
          <Text style={styles.tabText}>Pending Surveys</Text>
        </TouchableOpacity>

        {/* Inside AdminDashboardScreen.js */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('AllFeedbacksScreen')}
        >
          <Icon name="message-square" size={22} color="#fff" />
          <Text style={styles.tabText}>User Feedbacks</Text>
        </TouchableOpacity>

        {/* 📩 Requests Tab */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('RequestsScreen')}
        >
          <Icon name="inbox" size={22} color="#fff" />
          <Text style={styles.tabText}>Requests</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <TouchableOpacity style={styles.infoTabButton}>
            <Icon name="file-text" size={22} color="#fff" />
            <Text style={styles.tabText}>
              Total Surveys: {surveyCount || 0}
            </Text>
          </TouchableOpacity>

          {/* 🔑 Total Licenses Tab */}
          <TouchableOpacity style={styles.infoTabButton}>
            <Icon name="key" size={22} color="#fff" />
            <Text style={styles.tabText}>Total Licenses: {licenseCount}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ➕ Floating Create User Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateUserScreen')}
      >
        <Icon name="user-plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
    alignItems: 'center',
  },
  tabButton: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoTabButton: {
    width: '50%',
    height: 80,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#2b97aaff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#8e4ae2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});
