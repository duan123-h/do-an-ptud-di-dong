import axiosClient from "../axiosCustom";
function login(data){
    const url="/api/login"
    return axiosClient.post(url,data);
};
function currentuser(){
    const url="/api/currentuser"
    return axiosClient.get(url);
};
const AuthService = {
  login,
  currentuser
};
export default AuthService