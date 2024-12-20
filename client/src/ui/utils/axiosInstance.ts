// src/utils/axiosInstance.ts
import axios from 'axios';

export const baseURL = 'https://pos-tau-nine.vercel.app/' 

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});


export default axiosInstance;
