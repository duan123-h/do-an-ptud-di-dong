import axiosClient from "./axiosCustom";
function prescription(data){
    const url="/api/exports/prescription"
    return axiosClient.post(url,data);
};
function destroyPrescription(data){
    const url="/api/exports/prescription/destroy"
    return axiosClient.post(url,data);
};

const ExportService = {
  prescription,
  destroyPrescription
};
export default ExportService