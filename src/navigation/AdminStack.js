import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import BuildingFormScreen from '../screens/Forms/BuildingFormScreen';
import FormScreen from '../screens/Forms/FormScreen';
import PendingSurveysScreen from '../screens/Admin/PendingSurveysScreen';
import SubmittedSurveysScreen from '../screens/Admin/SubmittedSurveyScreen';
import AllUsersScreen from '../screens/Admin/AllUsersScreen';
import CreateUserScreen from '../screens/Admin/CreateUserScreen';
import SurveyDetailScreen from '../screens/Admin/SurveyDetailScreen';
import RequestsScreen from '../screens/Admin/RequestsScreen';
import AllFeedbacksScreen from '../screens/Admin/AllFeedbacksScreen';
import FeedbackDetailScreen from '../screens/Admin/FeedbackDetailScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          headerShown: true,
          title: 'Admin Dashboard',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
      />

      <Stack.Screen
        name="AllUsersScreen"
        component={AllUsersScreen}
        options={{
          headerShown: true,
          title: 'All Users',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="SubmittedSurveysScreen"
        component={SubmittedSurveysScreen}
        options={{
          headerShown: true,
          title: 'Submitted Surveys',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="PendingSurveysScreen"
        component={PendingSurveysScreen}
        options={{
          headerShown: true,
          title: 'Pending Surveys',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="CreateUserScreen"
        component={CreateUserScreen}
        options={{
          headerShown: true,
          title: 'Create New User',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="SurveyDetailScreen"
        component={SurveyDetailScreen}
        options={{
          headerShown: true,
          title: 'Survey Detail Screen',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
      />
      <Stack.Screen
        name="RequestsScreen"
        component={RequestsScreen}
        options={{
          headerShown: true,
          title: 'Signup Requests',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
      />

      <Stack.Screen
        name="AllFeedbacksScreen"
        component={AllFeedbacksScreen}
        options={{
          headerShown: true,
          title: 'User Feedback Overview',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
      />

      <Stack.Screen
        name="FeedbackDetailScreen"
        component={FeedbackDetailScreen}
        options={{
          headerShown: true,
          title: 'Feedback Details',
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerTitleStyle: { color: '#1E293B', fontWeight: '700' },
        }}
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
