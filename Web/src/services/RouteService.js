import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/routes"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/routes"
    return axiosClient.post(url,data);
};
function update(data,routeid){
    const url=`/api/routes/${routeid}`;
    return axiosClient.put(url,data);
};
function getDetail(routeid){
    const url="/api/routes/"
    return axiosClient.get(`${url}${routeid}`);
}
function destroy(routeid){
    const url="/api/routes/"
    return axiosClient.delete(`${url}${routeid}`);
}
const RouteService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default RouteService