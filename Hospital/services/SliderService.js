import axiosClient from "./axiosCustom";
function getAll(params){
    const url="/api/sliders"
    return axiosClient.get(url,{params});
};
const SliderService = {
  getAll
};
export default SliderService