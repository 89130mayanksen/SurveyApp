import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pick, isCancel } from '@react-native-documents/picker';
import { ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'react-native-image-picker';
import { useContext } from 'react';
import { FormDataContext } from './SurveyStack';
import uploadFile from '../functions/uploadFile';
import {
  getForm,
  getParts,
  getFields,
  submitForm,
  uploadSurveyFile,
} from '../functions/uploadFile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDetails from '../functions/getDetails';

const Form1 = () => {
  // const [files, setFiles] = useState([]);
  const [progres, setProgress] = useState(0);
  const navigation = useNavigation();
  const { updateFieldFile } = useContext(FormDataContext);

  //
  //
  const [formStructure, setFormStructure] = useState([]);
  const [formId, setFormId] = useState(null);
  const [formResponseId, setFormResponseId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [files, setFiles] = useState({}); // store file previews by fieldId
  const [category, setCategory] = useState('');

  //
  //

  //

  const fetchBuildingDetails = async () => {
    try {
      console.log('get detaisl started');
      const buildId = await AsyncStorage.getItem('build');
      const token = await AsyncStorage.getItem('jwtToken');
      const data = await getDetails(token);
      console.log('consoling data');
      console.log(data);

      if (data) {
        console.log(data.data);
        setCategory(data.data.category);
        console.log('consoling category');
        console.log(category, data.data);
      }
      console.log('🏢 Building details:', data);
    } catch (err) {
      console.error('Error loading building details:', err);
    }
  };

  const initForm = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) return;

      const storedUserId = await AsyncStorage.getItem('userId');
      const storedAdminId = await AsyncStorage.getItem('adminId');
      const category = await AsyncStorage.getItem('selectedCategory');
      setUserId(storedUserId);
      setAdminId(storedAdminId);
      console.log('====================================');
      console.log(category, 'beore gping to grtform ');
      console.log('====================================');
      const form = await getForm(category);
      console.log(form);
      const fetchedFormId = form?.data?.[0]?._id;
      setFormId(fetchedFormId);
    } catch (err) {
      console.error('Form init error:', err);
    }
  };
  useEffect(async () => {
    await initForm();
    await fetchBuildingDetails();
  }, []);
  //
  //
  // ✅ Open Camera and upload
  const openCamera = async fieldId => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to take photos.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Camera access is required');
        return;
      }

      ImagePicker.launchCamera({ mediaType: 'photo' }, async response => {
        if (response.didCancel || response.errorCode) return;

        if (response.assets?.length > 0) {
          const photo = response.assets[0];
          const file = {
            uri: photo.uri,
            name: photo.fileName || `photo_${Date.now()}.jpg`,
            type: photo.type || 'image/jpeg',
          };

          if (!formResponseId) {
            Alert.alert('Error', 'Form response not initialized yet.');
            return;
          }

          await uploadSurveyFile(file, formResponseId, fieldId);
          setFiles(prev => ({ ...prev, [fieldId]: file.uri }));
        }
      });
    } catch (err) {
      console.error('openCamera error:', err);
    }
  };
  //
  //
  // ✅ Pick Document and upload
  const pickDocument = async fieldId => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const file = {
        uri: res.uri,
        name: res.name,
        type: res.type || 'application/octet-stream',
      };

      if (!formResponseId) {
        Alert.alert('Error', 'Form response not initialized yet.');
        return;
      }

      await uploadSurveyFile(file, formResponseId, fieldId);
      setFiles(prev => ({ ...prev, [fieldId]: file.name }));
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('pickDocument error:', err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollContainer}>
        {formStructure.map(part => (
          <View key={part._id}>
            <Text style={styles.PartTitle}>{part.name}</Text>

            {part.fields.map(field => (
              <View key={field._id} style={styles.InputContainer}>
                <Text style={styles.InputText}>{field.label}</Text>
                <View style={styles.uploadButtons}>
                  <TouchableOpacity
                    style={styles.UploadButton}
                    onPress={() => pickDocument(field._id)}
                  >
                    <Text style={styles.UploadButtonText}>Upload</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.UploadButton}
                    onPress={() => openCamera(field._id)}
                  >
                    <Text style={styles.UploadButtonText}>Capture</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form1;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 1, 72, 1)',
    width: '100%',
    height: '100%',
  },
  ScrollContainer: {
    marginBottom: 10,
    display: 'flex',
  },
  InputContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(112, 176, 255, 1)',
  },
  InputText: {
    color: 'rgba(0, 1, 72, 1)',
    fontSize: 13,
  },
  UploadButton: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  UploadButtonText: {
    padding: 10,
    backgroundColor: 'rgba(0, 2, 111, 1)',
    color: 'white',
    borderRadius: 10,
    fontSize: 13,
  },
  FormTitle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'white',
    fontSize: 13,
  },
  NextContainer: {
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  NextText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 132, 255, 1)',
    color: 'white',
    borderRadius: 20,
  },
  uploadButtons: { flexDirection: 'row' },
  content: { alignItems: 'center' },
  preview: { width: 200, height: 300, marginTop: 20 },
});
