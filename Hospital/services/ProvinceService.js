import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/provinces"
    return axiosClient.get(url,{params});
};
function getCommunes(provinceid){
    const url=`/api/provinces/${provinceid}/communes`
    return axiosClient.get(url);
};
const ProvinceService = {
  getAll,
  getCommunes
};
export default ProvinceService