import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { adminSignup, userSignup } from '../../api/auth';

export default function SignupScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyCode, setCompanyCode] = useState('');
  const [role, setRole] = useState('user');

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !companyCode) {
      Alert.alert('All fields are required');
      return;
    }
    if (name.length < 2) {
      Alert.alert('Validation error', 'Name length is too short');
      return;
    }
    if (email.length < 12) {
      Alert.alert('Validation error', 'Email length is too short');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation error', 'Password length is too short');
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must contain:\n• At least one uppercase letter\n• At least one lowercase letter\n• At least one number\n• At least one special character (@$!%*?&)',
      );
      return;
    }
    if (companyCode.length < 2) {
      Alert.alert('Validation error', 'Company code length is too short');
      return;
    }
    ////////////////////////////////////////////
    if (role === 'admin') {
      const result = await adminSignup(name, email, password, companyCode);
      console.log(result);
      if (result.success) {
        Alert.alert(result.message, 'Please login with your new account');
        await AsyncStorage.setItem('role', result.data.role);
        navigation.navigate('Login');
      }
    }
    ////////////////////////////////////////////

    ////////////////////////////////////////////
    if (role === 'user') {
      const result = await userSignup(name, email, password, companyCode);
      console.log(result);
      if (result.success) {
        Alert.alert(result.message, 'Please login with your new account');
        await AsyncStorage.setItem('role', result.data.role);
        navigation.navigate('Login');
      }
    }
    ////////////////////////////////////////////

    // Here you would call your backend API:
    // const response = await api.post("/signup", { name, email, password, role });

    // Simulate signup success
    // Alert.alert("Signup Successful", "Please login with your new account");

    // Navigate back to Login page
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={value => setEmail(value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword} // Toggle based on state
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Text style={styles.eyeIconText}>
              {showPassword ? (
                <Icon name="eye" size={20} style={styles.icon} />
              ) : (
                <Icon name="eye-off" size={20} style={styles.icon} />
              )}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Company Code"
          placeholderTextColor="#999"
          value={companyCode}
          onChangeText={setCompanyCode}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Select Role</Text>
          <Picker
            selectedValue={role}
            onValueChange={value => setRole(value)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>

        <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>
            Already have an account?
            <Text style={styles.loginTextBold}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light background
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    color: '#333', // Dark text for contrast
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666', // Slightly lighter dark text
    marginBottom: 30,
    textAlign: 'center',
  },
  icon: {
    marginRight: 6,
    color: 'black',
  },
  input: {
    backgroundColor: '#FFF', // White background for inputs
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1, // Add a border
    borderColor: '#E0E0E0', // Light gray border
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordInput: {
    flex: 1,
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  eyeIconText: {
    fontSize: 20,
    color: '#666',
  },
  pickerContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerLabel: {
    color: '#666',
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(227, 227, 227, 1)',
    marginHorizontal: 10,
  },
  picker: {
    color: '#a2a2a2ff',
    marginHorizontal: 10,
  },
  pickerItem: {
    color: '#dfdfdfff',
    backgroundColor: 'black',
  },
  signupButton: {
    backgroundColor: '#007BFF', // A friendly blue color
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 5,
  },
  loginLinkText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  loginTextBold: {
    color: '#007BFF', // Consistent blue for clickable text
    fontWeight: 'bold',
  },
});
