import axios from "axios";
import queryString from "query-string";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient = axios.create({
    headers:{
        'content-type':"application/json",
    },
    paramsSerializer: params=>queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config)=>{
    const backendIp = await AsyncStorage.getItem("BackendIp");
    config.baseURL = `http://${backendIp}`;
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
})
axiosClient.interceptors.response.use((response)=>{
    if(response && response.data){
        return response.data;
    }
    return response;
},(error)=>{
    
    throw error;
});
export default axiosClient;