import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/doctors"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/doctors"
    return axiosClient.post(url,data);
};
function update(data,doctorid){
    const url=`/api/doctors/${doctorid}`;
    return axiosClient.put(url,data);
};
function getDetail(doctorid){
    const url="/api/doctors/"
    return axiosClient.get(`${url}${doctorid}`);
}
function destroy(doctorid){
    const url="/api/doctors/"
    return axiosClient.delete(`${url}${doctorid}`);
}
const doctorservice = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default doctorservice