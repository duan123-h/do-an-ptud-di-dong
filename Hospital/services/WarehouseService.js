import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/warehouses"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/warehouses"
    return axiosClient.post(url,data);
};
function update(data,warehouseid){
    const url=`/api/warehouses/${warehouseid}`;
    return axiosClient.put(url,data);
};
function getDetail(warehouseid){
    const url="/api/warehouses/"
    return axiosClient.get(`${url}${warehouseid}`);
}
function destroy(warehouseid){
    const url="/api/warehouses/"
    return axiosClient.delete(`${url}${warehouseid}`);
}
function isactive(warehouseid){
    const url="/api/warehouses/isactive/"
    return axiosClient.get(`${url}${warehouseid}`);
}
const WarehouseService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default WarehouseService