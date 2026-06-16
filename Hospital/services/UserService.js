import axiosClient from "./axiosCustom";

function getProfile(){
    const url="/api/users/profile"
    return axiosClient.get(url);
}
function chagnePass(data){
    const url="/api/users/changepassword"
    return axiosClient.post(url,data);
}
function updateProfile(data){
    const url="/api/users/updateprofile"
    return axiosClient.post(url,data);
}

const UserService = {
  getProfile,
  chagnePass,
  updateProfile
};
export default UserService