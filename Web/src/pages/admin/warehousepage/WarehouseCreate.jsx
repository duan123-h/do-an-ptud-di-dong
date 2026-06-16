import toast from 'react-hot-toast';
import User from "../../../services/UserService";
import Warehouse from '../../../services/WarehouseService';
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
import Select from "react-select";
export default function WarehouseCreate() {
    const location = useLocation();
    const { id } = useParams()
    const navigate = useNavigate();
    const [loadingpost, setLoadingpost] = useState(false);
    const [warehouseData, setWarehouseData] = useState({});
    const [userData, setUserData] = useState([]);
    const [userIds,setUserIds]=useState([]);
    async function getListUser() {
        try {
            const res = await User.getAll();
            const options = res.data.map((item) => ({
                value: item.userid,
                label: item.name,
            }));
            setUserData(options);
        } catch (error) {
            toast.error("lỗi không xác định.");
        }
    }
    useEffect(() => {
        getListUser();
    }, [location]);
    function handleChangeInput(e) {
        var name = e.target.name;
        var value = e.target.value;
        setWarehouseData(input => ({
            ...input,
            [name]: value
        }))
    }
    const postWarehouse = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const data={
                name:warehouseData.name,
                location:warehouseData.location,
                note:warehouseData.note,
                isactive:warehouseData.isactive,
                users: userIds.map(item => {
                    return {
                        userid: item
                    }
                })
            }
            const response = await Warehouse.create(data);
            setLoadingpost(false);
            toast.success(response.message);
            navigate("/admin/Warehouse");
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
                <Link to="/Admin/Warehouse" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Thêm kho dược</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" disabled={loadingpost} className="btn btn-primary fs-5" onClick={postWarehouse}> {loadingpost ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Thêm")}</button>
                </div>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Tên kho</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" type="text" value={warehouseData.name} name="name" id="" />
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Vị trí kho</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" type="text" value={warehouseData.location} name="location" id="" />
                        </div>
                        <div className="py-1">
                            <label className="fw-bold">Ghi chú</label>
                            <textarea
                                className="form-control border-primary"
                                name="note"
                                value={warehouseData.note}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>
                        <div className="py-1">
                            <label className="fw-bold">Người phụ trách</label>
                            <Select
                                isMulti
                                classNames={{
                                    control: () => "border-primary",
                                }}
                                options={userData}
                                value={userData.filter(opt => userIds.includes(opt.value))}
                                onChange={(selected) => {
                                    const uid = [];
                                   selected.map(item => {
                                        uid.push(item.value);
                                        return `[${item.value}]-${item.label}`;
                                    })
                                    setUserIds(uid);
                                }
                                }
                                placeholder="-- Chọn người quản lý --"
                                isSearchable
                                isClearable
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                closeMenuOnSelect={false}
                            >
                            </Select>
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Trạng thái</label>
                            <select class="form-select border-primary" onChange={handleChangeInput} name="isactive" aria-label="Default select example">
                                <option value="1">Hoạt động</option>
                                <option value="0">Ngừng hoạt động</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}