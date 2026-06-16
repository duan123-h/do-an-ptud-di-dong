import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/menus"
    return axiosClient.get(url,{params});
};
function create(data){
    const url="/api/menus"
    return axiosClient.post(url,data);
};
function update(data,menuid){
    const url=`/api/menus/${menuid}`;
    return axiosClient.put(url,data);
};
function getDetail(menuid){
    const url="/api/menus/"
    return axiosClient.get(`${url}${menuid}`);
}
function destroy(menuid){
    const url="/api/menus/"
    return axiosClient.delete(`${url}${menuid}`);
}
function isactive(menuid){
    const url="/api/menus/isactive/"
    return axiosClient.get(`${url}${menuid}`);
}
const MenuService = {
  getAll,
  create,
  destroy,
  getDetail,
  update,
  isactive
};
export default MenuService