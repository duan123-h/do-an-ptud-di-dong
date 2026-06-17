import Department from "../../../services/DepartmentService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import 'react-quill/dist/quill.snow.css'
import DOMPurify from "dompurify";
export default function DepartmentIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [departmentData, setDepartmentData] = useState([]);
    const fetchDepartmentData = async () => {
        setLoading(true);
        try {
            const response = await Department.getAll();
            console.log(response.data);
            setDepartmentData(response.data);
        } catch (error) {
            console.error("Error fetching Departments:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchDepartmentData();
    }, [location]);
    function handleDelete(Departmentid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa khoa ${name} không?`,
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
                    var res = await Department.destroy(Departmentid);
                    mysal.fire('Đã xóa!', 'khoa đã được xóa.', 'success');
                    fetchDepartmentData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa khoa không thành công.', 'errors');
                }
            },
        })
    }
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý khoa</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/his/department" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/his/department/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive" >
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã khoa</th>
                                    <th scope="col">Tên khoa</th>
                                    <th scope="col">Mô tả</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading &&
                                    (
                                        departmentData.map(item => {
                                            return (
                                                <tr key={item.departmentid}>
                                                    <th className="align-middle" scope="row">{item.departmentid}</th>
                                                    <td className="align-middle" >{item.name}</td>
                                                    <td className="align-middle"><div className=" ql-snow" ><div className="ql-editor" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description) }}></div></div></td>
                                                    <td className="align-middle" style={{ minWidth: '110px', width: '110px' }}>
                                                        <Link to={`/his/department/edit/${item.departmentid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                        <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                            className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.departmentid, item.name)}></i></button>
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