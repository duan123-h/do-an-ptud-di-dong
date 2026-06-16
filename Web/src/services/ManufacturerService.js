import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/manufacturers"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/manufacturers"
    return axiosClient.post(url,data);
};
function update(data,manufacturerid){
    const url=`/api/manufacturers/${manufacturerid}`;
    return axiosClient.put(url,data);
};
function getDetail(manufacturerid){
    const url="/api/manufacturers/"
    return axiosClient.get(`${url}${manufacturerid}`);
}
function destroy(manufacturerid){
    const url="/api/manufacturers/"
    return axiosClient.delete(`${url}${manufacturerid}`);
}
const ManufacturerService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default ManufacturerService