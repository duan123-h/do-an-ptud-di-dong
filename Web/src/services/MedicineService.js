import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/medicines"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/medicines"
    return axiosClient.post(url,data);
};
function update(data,medicineid){
    const url=`/api/medicines/${medicineid}`;
    return axiosClient.put(url,data);
};
function getDetail(medicineid){
    const url="/api/medicines/"
    return axiosClient.get(`${url}${medicineid}`);
}
function destroy(medicineid){
    const url="/api/medicines/"
    return axiosClient.delete(`${url}${medicineid}`);
}
const MedicineService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default MedicineService