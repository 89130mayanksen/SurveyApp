import AsyncStorage from '@react-native-async-storage/async-storage';
import { memo } from 'react';

const API_BASE_URL = 'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

export async function createSurveyForm(buildingId) {
  const body = { building: buildingId };
  console.log(body);
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(`${API_BASE_URL}/survey/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log('Api error: ', responseData);
    }

    console.log('====================================');
    console.log('Api survey form console: ', responseData);
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

export async function getAllSurveyForm() {
  const token = await AsyncStorage.getItem('jwtToken');

  try {
    const response = await fetch(`${API_BASE_URL}/getsurveys`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log(responseData);
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

export async function getSurveyById(SurveyId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    const response = await fetch(`${API_BASE_URL}/survey/${SurveyId}`, {
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
    console.log(responseData);
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

export async function getFeedbackForm(surveyId, buildingId) {
  try {
    console.log(surveyId, buildingId);
    const token = await AsyncStorage.getItem('jwtToken');
    const response = await fetch(
      `${API_BASE_URL}/userFeedback/${surveyId}/${buildingId}`,
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
    console.log('Api Console', responseData);
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

export async function postFeedbackForm(surveyId, buildingId, body) {
  console.log('================================****');
  console.log(body);
  console.log('====================================');
  // const body = {
  //   mobileServicePerformance: {
  //     voiceCall: 4,
  //     internetPerformance: 5,
  //   },
  //   broadbandServicePerformance: {
  //     provisioning: 3,
  //     speed: 4,
  //     resolution: 5,
  //   },
  //   mobileNetworkCoverage: {
  //     indoor: 4,
  //     outdoor: 5,
  //   },
  //   overallExperience: 5,
  //   suggestions: 'Keep up the good work!',
  // };

  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(
      `${API_BASE_URL}/userFeedback/submit/${surveyId}/${buildingId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
      console.log('====================================');
    }

    console.log('====================================');
    console.log('Api console: ', responseData);
    console.log('====================================');

    return responseData;
  } catch (error) {
    console.log('====================================');
    console.log('Api or Fetch error', error);
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

export async function postUploadDocument(
  file,
  surveyId,
  buildingId,
  formId,
  partId,
  fieldId,
) {
  console.log(file, surveyId, buildingId, formId, partId, fieldId);
  const formData = new FormData();

  if (file.name) {
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });
  } else {
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.fileName,
    });
  }

  formData.append('surveyId', surveyId);
  formData.append('buildingId', buildingId);
  formData.append('formId', formId);
  formData.append('partId', partId);
  formData.append('fieldId', fieldId);
  console.log(formData);

  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(`${API_BASE_URL}/survey/upload`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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

export async function getUploadedDocument(surveyId, formId, partId, fieldId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(
      `${API_BASE_URL}/survey/getfield/${surveyId}/${formId}/${partId}/${fieldId}`,
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

export async function postComment(
  surveyId,
  buildingId,
  formId,
  partId,
  fieldId,
  comment,
) {
  const body = {
    surveyId,
    buildingId,
    formId,
    partId,
    fieldId,
    comment,
  };

  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(`${API_BASE_URL}/survey/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
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

export async function postRating(surveyId, buildingId, formId, partId, rating) {
  const body = { surveyId, buildingId, formId, partId, rating };
  console.log(body);

  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(`${API_BASE_URL}/survey/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
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

export async function getComment(
  surveyId,
  buildingId,
  formId,
  partId,
  fieldId,
) {
  const query = new URLSearchParams({
    surveyId,
    buildingId,
    formId,
    partId,
    fieldId,
  });
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    const response = await fetch(
      `${API_BASE_URL}/survey/getField?${query.toString()}`,
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

export async function getRating(surveyId, buildingId, formId, partId) {
  const query = new URLSearchParams({
    surveyId,
    buildingId,
    formId,
    partId,
  });

  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(
      `${API_BASE_URL}/survey/getratings?${query.toString()}`,
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

export async function submitSurvey(surveyId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(`${API_BASE_URL}/submitform/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ surveyId }),
    });

    const responseData = await response.json(response);

    if (!response.ok) {
      console.log('====================================');
      console.log('Api or Fetch error: ', responseData);
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

export async function getUserUploads(surveyId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    const response = await fetch(
      `${API_BASE_URL}/survey/getUploads/${surveyId}`,
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

    console.log('=================================***');
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

export async function submitFeedback(userId, surveyId, buildingId) {
  try {
    console.log(surveyId, buildingId, userId);
    const token = await AsyncStorage.getItem('jwtToken');
    console.log(token);

    const response = await fetch(
      `${API_BASE_URL}/userFeedback/allpdf/${surveyId}/${buildingId}/${userId}`,
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

export async function getSize(surveyId) {
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const response = await fetch(`${API_BASE_URL}/survey/getSize/${surveyId}`, {
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

    console.log('=========================&&&&&&&****');
    console.log('Api console: ', responseData);
    console.log('====================================');

    return responseData;
  } catch (error) {
    console.log('====================================');
    console.log('Api or Fetch error: ', error);
    console.log('====================================');
  }
}
