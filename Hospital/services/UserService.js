import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/users"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/users"
    return axiosClient.post(url,data);
};
function update(data,userid){
    const url=`/api/users/${userid}`;
    return axiosClient.put(url,data);
};
function getDetail(userid){
    const url="/api/users/"
    return axiosClient.get(`${url}${userid}`);
}
function destroy(userid){
    const url="/api/users/"
    return axiosClient.delete(`${url}${userid}`);
}

function getProfile(userid){
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
function getOutpatientRegistrations(){
    const url="/api/users/outpatientregistrations"
    return axiosClient.get(url);
}
const UserService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  getProfile,
  chagnePass,
  updateProfile,
  getOutpatientRegistrations
};
export default UserService