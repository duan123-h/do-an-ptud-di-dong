import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/users/prescriptions"
    return axiosClient.get(url,{params});
};
function getDetail(prescriptionid,params){
    const url=`/api/users/prescriptions/${prescriptionid}`;
    return axiosClient.get(url,{params});
}
const PrescriptionService = {
  getAll,
  getDetail
};
export default PrescriptionService