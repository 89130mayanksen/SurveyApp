import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

import { createUserByAdmin } from '../../api/auth';

export default function AdminDashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext); // Note: This line is commented out, so the logout from context is not being used.
  const [createUser, setCreateUser] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyCode, setCompanyCode] = useState('');

  async function handleCreateUser(name, email, password, companyCode) {
    console.log(name, email, password, companyCode);
    if (!name || !email || !password || !companyCode) {
      Alert.alert('All fields are required');
      return;
    }
    if (name.length < 2) {
      Alert.alert('Validation error', 'Name length is too short');
      return;
    }
    if (email.length < 12) {
      Alert.alert('Validation error', 'Email length is too short');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation error', 'Password length is too short');
      return;
    }
    if (companyCode.length < 2) {
      Alert.alert('Validation error', 'Company code length is too short');
      return;
    }
    const result = await createUserByAdmin(name, email, password, companyCode);
    console.log('====================================');
    console.log(result);
    console.log('====================================');

    Alert.alert('New User Created');
    setCreateUser(false); // Close the modal after creation
    // Reset form fields
    setName('');
    setEmail('');
    setPassword('');
    setCompanyCode('');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Admin Dashboard</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('BuildingForm')}
        style={{ marginTop: 20, padding: 12, backgroundColor: 'lightblue' }}
      >
        <Text>Add New Survey</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={logout}
        style={{ marginTop: 20, padding: 12, backgroundColor: 'tomato' }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setCreateUser(true)}
        >
          <Text style={styles.createButtonText}>Create new user</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={createUser}
          onRequestClose={() => {
            setCreateUser(!createUser);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCreateUser(false)}
              >
                <Text style={{ fontSize: 24, color: '#999' }}>&times;</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Create New User</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter user name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter user email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                // secureTextEntry={true}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Company Code"
                placeholderTextColor="#888"
                value={companyCode}
                onChangeText={setCompanyCode}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() =>
                  handleCreateUser(name, email, password, companyCode)
                }
              >
                <Text style={styles.submitButtonText}>Create user</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  createButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 20,
    marginTop: 20,
  },
  createButtonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: 'rgba(0, 106, 255, 1)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
});
