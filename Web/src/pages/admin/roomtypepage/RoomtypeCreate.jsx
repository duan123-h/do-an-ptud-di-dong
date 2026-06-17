import toast from 'react-hot-toast';
import Roomtype from "../../../services/RoomtypeService";
import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Editor from '../../../components/Editor';
export default function RoomtypeCreate() {
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
    const [roomtypeData, setRoomtypeData] = useState({});
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setRoomtypeData(input=>({
            ...input,
            [name]:value
        }))
        console.log("RoomtypeData: ",roomtypeData);
    }
    function handleChangeEditor(content) {
        setRoomtypeData(input=>({
            ...input,
            description:content
        }))
        console.log("RoomtypeData: ",roomtypeData);
  }
    const postRoomtype = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Roomtype.create(roomtypeData);
            setLoadingpost(false);
            console.log(">>> check message: ",response)
            toast.success(response.message);
            navigate("/his/Roomtype");
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
            console.error("Error fetching Roomtypes:", error);
        }
    };

    return (
        <>
        <div className="d-flex mb-1">
                <Link to="/his/Roomtype" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Thêm mới hạng phòng</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" onClick={postRoomtype}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Thêm")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Tên hạng phòng</label>
                            <input onInput={handleChangeInput} className="form-control border-primary"  type="text" name="name" id=""/>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">giá hạng phòng</label>
                            <input onInput={handleChangeInput} className="form-control border-primary"  type="number" name="price" id=""/>
                        </div>
                    </div>
                    
                </div>
            </form>
        </>
    );
}