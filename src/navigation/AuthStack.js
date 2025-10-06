import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import OtpScreen from '../screens/Auth/OtpScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
