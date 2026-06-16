import toast from 'react-hot-toast';
import Servicerequestdetail from "../../../services/his/ServicerequestdetailService";
import { useEffect, useState } from "react";
import { Link, useAsyncError, useLocation, useNavigate, useParams } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
export default function HandleCLSCDHAEdit() {
    const mysal = withReactContent(swal);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [clsDetailData, setCLSDetailData] = useState({});
    const [loadingSave, setloadingSave] = useState(false);
    const [loadingEndOrStart, setLoadingEndOrStart] = useState(false);
    async function getCLSDetail(id) {
        try {
            const res = await Servicerequestdetail.getDetail(id);
            console.log("check data cls detail: ", res.data);
            setCLSDetailData(res.data);
        } catch (error) {
            toast.error("lỗi không thể lấy chi tiết phiếu CLS.");
        }
    };
    useEffect(() => {
        getCLSDetail(id);
    }, [location]);

    function handleChangeInput(e) {
        var name = e.target.name;
        var value = e.target.value;
        setCLSDetailData(input => ({
            ...input,
            [name]: value
        }))
    }

    const handlehandleCLSSave = async (e) => {
        setloadingSave(true);
        e.preventDefault();
        try {
            const data = {
                result: clsDetailData.result,
                resultimage: clsDetailData.resultimage
            }
            const response = await Servicerequestdetail.update(clsDetailData, id);
            setloadingSave(false);
            toast.success(response.message);
        } catch (error) {
            setloadingSave(false);
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
    };
    function handleCLSStart(name) {
        mysal.fire({
            title: `Bạn có chắc muốn bắt thực hiện CLS cho bệnh nhân ${name} không?`,
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
                    setLoadingEndOrStart(true);
                    const res = await Servicerequestdetail.start(id);
                    setCLSDetailData(prev => ({
                        ...prev,
                        ...res.data
                    }))
                    setLoadingEndOrStart(false);
                } catch (error) {
                    setLoadingEndOrStart(false);
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
    function handleCLSEnd(name) {
        mysal.fire({
            title: `Bạn có chắc muốn kết thúc thực hiện CLS cho bệnh nhân ${name} không?`,
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
                    setLoadingEndOrStart(true);
                    const res = await Servicerequestdetail.end(id);
                    setCLSDetailData(prev => ({
                        ...prev,
                        ...res.data
                    }))
                    setLoadingEndOrStart(false);
                } catch (error) {
                    setLoadingEndOrStart(false);
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
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <Link class="btn btn-primary me-3" to="/his/clsrequest/"><i class="fa-solid fa-left-long"></i></Link>
                        <h4 class="card-title">Thực hiện cận lâm sàng</h4>
                    </div>
                    <div className="d-flex mb-2" style={{ gap: '8px' }}>
                        {
                            clsDetailData.status == 1 && (<button class="btn btn-sm btn-primary" onClick={handlehandleCLSSave} disabled={loadingSave}>{loadingSave ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Lưu")}</button>)
                        }
                        {
                            clsDetailData.status == 0 && (<button disabled={loadingEndOrStart} class="btn btn-sm btn-success" onClick={() => handleCLSStart(clsDetailData.patient?.fullname ?? "-")}>{loadingEndOrStart ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Bắt đầu thực hiện CLS")}</button>)
                        }
                        {
                            clsDetailData.status == 1 && (<button disabled={loadingEndOrStart} class="btn btn-sm btn-danger" onClick={() => handleCLSEnd(clsDetailData.patient?.fullname ?? "-")}>{loadingEndOrStart ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Kết thúc thực hiện CLS")}</button>)
                        }
                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">Thông tin bệnh nhân</h5>
                            <div class="row">
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Họ tên:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{clsDetailData.patient?.fullname}</div>
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label">Ngày sinh:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{new Date(clsDetailData.patient?.dateofbirth).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}</div>
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label">Giới tính:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{clsDetailData.patient?.gender ? "Nam" : "Nữ"}</div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Địa chỉ:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{clsDetailData.patient?.address}</div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Chẩn đoán bệnh:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{clsDetailData.medicalexamination?.diseasename}</div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label">Bác sĩ chỉ định:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{clsDetailData.doctor?.fullname}</div>
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label">Thời gian bắt đầu:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{clsDetailData.starttime?new Date(clsDetailData.starttime).toLocaleString('vi-VN'):"-"}</div>
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label">Thời gian kết thúc:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{clsDetailData.endtime?new Date(clsDetailData.endtime).toLocaleString('vi-VN'):"-"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={(e)=>e.preventDefault()}>
                        <div class="mb-3">
                            <label for="result" class="form-label">Kết quả cận lâm sàng ({clsDetailData.service?.name}):</label>
                            <textarea onChange={handleChangeInput} class="form-control" id="result" name="result" rows="4" required value={clsDetailData.result}></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="resultimage" class="form-label">Đường dẫn ảnh kết quả:</label>
                            <input onInput={handleChangeInput} type="text" class="form-control" id="resultimage" value={clsDetailData.resultimage} name="resultimage"
                                placeholder="Nhập đường dẫn ảnh..." />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Xem trước ảnh:</label>
                            <div>
                                {clsDetailData.resultimage ? (
                                    <img id="imagePreview" src={clsDetailData.resultimage} alt="Xem trước ảnh kết quả" class="img-fluid border"
                                        style={{ maxHeight: '300px' }} />
                                ) : (
                                    <h4>
                                        Chưa có kết quả hình ảnh trả về!!!
                                    </h4>
                                )}

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}