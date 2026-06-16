import axiosClient from "../axiosCustom";
function login(data){
    console.log("👉 PAYLOAD GỬI LÊN SERVER:", data);
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