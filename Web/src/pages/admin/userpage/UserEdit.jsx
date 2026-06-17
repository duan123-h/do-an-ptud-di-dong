
import toast from 'react-hot-toast';
import user from "../../../services/UserService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import UserService from "../../../services/UserService";
export default function UserEdit() {
    const location = useLocation();
    const { id } = useParams()
    async function getDetailUser(userid) {
        try {
            var res = await UserService.getDetail(userid);
            
                setUserData({
                    userid:res.data.userid,
                    fullname: res.data.profile?.fullname,
                    address: res.data.profile?.address,
                    phone: res.data.profile?.phone,
                    email: res.data.profile?.email,
                    roleid: res.data.roleid,
                    avatar: res.data.profile?.avatar,
                    isactive: true
                });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error("Không tồn tại người dùng này.");
                } else {
                    toast.error("lỗi không xác định.");
                }
            }
        }
    }
    const navigate = useNavigate();
    const [loadingpost, setLoadingpost] = useState(false);
    const [userData, setUserData] = useState({
        userid:"",
        fullname: "",
        address: "",
        phone: "",
        email: "",
        roleid: "",
        avatar: "",
        isactive: true
    });
    useEffect(() => {
        getDetailUser(id);
    }, [location])
    function handleChangeInput(e) {
        var name = e.target.name;
        var value = e.target.value;
        setUserData(input => ({
            ...input,
            [name]: value
        }))
    }
    const updateUser = async (userid, e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await user.update(userData, userid);
            setLoadingpost(false);
            toast.success(response.message);
            navigate("/his/user");
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
            console.error("Error fetching users:", error);
        }
    };
    return (
        <>
            <div className="d-flex mb-1">
                <Link to="/his/User" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 className="m-0">Thêm mới người dùng</h3>
            </div>
            <form className="pb-2">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Tên người dùng</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={userData.fullname} type="text" name="fullname" id="" />
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Địa chỉ</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={userData.address} type="text" name="address" id="" />
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Số điện thoại</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={userData.phone} type="text" name="phone" id="" />
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Email</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={userData.email} type="text" name="email" id="" />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Quền</label>
                            <input onInput={handleChangeInput} className="form-control border-primary" value={userData.roleid} type="text" name="roleid" id="" />
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Trạng thái tài khoản</label>
                            <select onChange={handleChangeInput} value={userData.isactive ? 1 : 0} className="form-select border-primary" name="isactive" aria-label="Default select example">
                                <option value={1}>Hoạt động</option>
                                <option value={0}>Ngừng hoạt động</option>
                            </select>
                        </div>
                        <div className="py-1 d-flex flex-column">
                            <label htmlFor="" className="fw-bold">Anh đại diện</label>
                            <input className="form-control border-primary" type="text" value={userData.avatar} name="avatar" id="urlCoverImage "
                                onInput={handleChangeInput} />
                            <img id="img" className="rounded-circle img-fluid mx-auto" style={{ objectFit: 'cover', width: '150px', height: "150px" }} src={userData.avatar} alt="" />
                        </div>
                    </div>
                    <div className="py-1 d-flex flex">
                        <button type="button" className="btn btn-primary ms-auto fs-5" onClick={(e) => updateUser(userData.userid, e)}> {loadingpost ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Cập nhật")}</button>
                    </div>
                </div>
            </form>
        </>
    );
}