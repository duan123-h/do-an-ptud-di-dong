import user from "../../../services/UserService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
export default function UserIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [userData, setUserData] = useState([]);
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await user.getAll();
            console.log(response.data);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchUserData();
    }, [location]);
    function handleDelete(userid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa người dùng ${name}?`,
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
                    await user.destroy(userid);
                    mysal.fire('Đã xóa!', 'Người dùng đã được xóa.', 'success');
                    fetchUserData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa người dùng không thành công.', 'errors');
                }
            },
        })
    }
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý người dùng</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/admin/user" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/admin/user/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã người dùng</th>
                                    <th scope="col">Ảnh đại diện</th>
                                    <th scope="col">Tên người dùng</th>
                                    <th scope="col">Số điện thoại</th>
                                    <th scope="col">Emial</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Phân quyền</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading &&
                                    (
                                        userData.map(item => {
                                            return (
                                                <tr key={item.userid}>
                                                    <th className="align-middle" scope="row">{item.userid}</th>
                                                    <td className="align-middle"><img className="rounded-circle img-fluid" style={{ objectFit: 'cover', minHeight: '60px', minWidth: '60px', maxHeight: '60px', maxWidth: '60px' }} src={item.avatar} alt="" /></td>
                                                    <td className="align-middle" >{item.name}</td>
                                                    <th className="align-middle">{item.phonenumber}</th>
                                                    <td className="align-middle">{item.email}</td>
                                                    <td className="align-middle" >{item.address}</td>
                                                    <td className="align-middle" >{item.roleid}</td>
                                                    <td className="align-middle" style={{ minWidth: '110px', Width: '110px' }}>
                                                        <Link to={`/admin/user/edit/${item.userid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                        <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                            className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.userid, item.name)}></i></button>
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