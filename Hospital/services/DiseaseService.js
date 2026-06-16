import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/diseases"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/diseases"
    return axiosClient.post(url,data);
};
function update(data,diseaseid){
    const url=`/api/diseases/${diseaseid}`;
    return axiosClient.put(url,data);
};
function getDetail(diseaseid){
    const url="/api/diseases/"
    return axiosClient.get(`${url}${diseaseid}`);
}
function destroy(diseaseid){
    const url="/api/diseases/"
    return axiosClient.delete(`${url}${diseaseid}`);
}
const DiseaseService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default DiseaseService