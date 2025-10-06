import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FormScreen from '../form/FormScreen';
import { getForm } from '../functions/uploadFile';
import getDetails from '../functions/getDetails';

export default function SurveyStack({ navigation }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buildingDetails, setBuildingDetails] = useState(null);

  const fetchBuildingDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const data = await getDetails(token);

      if (data) {
        const category = data.data.category;
        setBuildingDetails(data.data);
        await AsyncStorage.setItem('selectedCategory', category);
        await initForm(category);
      }
    } catch (err) {
      console.error('Error loading building details:', err);
    }
  };

  const initForm = async category => {
    try {
      const form = await getForm(category);
      setForms(form.data || []);
      console.log('====================================');
      console.log(form.data);
      console.log('====================================');
    } catch (err) {
      console.error('Form init error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildingDetails();
  }, []);
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#121212', // dark background
        }}
      >
        <ActivityIndicator size="large" color="#28A745" />
        <Text style={{ color: '#28A745', marginTop: 10, fontSize: 16 }}>
          Loading...
        </Text>
      </View>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E1E1E', // dark header background
        },
        headerTintColor: '#fff', // back button & title text color
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: '#fff',
        },
        headerShadowVisible: false, // removes iOS shadow line
      }}
    >
      {forms.map((form, index) => (
        <Stack.Screen
          key={form._id || index}
          name={`Form${index + 1}`}
          options={{
            headerTitle: () => (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '600',
                  flexShrink: 1, // allow wrapping
                  textAlign: 'center',
                }}
                numberOfLines={2} // allow 2-line wrap
                ellipsizeMode="tail"
              >
                {form.name}
              </Text>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.removeItem('jwtToken');
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                }}
                style={{ marginRight: 12 }}
              >
                <View
                  style={{
                    backgroundColor: '#cf2645ff', // soft red button
                    borderRadius: 6,
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: 14,
                    }}
                  >
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            ),
          }}
        >
          {props => (
            <FormScreen
              {...props}
              form={form}
              buildingDetails={buildingDetails}
              route={{
                ...props.route,
                params: { index, totalForms: forms.length },
              }}
            />
          )}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
}
