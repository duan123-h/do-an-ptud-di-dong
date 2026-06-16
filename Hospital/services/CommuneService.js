import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/communes"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/communes"
    return axiosClient.post(url,data);
};
function update(data,communeid){
    const url=`/api/communes/${communeid}`;
    return axiosClient.put(url,data);
};
function getDetail(communeid){
    const url="/api/communes/"
    return axiosClient.get(`${url}${communeid}`);
}
function destroy(communeid){
    const url="/api/communes/"
    return axiosClient.delete(`${url}${communeid}`);
}
function getHamlets(communeid){
    const url=`/api/communes/${communeid}/hamlets`
    return axiosClient.get(url);
};
const CommuneService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  getHamlets
};
export default CommuneService