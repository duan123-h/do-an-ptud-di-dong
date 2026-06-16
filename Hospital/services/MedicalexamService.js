import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/users/medicalexaminations"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/medicalexaminations"
    return axiosClient.post(url,data);
};
function update(data,outpatientregistrationid){
    const url=`/api/medicalexaminations/${outpatientregistrationid}`;
    return axiosClient.put(url,data);
};
function getDetail(outpatientregistrationid){
    const url="/api/users/medicalexaminations/"
    return axiosClient.get(`${url}${outpatientregistrationid}`);
}
function destroy(outpatientregistrationid){
    const url="/api/medicalexaminations/"
    return axiosClient.delete(`${url}${outpatientregistrationid}`);
}

function start(outpatientregistrationid){
    const url=`/api/medicalexaminations/${outpatientregistrationid}/start`
    return axiosClient.get(url);
}
function end(outpatientregistrationid){
    const url=`/api/medicalexaminations/${outpatientregistrationid}/end`
    return axiosClient.get(url);
}
function handleDisposition(data){
    const url="/api/medicalexaminations/handledisposition"
    return axiosClient.post(url,data);
};
const MedicalexaminationService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  start,
  end,
  handleDisposition
};
export default MedicalexaminationService