import axiosClient from "../axiosCustom";
function getAll(params){
    const url="/api/his/patients"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/his/patients"
    return axiosClient.post(url,data);
};
function update(data,patientid){
    const url=`/api/his/patients/${patientid}`;
    return axiosClient.put(url,data);
};
function getDetail(patientid){
    const url="/api/his/patients/"
    return axiosClient.get(`${url}${patientid}`);
}
function destroy(patientid){
    const url="/api/his/patients/"
    return axiosClient.delete(`${url}${patientid}`);
}
const PatientService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default PatientService