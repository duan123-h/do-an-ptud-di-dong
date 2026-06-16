import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/users/servicerequests"
    return axiosClient.get(url,{params});
};

function getDetails(servicerequestid){
    const url=`/api/users/servicerequests/${servicerequestid}/details`;
    return axiosClient.get(`${url}`);
}
const ServicerequestService = {
  getAll,
  getDetails
};
export default ServicerequestService