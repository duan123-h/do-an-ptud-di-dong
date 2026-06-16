import toast from 'react-hot-toast';
import Servicecategory from "../../../services/ServicecategoryService";
import Department from "../../../services/DepartmentService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';
export default function ServicecategoryCreate() {
    const location= useLocation();
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
     const [servicecategoryData, setServicecategoryData] = useState({});
    const [departmentData, setDepartmentData] = useState([]);
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setServicecategoryData(input=>({
            ...input,
            [name]:value
        }))
        console.log("ServicecategorytypeData: ",servicecategoryData);
    }
    function handleChangeEditorDescription(content){
         setServicecategoryData(input=>({
            ...input,
            description:content
        }))
    }
  async function getListDepartment() {
        try{
            const res = await Department.getAll();
            setDepartmentData(res.data);
        }catch (error){
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    useEffect(()=>{
            getListDepartment();
    },[location])
    const postServicecategory = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Servicecategory.create(servicecategoryData);
            setLoadingpost(false);
            console.log(">>> check message: ",response)
            toast.success(response.message);
            navigate("/admin/Servicecategory");
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
                <Link to="/Admin/Servicecategory" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 class="m-0">Thêm mới loại dịch vụị </h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingpost} onClick={postServicecategory}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Thêm")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Tên loại dịch vụ</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={servicecategoryData.name}  type="text" name="name" id=""/>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">Mô tả loại dịch vụ</label>
                            <Editor onChange={handleChangeEditorDescription} value={servicecategoryData.description}></Editor>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">Trạng thái</label>
                            <select defaultValue={1} onChange={handleChangeInput} className="form-select border-primary" name="isactive" aria-label="Default select example">
                                <option value="1">Hiện</option>
                                <option value="0">Ẩn</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}