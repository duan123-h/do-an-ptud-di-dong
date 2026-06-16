import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/users/outpatientregistrations"
    return axiosClient.get(url,{params});
};

function getDetail(outpatientregistrationid){
    const url="/api/users/outpatientregistrations/"
    return axiosClient.get(`${url}${outpatientregistrationid}`);
}
function destroy(outpatientregistrationid){
    const url="/api/users/outpatientregistrations/"
    return axiosClient.delete(`${url}${outpatientregistrationid}`);
}
const OutpatientregistrationService = {
  getAll,
  destroy,
  getDetail,
};
export default OutpatientregistrationService