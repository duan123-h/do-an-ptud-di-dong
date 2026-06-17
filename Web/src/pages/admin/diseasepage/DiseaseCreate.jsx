import toast from 'react-hot-toast';
import Disease from "../../../services/DiseaseService";
import Diseasegroup from "../../../services/DiseasegroupService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';
export default function DiseaseCreate() {
    const location =useLocation();
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
    const [diseaseData, setDiseaseData] = useState({});
    const [diseasegroupData, setDiseasegroupData] = useState([]);
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setDiseaseData(input=>({
            ...input,
            [name]:value
        }))
    }
    async function getListDiseasegroup(){
        try{
            const res=await Diseasegroup.getAll();
            setDiseasegroupData(res.data);
        }catch(error){
            toast.error("lỗi không thể lấy danh sách nhóm bệnh.");
        }
    }
    useEffect(()=>{
        getListDiseasegroup();
    },[location])
    const postDisease = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Disease.create(diseaseData);
            setLoadingpost(false);
            console.log(">>> check message: ",response)
            toast.success(response.message);
            navigate("/his/Disease");
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
            console.error("Error fetching Diseases:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/his/Disease" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Thêm bệnh mới</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingpost} onClick={postDisease}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Thêm")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Tên bệnh</label>
                            <input onInput={handleChangeInput} className="form-control border-primary"  type="text" name="diseasename" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Nhóm bệnh</label>
                            <select className="form-select border-primary" onChange={handleChangeInput} name="diseasegroupid" aria-label="Default select example">
                                <option selected>--</option>
                                {
                                    diseasegroupData.map(item=>{
                                        return(
                                            <option  value={item.diseasegroupid}>{item.name}</option>
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