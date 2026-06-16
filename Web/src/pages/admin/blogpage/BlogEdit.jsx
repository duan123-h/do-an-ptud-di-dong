import toast from 'react-hot-toast';
import Blog from "../../../services/BlogService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';

export default function BlogEdit() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [loadingPost, setLoadingPost] = useState(false);
    const [blogData, setBlogData] = useState({});
    async function getBlog(id) {
        try {
            const res = await Blog.getDetail(id);
            setBlogData(res.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("Không tồn tại blog này.");
                } else {
                    toast.error("Lỗi không xác định.");
                }
            }
        }
    }

    useEffect(() => {
        getBlog(id);
    }, [location]);

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setBlogData(prev => ({ ...prev, [name]: value }));
    }

    function handleChangeEditor(content) {
        setBlogData(prev => ({ ...prev, detail: content }));
    }

    const updateBlog = async (e) => {
        e.preventDefault();
        setLoadingPost(true);
        try {
            const response = await Blog.update(blogData, id);
            setLoadingPost(false);
            toast.success(response.message || "Cập nhật blog thành công");
            navigate("/admin/blog");
        } catch (error) {
            setLoadingPost(false);
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).forEach(errArray => 
                    errArray.forEach(msg => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error("Error updating blog:", error);
        }
    };

    return (
        <>
            <div className="d-flex mb-1">
                <Link to="/admin/blog" className="btn btn-primary me-2">
                    <i className="fa-solid fa-left-long"></i>
                </Link>
                <h3 className="m-0">Chỉnh sửa bài viết</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary fs-5" disabled={loadingPost} onClick={updateBlog}>
                        {loadingPost ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Cập nhật")}
                    </button>
                </div>
            </div>

            <form className="row pb-2">
                <div className="col-12 col-md-6">
                    <div className="py-1">
                        <label className="fw-bold">Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            value={blogData.title || ""}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        />
                    </div>
                    <div className="py-1">
                        <label className="fw-bold">Mô tả</label>
                        <textarea
                            name="description"
                            value={blogData.description || ""}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        ></textarea>
                    </div>
                    <div className="py-1">
                        <label className="fw-bold">Người viết bài</label>
                        <input
                            type="text"
                            name="createdby"
                            value={blogData.createdby || ""}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        />
                    </div>
                    <div className="py-1">
                        <label className="fw-bold">Người sửa bài</label>
                        <input
                            type="text"
                            name="modifiedby"
                            value={blogData.modifiedby || ""}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        />
                    </div>
                    <div className="py-1">
                        <label className="fw-bold">Trạng thái</label>
                        <select
                            name="isactive"
                            value={blogData.isactive}
                            onChange={handleChangeInput}
                            className="form-select border-primary"
                        >
                            <option value="">--</option>
                            <option value={1}>Hiện</option>
                            <option value={0}>Ẩn</option>
                        </select>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="py-1">
                        <label className="fw-bold">Ảnh bìa</label>
                        <input
                            type="text"
                            name="image"
                            value={blogData.image || ""}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        />
                        {blogData.image && (
                            <img src={blogData.image} alt="Ảnh bìa" className="img-fluid mx-auto mt-2" style={{ width: "250px" }} />
                        )}
                    </div>
                </div>

                <div className="col-12">
                    <div className="py-1">
                        <label className="fw-bold">Nội dung bài viết</label>
                        <Editor value={blogData.detail || ""} onChange={handleChangeEditor} />
                    </div>
                </div>
            </form>
        </>
    );
}
