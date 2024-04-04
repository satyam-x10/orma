// apiService.ts
import Cookies from 'js-cookie';
import { AuthResponse, ApiResponse } from '../../../types';
import axiosInstance from '../../../api';
const API_URL = import.meta.env.VITE_API_URL;

export const checkAuth = async (): Promise<ApiResponse> => {
  const token = Cookies.get('token');
  if (!token) return { user: null, error: null };
  try {
    const response = await axiosInstance.get<AuthResponse>('/users/verify', {
      headers: { Authorization: `${token}` },
    });

    if (response.status === 200 && response?.data?.user) {
      return { user: response?.data?.user, error: null };
    } else {
      return { user: null, error: 'Invalid Credentionals, please try again' };
    }
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      // only return the message if error is an instance of Error
      return { user: null, error: error.message };
    }
    return { user: null, error: "An error occurred." };
  }
};

export const login = async (phoneNumber: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post(API_URL+'/users/register/start', {
      phone: phoneNumber
    });
    if(response.status === 200){
      return response?.data;
    }
   return { success: false, error: null };
  } catch (error: any) {
    return { success: false, error:  'Error fetching posts', };
  }  
};

export const verifyCode = async (code: string, request_id: string, phone: string | null, name: string | null): Promise<AuthResponse> => {

  let postData;

  if(name !== null){
    postData =  {
      code: code,
      request_id: request_id,
      name: name,
      phone: phone
    }
  }else{
    postData =  {
      code: code,
      request_id: request_id,
      phone: phone
    }
  }

  try {
    const response = await axiosInstance.post(API_URL+'/users/register/verify', {
        ...postData
    });
    if(response.status === 200){
      return response?.data;
    }
   return { success: false, error: null };
  } catch (error: any) {
    return { success: false, error:  'Error fetching posts', };
  }  
};

export const changeUserName = async (newName: String): Promise<AuthResponse> => {
  let token = Cookies.get('token');

  if (!token) {
      return { success: false, error: "Invalid Token"}
  }
   

  try {
   
    const response = await axiosInstance.post(API_URL + '/users/update/user',{newName }, {      
        headers: { Authorization: `${token}` },      
    });
    if (response.status === 200) {
      return response?.data;
    }
    return { success: false, error: null };
  } catch (error: any) {
    return { success: false, error: 'Error fetching posts', };
  }
};
