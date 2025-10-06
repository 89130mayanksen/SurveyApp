import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AdminScreen from './AdminScreen';
import SurveyStack from './SurveyStack';
import InfoScreen from './InfoScreen';

const stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <stack.Navigator initialRouteName="AdminScreen">
      <stack.Screen
        name="AdminScreen"
        component={AdminScreen}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="SurveyStack"
        component={SurveyStack}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="InfoScreen"
        component={InfoScreen}
        options={{ headerShown: false }}
      />
    </stack.Navigator>
  );
};

export default AdminStack;

const styles = StyleSheet.create({});
