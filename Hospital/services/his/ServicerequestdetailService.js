import axiosClient from "../axiosCustom";
function getAll(params){
    const url="/api/users/servicerequestdetails"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/his/servicerequestdetails"
    return axiosClient.post(url,data);
};
function update(data,servicerequestdetailid){
    const url=`/api/his/servicerequestdetails/${servicerequestdetailid}`;
    return axiosClient.put(url,data);
};
function getDetail(servicerequestdetailid){
    const url="/api/his/servicerequestdetails/"
    return axiosClient.get(`${url}${servicerequestdetailid}`);
}
function destroy(servicerequestdetailid){
    const url="/api/his/servicerequestdetails/"
    return axiosClient.delete(`${url}${servicerequestdetailid}`);
}
function start(servicerequestdetailid){
    const url=`/api/his/servicerequestdetails/${servicerequestdetailid}/start`
    return axiosClient.get(url);
}
function end(servicerequestdetailid){
    const url=`/api/his/servicerequestdetails/${servicerequestdetailid}/end`
    return axiosClient.get(url);
}
const ServicerequestdetailService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  start,
  end
};
export default ServicerequestdetailService