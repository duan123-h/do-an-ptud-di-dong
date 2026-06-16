import Medicalexam from "../../../services/his/MedicalexamService";
import Disposition from "../../../services/DispositionService";
import Servicerequest from "../../../services/his/ServicerequestService";
import Servicerequestdetail from "../../../services/his/ServicerequestdetailService";
import Disease from "../../../services/DiseaseService";
import Service from "../../../services/ServiceService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import Select from "react-select";
import toast from "react-hot-toast";
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import ModalListCLS from "../../../components/his/Modals/ModalListCLS";
import ModalCLSRequest from "../../../components/his/Modals/ModalCLSRequest";
import ModalResultCLS from "../../../components/his/Modals/ModalResultCLS";
import PrescriptionService from "../../../services/PrescriptionService";
import WarehouseService from "../../../services/WarehouseService";
import InventoryService from "../../../services/InventoryService";
import RouteService from "../../../services/RouteService";
export default function MedicalexamDetail() {
    const mysal = withReactContent(swal);
    const { id } = useParams();
    const [medicalexamData, setMedicalexamData] = useState({});
    const [resultCLSData, setResultCLSData] = useState({});
    const [listMedicalexamData, setListMedicalexamData] = useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [loadingEndOrStaart, setLoadingEndOrStaart] = useState(false);
    const [loadingDisease, setLoadingDisease] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDispositionSave, setLoadingDispositionSave] = useState(false);
    const [diseaseData, setDiseaseData] = useState([]);
    const [dispositionData, setDispositionData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [speaking, setSpeaking] = useState(false);
    const [showModalListCLS, setShowModalListCLS] = useState(false);
    const [showModalCLS, setShowModalCLS] = useState(false);
    const [showModalResultCLS, setShowModalResultCLS] = useState(false);
    const [showModalHandleDisposition, setShowModalHandleDisposition] = useState(false);
    const [showModalshowModalMedicnines, setShowModalshowModalMedicnines] = useState(false);
    const [showMedicineSearch, setShowMedicineSearch] = useState(true);
    const [loadingResultCLS, setLoadingResultCLS] = useState(true);
    const [listCLSData, setListCLSData] = useState([]);
    const [clsData, setCLSData] = useState([]);
    const [createOrEdit, setCreateOrEdit] = useState(true);
    const [loadingpost, setLoadingpost] = useState(false);
    const [loadingStore, setLoadingStore] = useState(false);
    const [servicerequestid, setServicerequestid] = useState(null);
    const [activeTab, setActiveTab] = useState("exam");
    const [diseaseIds, setDiseaseIds] = useState([]);
    const [prescription, setPrescription] = useState();
    const [warehouseData, setWarehouseDate] = useState([]);
    const [warehouseSelected, setWarehouseSelected] = useState("");
    const [searchMedicine, setSearchMedicine] = useState("");
    const [searchMedicineData, setSearchMedicineData] = useState([]);
    const [skipDebounce, setSkipDebounce] = useState(false);
    const [medicineSelected, setMedicineSelected] = useState({});
    const [listMedicineSelected, setListMedicineSelected] = useState([]);
    const [routeData, setRouteData] = useState([]);
    function handleSpeak(name, outpatientclinicname, queueorder) {
        if (!outpatientclinicname || !name || !queueorder) return;
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => handleSpeak(name, outpatientclinicname, queueorder);
            return;
        }
        const text = `Xin mời bệnh nhân ${name} số thứ tự ${queueorder} vào ${outpatientclinicname} để bắt đầu quá trình thăm khám.`
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.7;
        utterance.pitch = 0.8;
        utterance.lang = "vi-VN";

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };
    // const debounce = (func, delay) => {
    //     let timer;
    //     return (...args) => {
    //         clearTimeout(timer);
    //         timer = setTimeout(() => func(...args), delay);
    //     };
    // };
    const fetchSearchMedicineData = async (warehouse, search) => {
        try {
            if (warehouse != "" && search != "") {
                const params = { search: search }
                const response = await InventoryService.getMedicines(warehouse, params);
                setSearchMedicineData(response.data);
            } else if (search == "") {
                setSearchMedicineData([]);
            } else {
                toast.error("Vui lòng chọn kho thuốc");
                setSearchMedicineData([]);
            }
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
    };
    // const debouncedSearch = useCallback(debounce(fetchSearchMedicineData, 2000), []);
    function onChangeSearchMedicine(value) {
        setMedicineSelected({
            routeid: 1
        })
        setSkipDebounce(false);
        setSearchMedicine(value);
    }
    // useEffect(() => {
    //     debouncedSearch(warehouseSelected, searchMedicine,skipDebounce);
    // }, [searchMedicine, warehouseSelected]);
    const handleEnterSearchMedicine = (e) => {
        if (e.key === "Enter") {
            setSkipDebounce(true);
            fetchSearchMedicineData(warehouseSelected, searchMedicine);
        }
    };

    const fetchDiseaseData = async () => {
        setLoadingDisease(true);
        try {
            const response = await Disease.getAll();
            const options = response.data.map((item) => ({
                value: item.diseaseid,
                label: item.diseasename,
            }));
            setDiseaseData(options);
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
        setLoadingDisease(false);
    };
    const fetchRouteData = async () => {
        try {
            const response = await RouteService.getAll();
            setRouteData(response.data);
        } catch (error) {
            console.error("Error fetching Routes:", error);
        }
    };
    const fetchPrescription = async () => {
        try {
            const params = { medicalexaminationid: medicalexamData.medicalexaminationid }
            const response = await PrescriptionService.get(params);
            if (response?.data?.prescriptionid != null) {
                fetchPrescriptionDetail(response?.data?.prescriptionid);
            }
            setPrescription(input=>({
                ...input,
                ...response.data
            }));
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
    };
    const fetchPrescriptionDetail = async (prescriptionid) => {
        try {
            const response = await PrescriptionService.getDetail(prescriptionid);
            setListMedicineSelected(response.data);
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
    };
    const fetchwarehouseData = async () => {
        try {
            const response = await WarehouseService.getAll();
            setWarehouseDate(response.data);
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
    };
    const fetchDisposition = async () => {
        try {
            const response = await Disposition.getAll();
            const options = response.data.map((item) => ({
                value: item.dispositionid,
                label: item.name,
            }));
            setDispositionData(options);
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
    };
    const fetchfetchServiceData = async () => {
        try {
            const response = await Service.getAll();
            const groupedMap = response.data.reduce((acc, service) => {
                if (!acc[service.servicecategory.name]) {
                    acc[service.servicecategory.name] = [];
                }
                acc[service.servicecategory.name].push(service);
                return acc;
            }, {});
            const groupedArray = Object.entries(groupedMap).map(([categoryname, services]) => ({
                name: categoryname,
                services: services
            }));
            setServiceData(groupedArray);
            console.log(">>> check data: ", groupedArray);
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
    };
    function handleChangeInput(e) {
        var name = e.target.name;
        var value = e.target.value;
        setMedicalexamData(input => ({
            ...input,
            [name]: value
        }))
    }
    async function fetchMedicalexamData(id) {
        try {
            setLoading(true);
            const res = await Medicalexam.getDetail(id);
            setMedicalexamData(res.data);
            const did = [];
            res.data?.secondarydiseases?.map(item => {
                did.push(item.diseaseid);
            });
            setDiseaseIds(did);
            console.error("check data:", res.data);
            setLoading(false);
        } catch (error) {
            console.log("loi lấy dữ liệu phiếu khám: ", error);
            toast.error("Lỗi khi lấy dữ liệu phiếu khám");
        }
    }
    async function fetchListMedicalexamData(id) {
        try {
            const params = {
                patientid: medicalexamData.patient?.patientid
            }
            const res = await Medicalexam.getAll(params);
            setListMedicalexamData(res.data);
        } catch (error) {
            toast.error("Lỗi khi lấy dữ liệu lịch sử khám")
        }
    }
    async function fetchResultCLSData(id) {
        setLoadingResultCLS(true);
        try {
            const res = await Servicerequestdetail.getDetail(id);
            setResultCLSData(res.data);
            setLoadingResultCLS(false);
        } catch (error) {
            setLoadingResultCLS(false);
            toast.error("Lỗi khi lấy dữ liệu")
        }
    }
    function onOpenModalDisposition() {
        fetchDisposition();
        setShowModalHandleDisposition(true);
    }
    useEffect(() => {
        fetchDiseaseData();
        fetchMedicalexamData(id);
    }, [location]);
    useEffect(() => {
        if (medicalexamData.patient?.patientid) {
            fetchListMedicalexamData(medicalexamData.patient?.patientid);
        }
    }, [medicalexamData.patient?.patientid]);

    function handleMedicalexamStart(name) {
        mysal.fire({
            title: `Bạn có chắc muốn bắt đầu khám cho bệnh nhân ${name} không?`,
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoadingEndOrStaart(true);
                    const res = await Medicalexam.start(id);
                    setMedicalexamData(res.data);
                    setLoadingEndOrStaart(false);

                } catch (error) {

                    setLoadingEndOrStaart(false);
                    console.log(">>> check error: ", error)
                    if (error.response && error.response.data && error.response.data.errors) {
                        Object.values(error.response.data.errors).map((errArray) =>
                            errArray.map((msg) => toast.error(msg))
                        );
                    } else if (error.response && error.response.data && error.response.data.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
                    }
                    console.error("Error fetching Receptiontypes:", error);
                }
            }
        });

    }
    function handleMedicalexamEnd(name) {
        mysal.fire({
            title: `Bạn có chắc muốn kết thúc khám cho bệnh nhân ${name} không?`,
            text: "Sau khi kết thúc, bạn sẽ không thể chỉnh sửa phiếu khám này!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoadingEndOrStaart(true);
                    const res = await Medicalexam.end(id);
                    setMedicalexamData(prev => ({
                        ...prev,
                        ...res.data
                    }))
                    setLoadingEndOrStaart(false);

                } catch (error) {

                    setLoadingEndOrStaart(false);
                    console.log(">>> check error: ", error)
                    if (error.response && error.response.data && error.response.data.errors) {
                        Object.values(error.response.data.errors).map((errArray) =>
                            errArray.map((msg) => toast.error(msg))
                        );
                    } else if (error.response && error.response.data && error.response.data.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
                    }
                    console.error("Error fetching Receptiontypes:", error);
                }
            }
        });
    }
    async function handleMedicalexamSave() {
        try {
            setLoadingSave(true);
            const data = {
                medicalexaminationid: medicalexamData.medicalexaminationid,
                temperature: medicalexamData.temperature,
                bloodpressure: medicalexamData.bloodpressure,
                heartrate: medicalexamData.heartrate,
                height: medicalexamData.height,
                weight: medicalexamData.weight,
                generalexam: medicalexamData.generalexam,
                bodypartexam: medicalexamData.bodypartexam,
                labresults: medicalexamData.labresults,
                diagnosis: medicalexamData.diagnosis,
                diseaseid: medicalexamData.diseaseid,
                diseasename: medicalexamData.diseasename,
                dispositionid: medicalexamData.dispositionid,
                secondarydiseasenames: medicalexamData.secondarydiseasenames,
                secondarydisease: diseaseIds.map(item => {
                    return {
                        diseaseid: item
                    }
                })
            }
            console.log("chekcdata: ", data);
            const res = await Medicalexam.update(data, id);
            setMedicalexamData(prev => ({
                ...prev,
                ...res.data
            }))
            setLoadingSave(false);
            toast.success("Lưu thông tin phiếu khám bệnh thành công.");
        } catch (error) {
            setLoadingSave(false);
            console.log(">>> check error: ", error)
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).map((errArray) =>
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error("Error fetching Receptiontypes:", error);
        }
    }
    async function handleDispositionSave() {
        try {
            setLoadingDispositionSave(true);
            const data = {
                medicalexaminationid: medicalexamData.medicalexaminationid,
                diagnosis: medicalexamData.diagnosis,
                diseaseid: medicalexamData.diseaseid,
                diseasename: medicalexamData.diseasename,
                dispositionid: medicalexamData.dispositionid,
                secondarydiseasenames: medicalexamData.secondarydiseasenames,
                secondarydisease: diseaseIds.map(item => {
                    return {
                        diseaseid: item
                    }
                })
            }
            console.log("chekcdata: ", data);
            const res = await Medicalexam.handleDisposition(data);
            setMedicalexamData(prev => ({
                ...prev,
                ...res.data
            }))
            setLoadingDispositionSave(false);
            toast.success("Lưu thông tin phiếu khám bệnh thành công.");
        } catch (error) {
            setLoadingDispositionSave(false);
            console.log(">>> check error: ", error)
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).map((errArray) =>
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error("Error fetching Receptiontypes:", error);
        }
    }
    useEffect(() => {
        if (showModalListCLS) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showModalListCLS]);
    function handleShowModelCLS() {
        fetchServiceRequestData();
        setShowModalCLS(true);
    }
    function handleShowModelListCLS() {
        setShowModalListCLS(true);
        fetchfetchServiceData();
    }

    function handleShowHistoryExam() {
        setActiveTab('history');
    }
    function findServiceById(id) {
        for (const group of serviceData) {
            const found = group.services.find(s => s.serviceid === id);
            if (found) return found;
        }
        return null;
    }
    function handleAddCLS(id) {
        const service = findServiceById(id);
        if (service) {
            setListCLSData(prev => {
                if (prev.some(item => item.service.serviceid === service.serviceid)) return prev;
                return [...prev, { service: service }];
            });
        }
    }
    function handleRemoveCLS(id) {
        setListCLSData(prev => prev.filter(item => item.service.serviceid !== id));
    }
    function handleCreateCLS(id) {
        setListCLSData([]);
        setCreateOrEdit(true);
        setShowModalCLS(false);
        handleShowModelListCLS();
    }
    async function postDataCLS(e) {
        setLoadingpost(true);
        e.preventDefault();
        const datacls = {
            medicalexaminationid: medicalexamData.medicalexaminationid,
            patientid: medicalexamData.patient?.patientid,
            details: listCLSData.map(item => {
                return {
                    serviceid: item.service?.serviceid,
                    outpatientclinicid: item.service?.outpatientclinic?.outpatientclinicid
                }
            })
        }
        console.log("checkdata: ", datacls);
        try {
            const response = await Servicerequest.create(datacls);
            setListCLSData(response.data);
            setServicerequestid(response.servicerequestid);
            setLoadingpost(false);
            setCreateOrEdit(false);
            fetchServiceRequestData();
            console.log(">>> check message: ", response)
            toast.success(response.message);
        } catch (error) {
            setLoadingpost(false);
            console.log(">>> check error: ", error)
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).map((errArray) =>
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error("Error fetching Departments:", error);
        }
    }
    async function updateDataCLS(e) {
        console.log("nhan update");
        setLoadingpost(true);
        e.preventDefault();
        console.log("check data update: ", listCLSData);
        const datacls = {
            medicalexaminationid: medicalexamData.medicalexaminationid,
            details: listCLSData.map(item => {
                return {
                    serviceid: item.service?.serviceid,
                    outpatientclinicid: item.service?.outpatientclinic?.outpatientclinicid
                }
            })
        }
        console.log("check data update: ", datacls);
        try {
            const response = await Servicerequest.update(datacls, servicerequestid);
            setListCLSData(response.data);
            setLoadingpost(false);
            setCreateOrEdit(false);
            console.log(">>> check message: ", response)
            toast.success(response.message);
        } catch (error) {
            setLoadingpost(false);
            console.log(">>> check error: ", error)
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).map((errArray) =>
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error("Error fetching Departments:", error);
        }
    }
    const fetchServiceRequestData = async () => {
        try {
            if (medicalexamData.medicalexaminationid) {
                const params = { medicalexaminationid: medicalexamData.medicalexaminationid };
                const response = await Servicerequest.getAll(params);
                setCLSData(response.data);
            }
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
    };
    const fetcDetailhServiceRequestData = async (id) => {
        try {
            const response = await Servicerequest.getDetails(id);
            setServicerequestid(id);
            setListCLSData(response.data);
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
    };
    function handleDetailCLS(id) {
        setListCLSData([]);
        fetcDetailhServiceRequestData(id);
        setCreateOrEdit(false);
        setShowModalCLS(false);
        handleShowModelListCLS();
    }
    function handleResultCLS(id) {
        fetchResultCLSData(id);
        setShowModalResultCLS(true);
    }
    function onOpenModalMedicines() {
        fetchRouteData();
        setSearchMedicineData([]);
        fetchwarehouseData();
        fetchPrescription();
        setShowModalshowModalMedicnines(true);
    }
    function generateUsage({ day, morningdose, noondose, afternoondose, eveningdose }) {
        const parts = [];
        if (morningdose) parts.push(`sáng ${morningdose} viên`);
        if (noondose) parts.push(`trưa ${noondose} viên`);
        if (afternoondose) parts.push(`chiều ${afternoondose} viên`);
        if (eveningdose) parts.push(`tối ${eveningdose} viên`);

        if (parts.length === 0) return '';

        return `${day ?? 0} ngày, ngày ${parts.length} lần: ` + parts.join(', ');
    }
    useEffect(() => {
        setMedicineSelected(input => ({
            ...input,
            quantity: (medicineSelected?.day ?? 0) * ((medicineSelected?.morningdose ?? 0) + (medicineSelected?.noondose ?? 0) + (medicineSelected?.afternoondose ?? 0) + (medicineSelected?.eveningdose ?? 0)),
            usageinstructions: generateUsage(medicineSelected)
        }));
    }, [medicineSelected?.day, medicineSelected?.morningdose, medicineSelected?.noondose, medicineSelected?.afternoondose, medicineSelected?.eveningdose])
    function handleAddMedicine(item) {
        if (item.medicineid == null) {
            toast.error("vui lòng chọn thuốc để thêm");
            return;
        }
        if (item.quantity == null || item.quantity <= 0) {
            toast.error("vui nhập số lượng thuốc lớn hơn 0");
            return;
        }
        const check = listMedicineSelected.find(m => m.medicineid == item.medicineid);
        if (check == null) {
            setListMedicineSelected(input => [item, ...input]);
            setMedicineSelected({
                routeid: 1
            });
            setSearchMedicine("");
        } else {
            toast('Thuốc này đã được kê đơn');
        }
    }
    function handleRemoveMedicine(item) {
        const arrayMedicine = listMedicineSelected.filter(m => m.medicineid != item.medicineid)
        setListMedicineSelected(arrayMedicine);
    }
    function handleChangeMedicine(id, e) {
        const { name, value } = e.target;

        setListMedicineSelected(prevItems =>
            prevItems.map(item =>
                item.medicineid == id ? { ...item, [name]: value } : item
            )
        );
    }
    async function handleStorePrescription() {
        try {
            setLoadingStore(true);
            const data = {
                prescriptionid: prescription?.prescriptionid ?? null,
                patientid: prescription?.patient?.patientid ?? null,
                doctoradvice: prescription?.doctoradvice ?? '',
                prescriptiondate: prescription?.prescriptiondate ?? null,
                medicalexaminationid:prescription?.medicalexamination?.medicalexaminationid,
                details: listMedicineSelected.map(item => ({
                    prescriptiondetailid: item.prescriptiondetailid ?? null,
                    medicineid: item.medicineid,
                    quantity: item.quantity,
                    usageinstructions: item.usageinstructions ?? '',
                    warehouseid: item.warehouseid,
                    routeid: item.routeid ?? null
                }))
            };
            const res = await PrescriptionService.create(data);
            toast.success(res.message);
            setListMedicineSelected(res.data?.details);
            setPrescription(input => ({
                ...input,
                prescriptionid: res.data.prescriptionid,
                doctoradvice: res.data?.doctoradvice,
                prescriptiondate: res.data?.prescriptiondate
            }))
            setLoadingStore(false);

        } catch (error) {
            setLoadingStore(false);
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).map((errArray) =>
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    }

    return (
        <>
            {
                showModalshowModalMedicnines && (
                    <>
                        <style>
                            {
                                `
                                .modal-header {
                                    background-color: #0d6efd;
                                    color: white;
                                    padding: 0.5rem 1rem;
                                }

                                .form-label {
                                    font-weight: 500;
                                    margin-bottom: 0;
                                    white-space: nowrap;
                                    align-self: center;
                                }

                                .bg-blue-header {
                                    background-color: #0056b3;
                                    color: white;
                                    font-weight: bold;
                                    padding: 4px 5px;
                                }

                                .form-control:focus,
                                .form-select:focus,
                                .form-control-plaintext:focus {
                                    background-color: #fff9db;
                                    box-shadow: none;
                                    border-color: #86b7fe;
                                }

                                .table-custom th {
                                    background-color: #e9ecef;
                                    font-weight: 600;
                                    text-align: center;
                                    vertical-align: middle;
                                    font-size: 0.8rem;
                                }

                                .table-custom td {
                                    vertical-align: middle;
                                }

                                .footer-actions {
                                    background-color: #e9ecef;
                                    padding: 5px;
                                    border-top: 1px solid #dee2e6;
                                }

                                ::-webkit-scrollbar {
                                    width: 8px;
                                    height: 8px;
                                }

                                ::-webkit-scrollbar-thumb {
                                    background: #adb5bd;
                                    border-radius: 4px;
                                }
                                .search-container {
                                    position: relative;
                                }

                                .suggestion-box {
                                    display: none;
                                    position: absolute;
                                    top: 100%;
                                    left: 0;
                                    width: 900px;
                                    max-height: 400px;
                                    overflow-y: auto;
                                    background: white;
                                    border: 1px solid #999;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                    z-index: 1060;
                                    font-size: 0.8rem;
                                }
                                #txtTenThuoc:focus + .suggestion-box {
                                    display: block;
                                }
                                .suggestion-box:hover {
                                    display: block;
                                }

                                .suggestion-box table th {
                                    background-color: #f0f0f0;
                                    position: sticky;
                                    top: 0;
                                    z-index: 1;
                                    font-weight: 600;
                                    color: #444;
                                }
                                .suggestion-box table tbody tr:hover {
                                    background-color: #d1e7dd;
                                    cursor: pointer;
                                }
                                .suggestion-box table tbody tr.selected {
                                    background-color: #cff4fc;
                                }`
                            }
                        </style>
                        <div
                            className="modal fade show"
                            tabIndex="-1"
                            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                        >
                            <div class="modal-dialog modal-xl modal-fullscreen-lg-down" style={{ maxWidth: '98%' }}>
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title fs-6"><i class="bi bi-prescription"></i> Chỉ định thuốc</h5>
                                        <button type="button" class="btn-close btn-close-white" onClick={() => setShowModalshowModalMedicnines(false)}
                                            aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body p-2 bg-light">
                                        <div class="card mb-2 border-0 shadow-sm">
                                            <div class="card-body p-2">
                                                <div class="row g-1">
                                                    <div class="col-lg-7">
                                                        <div class="row g-1 align-items-center mb-1">
                                                            <div class="col-2"><label class="form-label text-danger">ICD10 (*)</label></div>
                                                            <div class="col-2">
                                                                <input type="text" class="form-control form-control-sm" value={prescription?.medicalexamination?.diseaseid} />
                                                            </div>
                                                            <div class="col-8">
                                                                <input type="text" class="form-control form-control-sm"
                                                                    value={prescription?.medicalexamination?.diseasename} />
                                                            </div>
                                                        </div>
                                                        <div class="row g-1 mb-1">
                                                            <div class="col-2"><label class="form-label">Bệnh Kèm theo</label></div>
                                                            <div class="col-10">
                                                                <textarea class="form-control form-control-sm"
                                                                    rows="2" value={prescription?.medicalexamination?.secondarydiseasenames} readOnly></textarea>
                                                            </div>
                                                        </div>
                                                        <div class="row g-1 align-items-center">
                                                            <div class="col-2"><label class="form-label text-danger">Ngày chỉ định
                                                                (*)</label></div>
                                                            <div class="col-4">
                                                                <input onChange={(e) => setPrescription(input => ({ ...input, prescriptiondate: e.target.value }))} type="datetime-local" class="form-control form-control-sm"
                                                                    value={prescription?.prescriptiondate} />
                                                            </div>
                                                        </div>
                                                        <div class="row g-1 align-items-center mt-1">
                                                            <div class="col-2"><label class="form-label text-danger">Kho thuốc (*)</label>
                                                            </div>
                                                            <div className="col-4">
                                                                <select onChange={(e) => setWarehouseSelected(e.target.value)} value={warehouseSelected} class="form-select form-select-sm">
                                                                    <option value={""}></option>
                                                                    {
                                                                        warehouseData.map(item => {
                                                                            return (
                                                                                <option value={item.warehouseid}>{item.name}</option>
                                                                            );
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-5 ps-lg-3 border-start">
                                                        <div class="row g-1 align-items-center mb-1">
                                                            <div class="col-3"><label class="form-label">Mã BN</label></div>
                                                            <div class="col-9"><input type="text" class="form-control form-control-sm"
                                                                value={prescription?.patient?.patientid} readonly /></div>
                                                        </div>
                                                        <div class="row g-1 align-items-center mb-1">
                                                            <div class="col-3"><label class="form-label">Tên bệnh nhân</label></div>
                                                            <div class="col-9"><input type="text"
                                                                class="form-control form-control-sm fw-bold" value={prescription?.patient?.fullname}
                                                                readonly /></div>
                                                        </div>
                                                        <div class="row g-1 align-items-center mb-1">
                                                            <div class="col-3"><label class="form-label">Ngày sinh sinh / GT</label></div>
                                                            <div class="col-5"><input type="text" class="form-control form-control-sm"
                                                                value={new Date(prescription?.patient?.dateofbirth).toLocaleString("vi-vn")} readonly /></div>
                                                            <div class="col-4"><input type="text" class="form-control form-control-sm"
                                                                value="Nam" readonly /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row g-1 mt-1">
                                                    <div class=""><label class="form-label">Lời dặn bác sỹ</label></div>
                                                    <div class="col-lg-12">
                                                        <textarea value={prescription?.doctoradvice} onChange={(e) => setPrescription(input => ({ ...input, doctoradvice: e.target.value }))} class="form-control form-control-sm"
                                                            rows="2" ></textarea>
                                                    </div>
                                                </div>
                                                {/* <div class="row g-1 mt-1 align-items-center">
                                                    <div class="col-auto">
                                                        <input class="form-check-input" type="checkbox" id="searchByName" />
                                                        <label class="form-check-label small" for="searchByName">Chỉ tìm theo tên
                                                            thuốc</label>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div class="container-fluid p-0 mb-3">
                                            <div class="row g-0 bg-blue-header text-center small">
                                                <div class="col-3 text-start ps-2">Tên thuốc/ tên hoạt chất (*)</div>
                                                <div class="col-1">Đường dùng (*)</div>
                                                <div class="col-1">S.ngày (*)</div>
                                                <div class="col-3">
                                                    <div class="row g-0">
                                                        <div class="col-3">Sáng</div>
                                                        <div class="col-3">Trưa</div>
                                                        <div class="col-3">Chiều</div>
                                                        <div class="col-3">Tối</div>
                                                    </div>
                                                </div>
                                                <div class="col-1">SL (*)</div>
                                                <div class="col-3 text-start ps-2">Cách dùng (*)</div>
                                            </div>
                                            <div class="row g-0 p-1 bg-white border border-top-0 align-items-center">
                                                <div class="col-3 pe-1 search-container">
                                                    <input value={searchMedicine} type="text" id="txtTenThuoc"
                                                        class="form-control form-control-sm bg-warning-subtle"
                                                        placeholder="Nhập tên thuốc (gõ 'amo')..." autocomplete="off"
                                                        onChange={(e) => onChangeSearchMedicine(e.target.value)}
                                                        onKeyDown={(e) => handleEnterSearchMedicine(e)}
                                                        onFocus={() => setShowMedicineSearch(true)}
                                                    />
                                                    {
                                                        searchMedicineData.length !== 0 && showMedicineSearch && (
                                                            <div class="suggestion-box" id="drugSuggestionBox">
                                                                <table class="table table-sm table-bordered mb-0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Tên thuốc</th>
                                                                            <th>Hoạt chất</th>
                                                                            <th>Mã thuốc</th>
                                                                            <th>SL khả dụng</th>
                                                                            <th>Kho thuốc</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            searchMedicineData.map(item => {
                                                                                return (
                                                                                    <tr key={`m-${item.medicineid}`}
                                                                                        onClick={() => {
                                                                                            setSearchMedicineData([item]);
                                                                                            setShowMedicineSearch(false);
                                                                                            setMedicineSelected({
                                                                                                medicineid: item.medicineid,
                                                                                                medicine: item,
                                                                                                warehouseid: item.warehouse.warehouseid,
                                                                                                routeid: 1
                                                                                            });
                                                                                            setSearchMedicine(item.name)
                                                                                        }}>
                                                                                        <td class="fw-bold">{item.name}</td>
                                                                                        <td>{item.activeingredients}</td>
                                                                                        <td>{item.medicineid}</td>
                                                                                        <td>{item.totalstockquantity}</td>
                                                                                        <td>{item.warehouse?.warehousename}</td>
                                                                                    </tr>
                                                                                );
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div class="col-1 pe-1">
                                                    <select value={medicineSelected?.routeid}
                                                        onChange={(e) => {
                                                            setMedicineSelected(input => ({
                                                                ...input,
                                                                routeid: e.target.value
                                                            }))
                                                        }}
                                                        class="form-select form-select-sm">
                                                        <option value={""}>Chọn đường dùng</option>
                                                        {
                                                            routeData.map(item => {
                                                                return (
                                                                    <option value={item.routeid}>{item.name}</option>
                                                                );
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div class="col-1 pe-1">
                                                    <input type="number" min="0" value={medicineSelected?.day ?? 0}
                                                        onChange={(e) => setMedicineSelected(input => ({
                                                            ...input,
                                                            day: Number(e.target.value)
                                                        }))}
                                                        class="form-control form-control-sm text-center" />
                                                </div>
                                                <div class="col-3 pe-1">
                                                    <div class="row g-1">
                                                        <div class="col-3">
                                                            <input value={medicineSelected?.morningdose ?? 0}
                                                                onChange={(e) => setMedicineSelected(input => ({
                                                                    ...input,
                                                                    morningdose: Number(e.target.value)
                                                                }))}
                                                                type="number" min="0"
                                                                class="form-control form-control-sm text-center" />
                                                        </div>
                                                        <div class="col-3">
                                                            <input value={medicineSelected?.noondose ?? 0}
                                                                onChange={(e) => setMedicineSelected(input => ({
                                                                    ...input,
                                                                    noondose: Number(e.target.value)
                                                                }))}
                                                                type="number" min="0"
                                                                class="form-control form-control-sm text-center" />
                                                        </div>
                                                        <div class="col-3">
                                                            <input value={medicineSelected?.afternoondose ?? 0}
                                                                onChange={(e) => setMedicineSelected(input => ({
                                                                    ...input,
                                                                    afternoondose: Number(e.target.value)
                                                                }))}
                                                                type="number" min="0"
                                                                class="form-control form-control-sm text-center" />
                                                        </div>
                                                        <div class="col-3"><input value={medicineSelected?.eveningdose ?? 0}
                                                            onChange={(e) => setMedicineSelected(input => ({
                                                                ...input,
                                                                eveningdose: Number(e.target.value)
                                                            }))}
                                                            type="number" min="0"
                                                            class="form-control form-control-sm text-center" /></div>
                                                    </div>
                                                </div>
                                                <div className="col-1 pe-1 d-flex">
                                                    <input onChange={(e) => setMedicineSelected(input => ({
                                                        ...input,
                                                        quantity: Number(e.target.value)
                                                    }))} value={medicineSelected?.quantity ?? 0} type="number" min="0" className="form-control form-control-sm me-1" placeholder="tg" />
                                                </div>
                                                <div class="col-3">
                                                    <input onChange={(e) => setMedicineSelected(input => ({
                                                        ...input,
                                                        usageinstructions: e.target.value
                                                    }))}
                                                        value={medicineSelected?.usageinstructions} type="text" class="form-control form-control-sm" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="table-responsive bg-white border" style={{ minHeight: '200px' }}>
                                            <table class="table table-sm table-bordered table-striped table-hover table-custom mb-0">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '3%' }}>#</th>
                                                        <th style={{ width: '20%' }} >Tên thuốc</th>
                                                        <th style={{ width: '25%' }} >Hoạt chất</th>
                                                        <th style={{ width: '10%' }}>Đường dùng</th>
                                                        <th style={{ width: '5%' }} >SL</th>
                                                        <th>Cách dùng</th>
                                                        <th style={{ width: '5%' }} ></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        listMedicineSelected.map((item, idx) => {
                                                            return (
                                                                <tr key={`mdicineSelected-${item.medicineid}`}>
                                                                    <td class="text-center">{idx + 1}</td>
                                                                    <td class="fw-bold">{item.medicine.name}</td>
                                                                    <td>{item.medicine.activeingredients}</td>
                                                                    <td class="text-center">
                                                                        <select name="routeid" onChange={(e) => handleChangeMedicine(item.medicineid, e)} value={item?.routeid} className="form-select">
                                                                            <option >Chọn đường dùng</option>
                                                                            {
                                                                                routeData.map(item => {
                                                                                    return (
                                                                                        <option value={item.routeid}>{item.name}</option>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </select>
                                                                    </td>
                                                                    <td class="text-center fw-bold px-2"><input type="number" name="quantity" onChange={(e) => handleChangeMedicine(item.medicineid, e)} class="form-control-plaintext" value={item.quantity} /></td>
                                                                    <td class="px-2"><input type="text" name="usageinstructions" onChange={(e) => handleChangeMedicine(item.medicineid, e)} class="form-control-plaintext" value={item.usageinstructions} /></td>
                                                                    <td class="text-center">
                                                                        <i onClick={() => handleRemoveMedicine(item)} style={{ cursor: 'pointer' }} class="bi bi-trash text-danger cursor-pointer"></i>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                    <div class="modal-footer justify-content-between footer-actions">
                                        <div class="d-flex gap-1">
                                            <button type="button" class="btn btn-primary btn-sm" onClick={() => handleAddMedicine(medicineSelected)}><i class="bi bi-plus-lg" ></i> Thêm
                                                thuốc</button>
                                            <button type="button" class="btn btn-primary btn-sm" onClick={handleStorePrescription}><i class="bi bi-save"></i> {loadingStore ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Lưu")}</button>
                                            <button type="button" class="btn btn-primary btn-sm" onClick={(e)=>{setShowModalshowModalMedicnines(false);onOpenModalDisposition()}}><i class="bi bi-gear"></i> Xử trí</button>
                                            {
                                                prescription?.prescriptionid!=null&&(
                                                    <button type="button" class="btn btn-primary btn-sm" onClick={(e)=>{window.open(`/His/Print/Prescription/${prescription?.prescriptionid}`, "_blank", "noopener,noreferrer");}}><i class="bi bi-gear"></i> In đơn thuốc</button>
                                                )
                                            }
                                        </div>

                                        <div class="d-flex gap-2 align-items-center">
                                            <button type="button" class="btn btn-secondary btn-sm" onClick={() => setShowModalshowModalMedicnines(false)}><i
                                                class="bi bi-x-circle"></i> Đóng</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>

                )
            }
            {
                showModalHandleDisposition && (
                    <div
                        className="modal fade show"
                        id="clinicModal"
                        tabIndex="-1"
                        style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                    >
                        <div
                            className="modal-dialog"
                            style={{ minWidth: "70vw" }}
                        >
                            <div className="modal-content text-white">
                                <div className="modal-header border-0 bg-primary">
                                    <h5 className="modal-title fw-bold">
                                        Xử trí
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowModalHandleDisposition(false)}
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="card-body row g-3">
                                        <div className="col-12">
                                            <label className="form-label fw-semibold text-dark">Chuẩn đoán ban đầu</label>
                                            <textarea
                                                className="form-control form-control-sm border-primary"
                                                name="diagnosis"
                                                value={medicalexamData.diagnosis}
                                                onInput={handleChangeInput}
                                            ></textarea>
                                        </div>

                                        <div className="col-md-6 ">
                                            <label className="form-label fw-semibold text-dark">Bệnh chính</label>
                                            <Select
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    control: base => ({ ...base, backgroundColor: "white", color: "black" }),
                                                    input: base => ({ ...base, color: "black" }),
                                                    singleValue: base => ({ ...base, color: "black" }),
                                                    multiValueLabel: base => ({ ...base, color: "black" }),
                                                    option: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: state.isSelected ? "#0d6efd" : "white",
                                                        color: state.isSelected ? "white" : "black",
                                                    }),
                                                }}
                                                options={diseaseData}
                                                value={diseaseData.find(
                                                    (opt) => opt.value === medicalexamData.diseaseid
                                                )}
                                                onChange={(selected) =>
                                                    setMedicalexamData((input) => ({
                                                        ...input,
                                                        diseaseid: selected?.value || "",
                                                        diseasename: selected ? `[${selected.value}]-${selected.label}` : ""
                                                    }))
                                                }
                                                placeholder="-- Chọn bệnh --"
                                                isSearchable
                                                isClearable

                                            >
                                            </Select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-dark">Tên bệnh</label>
                                            <input
                                                className="form-control border-primary"
                                                type="text"
                                                name="diseasename"
                                                value={medicalexamData.diseasename}
                                                onInput={handleChangeInput}
                                            />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <label className="form-label fw-semibold text-dark">Bệnh phụ</label>
                                            <Select
                                                isMulti
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    control: base => ({ ...base, backgroundColor: "white", color: "black" }),
                                                    input: base => ({ ...base, color: "black" }),
                                                    singleValue: base => ({ ...base, color: "black" }),
                                                    multiValueLabel: base => ({ ...base, color: "black" }),
                                                    option: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: state.isSelected ? "#0d6efd" : "white",
                                                        color: state.isSelected ? "white" : "black",
                                                    }),
                                                }}
                                                options={diseaseData}
                                                value={diseaseData.filter(opt => diseaseIds.includes(opt.value))}
                                                onChange={(selected) => {
                                                    const did = [];
                                                    const secondarydiseasenames = selected
                                                        .map(item => {
                                                            did.push(item.value);
                                                            return `[${item.value}]-${item.label}`;
                                                        })
                                                        .join(", ");
                                                    setMedicalexamData((input) => ({
                                                        ...input,
                                                        secondarydiseasenames: secondarydiseasenames
                                                    }))
                                                    setDiseaseIds(did);
                                                }
                                                }
                                                placeholder="-- Chọn bệnh --"
                                                isSearchable
                                                isClearable
                                                closeMenuOnSelect={false}
                                            >
                                            </Select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-dark">Tên bệnh</label>
                                            <textarea
                                                className="form-control border-primary"
                                                type="text"
                                                name="secondarydiseasenames"
                                                value={medicalexamData.secondarydiseasenames}
                                                onInput={handleChangeInput}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="col-md-6 ">
                                            <label className="form-label fw-semibold text-dark">Loại xử trí</label>
                                            <Select
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                    control: base => ({ ...base, backgroundColor: "white", color: "black" }),
                                                    input: base => ({ ...base, color: "black" }),
                                                    singleValue: base => ({ ...base, color: "black" }),
                                                    multiValueLabel: base => ({ ...base, color: "black" }),
                                                    option: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: state.isSelected ? "#0d6efd" : "white",
                                                        color: state.isSelected ? "white" : "black",
                                                    }),
                                                }}
                                                options={dispositionData}
                                                value={dispositionData.filter((opt) => opt.value === medicalexamData.dispositionid)}
                                                onChange={(selected) =>
                                                    setMedicalexamData((input) => ({
                                                        ...input,
                                                        dispositionid: selected?.value || "",
                                                    }))
                                                }
                                                placeholder="-- Chọn xử trí --"
                                                isSearchable
                                                isClearable
                                            >
                                            </Select>
                                        </div>
                                        <div className="col-12">
                                            <button disabled={loadingDispositionSave} className="btn btn-sm btn-primary" onClick={handleDispositionSave}>{loadingDispositionSave ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Lưu")}</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer border-0">
                                    <button
                                        className="btn btn-light"
                                        onClick={() => setShowModalHandleDisposition(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <ModalListCLS
                show={showModalListCLS}
                onClose={() => { setShowModalListCLS(false); setShowModalCLS(true) }}
                serviceData={serviceData}
                listCLSData={listCLSData}
                handleAddCLS={handleAddCLS}
                handleRemoveCLS={handleRemoveCLS}
                createOrEdit={createOrEdit}
                postDataCLS={postDataCLS}
                updateDataCLS={updateDataCLS}
                loadingpost={false}
                handleResultCLS={handleResultCLS}
            />
            <ModalCLSRequest
                show={showModalCLS}
                onClose={() => setShowModalCLS(false)}
                clsData={clsData}
                handleCreateCLS={handleCreateCLS}
                handleDetailCLS={handleDetailCLS}
            />
            <ModalResultCLS
                show={showModalResultCLS}
                ResultCLSData={resultCLSData}
                onClose={() => { setShowModalListCLS(true); setShowModalResultCLS(false) }}
                loading={loadingResultCLS}
            />
            <div class="card shadow-sm">
                <div class="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                            <Link to="/His/Medicalexam" className="btn btn-primary me-3">
                                <i className="fa-solid fa-left-long"></i>
                            </Link>
                            <h4 class="card-title">Khám bệnh</h4>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3 border-end">
                            <div class="d-flex">
                                <div class="me-3">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${medicalexamData.patient?.patientid}`} alt="QR Code" />
                                </div>
                                <div>
                                    <p class="mb-1"><strong>Mã BN:</strong> {medicalexamData.patient?.patientid ?? "-"}</p>
                                    <p class="mb-1 text-danger"><strong>Họ Tên:</strong> {medicalexamData.patient?.fullname ?? "-"}</p>
                                    <p class="mb-1"><strong>Ngày sinh:</strong> {medicalexamData.patient?.dateofbirth ?? "-"}</p>
                                    <p class="mb-0"><strong>GT:</strong> {medicalexamData.patient?.gender ? "Nam" : "Nữ"} &nbsp;&nbsp; <strong>Tuổi:</strong> 22 tuổi</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-9 text-start">
                            <div className="d-flex" style={{ gap: '8px' }}>
                                {
                                    medicalexamData.outpatientregistration?.examinationstatus == 2 && (<button class="btn btn-sm btn-primary" onClick={handleMedicalexamSave} disabled={loading || loadingDisease || medicalexamData.outpatientregistration?.examinationstatus == 3 || loadingSave}>{loadingSave ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Lưu")}</button>)
                                }
                                {
                                    medicalexamData.outpatientregistration?.examinationstatus == 1 && (<button disabled={loadingEndOrStaart} class="btn btn-sm btn-success" onClick={() => handleMedicalexamStart(medicalexamData.patient?.fullname ?? "-")}>{loadingEndOrStaart ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Bắt đầu khám")}</button>)
                                }
                                {
                                    medicalexamData.outpatientregistration?.examinationstatus == 2 && (<button disabled={loadingEndOrStaart} class="btn btn-sm btn-danger" onClick={() => handleMedicalexamEnd(medicalexamData.patient?.fullname ?? "-")}>{loadingEndOrStaart ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Kết thúc khám")}</button>)
                                }
                                {
                                    medicalexamData.outpatientregistration?.examinationstatus == 2 && (<button class="btn btn-sm btn-primary" onClick={onOpenModalDisposition}>Xử trí</button>)
                                }
                                {
                                    medicalexamData.outpatientregistration?.examinationstatus !=1 && (<button class="btn btn-sm btn-primary" onClick={onOpenModalMedicines}>Cấp thuốc</button>)
                                }
                                <button class="btn btn-sm btn-primary" onClick={() => handleSpeak(medicalexamData.patient?.fullname, medicalexamData.outpatientclinic?.name, medicalexamData.outpatientregistration?.queueorder)} disabled={!loading && speaking}>GỌI KHÁM</button>
                                <button class="btn btn-sm btn-primary" disabled={loading}>IN PHIẾU</button>
                                {
                                    medicalexamData.outpatientregistration?.examinationstatus >= 2 && (<button class="btn btn-sm btn-primary" onClick={handleShowModelCLS}>Chỉ định CLS</button>)
                                }
                            </div>
                            <div class="p-3 rounded mt-2" style={{ backgroundColor: '#EBE9FA' }}>
                                <div class="row" style={{ color: '#726FE4' }}>
                                    <div class="col-md-4">
                                        <p><strong><i class="fa-solid fa-house"></i> {medicalexamData.outpatientclinic?.name ?? "-"}</strong></p>
                                        <p><strong><i class="fa-solid fa-stethoscope"></i> {medicalexamData.doctor?.stafftype?.code ?? "-"}. {medicalexamData.doctor?.fullname ?? "-"}</strong></p>
                                    </div>
                                    <div class="col-md-4">
                                        <p><strong>Bắt đầu:</strong> {medicalexamData.examinationstarttime ? new Date(medicalexamData.examinationstarttime).toLocaleDateString('vi-VN') : "-"}</p>
                                        <p><strong>Kết thúc:</strong> {medicalexamData.examinationendtime ? new Date(medicalexamData.examinationendtime).toLocaleDateString('vi-VN') : "-"}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p><strong>Bệnh chính:</strong> {medicalexamData.diseasename ?? "-"}</p>
                                        <p><strong>Bệnh phụ:</strong>{medicalexamData.secondarydiseasenames ?? "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mb-3">

                        <ul className="nav nav-tabs mt-3" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "exam" ? "active text-dark fw-bold" : ""}`}
                                    type="button"
                                    onClick={() => setActiveTab("exam")}
                                >
                                    Khám bệnh
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${activeTab === "history" ? "active text-dark fw-bold" : ""}`}
                                    type="button"
                                    onClick={handleShowHistoryExam}
                                >
                                    Lịch sử khám bệnh
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="tab-content">
                        {activeTab === "exam" && (
                            <div className="tab-pane fade show active">
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="card shadow-sm mb-0">
                                        <div className="card-header bg-light border-bottom fw-bold text-dark">
                                            Khám và chỉ số sinh tồn
                                        </div>
                                        <div className="card-body row g-3">
                                            <div className="col-md-2">
                                                <label className="form-label fw-semibold text-dark">Mạch (lần/phút)</label>
                                                <input
                                                    className="form-control form-control-sm border-primary"
                                                    type="text"
                                                    name="heartrate"
                                                    value={medicalexamData.heartrate}
                                                    onInput={handleChangeInput}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label className="form-label fw-semibold text-dark">Nhiệt độ (°C)</label>
                                                <input
                                                    className="form-control form-control-sm border-primary"
                                                    type="text"
                                                    name="temperature"
                                                    value={medicalexamData.temperature}
                                                    onInput={handleChangeInput}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label className="form-label fw-semibold text-dark">Huyết áp (mmHg)</label>
                                                <input
                                                    className="form-control form-control-sm border-primary"
                                                    type="text"
                                                    name="bloodpressure"
                                                    value={medicalexamData.bloodpressure}
                                                    onInput={handleChangeInput}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label className="form-label fw-semibold text-dark">Cân nặng (Kg)</label>
                                                <input
                                                    className="form-control form-control-sm border-primary"
                                                    type="text"
                                                    name="weight"
                                                    value={medicalexamData.weight}
                                                    onInput={handleChangeInput}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label className="form-label fw-semibold text-dark">Chiều cao (Cm)</label>
                                                <input
                                                    className="form-control form-control-sm border-primary"
                                                    type="text"
                                                    name="height"
                                                    value={medicalexamData.height}
                                                    onInput={handleChangeInput}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label className="form-label fw-semibold text-dark">BMI</label>
                                                <div
                                                    className={`form-control form-control-sm fw-bold ${medicalexamData.bmi == null
                                                        ? ""
                                                        : medicalexamData.bmi < 18.5
                                                            ? "bg-warning text-dark"
                                                            : medicalexamData.bmi < 25
                                                                ? "bg-success text-white"
                                                                : medicalexamData.bmi < 30
                                                                    ? "bg-warning text-dark"
                                                                    : "bg-danger text-white"
                                                        }`}

                                                >
                                                    {medicalexamData.bmi ? medicalexamData.bmi.toFixed(1) : "-"}
                                                </div>

                                                {medicalexamData.bmi && (
                                                    <small className="fw-semibold mt-1 d-block">
                                                        {medicalexamData.bmi < 18.5
                                                            ? "Thiếu cân"
                                                            : medicalexamData.bmi < 25
                                                                ? "Bình thường"
                                                                : medicalexamData.bmi < 30
                                                                    ? "Thừa cân"
                                                                    : "Béo phì"}
                                                    </small>
                                                )}
                                            </div>


                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold text-dark">Khám toàn thân</label>
                                                <textarea
                                                    className="form-control form-control-sm border-primary"
                                                    name="generalexam"
                                                    value={medicalexamData.generalexam}
                                                    onInput={handleChangeInput}
                                                ></textarea>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold text-dark">Khám bộ phận</label>
                                                <textarea
                                                    className="form-control form-control-sm border-primary"
                                                    name="bodypartexam"
                                                    value={medicalexamData.bodypartexam}
                                                    onInput={handleChangeInput}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header bg-light border-bottom fw-bold text-primary">
                                            Chuẩn đoán
                                        </div>
                                        <div className="card-body row g-3">
                                            <div className="col-12">
                                                <label className="form-label fw-semibold text-dark">Chuẩn đoán ban đầu</label>
                                                <textarea
                                                    className="form-control form-control-sm border-primary"
                                                    name="diagnosis"
                                                    value={medicalexamData.diagnosis}
                                                    onInput={handleChangeInput}
                                                ></textarea>
                                            </div>
                                            {/* <div className="col-md-6">
                                                <label className="form-label fw-semibold text-dark">Bệnh</label>
                                                <select data-live-search="true"
                                                    className="selectpicker form-select form-select-sm border-primary"
                                                    name="diseaseid"
                                                    value={medicalexamData.diseaseid}
                                                    onInput={handleChangeInput}
                                                >
                                                    <option value="">-- Chọn bệnh --</option>
                                                    {
                                                        diseaseData.map(item => {
                                                            return (
                                                                <option value={item.diseaseid}>{item.diseasename}</option>
                                                            );
                                                        })
                                                    }
                                                </select>
                                            </div> */}
                                            <div className="col-md-6 ">
                                                <label className="form-label fw-semibold text-dark">Bệnh chính</label>
                                                <Select
                                                    classNames={{
                                                        control: () => "border-primary",
                                                    }}
                                                    options={diseaseData}
                                                    value={diseaseData.find(
                                                        (opt) => opt.value === medicalexamData.diseaseid
                                                    )}
                                                    onChange={(selected) =>
                                                        setMedicalexamData((input) => ({
                                                            ...input,
                                                            diseaseid: selected?.value || "",
                                                            diseasename: selected ? `[${selected.value}]-${selected.label}` : ""
                                                        }))
                                                    }
                                                    placeholder="-- Chọn bệnh --"
                                                    isSearchable
                                                    isClearable
                                                    menuPortalTarget={document.body}
                                                    menuPosition="fixed"
                                                >
                                                </Select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold text-dark">Tên bệnh</label>
                                                <input
                                                    className="form-control border-primary"
                                                    type="text"
                                                    name="diseasename"
                                                    value={medicalexamData.diseasename}
                                                    onInput={handleChangeInput}
                                                />
                                            </div>
                                            <div className="col-md-6 ">
                                                <label className="form-label fw-semibold text-dark">Bệnh phụ</label>
                                                <Select
                                                    isMulti
                                                    classNames={{
                                                        control: () => "border-primary",
                                                    }}
                                                    options={diseaseData}
                                                    value={diseaseData.filter(opt => diseaseIds.includes(opt.value))}
                                                    onChange={(selected) => {
                                                        const did = [];
                                                        const secondarydiseasenames = selected
                                                            .map(item => {
                                                                did.push(item.value);
                                                                return `[${item.value}]-${item.label}`;
                                                            })
                                                            .join(", ");
                                                        setMedicalexamData((input) => ({
                                                            ...input,
                                                            secondarydiseasenames: secondarydiseasenames
                                                        }))
                                                        setDiseaseIds(did);
                                                    }
                                                    }
                                                    placeholder="-- Chọn bệnh --"
                                                    isSearchable
                                                    isClearable
                                                    menuPortalTarget={document.body}
                                                    menuPosition="fixed"
                                                    closeMenuOnSelect={false}
                                                >
                                                </Select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold text-dark">Tên bệnh</label>
                                                <textarea
                                                    className="form-control border-primary"
                                                    type="text"
                                                    name="secondarydiseasenames"
                                                    value={medicalexamData.secondarydiseasenames}
                                                    onInput={handleChangeInput}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="text-start mb-5">
                                        <button type="button" className="btn btn-outline-primary me-2">
                                            Xử trí
                                        </button>
                                        <button type="button" className="btn btn-outline-primary me-2">
                                            Chỉ định CLS
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Lưu
                                        </button>
                                    </div> */}
                                </form>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="tab-pane fade show active">
                                <div className="card shadow-sm mt-3">
                                    <div className="card-header bg-light border-bottom fw-bold text-primary">
                                        Lịch sử khám bệnh
                                    </div>
                                    <div className="card-body">
                                        <table className="table table-bordered table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Thời gian bắt đầu khám</th>
                                                    <th>Thời gian kết thúc khám bệnh</th>
                                                    <th>Chuẩn đoán</th>
                                                    <th>Bác sĩ</th>
                                                    <th>Phòng khám</th>
                                                    <th>Xử trí</th>
                                                    <th>Chức năng</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    listMedicalexamData.map(item => {
                                                        return (
                                                            <tr key={1}>
                                                                <td>{new Date(item.examinationstarttime).toLocaleString('vi-VN')}</td>
                                                                <td>{new Date(item.examinationendtime).toLocaleString('vi-VN')}</td>
                                                                <td>{item.disease?.diseasename}</td>
                                                                <td>{item.doctor?.name}</td>
                                                                <td>{item.outpatientclinic?.name}</td>
                                                                <td>{item.disposition?.name}</td>
                                                                <td>
                                                                    <a
                                                                        target="_blank"
                                                                        href={`/His/Medicalexam/Detail/${item.medicalexaminationid}`}
                                                                        className="btn btn-primary btn-sm"
                                                                    >
                                                                        <i className="fa-solid fa-play"></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* {
                        loading ? (
                            <div class="d-flex justify-content-center w-100 mb-3">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                
                            </>
                        )
                    } */}
                </div>
            </div>
        </>

    );
}