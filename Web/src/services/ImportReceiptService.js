import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/importreceipts"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/importreceipts"
    return axiosClient.post(url,data);
};
function update(data,importreceiptid){
    const url=`/api/importreceipts/${importreceiptid}`;
    return axiosClient.put(url,data);
};
function getMedicines(warehouseid){
    const url=`/api/importreceipts/${warehouseid}/medicines`;
    return axiosClient.get(url);
}
function getDetail(importreceiptid){
    const url="/api/importreceipts/"
    return axiosClient.get(`${url}${importreceiptid}`);
}
function destroy(importreceiptid){
    const url="/api/importreceipts/"
    return axiosClient.delete(`${url}${importreceiptid}`);
}
function process(importreceiptid){
    const url="/api/importreceipts/process/"
    return axiosClient.get(`${url}${importreceiptid}`);
}
const ImportReceiptService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  process
};
export default ImportReceiptService