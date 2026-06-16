import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/inventorys"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/inventorys"
    return axiosClient.post(url,data);
};
function update(data,inventoryid){
    const url=`/api/inventorys/${inventoryid}`;
    return axiosClient.put(url,data);
};
function getMedicines(warehouseid,params){
    const url=`/api/inventorys/${warehouseid}/medicines`;
    return axiosClient.get(url,{params});
}
function destroy(inventoryid){
    const url="/api/inventorys/"
    return axiosClient.delete(`${url}${inventoryid}`);
}
const InventoryService = {
  getAll,
  create,
  destroy,
  getMedicines,
  update
};
export default InventoryService