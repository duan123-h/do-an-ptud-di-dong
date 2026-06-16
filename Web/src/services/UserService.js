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
const UserService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default UserService