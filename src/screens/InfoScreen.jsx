import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useLogout from '../functions/useLogout';
import getDetails from '../functions/getDetails';

export default function InfoScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [form, setForm] = useState({
    property_manager_name: '',
    type_property: 'Apartments',
    building_name: '',
    location_details_lat: '',
    location_details_long: '',
    location_address: '',
    building_floors: 0,
    URIN_NUMBER: 0,
  });

  useEffect(() => {
    const fetchBuildingDetails = async () => {
      try {
        const buildId = await AsyncStorage.getItem('build');
        const token = await AsyncStorage.getItem('jwtToken');
        const data = await getDetails(buildId, token);

        if (data) {
          navigation.replace('SurveyStack');
        }
        console.log('🏢 Building details:', data);
      } catch (err) {
        console.error('Error loading building details:', err);
      }
    };

    fetchBuildingDetails();
  }, []);

  const API_BASE_URL =
    'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handled by plist
  };

  const getLocation = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      console.log('Location permission denied');
      return;
    }

    setLoadingLocation(true);

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        handleChange('location_details_lat', latitude.toString());
        handleChange('location_details_long', longitude.toString());
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        setLoadingLocation(false);
      },
      error => {
        console.log('Error getting location:', error.message);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const postBuildingDetails = async form => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) throw new Error('No token found in storage');

      const response = await fetch(`${API_BASE_URL}/building/createBuilding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Building created successfully:', data);
      return data;
    } catch (err) {
      console.error('❌ Failed to create building:', err.message);
    }
  };

  const handleSubmit = async () => {
    if (!form.property_manager_name.trim()) {
      Alert.alert('Validation Error', 'Property Manager name is Required!');
      return;
    }
    if (!form.type_property.trim()) {
      Alert.alert('Validation Error', 'Type of Property is Required!');
      return;
    }
    if (!form.building_name.trim()) {
      Alert.alert('Validation Error', 'Building Name is Required!');
      return;
    }
    if (!form.location_details_lat.trim()) {
      Alert.alert('Validation Error', 'Location Latitude is Required!');
      return;
    }
    if (!form.location_details_long.trim()) {
      Alert.alert('Validation Error', 'Loacation Longitude is Required!');
      return;
    }
    if (!form.location_address.trim()) {
      Alert.alert('Validation Error', 'Location Address is Required!');
      return;
    }

    try {
      const result = await postBuildingDetails(form);
      if (result) {
        navigation.replace('SurveyStack');
        await AsyncStorage.setItem('build', result.building._id);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = useLogout();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.TitleContainer}>
          <Text style={styles.Title}>Basic Building Details</Text>
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.InputText}>Property Manager</Text>
          <TextInput
            style={styles.Input}
            placeholder="Enter the Owner's name"
            placeholderTextColor="#888"
            value={form.property_manager_name}
            onChangeText={text => handleChange('property_manager_name', text)}
          />
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.InputText}>Type Of Property</Text>
          <View style={styles.PickerWrapper}>
            <Picker
              style={styles.Picker}
              dropdownIconColor="#4CAF50"
              selectedValue={form.type_property}
              onValueChange={value => handleChange('type_property', value)}
            >
              {/* keeping all your picker items intact */}
              <Picker.Item label="Apartments" value="Apartments" />
              <Picker.Item
                label="Independent Houses"
                value="Independent Houses"
              />
              <Picker.Item label="Gated Societies" value="Gated Societies" />
              <Picker.Item
                label="Central Courts/ State Courts"
                value="Central Courts/ State Courts"
              />
              <Picker.Item
                label="Public Sector Undertakings"
                value="Public Sector Undertakings"
              />
              <Picker.Item
                label="Local Bodies and heritage sites"
                value="Local Bodies and heritage sites"
              />
              <Picker.Item
                label="Commercial Office Complex"
                value="Commercial Office Complex"
              />
              <Picker.Item label="Shopping Malls" value="Shopping Malls" />
              <Picker.Item
                label="Industrial Estates"
                value="Industrial Estates"
              />
              <Picker.Item label="Airports" value="Airports" />
              <Picker.Item label="Bus Station" value="Bus Station" />
              <Picker.Item label="Railway Station" value="Railway Station" />
              <Picker.Item label="Hospitals" value="Hospitals" />
              <Picker.Item label="Hotels" value="Hotels" />
              <Picker.Item label="Institutes" value="Institutes" />
              <Picker.Item label="Stadiums" value="Stadiums" />
              <Picker.Item
                label="Spaces of Gathering (Capacity > 5000)"
                value="Spaces of Gathering (Capacity > 5000)"
              />
              <Picker.Item label="Expressways" value="Expressways" />
              <Picker.Item label="Highways" value="Highways" />
              <Picker.Item label="Railways Routes" value="Railways Routes" />
            </Picker>
          </View>
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.InputText}>Building Name</Text>
          <TextInput
            style={styles.Input}
            placeholder="Enter the Building name"
            placeholderTextColor="#888"
            value={form.building_name}
            onChangeText={text => handleChange('building_name', text)}
          />
        </View>

        <View style={{ padding: 10 }}>
          <Text style={styles.InputText}>Location Details</Text>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TextInput
              style={styles.SmallInput}
              keyboardType="number-pad"
              placeholder="Latitude"
              placeholderTextColor="#888"
              value={form.location_details_lat}
              onChangeText={text => handleChange('location_details_lat', text)}
            />
            <TextInput
              style={styles.SmallInput}
              keyboardType="number-pad"
              placeholder="Longitude"
              placeholderTextColor="#888"
              value={form.location_details_long}
              onChangeText={text => handleChange('location_details_long', text)}
            />
            <TouchableOpacity
              style={styles.LocateButton}
              onPress={getLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.ButtonText}>Locate</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.InputText}>Location Address</Text>
          <TextInput
            style={styles.Input}
            placeholder="Enter the location address of the building"
            placeholderTextColor="#888"
            value={form.location_address}
            onChangeText={text => handleChange('location_address', text)}
          />
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.InputText}>Building Floor</Text>
          <TextInput
            style={styles.Input}
            placeholder="Enter the floor number of the building"
            placeholderTextColor="#888"
            value={form.building_floors.toString()}
            onChangeText={text => handleChange('building_floors', Number(text))}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.InputContainer}>
          <Text style={styles.InputText}>URIN number</Text>
          <TextInput
            style={styles.Input}
            placeholder="Enter the alotted URIN number"
            placeholderTextColor="#888"
            value={form.URIN_NUMBER.toString()}
            onChangeText={text => handleChange('URIN_NUMBER', Number(text))}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity style={styles.SubmitButton} onPress={handleSubmit}>
          <Text style={styles.ButtonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.LogoutButton} onPress={handleLogout}>
          <Text style={styles.ButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // dark theme
    paddingHorizontal: 20,
  },
  TitleContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  Title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  InputContainer: {
    marginBottom: 15,
  },
  InputText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#E0E0E0',
  },
  Input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#1E1E1E',
  },
  SmallInput: {
    width: 110,
    height: 45,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#fff',
    backgroundColor: '#1E1E1E',
  },
  PickerWrapper: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
  },
  Picker: {
    color: '#fff',
    height: 50,
  },
  LocateButton: {
    height: 45,
    minWidth: 90,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  SubmitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  LogoutButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  ButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
