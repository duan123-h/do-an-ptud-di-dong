import toast from 'react-hot-toast';
import Blog from "../../../services/BlogService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';

export default function BlogDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [blogData, setBlogData] = useState({});
    async function getBlog(id) {
        try {
            setLoading(true);
            const res = await Blog.getDetail(id);
            setBlogData(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
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


    return (
        <>
            {
                loading ? (
                    <div style={{ width: '100%', height: '100vh' }} className="d-flex justify-content-center align-items-center">
                        <div style={{ width: '50px', height: '50px' }} class="spinner-border text-primary" role="status">
                            <span class="sr-only fs-5">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="mt-4">{blogData.title}</h2>
                        <div className="fs-6">
                            <i className="fa-solid fa-clock me-2" style={{ color: "#FFD43B" }}></i>
                            {new Date(blogData.createddate).toLocaleDateString("vi-VN")}
                        </div>

                        <div dangerouslySetInnerHTML={{ __html: blogData.detail }} />
                    </div>
                )
            }
        </>
    );
}
