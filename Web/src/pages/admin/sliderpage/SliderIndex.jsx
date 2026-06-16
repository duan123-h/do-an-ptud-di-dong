import Slider from "../../../services/SliderService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DOMPurify from "dompurify";

export default function SliderIndex() {
    const [loading, setLoading] = useState(true);
    const mysal = withReactContent(swal);
    const [sliderData, setSliderData] = useState([]);

    const fetchSliderData = async () => {
        setLoading(true);
        try {
            const response = await Slider.getAll();
            console.log(response.data);
            setSliderData(response.data);
        } catch (error) {
            console.error("Error fetching sliders:", error);
        }
        setLoading(false);
    };

    const location = useLocation();
    useEffect(() => {
        fetchSliderData();
    }, [location]);

    // XÓA SLIDER
    function handleDelete(sliderid, title) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa slider ${title} không?`,
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
                    await Slider.destroy(sliderid);
                    mysal.fire('Đã xóa!', 'Slider đã được xóa.', 'success');
                    fetchSliderData();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa slider không thành công.', 'error');
                }
            },
        });
    }

    // ĐỔI TRẠNG THÁI
    async function handleIsactive(sliderid) {
        try {
            await Slider.isactive(sliderid);
            mysal.fire('Thành công!', 'Đổi trạng thái thành công.', 'success');
            fetchSliderData();
        } catch (error) {
            swal.fire('Lỗi!', 'Đổi trạng thái thất bại.', 'error');
        }
    }

    return (
        <>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h4 className="card-title">Quản lý slider</h4>

                    <div className="d-sm-flex flex-row d-block align-items-center">

                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input
                                name="search"
                                type="text"
                                className="form-control border-dark me-2"
                                style={{ Width: '250px' }}
                                placeholder="Tìm kiếm..."
                            />
                            <button className="btn btn-primary" type="submit">
                                <i className="fa-solid fa-search"></i>
                            </button>
                            <Link to="/admin/slider" className="btn btn-primary ms-2">
                                <i className="fa-solid fa-rotate-right"></i>
                            </Link>
                        </form>

                        <Link
                            to="/admin/slider/create"
                            className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"
                        >
                            <i className="fa-solid fa-plus me-2"></i>Thêm
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table" style={{ Width: '100%' }}>
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th scope="col">Mã Slider</th>
                                    <th scope="col">Tiêu đề</th>
                                    <th scope="col">Mô tả slider</th>
                                    <th scope="col">Thứ tự</th>
                                    <th scope="col">Ảnh</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Chức năng</th>
                                </tr>
                            </thead>

                            <tbody>
                                {!loading &&
                                    sliderData.map(item => {
                                        return (
                                            <tr key={item.sliderid}>
                                                <th className="align-middle" scope="row">
                                                    {item.sliderid}
                                                </th>

                                                <td className="align-middle">{item.title}</td>

                                                <td className="align-middle" style={{ minWidth: "150px" }}>
                                                    <div className="ql-snow">
                                                        <div
                                                            className="ql-editor"
                                                            dangerouslySetInnerHTML={{
                                                                __html: DOMPurify.sanitize(item.description),
                                                            }}
                                                        ></div>
                                                    </div>
                                                </td>

                                                <td className="align-middle">{item.displayorder}</td>

                                                <td className="align-middle">
                                                    <img
                                                        src={item.imagepath}
                                                        className="img-fluid"
                                                        style={{ height: "80px" }}
                                                        alt=""
                                                    />
                                                </td>

                                                <td className="align-middle">
                                                    <div
                                                        className={`fs-7 my-1 p-2 badge ${item.isactive
                                                                ? "bg-success"
                                                                : "bg-warning text-dark"
                                                            }`}
                                                    >
                                                        {item.isactive ? "Hiện" : "Ẩn"}
                                                    </div>
                                                </td>

                                                <td
                                                    className="align-middle"
                                                    style={{ minWidth: "170px", width: "170px" }}
                                                >
                                                    <button
                                                        onClick={() => handleIsactive(item.sliderid)}
                                                        className={`btn ${item.isactive ? "btn-warning" : "btn-success"} mx-1 px-2 py-1`}
                                                    >
                                                        <i
                                                            className={`fa-regular ${item.isactive ? "fa-eye-slash" : "fa-eye"
                                                                } fs-6`}
                                                        ></i>
                                                    </button>

                                                    <Link
                                                        to={`/admin/slider/edit/${item.sliderid}`}
                                                        className="btn btn-primary mx-1 px-2 py-1"
                                                    >
                                                        <i className="fa-regular fa-edit fs-6"></i>
                                                    </Link>

                                                    <button
                                                        className="btn btn-danger mx-1 px-2 py-1"
                                                        onClick={() => handleDelete(item.sliderid, item.title)}
                                                    >
                                                        <i className="fa-regular fa-trash-can fs-6"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>

                    {loading && (
                        <div className="d-flex justify-content-center w-100 mb-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
