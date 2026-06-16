import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/departments"
    return axiosClient.get(url,{params});
};
const DepartmentService = {
  getAll,
};
export default DepartmentService