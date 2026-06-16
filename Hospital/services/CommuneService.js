import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/communes"
    return axiosClient.get(url,{params});
};

function getHamlets(communeid){
    const url=`/api/communes/${communeid}/hamlets`
    return axiosClient.get(url);
};
const CommuneService = {
  getAll,
  getHamlets
};
export default CommuneService