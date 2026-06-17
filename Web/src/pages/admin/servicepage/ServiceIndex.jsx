import Service from "../../../services/ServiceService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import 'react-quill/dist/quill.snow.css'
import DOMPurify from "dompurify";
export default function ServiceIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [serviceData, setServiceData] = useState([]);
    const fetchServiceData = async () => {
        setLoading(true);
        try {
            const response = await Service.getAll();
            console.log(response.data);
            setServiceData(response.data);
        } catch (error) {
            console.error("Error fetching Services:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchServiceData();
    }, [location]);
    function handleDelete(Serviceid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa dịch vụ ${name} không?`,
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            preConfirm: async () => {
                try {
                    await Service.destroy(Serviceid);
                    mysal.fire('Đã xóa!', 'dịch vụ đã được xóa.', 'success');
                    fetchServiceData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa dịch vụ không thành công.', 'errors');
                }
            },
        })
    }
    async function handleIsactive(Serviceid) {
        try {
            await Service.isactive(Serviceid);
            mysal.fire('Đã ẩn!', 'dịch vụ đã được ẩn.', 'success');
            fetchServiceData();
        } catch (error) {
            swal.fire('Lỗi!', 'ẩn dịch vụ không thành công.', 'errors');
        }
    }
    function formatVND(amount) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    }
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý dịch vụ</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/his/Service" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/his/Service/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã dịch vụ</th>
                                    <th scope="col">Tên dịch vụ</th>
                                    <th scope="col">Loại dịch vụ</th>
                                    <th scope="col">Mô tả dịch vụ</th>
                                    <th scope="col">giá dịch vụ</th>
                                    <th scope="col">Phòng thực hiện</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading &&
                                    (
                                        serviceData.map(item => {
                                            return (
                                                <tr key={item.Serviceid}>
                                                    <th className="align-middle" scope="row">{item.serviceid}</th>
                                                    <td className="align-middle" >{item.name}</td>
                                                    <td className="align-middle" >{item.servicecategory?.name}</td>
                                                    <td className="align-middle"><div className=" ql-snow" ><div className="ql-editor" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description) }}></div></div></td>
                                                    <td className="align-middle">{formatVND(item.price)}</td>
                                                    <td className="align-middle" >{item.outpatientclinic?.name}</td>
                                                    <td class="align-middle">
                                                        <div className={`fs-7 my-1 p-2  badge ${item.isactive ? ` bg-success` : ` text-dark badge bg-warning`}`}>{item.isactive ? "Hiện" : `Ẩn`}</div>
                                                    </td>
                                                    <td className="align-middle" style={{ minWidth: '170px', width: '170px' }}>
                                                        <button onClick={() => handleIsactive(item.serviceid)} className={`btn ${item.isactive ? ` btn-warning ` : ` btn-success `}mx-1 px-2 py-1`}><i
                                                            className={`fa-regular  ${item.isactive ? ` fa-eye-slash ` : ` fa-eye `} fs-6`}></i></button>
                                                        <Link to={`/his/Service/edit/${item.serviceid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                        <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                            className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.serviceid, item.name)}></i></button>
                                                    </td>
                                                </tr>
                                            );
                                        })

                                    )
                                }
                            </tbody>
                        </table>
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
            </div>
        </>
    );
}