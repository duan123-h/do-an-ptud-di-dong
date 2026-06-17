import toast from 'react-hot-toast';
import Department from "../../../services/DepartmentService";
import Outpatientclinic from '../../../services/OutpatientclinicService';
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
export default function OutpatientclinicCreate() {
    const location = useLocation();
    const {id} = useParams()
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
    const [outpatientclinicData, setoutpatientclinicData] = useState({});
    const [departmentData, setDepartmentData] = useState([]);
    async function getListDepartment(){
        try{
            const res =await Department.getAll();
            console.log(res);
            setDepartmentData(res.data);
        }catch(error){
            toast.error("lỗi không xác định.");
        }
    }
    useEffect(()=>{
        getListDepartment();
    },[location]);
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setoutpatientclinicData(input=>({
            ...input,
            [name]:value
        }))
        console.log("outpatientclinicData: ",outpatientclinicData);
    }
    const postOutpatientclinic = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Outpatientclinic.create(outpatientclinicData);
            setLoadingpost(false);
            toast.success(response.message);
            navigate("/his/Outpatientclinic");
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
            console.error("Error fetching Outpatientclinics:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/his/Outpatientclinic" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Thêm phòng khám</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" disabled={loadingpost} className="btn btn-primary fs-5" onClick={postOutpatientclinic}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Thêm")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Tên phòng khám</label>
                            <input onInput={handleChangeInput} className="form-control border-primary"  type="text" value={outpatientclinicData.name} name="name" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Khoa</label>
                            <select className="form-select border-primary" onChange={handleChangeInput} name="departmentid" aria-label="Default select example">
                                <option selected>--</option>
                                {
                                    departmentData.map(item=>{
                                        return(
                                            <option key={`d${item.departmentid}`} value={item.departmentid}>{item.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}