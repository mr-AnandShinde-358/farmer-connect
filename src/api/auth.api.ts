import { loginFormData, SignUpFormData } from "../schema/user.Schema";
import apiClient from "./axiosInstance";


export const authApi = {

  // login-user

  loginUser:async(payload:loginFormData)=>{
    
    const {data} = await apiClient.post(`/user/login`,payload)
    return data
  },

  // register-user

  registerUser:async(payload:SignUpFormData)=>{
    
    const {data} = await apiClient.post(`/user/register`,payload)
   
    return data
  },

  // logout-user

  logoutUser:async()=>{
    console.log("caling logout")
     const {data} = await apiClient.post(`/user/logout`)
     console.log(data)
    return data
  }

}