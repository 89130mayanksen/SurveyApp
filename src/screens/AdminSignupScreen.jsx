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

export default function AdminSignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretkey, setSecretkey] = useState('');

  const API_BASE_URL =
    'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

  let basicDetails = {
    name,
    email,
    password,
    secretkey,
  };

  const postBasicDetails = async () => {
    try {
      // Validation
      if (!name.trim())
        return Alert.alert('Validation Error', 'Name is Required!');
      if (!email.trim())
        return Alert.alert('Validation Error', 'Email is Required!');
      if (!password.trim())
        return Alert.alert('Validation Error', 'Password is Required!');
      if (!secretkey.trim())
        return Alert.alert('Validation Error', 'Secret key is Required!');

      const token = await AsyncStorage.getItem('jwtToken');
      console.log(basicDetails);
      const response = await fetch(`${API_BASE_URL}/admin/createadmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(basicDetails),
      });

      if (!response.ok) {
        console.log(response)
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
        value={name}
        onChangeText={value => setName(value)}
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
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={value => setPassword(value)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Secret Key"
        placeholderTextColor="#aaa"
        value={secretkey}
        onChangeText={value => setSecretkey(value)}
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
