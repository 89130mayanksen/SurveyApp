import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

export async function getCompanySurveys() {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);

    const response = await fetch(`${API_BASE_URL}/survey/getCompanySurveys`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console', responseData);
    console.log('====================================');

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

export async function getAllFeedbacksSurveys() {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);
    const response = await fetch(`${API_BASE_URL}/survey/getFeedebacksAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api Error :', responseData);
      console.log('====================================');
    }
    
    console.log('====================================');
    console.log('Api console: ', responseData);
    console.log('====================================');

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

export async function getAllUsers(){
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    const response = await fetch(`${API_BASE_URL}/survey/allUsers`,{
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

    console.log('====================================');
    console.log('Api console: ',responseData);
    console.log('====================================');

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

export async function getAllPendingSurveys(){
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    const response = await fetch(`${API_BASE_URL}/survey/pendingSurveys`,{
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
    console.log('====================================');
    console.log('Api console: ',responseData);
    console.log('====================================');

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

export async function getAllFeedbacks(surveyId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = fetch(
      `${API_BASE_URL}/survey/getSurveyParticipants/${surveyId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console', responseData);
    console.log('====================================');

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

export async function getSurveyParticipants(surveyId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(
      `${API_BASE_URL}/survey/getSurveyParticipants/${surveyId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console', responseData);
    console.log('====================================');

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

export async function getAllUploads(surveyId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(
      `${API_BASE_URL}/survey/getAlluploads/${surveyId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console', responseData);
    console.log('====================================');

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

export async function createUserByAdmin(
  name,
  email,
  password,
  companyCode,
  phone,
) {
  const body = { name, email, password, companyCode, phone };
  console.log(body);
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);
    const response = await fetch(`${API_BASE_URL}/admin/createUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Api error: ', errorData);
    }

    const responseData = await response.json();
    console.log(responseData);

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

export async function deleteUser(userId) {
  try {
    console.log(userId);
    const token = await AsyncStorage.getItem('jwtToken');
    const response = await fetch(`${API_BASE_URL}/admin/deleteUser/${userId}`, {
      method: 'DELETE',
      headers: {
        'Cotent-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console', responseData);
    console.log('====================================');

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

export async function getAllNotification() {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);

    const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console', responseData);
    console.log('====================================');

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

export async function acceptNotification(userId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);

    const response = await fetch(
      `${API_BASE_URL}/admin/approveUser/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseData = await response.json();
    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console', responseData);
    console.log('====================================');

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

export async function rejectNotification(userId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);

    const response = await fetch(`${API_BASE_URL}/admin/rejectUser/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console', responseData);
    console.log('====================================');

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