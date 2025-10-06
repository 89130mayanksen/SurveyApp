import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import TraiLogo from '../TraiLogo.svg';
import VinfoLogo from '../VinfoLogo.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const API_BASE_URL =
    'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

  const loginUser = async (email, password, type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${type}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data);
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const handleUserLogin = async () => {
    try {
      const result = await loginUser(email, password, 'auth');
      console.log(result.message);
      Alert.alert('✅ Login successful');
      await AsyncStorage.setItem('jwtToken', result.data);
      if (result.message === 'Admin Logged in successfully') {
        navigation.replace('AdminStack');
      } else {
        navigation.replace('InfoStack');
      }
    } catch (err) {
      Alert.alert('❌ Login Failed', err.message);
    }
  };

  const handleAdminLogin = async () => {
    try {
      const result = await loginUser(email, password, 'admin');
      console.log(result.message);
      Alert.alert('✅ Login successful');
      await AsyncStorage.setItem('jwtToken', result.data);
      if (result.message === 'Admin Logged in successfully') {
        navigation.replace('AdminStack');
      } else {
        navigation.replace('InfoStack');
      }
    } catch (err) {
      Alert.alert('❌ Login Failed', err.message);
    }
  };

  const showSignupAlert = () => {
    Alert.alert('Signup', 'You want to signup as ...?', [
      {
        text: 'User',
        onPress: () => navigation.navigate('Signup'),
      },
      {
        text: 'Admin',
        onPress: () => navigation.navigate('AdminSignup'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TraiLogo style={{ marginVertical: 10 }} width={90} height={90} />

        <View style={styles.loginContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue to your account</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setpassword}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
          />

          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleUserLogin}
            >
              <Text style={styles.loginButtonText}>User Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleAdminLogin}
            >
              <Text style={styles.loginButtonText}>Admin Login</Text>
            </TouchableOpacity>
          </View>

          {/* <Pressable onPress={showSignupAlert}>
            <Text style={styles.signUpText}>
              Don’t have an account?{' '}
              <Text style={styles.signUpHighlight}>Sign up</Text>
            </Text>
          </Pressable> */}
          <View>
            {/* Trigger Button */}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 5,
              }}
            >
              <Text style={{ color: 'white' }}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => setVisible(true)}
                style={styles.signupBtn}
              >
                <Text style={styles.signupText}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Custom Alert */}
            <Modal
              visible={visible}
              transparent
              animationType="fade"
              onRequestClose={() => setVisible(false)}
            >
              <View style={styles.overlay}>
                <View style={styles.alertBox}>
                  <Text style={styles.title}>Signup</Text>
                  <Text style={styles.message}>You want to signup as...?</Text>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.optionBtn, { backgroundColor: '#4CAF50' }]}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate('Signup');
                      }}
                    >
                      <Text style={styles.optionText}>User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.optionBtn, { backgroundColor: '#2196F3' }]}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate('AdminSignup');
                      }}
                    >
                      <Text style={styles.optionText}>Admin</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.cancelBtn]}
                    onPress={() => setVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // dark background
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '100%',
    marginTop: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
    color: '#e6e6e6ff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    fontSize: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2C2C2C',
  },
  loginButton: {
    width: '40%',
    height: 50,
    backgroundColor: '#4CAF50', // green accent
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  signUpText: {
    color: '#4CAF50',
    marginTop: 18,
    textAlign: 'center',
  },
  signUpHighlight: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  signupBtn: {
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: 'center',
  },
  signupText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: 'rgba(25, 25, 25, 1)',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'rgba(255, 255, 255, 1)'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: 'rgba(183, 0, 0, 1)',
    fontSize: 16,
    fontWeight: '600',
  },
});
