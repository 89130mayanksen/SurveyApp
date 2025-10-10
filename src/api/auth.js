import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://ec2-65-0-181-71.ap-south-1.compute.amazonaws.com';

///////////////
//Admin
///////////////

export async function adminSignup(name, email, password, companyCode, phone) {
  const body = { name, email, password, companyCode, phone };
  // const body = {
  //   name: 'Jomn Doee',
  //   email: 'john1234@example.com',
  //   password: 'strongPass@123',
  //   companyCode: 'COMP123',
  // };
  console.log('Req body', body);

  try {
    const response = await fetch(`${API_BASE_URL}/admin/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Response', response);

    if (!response.ok) {
      const errorData = await response.json(); // Get the error message from the response
      console.error('API Error:', errorData);
    }
    const responseData = await response.json();
    console.log(responseData);

    ////////////////////
    return responseData;
  } catch (error) {
    console.log('====================================');
    console.error('Fetch error:', error);
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

export async function adminLogin(email, password) {
  const body = { email, password };
  console.log('Req body', body);

  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
    }
    const responseData = await response.json();
    console.log(responseData);

    ////////////////////
    return responseData;
  } catch (error) {
    console.log('====================================');
    console.error('Fetch error:', error);
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

export async function adminLoginVerify(adminId, otp) {
  const body = { adminId, otp: '1234' };
  console.log('Req body', body);

  try {
    const response = await fetch(`${API_BASE_URL}/admin/login/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Api error: ', errorData);
    }

    const responseData = await response.json();
    console.log(responseData);

    ////////////////////
    return responseData;
  } catch (error) {
    console.log('====================================');
    console.error('Fetch error: ', error);
    console.log('====================================');
  }
}

///////////////
// User
///////////////

export async function userSignup(name, email, password, companyCode, phone) {
  const body = { name, email, password, companyCode, phone };
  console.log('Req body', body);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Response', response);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Api error: ', errorData);
    }

    const responseData = await response.json();
    console.log(responseData);

    return responseData;
  } catch (error) {
    console.log('====================================');
    console.error('Fetch or API error: ', error);
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

export async function userLogin(email, password) {
  const body = { email, password };
  console.log('req body', body);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Api error: ', errorData);
    }

    const responseData = response.json();
    console.log(responseData);

    return responseData;
  } catch (error) {
    console.log('====================================');
    console.log('Fetch or API error: ', error);
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

export async function userLoginVerify(userId, otp) {
  const body = { userId, otp: '1234' };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    console.log('Fetch or Api error: ', error);
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

export async function AdminUserlogout() {
  const token = await AsyncStorage.getItem('jwtToken');
  try {
    const response = await fetch(`${API_BASE_URL}/admin/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
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
    console.log(error);
    console.log('====================================');
  }
}