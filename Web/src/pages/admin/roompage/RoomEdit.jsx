import toast from 'react-hot-toast';
import Roomtype from "../../../services/RoomtypeService";
import Room from "../../../services/RoomService";
import Department from "../../../services/DepartmentService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams  } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
export default function RoomEdit() {
    const {id}=useParams();
    const location= useLocation();
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
     const [roomData, setRoomData] = useState({});
    const [roomtypeData, setRoomtypeData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setRoomData(input=>({
            ...input,
            [name]:value
        }))
        console.log("RoomtypeData: ",roomtypeData);
    }
    async function getRoom() {
        try{
            const res = await Room.getDetail(id);
            setRoomData(res.data);
        }catch (error){
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    async function getListDepartment() {
        try{
            const res = await Department.getAll();
            setDepartmentData(res.data);
        }catch (error){
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    async function getListRoomtyoe() {
        try{
            const res = await Roomtype.getAll();
            setRoomtypeData(res.data);
        }catch (error){
            toast.error("lỗi không thể lấy danh sách loại phòng.");
        }
    }
    useEffect(()=>{
        getRoom();
        getListDepartment();
        getListRoomtyoe();
    },[location])
    const updateRoom = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Room.update(roomData,id);
            setLoadingpost(false);
            console.log(">>> check message: ",response)
            toast.success(response.message);
            navigate("/his/Room");
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
                <Link to="/his/Room" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 class="m-0">chỉnh sửa phòng điều trị </h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingpost} onClick={updateRoom}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Cập nhật")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label for="" className="fw-bold">Số phòng</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={roomData.roomnumber}  type="number" name="roomnumber" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Hạng phòng</label>
                            <select className="form-select border-primary" onChange={handleChangeInput} name="roomtypeid" aria-label="Default select example">
                                {
                                    roomtypeData.map(item=>{
                                        return(
                                            <option selected={item.roomtypeid==roomData.roomtypeid} value={item.roomtypeid}>{item.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Khoa</label>
                            <select className="form-select border-primary" onChange={handleChangeInput} name="departmentid" aria-label="Default select example">
                                {
                                    departmentData.map(item=>{
                                        return(
                                            <option selected={item.departmentid==roomData.departmentid} value={item.departmentid}>{item.name}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="py-1">
                            <label for="" className="fw-bold">Sức chứa</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={roomData.capacity}  type="number" name="capacity" id=""/>
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Trạng thái</label>
                            <select class="form-select border-primary" onChange={handleChangeInput} name="isactive" aria-label="Default select example">
                                <option selected={roomData.isactive} value="1">Hiện</option>
                                <option selected={!roomData.isactive} value="0">Ẩn</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}