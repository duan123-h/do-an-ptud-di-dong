import axios from "axios";
import queryString from "query-string";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showError } from '@/components/toast';
const axiosClient = axios.create({
    headers: {
        'content-type': "application/json",
    },
    paramsSerializer: params => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
    const backendIp = await AsyncStorage.getItem("BackendIp");
    if (backendIp) {
        config.baseURL = `http://${backendIp}`;
    } else {
        config.baseURL = `https://do-an-ptud-di-dong.onrender.com`;
    }
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
})
axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    showError(error.response?.data?.message);
    throw error;
});
export default axiosClient;