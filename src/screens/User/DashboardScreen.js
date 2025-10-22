import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid, // ✅ ADD THIS
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { getBuildingDetails } from '../../api/buildingForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getSurveyById,
  getFeedbackForm,
  getUserUploads,
  submitSurvey,
  getSize,
} from '../../api/surveyForm';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

export default function DashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [loadingSurveyId, setLoadingSurveyId] = useState(null);

  const [loadingFeedbackId, setLoadingFeedbackId] = useState(null); // new state

  // Fetching building details array

  const [submittingSurveyId, setSubmittingSurveyId] = useState(null);
  const [pdfUrls, setPdfUrls] = useState({}); // store pdf url per building item

  const [uploadsData, setUploadsData] = useState({});
  const [surveySizes, setSurveySizes] = useState({});

  const [loggingOut, setLoggingOut] = useState(false);

  // { [surveyId]: { totalFields, completedFields, pendingFields, percentageCompleted } }

  useEffect(() => {
    if (buildings.length > 0) {
      buildings.forEach(async item => {
        if (item.survey?._id) {
          try {
            const data = await getUserUploads(item.survey._id);
            console.log(data.progress);
            setUploadsData(prev => ({
              ...prev,
              [item.survey._id]: data.progress,
            }));
          } catch (error) {
            console.log(
              `Error fetching uploads for survey ${item.survey._id}:`,
              error,
            );
          }
        }
      });
    }
  }, [buildings]);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const result = await getBuildingDetails();
      if (result && result.data && Array.isArray(result.data.buildings)) {
        setBuildings(result.data.buildings);
        setFilteredBuildings(result.data.buildings);
      } else {
        setBuildings([]);
        setFilteredBuildings([]);
      }
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
      Alert.alert('Error', 'Failed to load buildings. Please try again.');
      setBuildings([]);
      setFilteredBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // Search filter by URIN
  useEffect(() => {
    let updated = [...buildings];

    if (searchQuery.trim()) {
      updated = updated.filter(b =>
        b.URIN_NUMBER?.toString().includes(searchQuery.trim()),
      );
    }

    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      updated = updated.filter(b => b.createdAt.startsWith(formatted));
    }

    setFilteredBuildings(updated);
  }, [searchQuery, selectedDate, buildings]);

  async function handleFetchForms(SurveyId) {
    try {
      setLoadingSurveyId(SurveyId); // 👈 start loader

      const result = await getSurveyById(SurveyId);
      if (result) {
        navigation.navigate('FormsNavigator', {
          survey: result.survey,
          buildingId: result.survey.building._id,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch survey');
    } finally {
      setLoadingSurveyId(null); // 👈 stop loader
    }
  }

  async function handleFetchFeedback(item) {
    try {
      setLoadingFeedbackId(item.survey._id);

      const Feedback = await getFeedbackForm(item.survey._id, item._id);
      navigation.navigate('Feedback', {
        userId: item.createdById,
        surveyId: item.survey._id,
        buildingId: item._id,
        Feedback,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch feedback');
    } finally {
      setLoadingFeedbackId(null);
    }
  }

  const handleSubmitSurvey = async item => {
    try {
      setSubmittingSurveyId(item.survey._id);
      const react = await getUserUploads(item.survey._id);
      await handleGetSize(item.survey._id);
      const result = await submitSurvey(item.survey._id);
      const returnedPdf = result?.pdfUrl || result?.data?.pdfUrl;
      if (returnedPdf) {
        setPdfUrls(prev => ({ ...prev, [item._id]: returnedPdf }));
      }
      Alert.alert(
        'Success',
        result?.message || 'Survey submitted successfully',
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit survey.');
    } finally {
      setSubmittingSurveyId(null);
    }
  };

  async function downloadPdfToAppStorage(url, name = 'survey.pdf') {
    try {
      if (!url) {
        Alert.alert('No PDF URL', 'PDF URL is missing.');
        return;
      }

      const safeName = name.replace(/[\\/:*?"<>|]/g, '_');

      // Only pre-Android 10 needs external storage permission
      if (Platform.OS === 'android' && Platform.Version < 29) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Cannot download without storage permission.',
          );
          return;
        }
      }

      const baseDir =
        Platform.OS === 'android'
          ? RNFS.ExternalDirectoryPath // /storage/emulated/0/Android/data/<pkg>/files
          : RNFS.DocumentDirectoryPath;

      const dest = `${baseDir}/${safeName}`;
      await RNFS.mkdir(baseDir);

      const res = await RNFS.downloadFile({
        fromUrl: encodeURI(url),
        toFile: dest,
      }).promise;
      if (res.statusCode >= 200 && res.statusCode < 300) {
        Alert.alert('Downloaded', `Saved to:\n${dest}`);
        try {
          await FileViewer.open(dest, { showOpenWithDialog: true });
        } catch (e) {
          console.log('Open error:', e);
        }
      } else {
        Alert.alert('Download Failed', `Status code: ${res.statusCode}`);
      }
    } catch (e) {
      console.log('Download error:', e);
      Alert.alert('Error', 'Could not download PDF.');
    }
  }

  async function handleGetSize(surveyId) {
    try {
      const size = await getSize(surveyId);
      console.log(size.totalSizeFormatted);

      // ✅ Save size info per survey
      setSurveySizes(prev => ({
        ...prev,
        [surveyId]: size,
      }));
    } catch (error) {
      console.log('Failed to fetch size:', error);
    }
  }

  const renderItem = ({ item }) => {
    const upload = uploadsData[item.survey?._id]; // get upload info
    console.log(item.survey._id);
    console.log(upload);

    const progress = upload ? upload.percentageCompleted / 100 : 0;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.building_name}</Text>
        </View>
        <View style={styles.cardBody}>
          {/* building details */}
          <Text style={styles.detailText}>
            <Text style={styles.label}>URIN:</Text> {item.URIN_NUMBER}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Property Manager:</Text>{' '}
            {item.property_manager_name}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Type:</Text> {item.type_property}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Building Condition:</Text> {item.building_condition}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Location:</Text> {item.location_address}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Floors:</Text> {item.building_floors}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Category:</Text> {item.category}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Created at:</Text>{' '}
            {new Date(item.createdAt).toLocaleString()}
          </Text>

          {/* ✅ Show Survey Size if available */}
          {surveySizes[item.survey._id] && (
            <Text style={styles.label}>
              Total Survey size:{' '}
              {surveySizes[item.survey._id].totalSizeFormatted}
            </Text>
          )}

          {/* show pdf url if exists */}
          {pdfUrls[item._id] && (
            <Text
              style={{ color: '#007bff', marginVertical: 8 }}
              onPress={() => Linking.openURL(pdfUrls[item._id])}
            >
              {pdfUrls[item._id]}
            </Text>
          )}
          {/* ✅ Download PDF Button - only shows if URL exists */}
          {pdfUrls[item._id] && (
            <TouchableOpacity
              style={[
                styles.formBtn,
                {
                  backgroundColor: '#28a745',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                },
              ]}
              onPress={() =>
                downloadPdfToAppStorage(
                  pdfUrls[item._id],
                  `${item.building_name}.pdf`,
                )
              }
            >
              <MaterialIcons
                name="download"
                size={20}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.formBtnTxt}>Download PDF</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress Bar */}
        {upload && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Form Progress</Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {upload.completedFields}/{upload.totalFields} fields completed (
              {upload.percentageCompleted}%)
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          {/* Survey Form */}
          <TouchableOpacity
            style={styles.formBtn}
            onPress={() => handleFetchForms(item.survey._id)}
            disabled={loadingSurveyId === item.survey._id}
          >
            {loadingSurveyId === item.survey._id ? (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ paddingVertical: 5, paddingHorizontal: 18 }}
              />
            ) : (
              <Text style={styles.formBtnTxt}>Survey</Text>
            )}
          </TouchableOpacity>

          {/* Submit Survey */}
          <TouchableOpacity
            style={styles.formBtn}
            onPress={() => handleSubmitSurvey(item)}
            disabled={submittingSurveyId === item.survey._id}
          >
            {submittingSurveyId === item.survey._id ? (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ paddingVertical: 5, paddingHorizontal: 40 }}
              />
            ) : (
              <Text style={styles.formBtnTxt}>Submit Survey</Text>
            )}
          </TouchableOpacity>

          {/* Feedback Form */}
          <TouchableOpacity
            style={styles.formBtn}
            onPress={() => handleFetchFeedback(item)}
            disabled={loadingFeedbackId === item.survey._id  || item.building_condition === 'new'}
          >
            {loadingFeedbackId === item.survey._id ? (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ paddingVertical: 5, paddingHorizontal: 43 }}
              />
            ) : (
              <Text style={styles.formBtnTxt}>Feedback Form</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Dashboard</Text>

        <TouchableOpacity
          style={styles.reloadButton}
          onPress={fetchBuildings}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            <Icon name="refresh" size={24} color="#007bff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by URIN number"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          keyboardType="number-pad"
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate
              ? selectedDate.toISOString().split('T')[0]
              : 'Filter by Date'}
          </Text>
        </TouchableOpacity>
        {selectedDate && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSelectedDate(null)}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* Building List */}
      {filteredBuildings.length > 0 ? (
        <FlatList
          data={filteredBuildings}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No buildings found. Try adjusting your filters.
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('BuildingForm')}
          style={styles.addButton}
        >
          <Text style={styles.buttonText}>Add New Survey</Text>
        </TouchableOpacity>
        <TouchableOpacity
          flex={1}
          marginLeft={8}
          style={styles.logoutButton}
          onPress={async () => {
            setLoggingOut(true);
            try {
              await logout();
            } finally {
              setLoggingOut(false);
            }
          }}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reloadButton: {
    position: 'absolute',
    right: 16,
    top: 25,
    transform: [{ translateY: -12 }],
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#007bff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#343a40' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#f1f3f5',
    marginRight: 8,
    color: '#000',
  },
  dateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateButtonText: { color: '#fff', fontWeight: '600' },
  clearButton: {
    marginLeft: 8,
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearButtonText: { color: '#fff', fontWeight: '600' },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#007bff' },
  formBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  formBtnTxt: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 7,
    shadowColor: '#000',
  },
  cardBody: { padding: 16 },
  detailText: { fontSize: 14, color: '#495057', marginBottom: 4 },
  label: { fontWeight: 'bold', color: '#212529' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  addButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fffffff4',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 10,
  },
  noDataContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noDataText: { fontSize: 16, color: '#6c757d', textAlign: 'center' },
  formBtnLoading: {
    justifyContent: 'center', // center horizontally
    alignItems: 'center', // center vertically
    paddingHorizontal: 18,
    paddingVertical: 5,
  },

  activityIndicator: {
    width: '100%', // take full width of button
    textAlign: 'center',
  },

  progressContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f1f3f5', // subtle card highlight
    borderRadius: 12,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginVertical: 6,
  },
  progressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#dee2e6',
    borderRadius: 7,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 7,
  },
  progressText: {
    fontSize: 12,
    color: '#495057',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'right',
  },
});
