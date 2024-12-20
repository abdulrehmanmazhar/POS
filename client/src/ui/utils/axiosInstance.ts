// src/utils/axiosInstance.ts
import axios from 'axios';

export const baseURL = 'https://pos-11kumiohm-abdulrehmanmazhars-projects.vercel.app' 

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});


export default axiosInstance;
