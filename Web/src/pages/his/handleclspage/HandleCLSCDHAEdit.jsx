import toast from 'react-hot-toast';
import Servicerequestdetail from "../../../services/his/ServicerequestdetailService";
import ImagingResultService from "../../../services/ImagingResultService";
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
    const [formData, setFormData] = useState({
        description: "",
        conclusion: "",
        resultimage: ""
    });
    const [loadingSave, setloadingSave] = useState(false);
    const [loadingEndOrStart, setLoadingEndOrStart] = useState(false);
    async function getCLSDetail(id) {
        try {
            const res = await Servicerequestdetail.getDetail(id);

            const data = res.data;
            setCLSDetailData(data);

            setFormData({
                description: data.imagingresult?.description || "",
                conclusion: data.imagingresult?.conclusion || "",
                resultimage: data.imagingresult?.resultimage || ""
            });

        } catch (error) {
            toast.error("lỗi không thể lấy chi tiết phiếu CLS.");
        }
    }
    useEffect(() => {
        getCLSDetail(id);
    }, [location]);

    function handleChangeInput(e) {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
    
    const handlehandleCLSSave = async (e) => {
        e.preventDefault();
        setloadingSave(true);

        try {
            const payload = {
                servicerequestdetailid: id,
                description: formData.description,
                conclusion: formData.conclusion,
                resultimage: formData.resultimage
            };

            const response = await ImagingResultService.update(payload, id);

            toast.success(response.message);
            setloadingSave(false);

        } catch (error) {
            setloadingSave(false);

            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach(arr =>
                    arr.forEach(msg => toast.error(msg))
                );
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };
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
    function handleCLSStart(name) {
            mysal.fire({
                title: `Bắt đầu CLS cho ${name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
            }).then(async (result) => {
                if (!result.isConfirmed) return;
    
                try {
                    setLoadingEndOrStart(true);
    
                    const res = await Servicerequestdetail.start(id);
    
                    setCLSDetailData(prev => ({ ...prev, ...res.data }));
    
                    setLoadingEndOrStart(false);
                } catch (error) {
                    setLoadingEndOrStart(false);
                    toast.error("Có lỗi xảy ra");
                }
            });
        }
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <Link class="btn btn-primary me-3" to="/his/clscdharequest/"><i class="fa-solid fa-left-long"></i></Link>
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

                                    >{clsDetailData.starttime ? new Date(clsDetailData.starttime).toLocaleString('vi-VN') : "-"}</div>
                                </div>
                                <div class="col-md-3 mb-2">
                                    <label class="form-label">Thời gian kết thúc:</label>
                                    <div
                                        className={`form-control form-control-sm fw-bold bg-white text-dark`}

                                    >{clsDetailData.endtime ? new Date(clsDetailData.endtime).toLocaleString('vi-VN') : "-"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-3">
                            <label className="form-label">Mô tả kết quả</label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChangeInput}
                                disabled={clsDetailData.status !== 1}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Kết luận</label>
                            <textarea
                                className="form-control"
                                name="conclusion"
                                rows="3"
                                value={formData.conclusion}
                                onChange={handleChangeInput}
                                disabled={clsDetailData.status !== 1}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Đường dẫn ảnh</label>
                            <input
                                type="text"
                                className="form-control"
                                name="resultimage"
                                value={formData.resultimage}
                                onChange={handleChangeInput}
                                disabled={clsDetailData.status !== 1}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Xem trước ảnh</label>
                            {formData.resultimage ? (
                                <img
                                    src={formData.resultimage}
                                    alt="preview"
                                    className="img-fluid border"
                                    style={{ maxHeight: "300px" }}
                                />
                            ) : (
                                <h6>Chưa có hình ảnh</h6>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}