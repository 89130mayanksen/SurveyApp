import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InfoScreen from './InfoScreen';
import SurveyStack from './SurveyStack';

const stack = createNativeStackNavigator();

const InfoStack = () => {
  return (
    <stack.Navigator initialRouteName="InfoScreen">
      <stack.Screen
        name="InfoScreen"
        component={InfoScreen}
        options={{ headerShown: false }}
      />
      <stack.Screen
        name="SurveyStack"
        component={SurveyStack}
        options={{ headerShown: false }}
      />
    </stack.Navigator>
  );
};

export default InfoStack;

const styles = StyleSheet.create({});
