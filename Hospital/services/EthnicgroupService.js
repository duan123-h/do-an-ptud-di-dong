import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/ethnicgroups"
    return axiosClient.get(url,{params});
};
const EthnicgroupService = {
  getAll,
};
export default EthnicgroupService