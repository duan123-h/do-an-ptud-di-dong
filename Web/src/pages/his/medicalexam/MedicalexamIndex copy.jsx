import Outpatientregistration from "../../../services/his/OutpatientregistrationService";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"

export default function MedicalexamIndex() {

    const mysal = withReactContent(swal);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [listMedicalexamData, setListMedicalexamDataData] = useState([]);
    const [medicalexamData, setMedicalexamDataData] = useState({});
    const fetchMedicalexamData = async () => {
        try {
            const savedClinic = localStorage.getItem("selectedClinic");
            if(savedClinic){
                const params = { outpatientclinicid: savedClinic };
                const response = await Outpatientregistration.getAll(params);
                setListMedicalexamDataData(response.data);  
            }
        } catch (error) {
            console.error("Error fetching Outpatientregistrations:", error);
        }
    };
    const location = useLocation();
    useEffect(() => {
        fetchMedicalexamData();
    }, [location]);
    const handleClinkPatient = (e,outpatientregistrationid) => {
        setSelectedRowId(outpatientregistrationid);
        const MedicalexamData = listMedicalexamData.find(p => String(p.outpatientregistrationid) === String(outpatientregistrationid)) || {};
        setMedicalexamDataData(MedicalexamData);
    };
    return (
        <>
            <h3>Danh sách bệnh nhân</h3>
            <div class="d-sm-flex flex-row d-block align-items-center">
                <button class="btn btn-primary me-2" value="" id="call">Gọi khám</button>
                <button class="btn btn-primary me-2" value="" id="examine">Khám bệnh</button>
                <button class="btn btn-primary me-2" value="" disabled id="service">Chỉ định dịch vụ</button>
                <div class="btn-group me-2">
                    <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        In ấn
                    </button>
                    <ul class="dropdown-menu">
                        <li><button id="linkprintdonthuoc" disabled class="dropdown-item">Đơn thuốc</button></li>
                        <li><button id="linkprintcls" disabled class="dropdown-item">Phiếu hướng dẫn cls</button></li>
                    </ul>
                </div>
            </div>
            <div class="d-flex">
                <div class="col-6">
                    <div class="table-responsive overflow-auto" style={{maxHeight:'75vh'}}>
                        <table id="Patienttable" class="table"style={{width:'100%'}} >
                            <thead class="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Mã TN</th>
                                    <th scope="col">Mã BN</th>
                                    <th scope="col">Mã DD</th>
                                    <th scope="col">Tên bệnh nhân</th>
                                    <th scope="col">Giới tính</th>
                                    <th scope="col">Ngày tiếp nhận</th>
                                    <th scope="col">Số thứ tự</th>
                                    <th scope="col">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody >
                                {listMedicalexamData.map(item=>{
                                    return(
                                        <tr onClick={(e)=>handleClinkPatient(e,item.outpatientregistrationid)} className={`${selectedRowId === item.outpatientregistrationid? "bg-warning bg-opacity-50 text-dark" : ""}`}>
                                            <td class="align-middle"><input type="checkbox" class="row-check" /></td>
                                            <td class="align-middle" >{item.outpatientregistrationid}</td>
                                            <td class="align-middle" >{item.patientid}</td>
                                            <td class="align-middle" >{item.patient?.personalid}</td>
                                            <td class="align-middle" >{item.patient?.fullname}</td>
                                            <td class="align-middle">{item.patient?.gender?"Nam":"Nữ"}</td>
                                            <td class="align-middle">{new Date(item.registrationtime).toLocaleDateString('vi-VN')}</td>
                                            <td class="align-middle" >Số thứ tự {item.queueorder}</td>
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
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="ps-3 col-6 bg-white">
                    <h2 class="text-center fw-bold">Thông tin bệnh nhận</h2>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Mã BN</label><p class="ms-2 mb-0 fw-bold text-primary">{medicalexamData.patientid}</p>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Họ và tên</label><h2 id="fullname" class="ms-2 mb-0 fw-bold text-danger">{medicalexamData.patient?.fullname}</h2>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Địa chỉ</label><p id="address" class="ms-2 mb-0 fw-bold text-primary">{medicalexamData.patient?.address}</p>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <div class="col-6 d-flex align-items-center">
                            <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Ngày sinh</label><p id="dateofbirth" class="ms-2 mb-0 fw-bold text-primary">{new Date(medicalexamData.patient?.dateofbirth).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div class="col-6 d-flex align-items-center">
                            <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Giới tính</label><p id="gender" class="ms-2 mb-0 fw-bold text-primary">{medicalexamData.patient?.gender?"Nam":"Nữ"}</p>
                        </div>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Số điện thoại</label><p id="phone" class="ms-2 mb-0 fw-bold text-primary">{medicalexamData.patient?.phone}</p>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Email</label><p id="email" class="ms-2 mb-0 fw-bold text-primary">{medicalexamData.patient?.email}</p>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Số thứ tự</label><p id="queueorder" class="ms-2 mb-0 fw-bold text-primary">{medicalexamData.queueorder}</p>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Thời gian tiếp nhận</label><p id="registrationtime" class="ms-2 mb-0 fw-bold text-primary">{new Date(medicalexamData?.registrationtime).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Chẩn đoán</label><p id="diseasename" class="ms-2 mb-0 fw-bold text-primary">{medicalexamData.disease?.diseasename}</p>
                    </div>
                    <div class="py-2 d-flex align-items-center">
                        <label style={{minWidth:'150px'}}  class="text-mutd fw-bold">Xử trí</label><p id="disposition" class="ms-2 mb-0 fw-bold text-primary">{medicalexamData.medicalexamination?.disposition?.name}</p>
                    </div>
                </div>
            </div>
        </>
    );
}