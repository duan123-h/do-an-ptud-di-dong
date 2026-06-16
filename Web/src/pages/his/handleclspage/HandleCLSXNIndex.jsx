import Servicerequestdetail from "../../../services/his/ServicerequestdetailService";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"

export default function HandleCLSXNIndex() {
    const mysal = withReactContent(swal);
    const [loading, setLoading] = useState(true);
    const [clsRequestData, setClsRequestData] = useState([]);
    const fetchCLSRequestData = async () => {
        setLoading(true)
        try {
            const savedClinic = localStorage.getItem("selectedClinic");
            if (savedClinic) {
                const params = { outpatientclinicid: savedClinic };
                const response = await Servicerequestdetail.getAll(params);
                setClsRequestData(response.data);
            }
        } catch (error) {
            console.error("Error fetching Outpatientregistrations:", error);
        }
        setLoading(false)
    };
    const location = useLocation();
    useEffect(() => {
        fetchCLSRequestData();
    }, [location]);
    // function handleDelete(Outpatientregistrationid, name) {
    //     mysal.fire({
    //         title: `Bạn có chắc muốn xóa đăng ký khám bệnh của bệnh nhân ${name} không?`,
    //         text: "Hành động này không thể hoàn tác!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         showLoaderOnConfirm: true,
    //         confirmButtonColor: '#d33',
    //         cancelButtonColor: '#3085d6',
    //         confirmButtonText: 'Xóa',
    //         cancelButtonText: 'Hủy',
    //         preConfirm: async () => {
    //             try {
    //                 await Outpatientregistration.destroy(Outpatientregistrationid);
    //                 mysal.fire('Đã xóa!', 'đăng ký khám bệnh đã được xóa.', 'success');
    //                 fetchOutpatientregistrationData();
    //             } catch (error) {
    //                 swal.fire('Lỗi!', 'Xóa đăng ký khám bệnh không thành công.', 'errors');
    //             }
    //         },
    //     })
    // }
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Danh sách bệnh nhân chỉ định cận lâm sàn</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/His/Reception" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/His/Reception/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã bệnh nhân</th>
                                    <th scope="col">Mã định danh</th>
                                    <th scope="col">Tên bệnh nhân</th>
                                    <th scope="col">Giới tính</th>
                                    <th scope="col">Bác sĩ chỉ định</th>
                                    <th scope="col">Thời gian chỉ định</th>
                                    <th scope="col">Phòng thực hiện</th>
                                    <th scope="col">Số thứ tự</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && (
                                    clsRequestData.map(item => {
                                        return (
                                            <tr key={item.servicerequestdetailid}>
                                                <th class="align-middle" scope="row">{item.patient?.patientid}</th>
                                                <td class="align-middle" >{item.patient?.personalid}</td>
                                                <td class="align-middle" >{item.patient?.fullname}</td>
                                                <td class="align-middle" >{item.patient?.gender ? "Nam" : "Nữ"}</td>
                                                <td class="align-middle">{item.doctor?.name}</td>
                                                <td class="align-middle">{new Date(item.servicerequest.requesttime).toLocaleDateString('vi-VN')}</td>
                                                <td class="align-middle" >{item.outpatientclinic?.name}</td>
                                                <td class="align-middle" >Số thứ tự {item.queueorder}</td>
                                                <td class="align-middle" >
                                                    {
                                                        item.status == 0 ? (<span class="badge text-bg-warning">Đang chờ</span>) :
                                                            item.status == 1 ? (<span class="badge text-bg-danger">Đang xử lý</span>) :
                                                                item.status == 2 ? (<span class="badge text-bg-success">Hoàn thành</span>) :
                                                                    (<span class="badge text-bg-secondary">Bản nháp</span>)
                                                    }
                                                </td>
                                                <td className="align-middle" style={{ minWidth: '110px', width: '110px' }}>
                                                    <Link to={`/his/clsxnrequest/detail/${item.servicerequestdetailid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                    <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                        className="fa-regular fa-trash-can fs-6" ></i></button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    )
                                )
                                }

                            </tbody>
                        </table>

                    </div>
                </div>
                {loading &&
                    (
                        <div class="d-flex justify-content-center w-100 mb-3">
                            <div class="spinner-border text-primary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>

                    )
                }
            </div>
        </>
    );
}