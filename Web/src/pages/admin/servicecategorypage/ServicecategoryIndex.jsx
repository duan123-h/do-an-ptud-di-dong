import Servicecategory from "../../../services/ServicecategoryService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import 'react-quill/dist/quill.snow.css'
import DOMPurify from "dompurify";
export default function ServicecategoryIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [servicecategoryData, setServicecategoryData] = useState([]);
    const fetchServicecategoryData = async () => {
        setLoading(true);
        try {
            const response = await Servicecategory.getAll();
            console.log(response.data);
            setServicecategoryData(response.data);
        } catch (error) {
            console.error("Error fetching Servicecategorys:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchServicecategoryData();
    }, [location]);
    function handleDelete(Servicecategoryid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa loại dịch vụ ${name} không?`,
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
                    await Servicecategory.destroy(Servicecategoryid);
                    mysal.fire('Đã xóa!', 'loại dịch vụ đã được xóa.', 'success');
                    fetchServicecategoryData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa loại dịch vụ không thành công.', 'errors');
                }
            },
        })
    }
    async function handleIsactive(Servicecategoryid) {
        try {
            await Servicecategory.isactive(Servicecategoryid);
            mysal.fire('Đã ẩn!', 'loại dịch vụ đã được ẩn.', 'success');
            fetchServicecategoryData();
        } catch (error) {
            swal.fire('Lỗi!', 'ẩn loại dịch vụ không thành công.', 'errors');
        }
    }
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý loại dịch vụ</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/his/Servicecategory" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/his/Servicecategory/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã loại dịch vụ</th>
                                    <th scope="col">Tên loại dịch vụ</th>
                                    <th scope="col">Mô tả ngắn</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading &&
                                    (
                                        servicecategoryData.map(item => {
                                            return (
                                                <tr key={item.servicecategoryid}>
                                                    <th className="align-middle" scope="row">{item.servicecategoryid}</th>
                                                    <td className="align-middle" >{item.name}</td>
                                                    <td className="align-middle"><div className=" ql-snow" ><div className="ql-editor" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description) }}></div></div></td>
                                                    <td class="align-middle">
                                                        <div className={`fs-7 my-1 p-2  badge ${item.isactive ? ` bg-success` : ` text-dark badge bg-warning`}`}>{item.isactive ? "Hiện" : `Ẩn`}</div>
                                                    </td>
                                                    <td className="align-middle" style={{ minWidth: '170px', width: '170px' }}>
                                                        <button onClick={() => handleIsactive(item.servicecategoryid)} className={`btn ${item.isactive ? ` btn-warning ` : ` btn-success `}mx-1 px-2 py-1`}><i
                                                            className={`fa-regular  ${item.isactive ? ` fa-eye-slash ` : ` fa-eye `} fs-6`}></i></button>
                                                        <Link to={`/his/Servicecategory/edit/${item.servicecategoryid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                        <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                            className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.servicecategoryid, item.name)}></i></button>
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