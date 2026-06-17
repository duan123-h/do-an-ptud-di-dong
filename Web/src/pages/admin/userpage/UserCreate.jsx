
import toast from 'react-hot-toast';
import user from "../../../services/UserService";
import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
export default function UserCreate() {
    const navigate = useNavigate();
    const [loadingpost,setLoadingpost]=useState(false);
    const [userData, setUserData] = useState({
        name:"",
        address:"",
        phonenumber:"",
        email:"",
        username:"",
        password:"",
        roleid:"",
        avatar:""
    });
    function handleChangeInput(e){
        var name=e.target.name;
        var value=e.target.value;
        setUserData(input=>({
            ...input,
            [name]:value
        }))
    }
    const postUser = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await user.create(userData);
            setLoadingpost(false);
            console.log(">>> check message: ",response)
            toast.success(response.message);
            navigate("/his/user");
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
                            <input onInput={handleChangeInput} className="form-control border-primary" value={userData.name} type="text" name="name" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Địa chỉ</label>
                            <input onInput={handleChangeInput}  className="form-control border-primary" value={userData.address} type="text" name="address" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Số điện thoại</label>
                            <input onInput={handleChangeInput}  className="form-control border-primary" value={userData.phonenumber} type="text" name="phonenumber" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Email</label>
                            <input onInput={handleChangeInput}  className="form-control border-primary" value={userData.email} type="text" name="email" id=""/>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Tài khoản</label>
                            <input onInput={handleChangeInput}  className="form-control border-primary" value={userData.username} type="text" name="username" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Mật khẩu</label>
                            <input onInput={handleChangeInput}  className="form-control border-primary" value={userData.password} type="text" name="password" id=""/>
                        </div>
                        <div className="py-1">
                            <label htmlFor="" className="fw-bold">Quền</label>
                            <input onInput={handleChangeInput}  className="form-control border-primary" value={userData.roleid} type="text" name="roleid" id=""/>
                        </div>
                        {/* <div className="py-1">
                            <label htmlFor="" className="fw-bold">Quyền</label>
                            <select className="form-select border-primary" name="RoleId" aria-label="Default select example">
                                <option selected>--</option>
                                @foreach (var item in Model)
                                {
                                    <option value="@item.RoleId">@item.Name</option>
                                }
                            </select>
                        </div>  */}
                        <div className="py-1 d-flex flex-column">
                            <label  htmlFor="" className="fw-bold">Anh đại diện</label>
                            <input className="form-control border-primary" type="text" value={userData.avatar} name="avatar" id="urlCoverImage "
                                onInput={handleChangeInput} />
                                <img id="img" className="rounded-circle img-fluid mx-auto" style={{objectFit: 'cover',width: '150px',height:"150px"}} src={userData.avatar} alt=""/>
                        </div>
                    </div>
                    <div className="py-1 d-flex flex">
                        <button type="button" className="btn btn-primary ms-auto fs-5" onClick={postUser}> {loadingpost?(<i className="fa-solid fa-spinner fa-spin"></i>):("Thêm")}</button>
                    </div>
                </div>
            </form>
        </>
    );
}