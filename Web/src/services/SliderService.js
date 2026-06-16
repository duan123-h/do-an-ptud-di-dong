import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/sliders"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/sliders"
    return axiosClient.post(url,data);
};
function update(data,sliderid){
    const url=`/api/sliders/${sliderid}`;
    return axiosClient.put(url,data);
};
function getDetail(sliderid){
    const url="/api/sliders/"
    return axiosClient.get(`${url}${sliderid}`);
}
function destroy(sliderid){
    const url="/api/sliders/"
    return axiosClient.delete(`${url}${sliderid}`);
}
function isactive(sliderid){
    const url="/api/sliders/isactive/"
    return axiosClient.get(`${url}${sliderid}`);
}
const SliderService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default SliderService