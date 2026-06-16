import toast from 'react-hot-toast';
import Roomtype from "../../../services/RoomtypeService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
export default function RoomtypeEdit() {
    const location = useLocation();
    const {id} = useParams()
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
    const [roomtypeData, setRoomtypeData] = useState({});
    async function getRoomtype(id){
        try{
            const res =await Roomtype.getDetail(id);
            console.log(res);
            setRoomtypeData(res.data);
        }catch(error){
            if(error.response){
                if(error.response.status===404){
                    toast.error("Không tồn tại loại phòng này.");
                }else{
                    toast.error("lỗi không xác định.");
                }
            }
        }
    }
    useEffect(()=>{
        getRoomtype(id)
    },[location]);
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setRoomtypeData(input=>({
            ...input,
            [name]:value
        }))
        console.log("RoomtypeData: ",roomtypeData);
    }
    const updateRoomtype = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Roomtype.update(roomtypeData,id);
            setLoadingpost(false);
            toast.success(response.message);
            navigate("/admin/Roomtype");
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
            console.error("Error fetching Roomtypes:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/Admin/Roomtype" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 class="m-0">Chỉnh sửa hạng phòng</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingpost} onClick={updateRoomtype}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Cập nhật")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" class="fw-bold">Tên hạng phòng</label>
                            <input onInput={handleChangeInput} className="form-control border-primary"  type="text" value={roomtypeData.name} name="name" id=""/>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">giá hạng phòng</label>
                            <input onInput={handleChangeInput} className="form-control border-primary"  type="number" value={roomtypeData.price} name="price" id=""/>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}