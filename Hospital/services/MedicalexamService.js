import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/users/medicalexaminations"
    return axiosClient.get(url,{params});
};
function getDetail(outpatientregistrationid){
    const url="/api/users/medicalexaminations/"
    return axiosClient.get(`${url}${outpatientregistrationid}`);
}
const MedicalexaminationService = {
  getAll,
  getDetail
};
export default MedicalexaminationService