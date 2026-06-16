import toast from 'react-hot-toast';
import Servicerequestdetail from "../../../services/his/ServicerequestdetailService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function HandleCLSXNEdit() {
    const mysal = withReactContent(swal);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [clsDetailData, setCLSDetailData] = useState({});
    const [labResults, setLabResults] = useState({});

    const [loadingSave, setloadingSave] = useState(false);
    const [loadingEndOrStart, setLoadingEndOrStart] = useState(false);

    // =========================
    // LOAD DETAIL
    // =========================
    async function getCLSDetail(id) {
        try {
            const res = await Servicerequestdetail.getDetail(id);
            const data = res.data;

            setCLSDetailData(data);

            // init dynamic form
            const init = {};
            data.service?.labparameters?.forEach(item => {
                init[item.code] = "";
            });

            setLabResults(init);

        } catch (error) {
            toast.error("lỗi không thể lấy chi tiết phiếu CLS.");
        }
    }

    useEffect(() => {
        getCLSDetail(id);
    }, [location]);

    // =========================
    // HANDLE LAB INPUT
    // =========================
    function handleLabChange(e, code) {
        const value = e.target.value;

        setLabResults(prev => ({
            ...prev,
            [code]: value
        }));
    }

    // =========================
    // SAVE RESULT
    // =========================
    const handleSave = async (e) => {
        setloadingSave(true);
        e.preventDefault();

        try {
            const payload = {
                result: labResults,
                resultimage: clsDetailData.resultimage
            };

            const response = await Servicerequestdetail.update(payload, id);

            setloadingSave(false);
            toast.success(response.message);

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

    // =========================
    // START CLS
    // =========================
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

    // =========================
    // END CLS
    // =========================
    function handleCLSEnd(name) {
        mysal.fire({
            title: `Kết thúc CLS cho ${name}?`,
            text: "Sau khi kết thúc sẽ không chỉnh sửa được!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            try {
                setLoadingEndOrStart(true);

                const res = await Servicerequestdetail.end(id);

                setCLSDetailData(prev => ({ ...prev, ...res.data }));

                setLoadingEndOrStart(false);
            } catch (error) {
                setLoadingEndOrStart(false);
                toast.error("Có lỗi xảy ra");
            }
        });
    }

    // =========================
    // RENDER
    // =========================
    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link className="btn btn-outline-secondary me-3" to="/his/clsrequest/">← Quay lại</Link>
                    <span className="h4 text-primary fw-bold">Chi tiết Cận lâm sàng: {clsDetailData.service?.name}</span>
                </div>
                <div>
                    {clsDetailData.status === 0 && (
                        <button className="btn btn-success" onClick={() => handleCLSStart(clsDetailData.patient?.fullname)}>
                            <i className="bi bi-play-fill"></i> Bắt đầu thực hiện
                        </button>
                    )}
                    {clsDetailData.status === 1 && (
                        <>
                            <button className="btn btn-primary me-2" onClick={handleSave} disabled={loadingSave}>Lưu kết quả</button>
                            <button className="btn btn-danger" onClick={() => handleCLSEnd(clsDetailData.patient?.fullname)}>Hoàn thành & Khóa</button>
                        </>
                    )}
                </div>
            </div>

            <div className="row">
                {/* Cột trái: Thông tin Bệnh nhân */}
                <div className="col-lg-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-light">
                            <h6 className="mb-0"><i className="bi bi-person-badge"></i> Thông tin bệnh nhân</h6>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-3">
                                {/* <img src={clsDetailData.patient?.avatar} className="rounded-circle border" width="100" alt="avatar" /> */}
                                <h5 className="mt-2">{clsDetailData.patient?.fullname}</h5>
                                <span className="badge bg-info">{clsDetailData.patient?.personalid}</span>
                            </div>
                            <table className="table table-sm">
                                <tbody>
                                    <tr><th>Ngày sinh:</th><td>{clsDetailData.patient?.dateofbirth}</td></tr>
                                    <tr><th>Giới tính:</th><td>{clsDetailData.patient?.gender === 1 ? 'Nam' : 'Nữ'}</td></tr>
                                    <tr><th>Địa chỉ:</th><td>{clsDetailData.patient?.address}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Nhập liệu kết quả */}
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-light d-flex justify-content-between">
                            <h6 className="mb-0">Kết quả xét nghiệm</h6>
                            <span className="text-muted">Mã: {clsDetailData.service?.code}</span>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Thông số</th>
                                            <th>Kết quả</th>
                                            <th>Đơn vị</th>
                                            <th>Khoảng tham chiếu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clsDetailData.service?.labparameters?.map(item => (
                                            <tr key={item.labparameterid}>
                                                <td className="fw-bold">{item.name}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={labResults[item.code] || ""}
                                                        onChange={(e) => handleLabChange(e, item.code)}
                                                        disabled={clsDetailData.status !== 1}
                                                    />
                                                </td>
                                                <td>{item.unit}</td>
                                                <td>
                                                    {item.labparameterranges?.map((r, idx) => (
                                                        <small key={idx} className="d-block text-muted">
                                                            {r.min} - {r.max}
                                                        </small>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}