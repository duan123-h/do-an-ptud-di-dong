import axiosClient from "../axiosCustom";
function getAll(params){
    const url="/api/his/outpatientregistrations"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/his/outpatientregistrations"
    return axiosClient.post(url,data);
};
function update(data,outpatientregistrationid){
    const url=`/api/his/outpatientregistrations/${outpatientregistrationid}`;
    return axiosClient.put(url,data);
};
function getDetail(outpatientregistrationid){
    const url="/api/his/outpatientregistrations/"
    return axiosClient.get(`${url}${outpatientregistrationid}`);
}
function destroy(outpatientregistrationid){
    const url="/api/his/outpatientregistrations/"
    return axiosClient.delete(`${url}${outpatientregistrationid}`);
}
const OutpatientregistrationService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default OutpatientregistrationService