import axiosClient from "../axiosCustom";
function getAll(params){
    const url="/api/his/servicerequests"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/his/servicerequests"
    return axiosClient.post(url,data);
};
function update(data,servicerequestid){
    const url=`/api/his/servicerequests/${servicerequestid}`;
    return axiosClient.put(url,data);
};
function getDetail(servicerequestid){
    const url="/api/his/servicerequests/"
    return axiosClient.get(`${url}${servicerequestid}`);
}
function destroy(servicerequestid){
    const url="/api/his/servicerequests/"
    return axiosClient.delete(`${url}${servicerequestid}`);
}
function getDetails(servicerequestid){
    const url=`/api/his/servicerequests/${servicerequestid}/details`;
    return axiosClient.get(`${url}`);
}
const ServicerequestService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  getDetails
};
export default ServicerequestService