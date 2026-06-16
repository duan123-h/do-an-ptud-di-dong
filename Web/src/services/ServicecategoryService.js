import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/servicecategorys"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/servicecategorys"
    return axiosClient.post(url,data);
};
function update(data,servicecategoryid){
    const url=`/api/servicecategorys/${servicecategoryid}`;
    return axiosClient.put(url,data);
};
function getDetail(servicecategoryid){
    const url="/api/servicecategorys/"
    return axiosClient.get(`${url}${servicecategoryid}`);
}
function destroy(servicecategoryid){
    const url="/api/servicecategorys/"
    return axiosClient.delete(`${url}${servicecategoryid}`);
}
function isactive(servicecategoryid){
    const url="/api/servicecategorys/isactive/"
    return axiosClient.get(`${url}${servicecategoryid}`);
}
const ServicecategoryService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default ServicecategoryService