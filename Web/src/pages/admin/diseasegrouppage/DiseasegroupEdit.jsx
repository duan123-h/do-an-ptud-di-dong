import toast from 'react-hot-toast';
import Diseasegroup from "../../../services/DiseasegroupService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';
export default function DiseasegroupEdit() {
    const location = useLocation();
    const {id} = useParams()
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
    const [diseasegroupData, setDiseasegroupData] = useState({});
    async function getDiseasegroup(id){
        try{
            const res =await Diseasegroup.getDetail(id);
            console.log(res);
            setDiseasegroupData(res.data);
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
        getDiseasegroup(id)
    },[location]);
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setDiseasegroupData(input=>({
            ...input,
            [name]:value
        }))
        console.log("DiseasegroupData: ",diseasegroupData);
    }
    function handleChangeEditor(content) {
        setDiseasegroupData(input=>({
            ...input,
            description:content
        }))
        console.log("DiseasegroupData: ",diseasegroupData);
  }
    const updateDiseasegroup = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Diseasegroup.update(diseasegroupData,id);
            setLoadingpost(false);
            toast.success(response.message);
            navigate("/his/Diseasegroup");
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
            console.error("Error fetching Diseasegroups:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/his/Diseasegroup" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Chinh sửa nhóm bệnh</h3>
                <div className=" d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary fs-5" disabled={loadingpost} onClick={updateDiseasegroup}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Cập nhật")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Tên nhóm bệnh</label>
                            <input onInput={handleChangeInput} className="form-control border-primary"  type="text" value={diseasegroupData.name} name="name" id=""/>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">Mô tả nhóm bệnh</label>
                            <Editor value={diseasegroupData.description} onChange={handleChangeEditor}></Editor>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}