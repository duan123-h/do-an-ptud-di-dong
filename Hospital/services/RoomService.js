import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/rooms"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/rooms"
    return axiosClient.post(url,data);
};
function update(data,roomid){
    const url=`/api/rooms/${roomid}`;
    return axiosClient.put(url,data);
};
function getDetail(roomid){
    const url="/api/rooms/"
    return axiosClient.get(`${url}${roomid}`);
}
function destroy(roomid){
    const url="/api/rooms/"
    return axiosClient.delete(`${url}${roomid}`);
}
function isactive(roomid){
    const url="/api/rooms/isactive/"
    return axiosClient.get(`${url}${roomid}`);
}
const RoomService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default RoomService