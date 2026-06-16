import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/doctors"
    return axiosClient.get(url,{params});
};

function getDetail(doctorid){
    const url="/api/doctors/"
    return axiosClient.get(`${url}${doctorid}`);
}
const doctorservice = {
  getAll,
  getDetail
};
export default doctorservice