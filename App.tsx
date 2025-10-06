// import * as React from 'react';
// import { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { jwtDecode } from 'jwt-decode';
// import { View, ActivityIndicator } from 'react-native';

// import LoginScreen from './src/screens/LoginScreen';
// import InfoStack from './src/screens/InfoStack';
// import SignupScreen from './src/screens/SignupScreen';
// import AdminStack from './src/screens/AdminStack';
// import AdminSignScreen from './src/screens/AdminSignupScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [initialRoute, setInitialRoute] = useState<
//     string | { name: string; params?: any } | null
//   >(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const checkToken = async () => {
//       const token = await AsyncStorage.getItem('jwtToken');
//       setIsLoggedIn(!!token);
//     };
//     checkToken();
//   }, []);

//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
//         const token = await AsyncStorage.getItem('jwtToken');

//         if (!token) {
//           setInitialRoute('Login');
//           return;
//         }

//         const decoded: any = jwtDecode(token);
//         const now = Date.now() / 1000;

//         if (decoded.exp && decoded.exp < now) {
//           // token expired
//           await AsyncStorage.removeItem('jwtToken');
//           setInitialRoute('Login');
//           return;
//         }
//         if (decoded.role === 'admin') {
//           setInitialRoute('AdminStack');
//         } else {
//           setInitialRoute({
//             name: 'InfoStack',
//           } as any); // 👈 nested navigation
//         }
//       } catch (err) {
//         console.log('Auth check failed:', err);
//         setInitialRoute('Login');
//       }
//     };

//     checkLogin();
//   }, []);

//   if (!initialRoute) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0069beff" />
//       </View>
//     );
//   }

//   const initialRouteName =
//     typeof initialRoute === 'string' ? initialRoute : initialRoute.name;

//   const initialParams =
//     typeof initialRoute === 'object' && initialRoute.params
//       ? initialRoute.params
//       : undefined;

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName={
//           typeof initialRoute === 'string' ? initialRoute : initialRoute.name
//         }
//       >
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Signup"
//           component={SignupScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="InfoStack"
//           component={InfoStack}
//           options={{ headerShown: false }}
//           initialParams={
//             initialRouteName === 'InfoStack' ? initialParams : undefined
//           }
//         />
//         <Stack.Screen
//           name="AdminSignup"
//           component={AdminSignScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="AdminStack"
//           component={AdminStack}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

