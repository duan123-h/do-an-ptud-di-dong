import axiosClient from "../axiosCustom";
function getAll(params){
    const url="/api/his/medicalexams"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/his/medicalexams"
    return axiosClient.post(url,data);
};
function update(data,outpatientregistrationid){
    const url=`/api/his/medicalexams/${outpatientregistrationid}`;
    return axiosClient.put(url,data);
};
function getDetail(outpatientregistrationid){
    const url="/api/his/medicalexams/"
    return axiosClient.get(`${url}${outpatientregistrationid}`);
}
function destroy(outpatientregistrationid){
    const url="/api/his/medicalexams/"
    return axiosClient.delete(`${url}${outpatientregistrationid}`);
}

function start(outpatientregistrationid){
    const url=`/api/his/medicalexams/${outpatientregistrationid}/start`
    return axiosClient.get(url);
}
function end(outpatientregistrationid){
    const url=`/api/his/medicalexams/${outpatientregistrationid}/end`
    return axiosClient.get(url);
}
function handleDisposition(data){
    const url="/api/his/medicalexams/handledisposition"
    return axiosClient.post(url,data);
};
const MedicalexamService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  start,
  end,
  handleDisposition
};
export default MedicalexamService