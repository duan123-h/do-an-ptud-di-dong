import React from "react";
const ModalResultCLS = ({
    show,
    onClose,
    ResultCLSData = {},
    loading
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
                        <h5 className="modal-title fw-bold">Kêt quả chỉ định CLS</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">
                        {
                            loading ? (
                                <div class="d-flex justify-content-center w-100 mb-3">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                ResultCLSData&&ResultCLSData.status == 2 ? (
                                    <>
                                        <div class="mb-3">
                                            <label for="result" class="form-label text-dark">Kết quả cận lâm sàng ({ResultCLSData.service?.name}):</label>
                                            <textarea  class="form-control" id="result" name="result" rows="4" required value={ResultCLSData.result}></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label text-dark">Hình ảnh:</label>
                                            <div>
                                                {ResultCLSData.resultimage ? (
                                                    <img id="imagePreview" src={ResultCLSData.resultimage} alt="Xem trước ảnh kết quả" class="img-fluid border"
                                                        style={{ maxHeight: '300px' }} />
                                                ) : (
                                                    <h4>
                                                        Không có hình ảnh trả về!!!
                                                    </h4>
                                                )}

                                            </div>
                                        </div>
                                    </>
                                ) : ResultCLSData&&ResultCLSData.status != 2 ? (
                                    <h4 className="text-danger mt-3 text-center">
                                        Hiện chưa có kết quả CLS cho chỉ định này !!!
                                    </h4>
                                ):(
                                    <></>
                                )
                            )
                        }
                    </div>

                    <div className="modal-footer border-0">
                        <button className="btn btn-light" onClick={onClose}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalResultCLS;
