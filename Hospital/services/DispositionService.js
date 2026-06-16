import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/dispositions"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/dispositions"
    return axiosClient.post(url,data);
};
function update(data,outpatientregistrationid){
    const url=`/api/dispositions/${outpatientregistrationid}`;
    return axiosClient.put(url,data);
};
function getDetail(outpatientregistrationid){
    const url="/api/dispositions/"
    return axiosClient.get(`${url}${outpatientregistrationid}`);
}
function destroy(outpatientregistrationid){
    const url="/api/dispositions/"
    return axiosClient.delete(`${url}${outpatientregistrationid}`);
}

function start(outpatientregistrationid){
    const url=`/api/dispositions/${outpatientregistrationid}/start`
    return axiosClient.get(url);
}
function end(outpatientregistrationid){
    const url=`/api/dispositions/${outpatientregistrationid}/end`
    return axiosClient.get(url);
}
const DispositionService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  start,
  end
};
export default DispositionService