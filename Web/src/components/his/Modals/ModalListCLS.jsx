import React from "react";
const ModalListCLS = ({
    show,
    onClose,
    serviceData = [],
    listCLSData = [],
    handleAddCLS,
    handleRemoveCLS,
    createOrEdit,
    postDataCLS,
    updateDataCLS,
    loadingpost,
    handleResultCLS
}) => {
    if (!show) return null;
    return (
        <div
            className="modal fade show"
            id="clinicModal"
            tabIndex="-1"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content text-white">
                    <div className="modal-header border-0 bg-primary">
                        <h5 className="modal-title fw-bold">Chỉ định cận lâm sàng</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="card mb-0">
                                    <div className="card-header bg-primary text-white py-1 small">
                                        Danh sách dịch vụ
                                    </div>
                                    <div
                                        className="list-group list-group-flush"
                                        style={{ maxHeight: "70vh", overflowY: "auto" }}
                                    >
                                        {serviceData.map((item, idx) => (
                                            <React.Fragment key={idx}>
                                                <div
                                                    className="d-flex align-items-center list-group-item py-1"
                                                    style={{ cursor: "pointer" }}
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#collapse${idx}`}
                                                >
                                                    <span className="me-2 badge bg-secondary rounded-pill icon-toggle">
                                                        +
                                                    </span>
                                                    <span>{item.name} (Mã / Tên / Giá)</span>
                                                </div>
                                                <div className="collapse ps-4" id={`collapse${idx}`}>
                                                    <table className="table table-sm table-bordered table-hover mb-0">
                                                        <tbody>
                                                            {item.services.map((item1) => (
                                                                <tr
                                                                    key={item1.serviceid}
                                                                    onClick={() => handleAddCLS(item1.serviceid)}
                                                                >
                                                                    <td>{item1.serviceid}</td>
                                                                    <td>{item1.name}</td>
                                                                    <td>{item1.price}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* DỊCH VỤ ĐÃ CHỌN */}
                            <div className="col-md-8 mb-3">
                                <div className="card mb-0">
                                    <div className="card-header bg-primary text-white py-1 small">
                                        Dịch vụ đã chọn
                                    </div>
                                    <div
                                        className="table-responsive"
                                        style={{ maxHeight: "70vh", overflowY: "auto" }}
                                    >
                                        <table className="table table-sm table-bordered table-hover mb-0">
                                            <thead className="small">
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
                                                {listCLSData.map((item) => (
                                                    <tr key={item.service.serviceid}>
                                                        <td>{item.service.serviceid}</td>
                                                        <td>{item.service.name}</td>
                                                        <td>{item.service.price}</td>
                                                        <td>
                                                            <select className="form-select form-select-sm">
                                                                <option>
                                                                    {item.service?.outpatientclinic?.name}
                                                                </option>
                                                            </select>
                                                        </td>
                                                        <td>
                                                            {item.status === 0 ? (
                                                                <span className="badge text-bg-warning">Đang chờ</span>
                                                            ) : item.status === 1 ? (
                                                                <span className="badge text-bg-danger">Đang xử lý</span>
                                                            ) : item.status === 2 ? (
                                                                <span className="badge text-bg-success">Hoàn thành</span>
                                                            ) : (
                                                                <span className="badge text-bg-secondary">Bản nháp</span>
                                                            )}
                                                        </td>
                                                        <td style={{ minWidth: "40px", maxWidth: "40px" }}>
                                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={item.servicerequestdetailid ? () => handleResultCLS(item.servicerequestdetailid) : undefined}>
                                                                <i className="fa-solid fa-eye"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger me-2"
                                                                onClick={() =>
                                                                    handleRemoveCLS(item.service.serviceid)
                                                                }
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
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

                    <div className="modal-footer border-0">
                        <button className="btn btn-light" onClick={onClose}>
                            Đóng
                        </button>
                        <button
                            disabled={loadingpost}
                            className="btn btn-dark"
                            onClick={createOrEdit ? postDataCLS : updateDataCLS}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalListCLS;
