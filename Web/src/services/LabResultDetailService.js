import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/labresultdetails"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/labresultdetails"
    return axiosClient.post(url,data);
};
function update(data,blogid){
    const url=`/api/labresultdetails/${blogid}`;
    return axiosClient.put(url,data);
};
function getDetail(blogid){
    const url="/api/labresultdetails/"
    return axiosClient.get(`${url}${blogid}`);
}
function destroy(blogid){
    const url="/api/labresultdetails/"
    return axiosClient.delete(`${url}${blogid}`);
}
function isactive(blogid){
    const url="/api/labresultdetails/isactive/"
    return axiosClient.get(`${url}${blogid}`);
}
const LabResultDetailService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default LabResultDetailService