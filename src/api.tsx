// axiosInstance.ts
import axios, { AxiosResponse, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // You can handle any errors here that occur during the request
    return Promise.reject(error);
  }
);

export default axiosInstance;
