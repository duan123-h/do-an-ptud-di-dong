import axiosClient from "./axiosCustom";
function getPatient(params){
    const url="/api/statistics/patient"
    return axiosClient.get(url,{params});
};
function getOutpatient(params){
    const url="/api/statistics/outpatient"
    return axiosClient.get(url,{params});
};
function getExamination(params){
    const url="/api/statistics/examination"
    return axiosClient.get(url,{params});
};
const BlogService = {
  getPatient,
  getOutpatient,
  getExamination
};
export default BlogService