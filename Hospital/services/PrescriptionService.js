import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/users/prescriptions"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/prescriptions"
    return axiosClient.post(url,data);
};
function update(data,prescriptionid){
    const url=`/api/prescriptions/${prescriptionid}`;
    return axiosClient.put(url,data);
};
function get(params){
    const url="/api/prescriptions/show"
    return axiosClient.get(url,{params});
}
function getDetail(prescriptionid,params){
    const url=`/api/users/prescriptions/${prescriptionid}`;
    return axiosClient.get(url,{params});
}
function destroy(prescriptionid){
    const url="/api/prescriptions/"
    return axiosClient.delete(`${url}${prescriptionid}`);
}
const PrescriptionService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  get
};
export default PrescriptionService