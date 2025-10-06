// // utils/api.js
// export  const uploadFile = async (file, partName, fieldId, category) => {
//   // try {
//   //   const formData = new FormData();
//   //   formData.append('file', {
//   //     uri: file.uri,
//   //     name: file.fileName,
//   //     type: file.type,
//   //   });
//   //   formData.append('partName', partName);
//   //   formData.append('fieldId', fieldId);
//   //   formData.append('category', category);

import AsyncStorage from '@react-native-async-storage/async-storage';

//   //   const response = await fetch('http://192.168.1.97:5000/upload-file', {
//   //     method: 'POST',
//   //     headers: {
//   //       'Content-Type': 'multipart/form-data',
//   //     },
//   //     body: formData,
//   //   });

//   //   if (!response.ok) {
//   //     throw new Error(`Upload failed: ${response.status}`);
//   //   }

//   //   const data = await response.json();
//   //   console.log('Upload success:', data);
//   //   return data;
//   // } catch (err) {
//   //   console.error('Upload error:', err);
//   //   throw err;
//   // }
// };

// // utils/api.js

// const API_BASE = 'http://192.168.1.8:5000';
const API_BASE = 'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

export const getForm = async category => {
  try {
    // console.log(category);
    console.log('helooooo', category);
    const token = await AsyncStorage.getItem('jwtToken');

    console.log('====================================');
    console.log(`${API_BASE}/survey/getForm?category=${category}`);
    console.log('====================================');

    const response = await fetch(
      `${API_BASE}/survey/getForm?category=${category}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // optional if you use auth
        },
      },
    );
    // if (!response.ok)
    //   throw new Error(`Failed to fetch form: ${response.status}`);
    const data = await response.json();
    console.log('Form fetched:', JSON.stringify(data));
    return data;
  } catch (err) {
    console.error('Error fetching form:', err.response);
    throw err;
  }
};

export const getParts = async formId => {
  try {
    const response = await fetch(
      `${API_BASE}/survey/getParts?formId=${formId}`,
    );
    if (!response.ok)
      throw new Error(`Failed to fetch parts: ${response.status}`);
    const data = await response.json();
    console.log('Parts fetched:', data);
    return data;
  } catch (err) {
    console.error('Error fetching parts:', err);
    throw err;
  }
};

export const getFieldUploads = async (formId, PartId, fieldId) => {
  try {
    const token = await AsyncStorage.getItem('jwtToken');

    const query = `formId=${formId}&PartId=${PartId}&fieldId=${fieldId}`;

    const response = await fetch(`${API_BASE}/survey/getUploads?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok)
      throw new Error(`Failed to fetch fields: ${response.status}`);

    const data = await response.json();
    console.log('fetched field:', data);
    return data;
  } catch (err) {
    console.error('Error fetching fields:', err);
    throw err;
  }
};

export const submitForm = async (formId, responses, userId, adminId) => {
  try {
    const body = {
      formId,
      responses,
    };

    const response = await fetch(`${API_BASE}/submitForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userId}`, // optional if you use auth
      },
      body: JSON.stringify(body),
    });

    if (!response.ok)
      throw new Error(`Form submission failed: ${response.status}`);

    const data = await response.json();
    console.log('Form submitted:', data);
    return data;
  } catch (err) {
    console.error('Error submitting form:', err);
    throw err;
  }
};

export const uploadSurveyField = async (
  file,
  formId,
  partId,
  fieldId,
  comment,
) => {
  try {
    const formData = new FormData();
    const token = await AsyncStorage.getItem('jwtToken');

    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
    formData.append('formId', formId);
    formData.append('PartId', partId);
    formData.append('fieldId', fieldId);
    formData.append('comment', comment);

    console.log('====================================');
    console.log(formData);
    console.log('====================================');
    const response = await fetch(`${API_BASE}/survey/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    console.log(response);
    // if (!response.ok) throw new Error(`File upload failed: ${response.status}`);

    const data = await response.json();
    console.log('File uploaded:', data);
    return data;
  } catch (err) {
    console.log(err);
    console.error('Error uploading file:', err.response);
    throw err;
  }
};

const UploadRating = async (rate) => {
  const token = await AsyncStorage.getItem('jwtToken');

  try {
    const response = await fetch(`${API_BASE}/survey/rating`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: rate,
    });
    console.log(response);
    if(!response.ok){
      console.log(response);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const handleSurveySubmit = async () => {
  try {
    const form = await getForm('general');
    const formId = form.data[0]._id;

    const parts = await getParts(formId);

    // Assume user fills answers
    const responses = [];

    // Submit form
    const formResponse = await submitForm(formId, responses, userId, adminId);
    const formResponseId = formResponse.data._id;

    // Upload file for a field
    const file = { uri: fileUri, name: 'photo.jpg', type: 'image/jpeg' };
    await uploadSurveyFile(file, formResponseId, parts[0].fields[2]._id);

    console.log('Survey submitted and file uploaded!');
  } catch (err) {
    console.error(err);
  }
};
