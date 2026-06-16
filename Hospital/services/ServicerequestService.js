import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/users/servicerequests"
    return axiosClient.get(url,{params});
};

function getDetail(servicerequestid){
    const url="/api/his/servicerequests/"
    return axiosClient.get(`${url}${servicerequestid}`);
}

function getDetails(servicerequestid){
    const url=`/api/users/servicerequests/${servicerequestid}/details`;
    return axiosClient.get(`${url}`);
}
const ServicerequestService = {
  getAll,
  getDetail,
  getDetails
};
export default ServicerequestService