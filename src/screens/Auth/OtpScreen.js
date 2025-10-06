import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { adminLoginVerify, userLoginVerify } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRoute } from '@react-navigation/native';

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const { login } = useContext(AuthContext);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleResend = () => {
    console.log('Resending OTP...');
  };

  ////////////
  const route = useRoute();
  const { role } = route.params;
  ////////////

  const handleVerify = async () => {
    if (role === 'admin') {
      const enteredOtp = otp.join('');
      const adminId = await AsyncStorage.getItem('id');
      console.log('====================================');
      console.log(adminId, otp);
      console.log('====================================');
      const result = await adminLoginVerify(adminId, String(otp));
      console.log('====================================');
      console.log(result);
      login(role, result.data.token);
      console.log('====================================');
      console.log('Verifying OTP:', enteredOtp);
    } else if (role === 'user') {
      const enteredOtp = otp.join('');
      const userId = await AsyncStorage.getItem('id');
      console.log(userId);
      console.log('====================================');
      console.log(userId, otp);
      console.log('====================================');
      const result = await userLoginVerify(userId, String(otp));
      console.log('====================================');
      console.log(result);
      login(role, result.data.token);
      console.log('====================================');
      console.log('Verifying OTP:', enteredOtp);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Enter the 4-digit code</Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={text => handleChange(text, index)}
            ref={ref => (inputRefs.current[index] = ref)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
                inputRefs.current[index - 1].focus();
              }
            }}
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleVerify} style={styles.verifyButton}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // light background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529', // dark text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#495057', // slightly muted text
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    maxWidth: 300,
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 8,
    backgroundColor: '#ffffff', // white input
    color: '#212529', // dark text
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ced4da', // light border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  verifyButton: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#007bff', // blue button
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    color: '#495057', // muted dark text
    fontSize: 14,
    marginRight: 5,
  },
  resendLink: {
    color: '#007bff', // blue link
    fontSize: 14,
    fontWeight: 'bold',
  },
});
