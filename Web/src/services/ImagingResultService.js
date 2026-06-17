import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/imagingresults"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/imagingresults"
    return axiosClient.post(url,data);
};
function update(data,blogid){
    const url=`/api/imagingresults/${blogid}`;
    return axiosClient.put(url,data);
};
function getDetail(blogid){
    const url="/api/imagingresults/"
    return axiosClient.get(`${url}${blogid}`);
}
function destroy(blogid){
    const url="/api/imagingresults/"
    return axiosClient.delete(`${url}${blogid}`);
}
function isactive(blogid){
    const url="/api/imagingresults/isactive/"
    return axiosClient.get(`${url}${blogid}`);
}
const ImagingResultService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default ImagingResultService