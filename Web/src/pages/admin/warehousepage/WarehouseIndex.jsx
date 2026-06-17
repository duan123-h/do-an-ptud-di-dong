import Warehouse from "../../../services/WarehouseService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import 'react-quill/dist/quill.snow.css'
import DOMPurify from "dompurify";
export default function WarehouseIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [warehouseData, setWarehouseData] = useState([]);
    const fetchWarehouseData = async () => {
        setLoading(true);
        try {
            const response = await Warehouse.getAll();
            console.log(response.data);
            setWarehouseData(response.data);
        } catch (error) {
            console.error("Error fetching Warehouses:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchWarehouseData();
    }, [location]);
    function handleDelete(outpatientclinicid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn kho có tên là ${name} không?`,
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
                    var res = await Warehouse.destroy(outpatientclinicid);
                    mysal.fire('Đã xóa!', 'kho đã được xóa.', 'success');
                    fetchWarehouseData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa kho không thành công.', 'errors');
                }
            },
        })
    }
    async function handleIsactive(warehouseid) {
        try {
            await Warehouse.isactive(warehouseid);
            mysal.fire('Đã ẩn!', 'Trạng thái của kho đã được cập nhật!!!.', 'success');
            fetchWarehouseData();
        } catch (error) {
            swal.fire('Lỗi!', 'Cập nhật trạng thái cuaqr kho không thành công!!!.', 'errors');
        }
    }
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý các kho</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/his/Warehouse" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/his/Warehouse/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã kho</th>
                                    <th scope="col">Tên kho</th>
                                    <th scope="col">Vị trí</th>
                                    <th scope="col">Ghi chú</th>
                                    <th scope="col">Ngày tạo dữ liệu</th>
                                    <th scope="col">Ngày cập nhật cuối cùng</th>
                                    <th scope="col">Người quản lý</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading &&
                                    (
                                        warehouseData.map(item => {
                                            return (
                                                <tr key={item.warehouseid}>
                                                    <th className="align-middle" scope="row">{item.warehouseid}</th>
                                                    <td className="align-middle" >{item.name}</td>
                                                    <td className="align-middle">{item.location}</td>
                                                    <td className="align-middle">{item.note}</td>
                                                    <td className="align-middle">{new Date(item.createdat).toLocaleDateString('vi-VN')}</td>
                                                    <td className="align-middle">{new Date(item.updatedat).toLocaleDateString('vi-VN')}</td>
                                                    <td className="align-middle">{item.usermanagers?.map(item=>{
                                                        return (<span class="badge bg-secondary mx-2 my-2">[{item.userid}]-{item?.fullname}</span>);
                                                    })}</td>
                                                    <td class="align-middle">
                                                        <div className={`fs-7 my-1 p-2  badge ${item.isactive ? ` bg-success` : ` text-dark badge bg-warning`}`}>{item.isactive ? "Hoạt động" : `Ngừng hoạt động`}</div>
                                                    </td>
                                                    <td className="align-middle" style={{ minWidth: '170px', width: '170px' }}>
                                                        <button onClick={() => handleIsactive(item.warehouseid)} className={`btn ${item.isactive ? ` btn-warning ` : ` btn-success `}mx-1 px-2 py-1`}><i
                                                            className={`fa-regular  ${item.isactive ? ` fa-eye-slash ` : ` fa-eye `} fs-6`}></i></button>
                                                        <Link to={`/his/Warehouse/edit/${item.warehouseid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                        <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                            className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.warehouseid, item.name)}></i></button>
                                                    </td>
                                                </tr>
                                            );
                                        })

                                    )
                                }
                            </tbody>
                        </table>
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
            </div>
        </>


    );
}