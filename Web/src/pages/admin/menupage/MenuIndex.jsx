import Menu from "../../../services/MenuService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import 'react-quill/dist/quill.snow.css'
import DOMPurify from "dompurify";
export default function MenuIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [menuData, setMenuData] = useState([]);
    const fetchMenuData = async () => {
        setLoading(true);
        try {
            const response = await Menu.getAll();
            console.log(response.data);
            setMenuData(response.data);
        } catch (error) {
            console.error("Error fetching Menus:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchMenuData();
    }, [location]);
    function handleDelete(menuid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa menu ${name} không?`,
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
                    await Menu.destroy(menuid);
                    mysal.fire('Đã xóa!', 'menu đã được xóa.', 'success');
                    fetchMenuData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa menu không thành công.', 'errors');
                }
            },
        })
    }
    async function handleIsactive(menuid) {
        try {
            await Menu.isactive(menuid);
            mysal.fire('Đã ẩn!', 'menu đã được ẩn.', 'success');
            fetchMenuData();
        } catch (error) {
            swal.fire('Lỗi!', 'ẩn menu không thành công.', 'errors');
        }
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
                            <Link to="/his/Menu" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/his/menu/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive" >
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <th scope="col">Mã Menu</th>
                                <th scope="col">Tên</th>
                                <th scope="col">Đường dẫn</th>
                                <th scope="col">Cấp</th>
                                <th scope="col">Menu Cha</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Chức năng</th>
                            </thead>
                            <tbody>
                                {!loading && (
                                    menuData.map(item => {
                                        const menucha= menuData.find(m=>m.menuid==item.parentid);
                                        return (
                                            <tr key={item.menuid}>

                                                <th class="align-middle" scope="row">{item.menuid}</th>
                                                <td class="align-middle" >{item.title}</td>
                                                <td class="align-middle" >{item.link}</td>
                                                <td class="align-middle">{item.levels}</td>
                                                <td class="align-middle">{menucha?.title??""}</td>
                                                <td class="align-middle">
                                                    <div className={`fs-7 my-1 p-2  badge ${item.isactive ? ` bg-success` : ` text-dark badge bg-warning`}`}>{item.isactive ? "Hiện" : `Ẩn`}</div>
                                                </td>
                                                <td className="align-middle" style={{ minWidth: '170px', width: '170px' }}>
                                                    <button onClick={() => handleIsactive(item.menuid)} className={`btn ${item.isactive ? ` btn-warning ` : ` btn-success `}mx-1 px-2 py-1`}><i
                                                        className={`fa-regular  ${item.isactive ? ` fa-eye-slash ` : ` fa-eye `} fs-6`}></i></button>
                                                    <Link to={`/his/menu/edit/${item.menuid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                    <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                        className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.menuid, item.name)}></i></button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )
                                }
                            </tbody>
                        </table>
                    </div >
                    {loading &&
                        (
                            <div class="d-flex justify-content-center w-100 mb-3">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>

                        )
                    }
                </div >
            </div >
        </>
    );
}