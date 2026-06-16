import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/dosageforms"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/dosageforms"
    return axiosClient.post(url,data);
};
function update(data,dosageformid){
    const url=`/api/dosageforms/${dosageformid}`;
    return axiosClient.put(url,data);
};
function getDetail(dosageformid){
    const url="/api/dosageforms/"
    return axiosClient.get(`${url}${dosageformid}`);
}
function destroy(dosageformid){
    const url="/api/dosageforms/"
    return axiosClient.delete(`${url}${dosageformid}`);
}
const DosageformService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default DosageformService