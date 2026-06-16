import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/services"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/services"
    return axiosClient.post(url,data);
};
function update(data,serviceid){
    const url=`/api/services/${serviceid}`;
    return axiosClient.put(url,data);
};
function getDetail(serviceid){
    const url="/api/services/"
    return axiosClient.get(`${url}${serviceid}`);
}
function destroy(serviceid){
    const url="/api/services/"
    return axiosClient.delete(`${url}${serviceid}`);
}
function isactive(serviceid){
    const url="/api/services/isactive/"
    return axiosClient.get(`${url}${serviceid}`);
}
const ServiceService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default ServiceService