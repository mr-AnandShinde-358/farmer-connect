import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import Constants from "expo-constants";
import { tokenStorage } from '../storage/mmkvStorage';
// Base URL- environment variable se le
const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
console.log("id addrss",debuggerHost)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://10.246.148.154:8000/api/v1`;


// Create Axios Instance
 
export const apiClient:AxiosInstance = axios.create(
    {
        baseURL:BASE_URL,
        timeout:10000,
        headers:{
             "Content-Type": "application/json",
             Accept:'application/json',
        },
       
    }
)


// Track karo ke refresh in progress hai ya nahi

let isRefreshing = false;
let failedQueue:Array<{
    resolve:(token:string)=>void;
    reject:(err:unknown)=> void;
}>[]=[];

// Queue main add karo requesst ko 

const processQueue = (error:unknown,token:string|null=null)=>{
    failedQueue.forEach(({resolve,reject})=>{
        if(error) reject(error);
        else resolve(token!)
    });
    failedQueue=[];
}



// Request Interceptor-Attach Bearer Token

apiClient.interceptors.request.use(
    (config:InternalAxiosRequestConfig)=>{
        // Har request main access Token add karo
        const accessToken = tokenStorage.getAccessToken()

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
);


// Response Interceptor - handle 401 & refresh Token

apiClient.interceptors.response.use(
    (response)=>{
        //suceess response
        return response;
    },

    async (error:AxiosError)=>{
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?:boolean;
      };

      // Only handle 401 Unauthorized, skip if already retried

      if(error.response?.status !== 401 || originalRequest._retry){
        return Promise.reject(error);
      }
      
      // get Refresh Token
      const refreshToken = tokenStorage.getRefreshToken();

      if(!refreshToken){
        // No refresh token - force logout via event

        signalAuthFailure();
        return  Promise.reject(error)
      }

      if(isRefreshing){
        // Queue thisrequest util refresh completes

        return new Promise((resolve,reject)=>{
            failedQueue.push({resolve,reject});
        }).then((token)=>{
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
        });
      }

      originalRequest._retry = true;
      isRefreshing=true;

      try {
        const {data} = await axios.post(`${BASE_URL}auth/refresh`,{
            refreshToken
        })

        const {accessToken} = data; // expiresIn
        tokenStorage.updateAccessToken(accessToken); // expiresIn

        processQueue(null,accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest)

      } catch (error) {
        processQueue(error,null)
        tokenStorage.clearTokens();
        signalAuthFailure();

        return Promise.reject(error);
      } finally{
        isRefreshing = false
      }


    }
  

)

// Auth Failure Event (Listende to in authStore)


type AuthFailureListener = ()=> void;

let _authFailureListener:AuthFailureListener |null = null

export const setAuthFailureListener = (fn:AuthFailureListener)=>{
    _authFailureListener=fn;
}

const signalAuthFailure = ()=>{
    _authFailureListener?.();
}

export default apiClient;