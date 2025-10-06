import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/User/DashboardScreen';
import BuildingFormScreen from '../screens/Forms/BuildingFormScreen';
import FormScreen from '../screens/Forms/FormScreen';
import FormsNavigatorHub from '../screens/Forms/FormsNavigatorHub';
import FeedbackFormHub from '../screens/Forms/FeedbackFormHub';
import NewFeedbackScreen from '../screens/Forms/NewFeedbackScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BuildingForm"
        component={BuildingFormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FormsNavigator"
        component={FormsNavigatorHub}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Form"
        component={FormScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackFormHub}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewFeedback"
        component={NewFeedbackScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
