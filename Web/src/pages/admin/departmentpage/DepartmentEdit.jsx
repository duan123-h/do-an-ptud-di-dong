import toast from 'react-hot-toast';
import Department from "../../../services/DepartmentService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';
export default function DepartmentEdit() {
    const location = useLocation();
    const {id} = useParams()
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
    const [departmentData, setDepartmentData] = useState({});
    async function getDepartment(id){
        try{
            const res =await Department.getDetail(id);
            console.log(res);
            setDepartmentData(res.data);
        }catch(error){
            if(error.response){
                if(error.response.status===404){
                    toast.error("Không tồn tại khoa này.");
                }else{
                    toast.error("lỗi không xác định.");
                }
            }
        }
    }
    useEffect(()=>{
        getDepartment(id)
    },[location]);
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setDepartmentData(input=>({
            ...input,
            [name]:value
        }))
        console.log("departmentData: ",departmentData);
    }
    function handleChangeEditor(content) {
        setDepartmentData(input=>({
            ...input,
            description:content
        }))
        console.log("departmentData: ",departmentData);
  }
    const updateDepartment = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Department.update(departmentData,id);
            setLoadingpost(false);
            toast.success(response.message);
            navigate("/his/Department");
        } catch (error) {
            setLoadingpost(false);
            if (error.response && error.response.data && error.response.data.errors) {
                 Object.values(error.response.data.errors).map((errArray) => 
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
            } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error("Error fetching Departments:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/his/Department" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Chỉnh sửa khoa</h3>
                <div className=" d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary fs-5" disabled={loadingpost} onClick={updateDepartment}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Cập nhật")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Tên khoa</label>
                            <input onInput={handleChangeInput} className="form-control border-primary"  type="text" value={departmentData.name} name="name" id=""/>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">Mô tả khoa</label>
                            <Editor value={departmentData.description} onChange={handleChangeEditor}></Editor>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}