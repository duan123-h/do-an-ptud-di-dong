import Room from "../../../services/RoomService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import 'react-quill/dist/quill.snow.css'
export default function RoomIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [roomData, setRoomData] = useState([]);
    const fetchRoomData = async () => {
        setLoading(true);
        try {
            const response = await Room.getAll();
            console.log(response.data);
            setRoomData(response.data);
        } catch (error) {
            console.error("Error fetching Rooms:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchRoomData();
    }, [location]);
    function handleDelete(Roomid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa phòng ${name} không?`,
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
                    await Room.destroy(Roomid);
                    mysal.fire('Đã xóa!', 'phòng đã được xóa.', 'success');
                    fetchRoomData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa phòng không thành công.', 'errors');
                }
            },
        })
    }
    async function handleIsactive(Roomid) {
        try {
            await Room.isactive(Roomid);
            mysal.fire('Đã ẩn!', 'phòng đã được ẩn.', 'success');
            fetchRoomData();
        } catch (error) {
            swal.fire('Lỗi!', 'ẩn phòng không thành công.', 'errors');
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
                    <h4 class="card-title">Quản lý loại phòng</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/admin/room" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/admin/room/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã Phòng</th>
                                    <th scope="col">Số phòng</th>
                                    <th scope="col">hạng phòng</th>
                                    <th scope="col">Khoa</th>
                                    <th scope="col">giá phòng</th>
                                    <th scope="col">Sức chứa</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading &&
                                    (
                                        roomData.map(item => {
                                            return (
                                                <tr key={item.Roomid}>
                                                    <th className="align-middle" scope="row">{item.roomid}</th>
                                                    <td className="align-middle" >{item.roomnumber}</td>
                                                    <td className="align-middle" >{item.roomtype?.name}</td>
                                                    <td className="align-middle" >{item.department?.name}</td>
                                                    <td className="align-middle">{formatVND(item.roomtype.price)}</td>
                                                    <td className="align-middle" >{item.capacity}</td>
                                                    <td class="align-middle">
                                                        <div className={`fs-7 my-1 p-2  badge ${item.isactive ? ` bg-success` : ` text-dark badge bg-warning`}`}>{item.isactive ? "Hiện" : `Ẩn`}</div>
                                                    </td>
                                                    <td className="align-middle" style={{ minWidth: '170px', width: '170px' }}>
                                                        <button onClick={() => handleIsactive(item.roomid)} className={`btn ${item.isactive ? ` btn-warning ` : ` btn-success `}mx-1 px-2 py-1`}><i
                                                            className={`fa-regular  ${item.isactive ? ` fa-eye-slash ` : ` fa-eye `} fs-6`}></i></button>
                                                        <Link to={`/admin/Room/edit/${item.roomid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                        <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                            className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.roomid, item.roomnumber)}></i></button>
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