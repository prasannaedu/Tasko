// import { configure } from "@testing-library/dom";
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization':`Bearer ${localStorage.getItem('token')}`,
    // },
    timeout: 10000,
});

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token');
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

export default api;