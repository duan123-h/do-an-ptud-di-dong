import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/staffs"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/staffs"
    return axiosClient.post(url,data);
};
function update(data,staffid){
    const url=`/api/staffs/${staffid}`;
    return axiosClient.put(url,data);
};
function getDetail(staffid){
    const url="/api/staffs/"
    return axiosClient.get(`${url}${staffid}`);
}
function destroy(staffid){
    const url="/api/staffs/"
    return axiosClient.delete(`${url}${staffid}`);
}

const StaffService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default StaffService