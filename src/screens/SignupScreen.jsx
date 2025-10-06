import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_BASE_URL =
    'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

  let basicDetails = { firstName, lastName, email, password, phonenumber };

  const postBasicDetails = async () => {
    try {
      // Validation
      if (!firstName.trim())
        return Alert.alert('Validation Error', 'First name is Required!');
      if (firstName.length < 6)
        return Alert.alert('Vlidation Error', 'First name too small');
      if (!lastName.trim())
        return Alert.alert('Validation Error', 'Last name is Required!');
      if (lastName.length < 6)
        return Alert.alert('Vlidation Error', 'Last name too small');
      if (!email.trim())
        return Alert.alert('Validation Error', 'Email is Required!');
      if (email.length < 6)
        return Alert.alert('Vlidation Error', 'Email too small');
      if (!phonenumber.trim())
        return Alert.alert('Validation Error', 'Phone number is Required!');
      if (!password.trim())
        return Alert.alert('Validation Error', 'Password is Required!');
      if (password.length < 6)
        return Alert.alert('Vlidation Error', 'Password too weak');

      const token = await AsyncStorage.getItem('jwtToken');
      console.log(basicDetails);
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(basicDetails),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ User registered successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to register user:', error);
      throw error;
    }
  };

  const handleSignup = async () => {
    const data = await postBasicDetails();
    if (data) {
      Alert.alert('🎉 Account created successfully!');
      navigation.replace('Login');
    }
  };

  const toLowerCaseString = str => {
    if (typeof str !== 'string') return '';
    const lower = str.toLowerCase();
    setEmail(lower);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Fill in your details to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={firstName}
        onChangeText={value => setFirstName(value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={lastName}
        onChangeText={value => setLastName(value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={value => setEmail(value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        value={phonenumber}
        onChangeText={value => setPhonenumber(value)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={value => setPassword(value)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>
          Already have an account?{' '}
          <Text style={styles.linkHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // dark theme background
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#2C2C2C',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#1E1E1E',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#4CAF50', // green accent
    padding: 15,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: '#bbb',
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
