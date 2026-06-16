import Medicalexam from "../../../services/his/MedicalexamService";
import Servicerequest from "../../../services/his/ServicerequestService";
import Servicerequestdetail from "../../../services/his/ServicerequestdetailService";
import Disease from "../../../services/DiseaseService";
import Service from "../../../services/ServiceService";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import Select from "react-select";
import toast from "react-hot-toast";
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
export default function MedicalexamDetail() {
    const mysal = withReactContent(swal);
    const { id } = useParams();
    const [medicalexamData, setMedicalexamData] = useState({});
    const [listMedicalexamData, setListMedicalexamData] = useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [loadingEndOrStaart, setLoadingEndOrStaart] = useState(false);
    const [loadingDisease, setLoadingDisease] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [diseaseData, setDiseaseData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [speaking, setSpeaking] = useState(false);
    const [showModalListCLS, setShowModalListCLS] = useState(false);
    const [showModalCLS, setShowModalCLS] = useState(false);
    const [listCLSData, setListCLSData] = useState([]);
    const [clsData, setCLSData] = useState([]);
    const [createOrEdit, setCreateOrEdit] = useState(true);
    const [loadingpost, setLoadingpost] = useState(false);
    const [servicerequestid, setServicerequestid] = useState(null);
    const [activeTab, setActiveTab] = useState("exam");

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
            console.error("check data:", res.data);
            setLoading(false);
        } catch (error) {
            toast.error("Lỗi khi lấy dữ liệu")
        }
    }
    async function fetchListMedicalexamData(id) {
        try {
            const params={
                patientid:medicalexamData.patient?.patientid
            }
            const res = await Medicalexam.getAll(params);
            setListMedicalexamData(res.data);
        } catch (error) {
            toast.error("Lỗi khi lấy dữ liệu")
        }
    }
    useEffect(() => {
        fetchDiseaseData();
        fetchMedicalexamData(id);
    }, [location]);

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
            console.log("check data log: ", medicalexamData);
            setLoadingSave(true);
            const res = await Medicalexam.update(medicalexamData, id);
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
        fetchListMedicalexamData(medicalexamData.patient?.patientid );
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
            doctorid: medicalexamData.doctor?.doctorid,
            details: listCLSData.map(item => {
                return {
                    serviceid: item.service?.serviceid,
                    outpatientclinicid: item.service?.outpatientclinic?.outpatientclinicid
                }
            })
        }
        try {
            const response = await Servicerequest.create(datacls);
            setListCLSData(response.data);
            setServicerequestid(response.servicerequestid);
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
    async function updateDataCLS(e) {
        setLoadingpost(true);
        e.preventDefault();
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
        fetcDetailhServiceRequestData(id);
        setCreateOrEdit(false);
        setShowModalCLS(false);
        handleShowModelListCLS();
    }
    return (
        <>
            {showModalListCLS && (
                <div
                    className="modal fade show"
                    id="clinicModal"
                    tabIndex="-1"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div
                        className={`modal-dialog modal-fullscreen`}

                    >
                        <div className="modal-content text-white ">
                            <div className="modal-header border-0 bg-primary">
                                <h5 className="modal-title fw-bold">Chỉ định cận lâm sàng </h5>


                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModalListCLS(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <div class="card mb-0">
                                            <div class="card-header bg-primary text-white py-1 small">
                                                Danh sách dịch vụ
                                            </div>
                                            <div class="list-group list-group-flush" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                                {
                                                    serviceData.map((item, idx) => {
                                                        return (
                                                            <>
                                                                <div class="d-flex align-items-center list-group-item py-1" style={{ cursor: 'pointer' }} data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`}>
                                                                    <span class="me-2 badge bg-secondary rounded-pill icon-toggle">+</span>
                                                                    <span>{item.name} (Mã / Tên / Giá)</span>
                                                                </div>
                                                                <div class="collapse ps-4" id={`collapse${idx}`}>
                                                                    <table class="table table-sm table-bordered table-hover mb-0" id="selectedTable">
                                                                        <tbody>
                                                                            {
                                                                                item.services.map(item1 => {
                                                                                    return (
                                                                                        <tr onClick={() => handleAddCLS(item1.serviceid)}>
                                                                                            <td>{item1.serviceid}</td>
                                                                                            <td>{item1.name}</td>
                                                                                            <td>{item1.price}</td>
                                                                                        </tr>
                                                                                    );
                                                                                })
                                                                            }

                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-8 mb-3">
                                        <div class="card mb-0">
                                            <div class="card-header bg-primary text-white py-1 small">
                                                Dịch vụ đã chọn
                                            </div>
                                            <div class="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                                <table class="table table-sm table-bordered table-hover mb-0" id="selectedTable">
                                                    <thead class="small">
                                                        <tr>
                                                            <th>Mã</th>
                                                            <th>Tên</th>
                                                            <th>Giá</th>
                                                            <th>Phòng</th>
                                                            <th>Trạng thái</th>
                                                            <th>Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            listCLSData.map(item => {
                                                                return (
                                                                    <tr>
                                                                        <td>{item.service.serviceid}</td>
                                                                        <td>{item.service.name}</td>
                                                                        <td>{item.service.price}</td>
                                                                        <td>
                                                                            <select class="form-select form-select-sm">
                                                                                <option>{item.service?.outpatientclinic?.name}</option>
                                                                            </select>
                                                                        </td>
                                                                        {/* <td>
                                                                            <input type="text" class="form-control form-control-sm" placeholder="Ghi chú" />
                                                                        </td> */}
                                                                        <td>
                                                                            {
                                                                                item.status == 0 ? (<span class="badge text-bg-warning">Đang chờ</span>) :
                                                                                    item.status == 1 ? (<span class="badge text-bg-danger">Đang xử lý</span>) :
                                                                                        item.status == 2 ? (<span class="badge text-bg-success">Hoàn thành</span>) :
                                                                                            (<span class="badge text-bg-secondary">Bản nháp</span>)
                                                                            }
                                                                        </td>
                                                                        <td style={{ minWidth: '40px', maxWidth: '40px' }}>
                                                                            <button class="btn btn-sm btn-outline-primary me-2"><i class="fa-solid fa-eye"></i></button>
                                                                            <button class="btn btn-sm btn-outline-danger me-2" onClick={() => handleRemoveCLS(item.service.serviceid)}> <i class="fa-solid fa-trash"></i></button>
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
                                </div>
                            </div>

                            <div className="modal-footer border-0">
                                <button
                                    className="btn btn-light"
                                    onClick={() => setShowModalListCLS(false)}
                                >
                                    Đóng
                                </button>
                                <button disabled={loadingpost} className="btn btn-dark" onClick={createOrEdit ? postDataCLS : updateDataCLS}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModalCLS && (
                <div
                    className="modal fade show"
                    id="clinicModal"
                    tabIndex="-1"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div
                        className={`modal-dialog`}
                        style={{ minWidth: '70vw' }}

                    >
                        <div className="modal-content text-white ">
                            <div className="modal-header border-0 bg-primary">
                                <h5 className="modal-title fw-bold">Danh sách phiếu chỉ dịnh cận lâm sàng</h5>


                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModalCLS(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <button class="btn btn-primary btn-sm" onClick={handleCreateCLS}>
                                        + Tạo Phiếu Chỉ Định
                                    </button>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th scope="col">Mã Phiếu</th>
                                                <th scope="col">Mã Khám Bệnh</th>
                                                <th scope="col">Bác Sĩ chỉ định</th>
                                                <th scope="col">Bệnh Nhân</th>
                                                <th scope="col">Thời Gian Yêu Cầu</th>
                                                <th scope="col" class="text-center">Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clsData.length === 0 ?
                                                (<td colSpan="6" className="text-center text-muted small py-2">
                                                    <i className="bi bi-inbox fs-1 text-primary d-block"></i>
                                                    Chưa có phiếu chỉ định nào
                                                </td>
                                                ) :
                                                (
                                                    clsData.map(item => {
                                                        return (
                                                            <tr>
                                                                <td>{item.servicerequestid}</td>
                                                                <td>{item.medicalexaminationid}</td>
                                                                <td>BS. {item.doctor?.fullname}</td>
                                                                <td>{item.patient?.fullname}</td>
                                                                <td>{new Date(item.requesttime).toLocaleString("vi-VN")}</td>
                                                                <td class="text-center">
                                                                    <button onClick={() => handleDetailCLS(item.servicerequestid)} class="btn btn-sm btn-outline-primary">Chi Tiết</button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="modal-footer border-0">
                                <button
                                    className="btn btn-light"
                                    onClick={() => setShowModalCLS(false)}
                                >
                                    Đóng
                                </button>
                                <button className="btn btn-dark" >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                <button class="btn btn-sm btn-info" onClick={() => handleSpeak(medicalexamData.patient?.fullname, medicalexamData.outpatientclinic?.name, medicalexamData.outpatientregistration?.queueorder)} disabled={!loading && speaking}>GỌI KHÁM</button>
                                <button class="btn btn-sm btn-outline-primary" disabled={loading}>IN PHIẾU</button>
                                {
                                    medicalexamData.outpatientregistration?.examinationstatus == 2 && (<button class="btn btn-sm btn-outline-success fw-bold" onClick={handleShowModelCLS}>Chỉ định CLS</button>)
                                }
                            </div>
                            <div class="p-3 rounded mt-2" style={{ backgroundColor: '#EBE9FA' }}>
                                <div class="row" style={{ color: '#726FE4' }}>
                                    <div class="col-md-4">
                                        <p><strong><i class="fa-solid fa-house"></i> {medicalexamData.outpatientclinic?.name ?? "-"}</strong></p>
                                        <p><strong><i class="fa-solid fa-stethoscope"></i> BS {medicalexamData.doctor?.fullname ?? "-"}</strong></p>
                                    </div>
                                    <div class="col-md-4">
                                        <p><strong>Bắt đầu:</strong> {medicalexamData.examinationstarttime ? new Date(medicalexamData.examinationstarttime).toLocaleDateString('vi-VN') : "-"}</p>
                                        <p><strong>Kết thúc:</strong> {medicalexamData.examinationendtime ? new Date(medicalexamData.examinationendtime).toLocaleDateString('vi-VN') : "-"}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p><strong>Bệnh chính:</strong> {medicalexamData.disease?.diseasename ?? "-"}</p>
                                        <p><strong>Bệnh phụ:</strong> -</p>
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
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold text-dark">Bệnh</label>
                                                <Select classNames={{
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
                                                            diseasename: selected?.label || ""
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
                                                    className="form-control form-control-sm border-primary"
                                                    type="text"
                                                    name="diseasename"
                                                    value={medicalexamData.diseasename}
                                                    onInput={handleChangeInput}
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
                                                                <td>{item.doctor?.fullname}</td>
                                                                <td>{item.outpatientclinic?.name}</td>
                                                                <td>{item.treatmenttype?.name}</td>
                                                                <td>
                                                                    <a
                                                                        target="_blank"
                                                                        href={`/His/Medicalexamination/examine/`}
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