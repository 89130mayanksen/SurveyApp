import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import BuildingFormScreen from '../screens/Forms/BuildingFormScreen';
import FormScreen from '../screens/Forms/FormScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BuildingForm"
        component={BuildingFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Form"
        component={FormScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
