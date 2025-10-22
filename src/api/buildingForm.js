import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

export async function buildingFormCreation(body) {

  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);
    const response = await fetch(`${API_BASE_URL}/building/createBuilding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
    }

    return responseData;
  } catch (error) {
    console.log('====================================');
    console.log('Api or Fetch error: ', error);
    console.log('====================================');
  }
}

////////
///////
//////
/////
////
///
//

export async function getBuildingDetails(){
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);
    const response = await fetch(`${API_BASE_URL}/building/getdetails`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    });

    const responseData = await response.json();

    if(!response.ok){
      console.log('====================================');
      console.log('Api Error :', responseData);
      console.log('====================================');
    }

    console.log('Api console: ',responseData);

    return responseData;
  } catch (error) {
    console.log('====================================');
    console.log('Api or Fetch error :', error);
    console.log('===================================='); 
  }
}