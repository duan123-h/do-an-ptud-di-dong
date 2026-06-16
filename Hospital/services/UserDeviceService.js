import axiosClient from "./axiosCustom";

function saveUserDevice(data) {
  console.log("PAYLOAD GỬI LÊN SERVER:", data);
  const url = "/api/users/savedevice"
  return axiosClient.post(url, data);
};
const UserDeviceService = {
  saveUserDevice
};
export default UserDeviceService