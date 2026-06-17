import toast from 'react-hot-toast';
import Servicecategory from "../../../services/ServicecategoryService";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';
export default function ServicecategoryEdit() {
    const {id}=useParams();
    const location= useLocation();
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
     const [servicecategoryData, setServicecategoryData] = useState({});
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setServicecategoryData(input=>({
            ...input,
            [name]:value
        }))
    }
    async function getServicecategory() {
        try{
            const res = await Servicecategory.getDetail(id);
            setServicecategoryData(res.data);
        }catch (error){
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    function handleChangeEditorDescription(content){
         setServicecategoryData(input=>({
            ...input,
            description:content
        }))
    }
    useEffect(()=>{
        getServicecategory();
    },[location])
    const updateServicecategory = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Servicecategory.update(servicecategoryData,id);
            setLoadingpost(false);
            console.log(">>> check message: ",response)
            toast.success(response.message);
            navigate("/his/Servicecategory");
        } catch (error) {
            setLoadingpost(false);
            console.log(">>> check error: ",error)
            if (error.response && error.response.data && error.response.data.errors) {
                 Object.values(error.response.data.errors).map((errArray) => 
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
            } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error("Error fetching Servicecategorytypes:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/his/Servicecategory" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 class="m-0">chỉnh sửa phòng điều trị </h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingpost} onClick={updateServicecategory}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Cập nhật")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Tên loại dịch vụ</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={servicecategoryData.name}  type="text" name="name" id=""/>
                        </div>
                    </div>
                    <div className="py-1">
                        <label for="" className="fw-bold">Mô tả dịch vụ</label>
                        <Editor onChange={handleChangeEditorDescription} value={servicecategoryData.description}></Editor>
                    </div>
                    <div className="py-1">
                        <label for="" className="fw-bold">Mô tả loại dịch vụ</label>
                        <Editor onChange={handleChangeEditorDescription} value={servicecategoryData.description}></Editor>
                    </div>
                    <div className="py-1">
                        <label for="" className="fw-bold">Trạng thái</label>
                        <select value={servicecategoryData.isactive?1:0} onChange={handleChangeInput} className="form-select border-primary" name="isactive" aria-label="Default select example">
                            <option value="1">Hiện</option>
                            <option value="0">Ẩn</option>
                        </select>
                    </div>
                </div>
            </form>
        </>
    );
}