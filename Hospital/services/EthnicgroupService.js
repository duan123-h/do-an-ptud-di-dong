import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/ethnicgroups"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/ethnicgroups"
    return axiosClient.post(url,data);
};
function update(data,ethnicgroupid){
    const url=`/api/ethnicgroups/${ethnicgroupid}`;
    return axiosClient.put(url,data);
};
function getDetail(ethnicgroupid){
    const url="/api/ethnicgroups/"
    return axiosClient.get(`${url}${ethnicgroupid}`);
}
function destroy(ethnicgroupid){
    const url="/api/ethnicgroups/"
    return axiosClient.delete(`${url}${ethnicgroupid}`);
}
const EthnicgroupService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default EthnicgroupService