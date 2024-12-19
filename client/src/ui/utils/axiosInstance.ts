// src/utils/axiosInstance.ts
import axios from 'axios';

export const baseURL = 'http://localhost:8080/api/v1' 

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});


export default axiosInstance;
