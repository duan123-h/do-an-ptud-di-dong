import toast from 'react-hot-toast';
import Service from "../../../services/ServiceService";
import Servicecategory from "../../../services/ServicecategoryService";
import Outpatientclinic from "../../../services/OutpatientclinicService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';
export default function ServiceEdit() {
    const {id}=useParams();
    const location= useLocation();
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
    const [serviceData, setServiceData] = useState({});
    const [servicecategoryData, setServicecategoryData] = useState([]);
    const [outpatientclinicData,setOutpatientclinicData]=useState([]);
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setServiceData(input=>({
            ...input,
            [name]:value
        }))
    }
    async function getService() {
        try{
            const res = await Service.getDetail(id);
            setServiceData(res.data);
        }catch (error){
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    async function getListServicecategory() {
        try{
            const res = await Servicecategory.getAll();
            setServicecategoryData(res.data);
        }catch (error){
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    async function getListOutpatientclinic() {
        try{
            const res = await Outpatientclinic.getAll();
            setOutpatientclinicData(res.data);
        }catch (error){
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    useEffect(()=>{
        getService();
        getListServicecategory();
        getListOutpatientclinic();
    },[location])
    function handleChangeEditorDescription(content){
         setServiceData(input=>({
            ...input,
            description:content
        }))
    }
    const updateService = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Service.update(serviceData,id);
            setLoadingpost(false);
            console.log(">>> check message: ",response)
            toast.success(response.message);
            navigate("/his/Service");
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
            console.error("Error fetching Servicetypes:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/his/Service" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 class="m-0">Chỉnh sửa dịch vụ </h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingpost} onClick={updateService}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Cập nhật")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Tên dịch vụ</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={serviceData.name}  type="text" name="name" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">loại dịch vụ</label>
                            <select value={serviceData.servicecategoryid} className="form-select border-primary" onChange={handleChangeInput} name="servicecategoryid" aria-label="Default select example">
                                {
                                    servicecategoryData.map(item=>{
                                        return(
                                            <option  value={item.servicecategoryid}>{item.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Phòng thực hiện</label>
                            <select value={serviceData.outpatientclinicid} className="form-select border-primary" onChange={handleChangeInput} name="outpatientclinicid" aria-label="Default select example">
                                {
                                    outpatientclinicData?.map(item=>{
                                        return(
                                            <option value={item.outpatientclinicid}>{item.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">Mô tả dịch vụ</label>
                            <Editor onChange={handleChangeEditorDescription} value={serviceData.description}></Editor>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">Giá</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={serviceData.price}  type="number" name="price" id=""/>
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Trạng thái</label>
                            <select value={serviceData.isactive?1:0} class="form-select border-primary" onChange={handleChangeInput} name="isactive" aria-label="Default select example">
                                <option  value="1">Hiện</option>
                                <option  value="0">Ẩn</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}