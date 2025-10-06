import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import FormScreen from './FormScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

export default function FormsNavigatorHub({ route }) {
  const { survey, buildingId } = route.params;
  console.log(buildingId);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIndicatorStyle: styles.tabIndicator,
      }}
    >
      {survey.forms.map((form, index) => (
        <Tab.Screen
          key={form._id}
          name={`F${index + 1}`}
          component={FormScreen}
          initialParams={{ form, surveyId: survey._id, buildingId: buildingId }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0079f2ff',
    elevation: 4,
    paddingTop: 15,
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  tabIndicator: {
    backgroundColor: '#F9FBFF',
    height: 3,
    borderRadius: 2,
  },
});
