import toast from 'react-hot-toast';
import Blog from "../../../services/BlogService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';

export default function BlogCreate() {
    const navigate = useNavigate();
    const [loadingPost, setLoadingPost] = useState(false);
    const [blogData, setBlogData] = useState({
        title: "",
        description: "",
        detail: "",
        image: "",
        createdby: "",
        modifiedby: "",
        isactive: true
    });

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setBlogData(prev => ({ ...prev, [name]: value }));
    }

    function handleChangeEditor(content) {
        setBlogData(prev => ({ ...prev, detail: content }));
    }

    const postBlog = async (e) => {
        e.preventDefault();
        setLoadingPost(true);
        try {
            const response = await Blog.create(blogData);
            setLoadingPost(false);
            toast.success(response.message || "Thêm mới blog thành công");
            navigate("/his/blog");
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
            console.error("Error creating blog:", error);
        }
    };

    return (
        <>
            <div className="d-flex mb-1">
                <Link to="/his/blog" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Thêm mới bài viết</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingPost} onClick={postBlog}>
                        {loadingPost ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Thêm")}
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
                            value={blogData.title}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        />
                    </div>

                    <div className="py-1">
                        <label className="fw-bold">Mô tả</label>
                        <textarea
                            name="description"
                            value={blogData.description}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        ></textarea>
                    </div>

                    <div className="py-1">
                        <label className="fw-bold">Người viết bài</label>
                        <input
                            type="text"
                            name="createdby"
                            value={blogData.createdby}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        />
                    </div>

                    <div className="py-1">
                        <label className="fw-bold">Người sửa bài</label>
                        <input
                            type="text"
                            name="modifiedby"
                            value={blogData.modifiedby}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        />
                    </div>

                    <div className="py-1">
                        <label className="fw-bold">Trạng thái</label>
                        <select
                            name="isactive"
                            value={blogData.isactive}
                            onChange={e => setBlogData(prev => ({ ...prev, isactive: e.target.value === "true" }))}
                            className="form-select border-primary"
                        >
                            <option value="">--</option>
                            <option value="true">Hiện</option>
                            <option value="false">Ẩn</option>
                        </select>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="py-1">
                        <label className="fw-bold">Ảnh bìa</label>
                        <input
                            type="text"
                            name="image"
                            value={blogData.image}
                            onChange={handleChangeInput}
                            className="form-control border-primary"
                        />
                        {blogData.image && <img src={blogData.image} alt="Ảnh bìa" className="img-fluid mx-auto mt-2" style={{ width: "250px" }} />}
                    </div>
                </div>

                <div className="col-12">
                    <div className="py-1">
                        <label className="fw-bold">Nội dung bài viết</label>
                        <Editor value={blogData.detail} onChange={handleChangeEditor} />
                    </div>
                </div>
            </form>
        </>
    );
}
