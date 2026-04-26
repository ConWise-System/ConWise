import axios from 'axios'
import { baseURL } from "../src/common/summeryApi"


const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

Axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
Axios.interceptors.request.use(
    async(config)=>{
        const accessToken = localStorage.getItem('accessToken')
        if(accessToken){
            config.headers.authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

Axios.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest = error.config
        if(error.response.status===401 && !originRequest.retry){
            originRequest.retry = true
            const refreshToken = localStorage.getItem('refreshToken')
            if(refreshToken){
                const newAccessToken = await refreshAccessToken(refreshToken)
                if(newAccessToken){
                    return Axios(originRequest)
                }
            }
        }
        return Promise.reject(error)
    }
)

const refreshAccessToken = async(refreshToken)=>{
    try{
        const response = await Axios({
            ...summeryApi.refreshToken,
            headers:{
                Authorization: `Bearer ${refreshToken}`
            }
        })
        const accessToken = response.data.data.accessToken
        localStorage.setItem(accessToken)
        return accessToken
    }catch(error){
        console.log(refreshToken)
    }
}

export default Axios