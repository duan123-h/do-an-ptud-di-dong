import Medicine from "../../../services/MedicineService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import 'react-quill/dist/quill.snow.css'
export default function MedicineIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [medicineData, setMedicineData] = useState([]);
    const fetchMedicineData = async () => {
        setLoading(true);
        try {
            const response = await Medicine.getAll();
            console.log(response.data);
            setMedicineData(response.data);
        } catch (error) {
            console.error("Error fetching Medicines:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchMedicineData();
    }, [location]);
    function handleDelete(Medicineid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa thuốc ${name} không?`,
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
                    await Medicine.destroy(Medicineid);
                    mysal.fire('Đã xóa!', 'thuốc đã được xóa.', 'success');
                    fetchMedicineData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa thuốc không thành công.', 'errors');
                }
            },
        })
    }

    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý thuốc</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/his/Medicine" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/his/Medicine/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col" style={{ width: '100px', minWidth: '100px' }} >Mã thuốc</th>
                                    <th scope="col">Tên thuốc</th>
                                    <th scope="col">Hoạt chất</th>
                                    <th scope="col">Dạng bào chế</th>
                                    <th scope="col">Chỉ định</th>
                                    <th scope="col">Liều dùng</th>
                                    <th scope="col">Chống chỉ định</th>
                                    <th scope="col">Thận trọng</th>
                                    <th scope="col">Thai kỳ & Cho con bú</th>
                                    <th scope="col">Ảnh hưởng khi lái xe/máy</th>
                                    <th scope="col">Tương tác thuốc</th>
                                    <th scope="col">Tác dụng phụ</th>
                                    <th scope="col">Xử trí khi quá liều</th>
                                    <th scope="col">Quy cách đóng gói</th>
                                    <th scope="col">Bảo quản</th>
                                    <th scope="col">Tiêu chuẩn chất lượng</th>
                                    <th scope="col">Nhà sản xuất</th>
                                    <th scope="col">Địa chỉ sản xuất</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading &&
                                    (
                                        medicineData.map(item => {
                                            return (
                                                <tr key={item.Medicineid}>
                                                    <th className="align-middle" scope="row">{item.medicineid}</th>
                                                    <td className="align-middle">{item.name}</td>
                                                    <td className="align-middle">{item.activeingredients}</td>
                                                    <td className="align-middle">{item.dosageform?.dosageformname}</td>
                                                    <td className="align-middle">{item.indications}</td>
                                                    <td className="align-middle">{item.dosage}</td>
                                                    <td className="align-middle">{item.contraindications}</td>
                                                    <td className="align-middle">{item.precautions}</td>
                                                    <td className="align-middle">{item.pregnancybreastfeeding}</td>
                                                    <td className="align-middle">{item.drivingmachineuse}</td>
                                                    <td className="align-middle">{item.interactions}</td>
                                                    <td className="align-middle">{item.sideeffects}</td>
                                                    <td className="align-middle">{item.overdosetreatment}</td>
                                                    <td className="align-middle">{item.packaging}</td>
                                                    <td className="align-middle">{item.storageconditions}</td>
                                                    <td className="align-middle">{item.qualitystandards}</td>
                                                    <td className="align-middle">{item.manufacturer?.name}</td>
                                                    <td className="align-middle">{item.manufacturer?.address}</td>
                                                    <td className="align-middle" style={{ minWidth: '110px', width: '110px' }}>
                                                        <Link to={`/his/Medicine/edit/${item.medicineid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                        <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                            className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.medicineid, item.name)}></i></button>
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