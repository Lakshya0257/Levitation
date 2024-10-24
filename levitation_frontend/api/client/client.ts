// import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
// import { API_BASE_URL } from '../../config';

// const client: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
// });

// client.interceptors.request.use((config: { headers: { Authorization: string; }; }) => {
//   const token = localStorage.getItem('token');

//   if(!token){
//     localStorage.removeItem('token');
//     window.location.href = '/auth/login';
//   }

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   console.log('Request config:', config);  // For debugging

//   return config;
// });

// client.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('userId');
//       window.location.href = '/auth/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default client;