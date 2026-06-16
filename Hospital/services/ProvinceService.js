import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/provinces"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/provinces"
    return axiosClient.post(url,data);
};
function update(data,provinceid){
    const url=`/api/provinces/${provinceid}`;
    return axiosClient.put(url,data);
};
function getDetail(provinceid){
    const url="/api/provinces/"
    return axiosClient.get(`${url}${provinceid}`);
}
function destroy(provinceid){
    const url="/api/provinces/"
    return axiosClient.delete(`${url}${provinceid}`);
}
function getCommunes(provinceid){
    const url=`/api/provinces/${provinceid}/communes`
    return axiosClient.get(url);
};
const ProvinceService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  getCommunes
};
export default ProvinceService