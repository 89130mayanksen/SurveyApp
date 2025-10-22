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
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import { buildingFormCreation } from '../../api/buildingForm';
import { createSurveyForm, getSurveyById } from '../../api/surveyForm';
import Icon from 'react-native-vector-icons/Ionicons'; // Example import

export default function BuildingFormScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  ///////////////
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [form, setForm] = useState({
    property_manager_name: '',
    type_property: 'Apartments',
    building_condition: 'old',
    building_name: '',
    location_details_lat: '',
    location_details_long: '',
    location_address: '',
    building_floors: '',
    URIN_NUMBER: '',
  });

  const [submitting, setSubmitting] = useState(false);

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
    try {
      const hasPermission = await requestPermission();
      console.log(hasPermission);
      if (!hasPermission) {
        console.log('Location permission denied');
        return;
      } else {
        console.log('Location permission granted');
      }

      setLoadingLocation(true);

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          // setLocation({ latitude, longitude });
          // handleChange('location_details_lat', latitude.toString());
          // handleChange('location_details_long', longitude.toString());
          console.log('Latitude:', latitude, 'Longitude:', longitude);
          setLoadingLocation(false);
        },
        error => {
          console.log('Error getting location:', error.message);
          setLoadingLocation(false);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = async () => {
  //   if (!form.property_manager_name.trim()) {
  //     Alert.alert('Validation Error', 'Property Manager name is Required!');
  //     return;
  //   }
  //   if (!form.type_property.trim()) {
  //     Alert.alert('Validation Error', 'Type of Property is Required!');
  //     return;
  //   }
  //   if (!form.building_name.trim()) {
  //     Alert.alert('Validation Error', 'Building Name is Required!');
  //     return;
  //   }
  //   if (!form.location_details_lat.trim()) {
  //     Alert.alert('Validation Error', 'Location Latitude is Required!');
  //     return;
  //   }
  //   if (!form.location_details_long.trim()) {
  //     Alert.alert('Validation Error', 'Loacation Longitude is Required!');
  //     return;
  //   }
  //   if (!form.location_address.trim()) {
  //     Alert.alert('Validation Error', 'Location Address is Required!');
  //     return;
  //   }
  //   console.log(form);

  //   try {
  //     const result = await buildingFormCreation(form);
  //     console.log('====================================');
  //     console.log(result);
  //     console.log('====================================');
  //     const surveyId = await handleCreateForms(result.data.building._id);
  //     console.log(surveyId);

  //     handleFetchForms(surveyId);
  //   } catch (err) {
  //     console.error('Error:', err);
  //   }
  // };

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

    setSubmitting(true); // ✅ Start loading

    try {
      const result = await buildingFormCreation(form);
      const surveyId = await handleCreateForms(result.data.building._id);
      handleFetchForms(surveyId);
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'Something went wrong while submitting.');
    } finally {
      setSubmitting(false); // ✅ Stop loading
    }
  };

  async function handleCreateForms(buildingId) {
    console.log(buildingId);
    const Survey = await createSurveyForm(buildingId);
    console.log(Survey.surveyId);
    return Survey.surveyId;
  }

  async function handleFetchForms(SurveyId) {
    console.log(SurveyId);

    const result = await getSurveyById(SurveyId);
    if (result) {
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.backBtnWrapper}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            {/* Add the icon here */}
            <Icon name="chevron-back-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.TitleContainer}>
          <Text style={styles.Title}>Basic Building Details</Text>
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
              dropdownIconColor="#007BFF" // Light theme accent color
              selectedValue={form.type_property}
              onValueChange={value => handleChange('type_property', value)}
            >
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
          <Text style={styles.InputText}>Building condition</Text>
          <View style={styles.PickerWrapper}>
            <Picker
              style={styles.Picker}
              dropdownIconColor="#007BFF" // Light theme accent color
              selectedValue={form.building_condition}
              onValueChange={value => handleChange('building_condition', value)}
            >
              <Picker.Item label="new" value="new" />
              <Picker.Item label="old" value="old" />
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

        <View style={{ paddingBottom: 13 }}>
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
              onPress={() => getLocation()}
              // disabled={true}
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.SubmitButton, submitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={submitting} // disable while loading
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.ButtonText}>Submit</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.LogoutButton} onPress={logout}>
            <Text style={styles.ButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Light gray background
    paddingHorizontal: 10,
  },
  backBtnWrapper: {
    position: 'absolute',
    top: 10, // Adjust this for safe area/notch
    left: 0,
    zIndex: 10,
  },
  backBtn: {
    // backgroundColor: 'rgb(0,0,0)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    // Using a light, semi-transparent background for a modern feel
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 26, // Rounded shape
    display: 'inline',
  },
  backBtnTxt: {
    backBtnTxt: {
      fontSize: 16,
      color: '#007AFF', // Standard iOS blue or a primary color
      marginLeft: 5, // Space after a potential arrow icon
      fontWeight: '600',
    },
  },
  TitleContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  Title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007BFF', // A friendly blue color
    textAlign: 'center',
  },
  InputContainer: {
    marginBottom: 15,
  },
  InputText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333', // Dark text for contrast
    paddingHorizontal: 10,
  },
  Input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light gray border
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FFF', // White background for inputs
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  SmallInput: {
    width: 110,
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  PickerWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  Picker: {
    color: '#333', // Dark text for the picker
    height: 50,
  },
  LocateButton: {
    height: 45,
    minWidth: 90,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 70,
  },
  SubmitButton: {
    width: '47%',
    backgroundColor: '#007bff', // A vibrant green
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  LogoutButton: {
    width: '47%',
    backgroundColor: '#DC3545', // A red for caution/logout
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#DC3545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  ButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
