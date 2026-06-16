import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/suppliers"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/suppliers"
    return axiosClient.post(url,data);
};
function update(data,supplierid){
    const url=`/api/suppliers/${supplierid}`;
    return axiosClient.put(url,data);
};
function getDetail(supplierid){
    const url="/api/suppliers/"
    return axiosClient.get(`${url}${supplierid}`);
}
function destroy(supplierid){
    const url="/api/suppliers/"
    return axiosClient.delete(`${url}${supplierid}`);
}
const SupplierService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default SupplierService