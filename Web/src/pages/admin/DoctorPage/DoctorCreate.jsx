
import toast from 'react-hot-toast';
import Doctor from "../../../services/DoctorService";
import Department from "../../../services/DepartmentService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Editor from '../../../components/Editor';
export default function DoctorCreate() {
    const location = useLocation();
    const [departmentData,setDepartmentData]=useState([]);
    const navigate = useNavigate();
    const [loadingpost, setLoadingpost] = useState(false);
    const [doctorData, setDoctorData] = useState({
        fullname: "",
        avartar: "",
        specialization: "",
        phone: "",
        email: "",
        createdat: "",
        departmentid: "",
        username: "",
        password: "",
        trainingexperience: "",
        strengthexperience: "",
    });
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
    function handleChangeInput(e) {
        var name = e.target.name;
        var value = e.target.value;
        setDoctorData(input => ({
            ...input,
            [name]: value
        }))
    }
    function handleChangeTrainingexperience(content){
        setDoctorData(input=>({
            ...input,
            trainingexperience:content
        }))
    }
    function handleChangeSpecialization(content){
        setDoctorData(input=>({
            ...input,
            specialization:content
        }))
    }
    function handleChangeStrengthexperience(content){
        setDoctorData(input=>({
            ...input,
            strengthexperience:content
        }))
    }
    const postDoctor = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Doctor.create(doctorData);
            setLoadingpost(false);
            console.log(">>> check message: ", response)
            toast.success(response.message);
            navigate("/his/Doctor");
        } catch (error) {
            setLoadingpost(false);
            console.log(">>> check error: ", error)
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).map((errArray) =>
                    errArray.map((msg) => toast.error(msg))
                );
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
            console.error("Error fetching Doctors:", error);
        }
    };
    return (
        <>
            <div className="d-flex mb-1">
                <Link to="/his/Doctor" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Thêm mới bác sĩ</h3>
                <div className=" d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary " disabled={loadingpost} onClick={postDoctor}>{loadingpost?( <i className="fa-solid fa-spinner fa-spin"></i>):("Thêm")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Tên bác sĩ</label>
                            <input className="form-control border-primary" onInput={handleChangeInput} value={doctorData.fullname} type="text"  name="fullname" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Số điện thoại</label>
                            <input className="form-control border-primary" onInput={handleChangeInput} value={doctorData.phone} type="text" name="phone" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Email</label>
                            <input className="form-control border-primary" onInput={handleChangeInput} value={doctorData.email} type="text" name="email" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Tài khoản</label>
                            <input className="form-control border-primary" onInput={handleChangeInput} value={doctorData.username} type="text" name="username" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Mật khẩu</label>
                            <input className="form-control border-primary" onInput={handleChangeInput} value={doctorData.password} type="text" name="password" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Khoa</label>
                            <select className="form-select border-primary" onChange={handleChangeInput} name="departmentid" aria-label="Default select example">
                                <option selected>--</option>
                                {
                                    departmentData.map(item=>{
                                        return(
                                            <option value={item.departmentid}>{item.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="py-1 d-flex flex-column">
                            <label htmlFor="" className="fw-bold">Anh đại diện</label>
                            <input className="form-control border-primary" type="text" onInput={handleChangeInput} value={doctorData.avartar} name="avartar" id="urlCoverImage "/>
                                <img id="img" className="rounded-circle img-fluid mx-auto" style={{objectFit: 'cover',width: '150px',height:"150px"}} src={doctorData.avartar} alt=""/>
                                </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="py-1 d-flex flex-column">
                                <label htmlFor="" className="fw-bold">Chuyên ngành</label>
                                <Editor value={doctorData.specialization} onChange={handleChangeSpecialization}></Editor>
                            </div>
                            <div className="py-1 d-flex flex-column">
                                <label htmlFor="" className="fw-bold">Quá trình đào tạo - Công tác</label>
                                <Editor value={doctorData.trainingexperience} onChange={handleChangeTrainingexperience}></Editor>
                            </div>
                            <div className="py-1 d-flex flex-column">
                                <label htmlFor="" className="fw-bold">Thế mạnh, kinh nghiệm công tác</label>
                                <Editor value={doctorData.strengthexperience} onChange={handleChangeStrengthexperience}></Editor>
                            </div>
                        </div>
                    </div>
            </form>
        </>
    );
}