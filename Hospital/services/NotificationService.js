import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/notifications"
    return axiosClient.get(url,{params});
};
function markAsRead(notificationid){
    const url=`/api/notifications/${notificationid}/read`
    console.log("url: ",url)
    return axiosClient.post(url);
};
function markAllRead(notificationid){
    const url=`/api/notifications/{${notificationid}/read`;
    return axiosClient.post(url,data);
};
function getCountNotRead(){
    const url=`/api/notifications/countnotread`;
    return axiosClient.get(url);
};
const notificationService = {
  getAll,
  markAsRead,
  markAllRead,
  getCountNotRead
};
export default notificationService