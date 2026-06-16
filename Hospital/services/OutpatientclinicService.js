import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/outpatientclinics"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/outpatientclinics"
    return axiosClient.post(url,data);
};
function update(data,outpatientclinicid){
    const url=`/api/outpatientclinics/${outpatientclinicid}`;
    return axiosClient.put(url,data);
};
function getDetail(outpatientclinicid){
    const url="/api/outpatientclinics/"
    return axiosClient.get(`${url}${outpatientclinicid}`);
}
function destroy(outpatientclinicid){
    const url="/api/outpatientclinics/"
    return axiosClient.delete(`${url}${outpatientclinicid}`);
}
const outpatientclinicService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default outpatientclinicService