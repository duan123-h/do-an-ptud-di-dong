import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/diseasegroups"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/diseasegroups"
    return axiosClient.post(url,data);
};
function update(data,diseasegroupid){
    const url=`/api/diseasegroups/${diseasegroupid}`;
    return axiosClient.put(url,data);
};
function getDetail(diseasegroupid){
    const url="/api/diseasegroups/"
    return axiosClient.get(`${url}${diseasegroupid}`);
}
function destroy(diseasegroupid){
    const url="/api/diseasegroups/"
    return axiosClient.delete(`${url}${diseasegroupid}`);
}
const DiseasegroupService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default DiseasegroupService