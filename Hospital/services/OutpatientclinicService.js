import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/outpatientclinics"
    return axiosClient.get(url,{params});
};
const outpatientclinicService = {
  getAll
};
export default outpatientclinicService