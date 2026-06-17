import toast from 'react-hot-toast';
import Menu from "../../../services/MenuService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
export default function MenuCreate() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loadingpost, setLoadingpost] = useState(false);
    const [menuData, setMenuData] = useState({});
    const [listMenuData, setListMenuData] = useState([]);
    async function getListDepartment() {
        try{
            const res = await Menu.getAll();
            setListMenuData(res.data);
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
        setMenuData(input => ({
            ...input,
            [name]: value
        }))
    }
    const postMenu = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Menu.create(menuData);
            setLoadingpost(false);
            console.log(">>> check message: ", response)
            toast.success(response.message);
            navigate("/his/Menu");
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
            console.error("Error fetching Menus:", error);
        }
    };

    return (
        <>
            <div className="d-flex mb-1">
                <Link to="/his/Menu" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Thêm mới menu</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingpost} onClick={postMenu}> {loadingpost ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Thêm")}</button>
                </div>
            </div>
            <form class="pb-2">
                <div class="col">
                    <div class="py-1">
                        <label for="" class="fw-bold">Tiêu đề</label>
                        <input class="form-control border-primary" type="text" onInput={handleChangeInput} value={menuData.title} name="title" id=""/>
                    </div>
                    <div class="py-1">
                        <label for="" class="fw-bold">Cấp</label>
                        <input class="form-control border-primary" type="text" onInput={handleChangeInput} value={menuData.levels} name="levels" id=""/>
                    </div>
                    <div class="py-1">
                        <label for="" class="fw-bold">Menu Cha</label>
                        <select class="form-select border-primary select-primary" onInput={handleChangeInput} value={menuData.parentid} name="parentid" aria-label="Default select example">
                            <option selected value="">--</option>
                            {
                                listMenuData.filter(m=>m.levels==1).map(item=>{
                                    return (
                                        <option value={item.menuid}>{item.title}</option>
                                    );
                                })
                            }
                        </select>
                    </div>
                    <div class="py-1">
                        <label for="" class="fw-bold">vị trí</label>
                        <select class="form-select border-primary select-primary" onInput={handleChangeInput} value={menuData.position} name="position" aria-label="Default select example">
                            <option selected>--</option>
                            <option value="1">Menu tóp</option>
                            <option value="2">Footer</option>
                        </select>
                    </div>
                    <div class="py-1">
                        <label for="" class="fw-bold">Đường dẫn</label>
                        <input class="form-control border-primary" type="text" onInput={handleChangeInput} value={menuData.link} name="link" id=""/>
                    </div>
                    <div class="py-1">
                        <label for="" class="fw-bold">Trang thai</label>
                        <select class="form-select border-primary" name="isactive" onInput={handleChangeInput} value={menuData.isactive} aria-label="Default select example">
                            <option selected value="">Trạng thái menu</option>
                            <option value={1}>Hiện</option>
                            <option value={0}>Ẩn</option>
                        </select>
                    </div>
                </div>
            </form>
        </>
    );
}