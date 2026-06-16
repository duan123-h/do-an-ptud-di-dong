import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/hamlets"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/hamlets"
    return axiosClient.post(url,data);
};
function update(data,hamletid){
    const url=`/api/hamlets/${hamletid}`;
    return axiosClient.put(url,data);
};
function getDetail(hamletid){
    const url="/api/hamlets/"
    return axiosClient.get(`${url}${hamletid}`);
}
function destroy(hamletid){
    const url="/api/hamlets/"
    return axiosClient.delete(`${url}${hamletid}`);
}
const HamletService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default HamletService