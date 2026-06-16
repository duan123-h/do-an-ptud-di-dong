import toast from 'react-hot-toast';
import Dosageform from "../../../services/DosageformService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
export default function DosageformCreate() {
    const location= useLocation();
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
     const [dosageformData, setDosageformData] = useState({});
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setDosageformData(input=>({
            ...input,
            [name]:value
        }))
    }
    const postDosageform = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Dosageform.create(dosageformData);
            setLoadingpost(false);
            console.log(">>> check message: ",response)
            toast.success(response.message);
            navigate("/admin/Dosageform");
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
            console.error("Error fetching Dosageformtypes:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/Admin/Dosageform" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 class="m-0">Thêm dạng bào chế thuốc </h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" onClick={postDosageform}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Thêm")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Tên dạng điều chế</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={dosageformData.dosageformname}  type="text" name="dosageformname" id=""/>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}