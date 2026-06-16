import Outpatientregistration from "../../../services/his/OutpatientregistrationService";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"

export default function MedicalexamIndex() {
    const navigate = useNavigate();
    const mysal = withReactContent(swal);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [listMedicalexamData, setListMedicalexamDataData] = useState([]);
    const [medicalexamData, setMedicalexamDataData] = useState({});
    const [loading, setLoading] = useState(true);
    const fetchMedicalexamData = async () => {
        setLoading(true);
        try {
            const savedClinic = localStorage.getItem("selectedClinic");
            if (savedClinic) {
                const params = { outpatientclinicid: savedClinic };
                const response = await Outpatientregistration.getAll(params);
                setListMedicalexamDataData(response.data);
            }
        } catch (error) {
            console.error("Error fetching Outpatientregistrations:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchMedicalexamData();
    }, [location]);
    const handleClinkPatient = (e, outpatientregistrationid) => {
        setSelectedRowId(outpatientregistrationid);
        const MedicalexamData = listMedicalexamData.find(p => String(p.outpatientregistrationid) === String(outpatientregistrationid)) || {};
        setMedicalexamDataData(MedicalexamData);
    };
    function handleexam() {
        navigate("/His/Medicalexam/Detail/" + selectedRowId);
    }
    return (
        <div>
            <div class="row p-o">
                <div class="col-lg-7 mb-4">
                    <div class="card shadow-sm mb-0">
                        <div class="card-body pb-0">
                            <h4 class="card-title">Danh sách bệnh nhân</h4>
                            <div>
                                <button class="btn btn-primary btn-sm me-1">Gọi khám</button>
                                <button class="btn btn-primary btn-sm me-1" onClick={handleexam}>Khám bệnh</button>
                                <button class="btn btn-primary btn-sm me-1">Chỉ định dịch vụ</button>
                                <button class="btn btn-primary btn-sm">In ấn</button>
                            </div>
                            <div className="border rounded mt-2" style={{ maxHeight: '70vh', overflow: 'auto' }}>
                                <table id="Patienttable" class="table" style={{ width: '100%' }} >
                                    <thead class=" sticky-top bg-white " style={{zIndex:1}}>
                                        <tr >
                                            <th className="text-nowrap" scope="col">Trạng thái</th>
                                            <th className="text-nowrap" scope="col">Mã TN</th>
                                            <th className="text-nowrap" scope="col">Mã BN</th>
                                            <th className="text-nowrap" scope="col">Mã DD</th>
                                            <th className="text-nowrap" scope="col">Tên bệnh nhân</th>
                                            <th className="text-nowrap" scope="col">Giới tính</th>
                                            <th className="text-nowrap" scope="col">Ngày tiếp nhận</th>
                                            <th className="text-nowrap" scope="col">Số thứ tự</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {!loading &&
                                            (
                                                listMedicalexamData.map(item => {
                                                    return (
                                                        <tr onDoubleClick={handleexam} onClick={(e) => handleClinkPatient(e, item.outpatientregistrationid)} className={`${selectedRowId === item.outpatientregistrationid ? "bg-warning bg-opacity-50 text-dark" : ""}`}>
                                                            <td class="align-middle">
                                                                <div class="fs-7 my-1 p-2  badge bg-primary">
                                                                    {item.examinationstatus === 0
                                                                        ? "Hủy khám"
                                                                        : item.examinationstatus === 1
                                                                            ? "Đang chờ khám"
                                                                            : item.examinationstatus === 2
                                                                                ? "Đang khám"
                                                                                : item.examinationstatus === 3
                                                                                    ? "Hoàn tất khám"
                                                                                    : "Không xác định"}
                                                                </div>
                                                            </td>
                                                            <td class="align-middle" >{item.outpatientregistrationid}</td>
                                                            <td class="align-middle" >{item.patientid}</td>
                                                            <td class="align-middle" >{item.patient?.personalid}</td>
                                                            <td class="align-middle" >{item.patient?.fullname}</td>
                                                            <td class="align-middle">{item.patient?.gender ? "Nam" : "Nữ"}</td>
                                                            <td class="align-middle">{new Date(item.registrationtime).toLocaleDateString('vi-VN')}</td>
                                                            <td class="align-middle" >Số thứ tự {item.queueorder}</td>
                                                        </tr>
                                                    );
                                                })

                                            )
                                        }

                                    </tbody>

                                </table>
                                {loading &&
                                    (
                                        <div class="d-flex justify-content-center w-100">
                                            <div class="spinner-border text-primary" role="status">
                                                <span class="sr-only">Loading...</span>
                                            </div>
                                        </div>

                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h4 class="card-title">Thông tin bệnh nhân</h4>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Mã BN:</div>
                                <div class="col-8">{medicalexamData.patientid || '—'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Họ và tên:</div>
                                <div class="col-8 text-danger fs-5 fw-bold">{medicalexamData.patient?.fullname || '—'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Địa chỉ:</div>
                                <div class="col-8 ">{medicalexamData.patient?.address || '—'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Ngày sinh:</div>
                                <div class="col-4 ">{medicalexamData.patient?.dateofbirth?new Date(medicalexamData.patient?.dateofbirth).toLocaleDateString('vi-VN'):"—"}</div>
                                <div class="col-2 fw-bold">Giới tính:</div>
                                <div class="col-2 ">{medicalexamData.patient?.gender? "Nam" :medicalexamData.patient?.gender? "Nữ":"—"}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Số điện thoại:</div>
                                <div class="col-8 ">{medicalexamData.patient?.phone || '—'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Email:</div>
                                <div class="col-8">{medicalexamData.patient?.email || '—'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Số thứ tự:</div>
                                <div class="col-8">{medicalexamData.queueorder || '—'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Thời gian tiếp nhận:</div>
                                <div class="col-8 ">{medicalexamData?.registrationtime?new Date(medicalexamData?.registrationtime).toLocaleDateString('vi-VN'):"—"}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Bệnh chính:</div>
                                <div class="col-8">{medicalexamData.medicalexamination?.diseasename || '—'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-4 fw-bold">Bệnh phụ:</div>
                                <div class="col-8">{medicalexamData.medicalexamination?.secondarydiseasenames || '—'}</div>
                            </div>
                            <div class="row">
                                <div class="col-4 fw-bold">Xử trí:</div>
                                <div class="col-8">{medicalexamData.disposition?.name || '—'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}