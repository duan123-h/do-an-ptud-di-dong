import React from "react";

export default function ModalCLSRequest({
    show,
    onClose,
    clsData = [],
    handleCreateCLS,
    handleDetailCLS,
}) {
    if (!show) return null;

    return (
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
                            Danh sách phiếu chỉ định cận lâm sàng
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleCreateCLS}
                            >
                                + Tạo Phiếu Chỉ Định
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Mã Phiếu</th>
                                        <th>Mã Khám Bệnh</th>
                                        <th>Bác Sĩ chỉ định</th>
                                        <th>Bệnh Nhân</th>
                                        <th>Thời Gian Yêu Cầu</th>
                                        <th className="text-center">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clsData.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="text-center text-muted small py-2"
                                            >
                                                <i className="bi bi-inbox fs-1 text-primary d-block"></i>
                                                Chưa có phiếu chỉ định nào
                                            </td>
                                        </tr>
                                    ) : (
                                        clsData.map((item) => (
                                            <tr key={item.servicerequestid}>
                                                <td>{item.servicerequestid}</td>
                                                <td>{item.medicalexaminationid}</td>
                                                <td>
                                                    BS. {item.doctor?.name}
                                                </td>
                                                <td>{item.patient?.fullname}</td>
                                                <td>
                                                    {new Date(
                                                        item.requesttime
                                                    ).toLocaleString("vi-VN")}
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={(e)=>{window.open(`/his/print/Hdcls/${item.servicerequestid}`, "_blank", "noopener,noreferrer");}}
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        In phiếu
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDetailCLS(
                                                                item.servicerequestid
                                                            )
                                                        }
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        Chi Tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="modal-footer border-0">
                        <button
                            className="btn btn-light"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
