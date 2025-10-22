import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import TraiLogo from '../../TraiLogo.svg';
import VinfoLogo from '../../VinfoLogo.svg';
import VinfoLogo2 from '../../VinfoLogo2.svg';
import VinfoLogo3 from '../../VinfoLogo3.svg';
import ToolLogo from '../../toolLogo.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { adminLogin, userLogin } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
// 1. IMPORT ICONS
import Icon from 'react-native-vector-icons/Feather'; // Using Feather, but you can use any set like FontAwesome

export default function LoginScreen({ navigation }) {
  // const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 2. STATE FOR PASSWORD VISIBILITY
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [role, setRole] = useState('user');

  const handleLogin = async () => {
    if (role === 'admin') {
      try {
        const result = await adminLogin(email, password);
        console.log('====================================');
        console.log(result);
        console.log('====================================');
        await AsyncStorage.setItem('id', result.data.adminId);
        navigation.navigate('Otp', { role: 'admin' });
      } catch (result) {
        Alert.alert('Validation error', 'Invalid credentials');
      }
    }
    if (role === 'user') {
      try {
        const result = await userLogin(email, password);
        console.log('====================================');
        console.log(result);
        console.log('====================================');

        await AsyncStorage.setItem('id', result.data.userId);
        navigation.navigate('Otp', { role: 'user' });
      } catch (result) {
        Alert.alert('Validation Error', 'Invalid credentials');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <ToolLogo width={85} height={85} />
        </View>

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>

        {/* EMAIL INPUT */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* PASSWORD INPUT CONTAINER */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          {/* ICON TOGGLE BUTTON */}
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'} // Choose the icon based on state
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

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

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.signupLink}
        >
          <Text style={styles.signupLinkText}>
            Don't have an account?{' '}
            <Text style={styles.signupTextBold}>Sign Up</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: '#333', // Dark text for contrast
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666', // Slightly lighter dark text
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // NEW STYLE: TextInput inside the container (takes up most space)
  passwordInput: {
    flex: 1, // Takes up all available space
    color: '#333',
    paddingHorizontal: 18,
    paddingVertical: 18,
    fontSize: 16,
    // Remove individual border styles as the container handles the border
  },
  // NEW STYLE: Icon toggle button
  visibilityToggle: {
    padding: 10,
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: '#007BFF', // A friendly blue color
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
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
  signupLink: {
    marginTop: 20,
  },
  signupLinkText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  signupTextBold: {
    color: '#007BFF', // Match the button color
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden', // Ensures picker content stays within the border radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerLabel: {
    color: '#666',
    fontSize: 16,
    paddingTop: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(220, 220, 220, 1)',
  },
  picker: {
    color: '#a1a1a1ff',
    marginHorizontal: 10,
  },
  pickerItem: {
    color: '#686868ff',
  },
});
