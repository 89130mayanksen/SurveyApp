import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';
// const API_BASE = 'http://192.168.1.8:5000';

export default async function getDetails() {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log('hello');

    console.log(API_BASE);
    // const response = await axios.get(`${API_BASE}/building/getdetails`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    const response = await fetch(`${API_BASE}/building/getdetails`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Building details:', data);

    console.log('====================================');
    console.log(response);
    console.log('====================================');
    return data;
  } catch (error) {
    console.error('❌ Error fetching building details:', error.response);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log('hello');

    console.log(API_BASE);
    
    const response = await fetch(`${API_BASE}/admin/getallusers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Building details:', data);

    console.log('====================================');
    console.log(response);
    console.log('====================================');
    return data;
  } catch (error) {
    console.error('❌ Error fetching building details:', error.response);
    throw error;
  }
}
