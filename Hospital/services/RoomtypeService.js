import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/roomtypes"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/roomtypes"
    return axiosClient.post(url,data);
};
function update(data,roomtypeid){
    const url=`/api/roomtypes/${roomtypeid}`;
    return axiosClient.put(url,data);
};
function getDetail(roomtypeid){
    const url="/api/roomtypes/"
    return axiosClient.get(`${url}${roomtypeid}`);
}
function destroy(roomtypeid){
    const url="/api/roomtypes/"
    return axiosClient.delete(`${url}${roomtypeid}`);
}
const RoomtypeService = {
  getAll,
  create,
  destroy,
  getDetail,
  update
};
export default RoomtypeService