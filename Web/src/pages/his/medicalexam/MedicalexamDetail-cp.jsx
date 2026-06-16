import Outpatientregistration from "../../../services/his/OutpatientregistrationService";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"

export default function MedicalexamDetail() {
    const [activeTab, setActiveTab] = useState("exam");
    return (
        <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                    <Link to="/His/Medicalexam" className="btn btn-primary me-3">
                        <i className="fa-solid fa-left-long"></i>
                    </Link>
                    <h3 className="m-0 text-dark">Khám bệnh</h3>
                </div>
            </div>

            {/* Thông tin bệnh nhân */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light border-bottom fw-bold text-primary">
                    Thông tin bệnh nhân
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label fw-semibold text-dark">Mã bệnh nhân</label>
                            <input
                                className="form-control form-control-sm"
                                disabled
                                value={""}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold text-dark">Họ tên</label>
                            <input
                                className="form-control form-control-sm"
                                disabled
                                value={""}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold text-dark">Ngày sinh</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                disabled
                                value={
                                    ""
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold text-dark">Giới tính</label>
                            <select className="form-select form-control-sm" disabled>
                                <option >
                                    Nam
                                </option>
                                <option >
                                    Nữ
                                </option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold text-dark">Dân tộc</label>
                            <select id="EthnicgroupSelect" className="form-select form-control-sm" disabled>
                                <option>Chọn Dân tộc</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold text-dark">Số điện thoại</label>
                            <input
                                className="form-control form-control-sm"
                                disabled
                                value={""}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-semibold text-dark">Địa chỉ</label>
                            <input
                                className="form-control form-control-sm"
                                disabled
                                value={""}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="col-12 mb-3">
                <span className="badge bg-primary fs-6 rounded-pill px-3 py-2">
                    {"Phòng khám A"}
                </span>

                <ul className="nav nav-tabs mt-3" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "exam" ? "active text-primary fw-bold" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("exam")}
                        >
                            Khám bệnh
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === "history" ? "active text-primary fw-bold" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("history")}
                        >
                            Lịch sử khám bệnh
                        </button>
                    </li>
                </ul>
            </div>

            <div className="tab-content">
                {activeTab === "exam" && (
                    <div className="tab-pane fade show active">
                        <form>
                            {/* Khám và chỉ số sinh tồn */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-light border-bottom fw-bold text-primary">
                                    Khám và chỉ số sinh tồn
                                </div>
                                <div className="card-body row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark">Khám toàn thân</label>
                                        <textarea
                                            className="form-control form-control-sm border-primary"
                                            name="generalexam"
                                            defaultValue={""}
                                        ></textarea>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark">Khám bộ phận</label>
                                        <textarea
                                            className="form-control form-control-sm border-primary"
                                            name="bodypartexam"
                                            defaultValue={""}
                                        ></textarea>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-dark">Mạch (lần/phút)</label>
                                        <input
                                            className="form-control form-control-sm border-primary"
                                            type="text"
                                            name="heartrate"
                                            defaultValue=""
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-dark">Nhiệt độ (°C)</label>
                                        <input
                                            className="form-control form-control-sm border-primary"
                                            type="text"
                                            name="temperature"
                                            defaultValue=""
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-dark">Huyết áp (mmHg)</label>
                                        <input
                                            className="form-control form-control-sm border-primary"
                                            type="text"
                                            name="bloodpressure"
                                            defaultValue=""
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-dark">Cân nặng (Kg)</label>
                                        <input
                                            className="form-control form-control-sm border-primary"
                                            type="text"
                                            name="weight"
                                            defaultValue=""
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-dark">Chiều cao (Cm)</label>
                                        <input
                                            className="form-control form-control-sm border-primary"
                                            type="text"
                                            name="height"
                                            defaultValue=""
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-semibold text-dark">BMI</label>
                                        <div className="form-control form-control-sm bg-light text-dark fw-bold">
                                            {/* Có thể tính BMI bằng JS nếu muốn */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chuẩn đoán */}
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
                                            defaultValue={""}
                                        ></textarea>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark">Bệnh</label>
                                        <select
                                            className="form-select form-select-sm border-primary"
                                            name="Diseaseid"
                                            defaultValue={""}
                                        >
                                            <option value="">-- Chọn bệnh --</option>
                                            <option value={1}>
                                                Benh A
                                            </option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-dark">Tên bệnh</label>
                                        <input
                                            className="form-control form-control-sm border-primary"
                                            type="text"
                                            name="Diseasename"
                                            defaultValue={""}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="text-start mb-5">
                                <button type="button" className="btn btn-outline-primary me-2">
                                    Xử trí
                                </button>
                                <button type="button" className="btn btn-outline-primary me-2">
                                    Chỉ định CLS
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Lưu
                                </button>
                            </div>
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
                                            <th>Ngày đăng ký khám</th>
                                            <th>Chuẩn đoán</th>
                                            <th>Bác sĩ</th>
                                            <th>Phòng khám</th>
                                            <th>Xử trí</th>
                                            <th>Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr key={1}>
                                            <td>22/02/2222</td>
                                            <td>Benh A</td>
                                            <td>HIHI</td>
                                            <td>Phong kham A</td>
                                            <td>Xu tri</td>
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
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}