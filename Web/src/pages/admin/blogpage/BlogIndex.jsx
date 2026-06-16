import Blog from "../../../services/BlogService";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function BlogIndex() {

    const [loading, setLoading] = useState(true);
    const [blogData, setBlogData] = useState([]);
    const mysal = withReactContent(swal);
    const location = useLocation();

    const fetchBlogData = async () => {
        setLoading(true);
        try {
            const response = await Blog.getAll();
            setBlogData(response.data);
        } catch (error) {
            console.error("Error fetching Blog:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBlogData();
    }, [location]);

    function handleDelete(blogid, title) {
        mysal.fire({
            title: `Bạn có chắc muốn xóa blog "${title}" không?`,
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            preConfirm: async () => {
                try {
                    await Blog.destroy(blogid);
                    mysal.fire("Đã xóa!", "Blog đã được xóa.", "success");
                    fetchBlogData();
                } catch (error) {
                    swal.fire("Lỗi!", "Xóa blog không thành công.", "error");
                }
            },
        });
    }

    async function handleIsactive(blogid) {
        try {
            await Blog.isactive(blogid);
            mysal.fire("Đã cập nhật!", "Trạng thái blog đã được thay đổi.", "success");
            fetchBlogData();
        } catch (error) {
            swal.fire("Lỗi!", "Cập nhật trạng thái không thành công.", "error");
        }
    }
    function formatDate(dateStr) {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("vi-VN");
    }

    return (
        <>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h4 className="card-title">Quản lý bài viết</h4>

                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2"
                                style={{ width: "250px" }} placeholder="Tìm kiếm..." />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/admin/blog" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>

                        <Link to="/admin/blog/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap">
                            <i className="fa-solid fa-plus me-2"></i>Thêm
                        </Link>
                    </div>

                    <div className="table-responsive">
                        <table className="table">
                            <thead className="border-bottom-2 border-dark">
                                <tr>
                                    <th>Mã Blog</th>
                                    <th>Ảnh</th>
                                    <th>Tiêu đề</th>
                                    <th>Người đăng bài</th>
                                    <th>Ngày đăng</th>
                                    <th>Người viết</th>
                                    <th>Người sửa</th>
                                    <th>Ngày sửa</th>
                                    <th>Trạng thái</th>
                                    <th>Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && blogData.map(item => 
                                {
                                    return (
                                        <tr key={item.blogid}>
                                            <th className="align-middle">{item.blogid}</th>

                                            <td className="align-middle">
                                                <img src={item.image} alt="" className="img-fluid"
                                                    style={{ minWidth: "100px", maxWidth: "100px" }} />
                                            </td>

                                            <td className="align-middle">{item.title}</td>
                                            <td className="align-middle">{item.user?.name}</td>
                                            <td className="align-middle">{formatDate(item.createddate)}</td>
                                            <td className="align-middle">{item.createdby}</td>
                                            <td className="align-middle">{item.modifiedby}</td>
                                            <td className="align-middle">{formatDate(item.modifieddate)}</td>

                                            <td className="align-middle">
                                                <div className={`fs-7 my-1 p-2 badge ${item.isactive ? "bg-success" : "bg-warning text-dark"}`}>
                                                    {item.isactive ? "Hiện" : "Ẩn"}
                                                </div>
                                            </td>

                                            <td className="align-middle" style={{ minWidth: "160px", width: "160px" }}>
                                                <button onClick={() => handleIsactive(item.blogid)}
                                                    className={`btn ${item.isactive ? "btn-warning" : "btn-success"} mx-1 px-2 py-1`}>
                                                    <i className={`fa-regular ${item.isactive ? "fa-eye-slash" : "fa-eye"} fs-6`}></i>
                                                </button>

                                                <Link to={`/admin/blog/edit/${item.blogid}`}
                                                    className="btn btn-primary mx-1 px-2 py-1">
                                                    <i className="fa-regular fa-edit fs-6"></i>
                                                </Link>

                                                <button className="btn btn-danger mx-1 px-2 py-1"
                                                    onClick={() => handleDelete(item.blogid, item.title)}>
                                                    <i className="fa-regular fa-trash-can fs-6"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
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
