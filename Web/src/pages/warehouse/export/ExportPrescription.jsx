import { useEffect, useState } from "react";
import PrescriptionService from "../../../services/PrescriptionService";
import ExportService from "../../../services/ExportService";
import toast from 'react-hot-toast';
export default function ExportPrescription() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [notDispensedDetails, setNotDispensedDetails] = useState([]);
    const [dispensedDetails, setDispensedDetails] = useState([]);

    const today = new Date().toISOString().slice(0, 10);

    const [filters, setFilters] = useState({
        startdate: today,
        enddate: today,
        isdispensed: false,
    });
    const fetchPrescriptions = async () => {
        try {
            const params = {
                ...filters,
                isdispensed: filters.isdispensed ? 1 : 0
            };
            const res = await PrescriptionService.getAll(params);
            setPrescriptions(res.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchPrescriptions();
    }, [filters]);
    const getAge = (dateOfBirth) => {
        if (!dateOfBirth) return "";
        const birth = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const getBirthYear = (dateOfBirth) => {
        if (!dateOfBirth) return "";
        return new Date(dateOfBirth).getFullYear();
    };
    const fetchPrescriptionNotDispensedDetails = async (prescriptionid) => {
        try {
            const notDispensedRes = await PrescriptionService.getDetail(prescriptionid, { isdispensed: 0 });
            setNotDispensedDetails(notDispensedRes.data || []);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchPrescriptionDispensedDetails = async (prescriptionid) => {
        try {
            const dispensedRes = await PrescriptionService.getDetail(prescriptionid, { isdispensed: 1 });
            setDispensedDetails(dispensedRes.data || []);
        } catch (error) {
            console.error(error);
        }
    };
    const handleSelectPrescription = async (prescription) => {
        try {
            setSelectedPrescription(prescription);
            fetchPrescriptionNotDispensedDetails(prescription.prescriptionid);
            fetchPrescriptionDispensedDetails(prescription.prescriptionid);

        } catch (error) {
            console.error(error);
        }
    };
    const handleInventoryChange = (prescriptionDetailId, value) => {
        setNotDispensedDetails(prev =>
            prev.map(d =>
                d.prescriptiondetailid === prescriptionDetailId
                    ? { ...d, batchid: value }
                    : d
            )
        );
    };
    const handleExportPrescription = async () => {
        try {
            if (notDispensedDetails.length == 0) return;
            if (!selectedPrescription) return;
            const invalid = notDispensedDetails.some(d => !d.batchid);
            if (invalid) {
                toast.error("Vui lòng nhập đầy đủ mã tồn kho");
                return;
            }

            const payload = {
                prescriptionid: selectedPrescription.prescriptionid,
                items: notDispensedDetails.map(d => ({
                    medicineid: d.medicineid,
                    batchid: d.batchid,
                    prescriptiondetailid: d.prescriptiondetailid,
                }))
            };

            const res = await ExportService.prescription(payload);
            toast.success(res.message);
            fetchPrescriptions();
            fetchPrescriptionNotDispensedDetails(selectedPrescription.prescriptionid);
            fetchPrescriptionDispensedDetails(selectedPrescription.prescriptionid);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).map((errArray) =>
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error(error);
        }
    };
    const handleDestroyExportPrescription = async () => {
        try {
            if (dispensedDetails.length == 0) return;
            if (!selectedPrescription) return;

            const payload = {
                prescriptionid: selectedPrescription.prescriptionid,
                items: dispensedDetails.map(d => ({
                    prescriptiondetailid: d.prescriptiondetailid,
                }))
            };

            const res = await ExportService.destroyPrescription(payload);
            toast.success(res.message);
            fetchPrescriptions();
            fetchPrescriptionNotDispensedDetails(selectedPrescription.prescriptionid);
            fetchPrescriptionDispensedDetails(selectedPrescription.prescriptionid);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).map((errArray) =>
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error(error);
        }
    };
    return (
        <div className="container-fluid h-100 p-2 d-flex flex-column">
            <div className="row g-2 h-100">
                <div className="col-md-3 h-100">
                    <div className="card shadow-sm h-100">
                        <div className="card-body p-2 d-flex flex-column h-100">
                            <div className="flex-shrink-0 mb-2">
                                <div className="row g-2 mb-2 align-items-center">
                                    <label className="col-4 small">Từ ngày</label>
                                    <div className="col-8">
                                        <input type="date" className="form-control form-control-sm"
                                            value={filters.startdate}
                                            onChange={e => setFilters({ ...filters, startdate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="row g-2 mb-2 align-items-center">
                                    <label className="col-4 small">Đến ngày</label>
                                    <div className="col-8">
                                        <input type="date" className="form-control form-control-sm"
                                            value={filters.enddate}
                                            onChange={e => setFilters({ ...filters, enddate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check small">
                                        <input className="form-check-input" type="checkbox" id="exported"
                                            checked={filters.isdispensed}
                                            onChange={e => setFilters({ ...filters, isdispensed: e.target.checked })} />
                                        <label className="form-check-label" htmlFor="exported">Đã xuất cho BN</label>
                                    </div>
                                    <button className="btn btn-light btn-sm border" onClick={fetchPrescriptions}>Làm mới</button>
                                </div>
                            </div>
                            <div className="card border-0 d-flex flex-column flex-grow-1 overflow-hidden">
                                <div className="card-header bg-primary text-white py-1 px-2 fw-bold small">
                                    Danh sách bệnh nhân
                                </div>
                                <div className="card-body p-0 overflow-auto">
                                    <table className="table table-bordered table-sm table-hover mb-0 small text-nowrap">
                                        <thead className="table-light sticky-top">
                                            <tr>
                                                <th>Mã phiếu</th>
                                                <th>Tên bệnh nhân</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescriptions.map(p => (
                                                <tr key={p.prescriptionid}
                                                    onClick={() => handleSelectPrescription(p)}
                                                    style={{ cursor: "pointer" }}
                                                    className={selectedPrescription?.prescriptionid === p.prescriptionid ? "table-primary" : ""}>
                                                    <td>{p.prescriptionid}</td>
                                                    <td>{p.patient?.fullname}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-md-9 h-100">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-primary text-white py-1 px-2 fw-bold small">
                            Xuất thuốc theo đơn
                        </div>
                        <div className="card-body p-2 d-flex flex-column h-100 overflow-hidden">
                            {selectedPrescription ? (
                                <>
                                    <div className="row mb-2 flex-shrink-0">
                                        <div className="col-md-5">
                                            <div className="row g-2 mb-1 align-items-center">
                                                <label className="col-3 small">Số phiếu</label>
                                                <div className="col-9">
                                                    <input type="text" readOnly className="form-control form-control-sm text-danger fw-bold"
                                                        value={selectedPrescription.prescriptionid} />
                                                </div>
                                            </div>
                                            <div className="row g-2 mb-1 align-items-center">
                                                <label className="col-3 small">Ngày xuất</label>
                                                <div className="col-9">
                                                    <input type="text" readOnly className="form-control form-control-sm"
                                                        value={new Date(selectedPrescription.prescriptiondate).toLocaleDateString()} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <div className="row g-2 mb-1 align-items-center">
                                                <label className="col-2 small">Tên BN</label>
                                                <div className="col-10">
                                                    <input type="text" readOnly className="form-control form-control-sm text-danger fw-bold text-uppercase"
                                                        value={selectedPrescription.patient?.fullname} />
                                                </div>
                                            </div>
                                            <div className="row g-2 mb-1 align-items-center">
                                                <label className="col-2 small">Tuổi</label>
                                                <div className="col-4">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        className="form-control form-control-sm"
                                                        value={getAge(selectedPrescription.patient?.dateofbirth)}
                                                    />
                                                </div>
                                                <label className="col-2 small text-end">Năm sinh</label>
                                                <div className="col-4">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        className="form-control form-control-sm"
                                                        value={getBirthYear(selectedPrescription.patient?.dateofbirth)}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-12 mt-1">
                                            <div class="row g-2 align-items-center">
                                                <label class="col-auto small" style={{ width: '100px' }}>Chẩn đoán</label>
                                                <div class="col">
                                                    <div class="d-flex flex-column gap-1">
                                                        <input type="text" readOnly class="form-control form-control-sm" value={selectedPrescription.medicalexamination?.diseasename} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 mt-1">
                                            <div class="row g-2 align-items-center">
                                                <label class="col-auto small" style={{ width: '100px' }}>Bệnh phụ</label>
                                                <div class="col">
                                                    <div class="d-flex flex-column gap-1">
                                                        <textarea class="form-control form-control-sm" rows="2" readOnly value={selectedPrescription.medicalexamination?.secondarydiseasenames}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-column h-50 pb-2">
                                        <div class="d-flex align-items-center gap-2 mb-1">
                                            <button class="btn btn-light btn-sm border fw-bold shadow-sm text-nowrap" onClick={handleExportPrescription}>
                                                <i class="fas fa-arrow-down text-primary"></i> Xuất thuốc
                                            </button>
                                        </div>

                                        <div class="card border flex-grow-1 overflow-hidden">
                                            <div class="card-header bg-primary text-white py-1 px-2 fw-bold small">
                                                Thuốc - Vật tư chưa xuất
                                                <span class="float-end"><i class="fas fa-chevron-up"></i></span>
                                            </div>
                                            <div class="card-body p-0 overflow-auto">
                                                <table class="table table-bordered table-sm table-hover mb-0 small text-nowrap">
                                                    <thead class="bg-primary text-white">
                                                        <tr>
                                                            <th class="bg-primary text-white" style={{ width: '120px' }}>Mã số lô nhập</th>

                                                            <th class="bg-primary text-white">Tên <i class="fas fa-caret-up"></i></th>
                                                            <th class="bg-primary text-white">Hoạt chất</th>
                                                            <th class="bg-primary text-white">SL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {notDispensedDetails.map(d => (
                                                            <tr key={d.prescriptiondetailid}>
                                                                <td className="p-1">
                                                                    <select
                                                                        className="form-control form-control-sm"
                                                                        value={d?.batchid || ""}
                                                                        onChange={e => handleInventoryChange(d.prescriptiondetailid, e.target.value)}
                                                                    >
                                                                        <option value="">-- Chọn lô --</option>
                                                                        {d.medicine?.batches?.map(batch => (
                                                                            <option key={batch.batchid} value={batch.batchid}>
                                                                                {batch.batchid} (SL còn lại: {batch.quantity})
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </td>

                                                                <td className="align-middle">{d.medicine?.name}</td>
                                                                <td className="align-middle">{d.medicine?.activeingredients}</td>
                                                                <td className="align-middle">{d.quantity}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex flex-column h-50 pt-1 border-top">
                                        <div class="d-flex align-items-center gap-2 mb-1 mt-1">
                                            <button class="btn btn-light btn-sm border fw-bold shadow-sm text-nowrap" onClick={handleDestroyExportPrescription}>
                                                <i class="fas fa-arrow-up text-danger"></i> Hủy xuất thuốc
                                            </button>
                                        </div>

                                        <div class="card border flex-grow-1 overflow-hidden">
                                            <div class="card-header bg-primary text-white py-1 px-2 fw-bold small">
                                                Thuốc - Vật tư ĐÃ XUẤT
                                                <span class="float-end"><i class="fas fa-chevron-up"></i></span>
                                            </div>
                                            <div class="card-body p-0 overflow-auto">
                                                <table class="table table-bordered table-sm table-hover mb-0 small text-nowrap">
                                                    <thead class="bg-primary text-white">
                                                        <tr>
                                                            <th class="bg-primary text-white">Tên <i class="fas fa-caret-up"></i></th>
                                                            <th class="bg-primary text-white">Hoạt chất</th>
                                                            <th class="bg-primary text-white">SL</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dispensedDetails.map(d => (
                                                            <tr key={d.prescriptiondetailid}>
                                                                <td>{d.exportdetail?.medicine?.name}</td>
                                                                <td>{d.exportdetail?.medicine?.activeingredients}</td>
                                                                <td>{d.exportdetail?.quantity}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-muted mt-5">Chọn một phiếu thuốc để xem chi tiết</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
