import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/departments"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/departments"
    return axiosClient.post(url,data);
};
function update(data,departmentid){
    const url=`/api/departments/${departmentid}`;
    return axiosClient.put(url,data);
};
function getDetail(departmentid){
    const url="/api/departments/"
    return axiosClient.get(`${url}${departmentid}`);
}
function destroy(departmentid){
    const url="/api/departments/"
    return axiosClient.delete(`${url}${departmentid}`);
}
const DepartmentService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default DepartmentService