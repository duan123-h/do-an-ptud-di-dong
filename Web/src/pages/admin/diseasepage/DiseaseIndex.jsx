import Disease from "../../../services/DiseaseService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
import 'react-quill/dist/quill.snow.css'
export default function DiseaseIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [diseaseData, setDiseaseData] = useState([]);
    const fetchDiseaseData = async () => {
        setLoading(true);
        try {
            const response = await Disease.getAll();
            console.log(response.data);
            setDiseaseData(response.data);
        } catch (error) {
            console.error("Error fetching Diseases:", error);
        }
        setLoading(false);
    };
    const location = useLocation();
    useEffect(() => {
        fetchDiseaseData();
    }, [location]);
    function handleDelete(Diseaseid, name) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa bệnh ${name} không?`,
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
                    var res = await Disease.destroy(Diseaseid);
                    mysal.fire('Đã xóa!', 'bệnh đã được xóa.', 'success');
                    fetchDiseaseData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa bệnh không thành công.', 'errors');
                }
            },
        })
    }
    return (
        <>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý bệnh</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/his/Disease" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/his/Disease/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }} >
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã bệnh</th>
                                    <th scope="col">Nhóm bệnh</th>
                                    <th scope="col">Tên bệnh</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading &&
                                    (
                                        diseaseData.map(item => {
                                            return (
                                                <tr key={item.diseaseid}>
                                                    <th className="align-middle" scope="row">{item.diseaseid}</th>
                                                    <td className="align-middle" >{item.diseasegroup?.name}</td>
                                                    <td className="align-middle">{item.diseasename}</td>
                                                    <td className="align-middle" style={{ minWidth: '110px', width: '110px' }}>
                                                        <Link to={`/his/Disease/edit/${item.diseaseid}`} className="btn btn-primary mx-1 px-2 py-1"><i className="fa-regular fa-edit fs-6"></i></Link>
                                                        <button className="btn btn-danger mx-1 px-2 py-1"><i
                                                            className="fa-regular fa-trash-can fs-6" onClick={() => handleDelete(item.diseaseid, item.diseasename)}></i></button>
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