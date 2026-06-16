import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/hamlets"
    return axiosClient.get(url,{params});
};
const HamletService = {
  getAll
};
export default HamletService