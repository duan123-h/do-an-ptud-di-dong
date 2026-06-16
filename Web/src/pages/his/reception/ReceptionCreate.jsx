import toast from 'react-hot-toast';
import Reception from "../../../services/his/OutpatientregistrationService";
import Hamlet from "../../../services/HamletService";
import Province from "../../../services/ProvinceService";
import Commune from "../../../services/CommuneService";
import Ethnicgroup from "../../../services/EthnicgroupService";
import Outpatientclinic from "../../../services/OutpatientclinicService";
import Department from "../../../services/DepartmentService";
import Patient from "../../../services/his/PatientService";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
export default function ReceptionCreate() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loadingpost, setLoadingpost] = useState(false);
    const [loadingsearch, setLoadingsearch] = useState(false);

    const [receptionData, setReceptionData] = useState({
        gender: 1
    });
    const [provinceData, setProvinceData] = useState([]);
    const [communeData, setCommuneData] = useState([]);
    const [hamletData, setHamletData] = useState([]);
    const [ethnicgroupData, setEthnicgroupData] = useState([]);
    const [outpatientclinicData, setOutpatientclinicData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);

    function handleChangeInput(e) {
        var name = e.target.name;
        var value = e.target.value;
        setReceptionData(input => ({
            ...input,
            [name]: value
        }))
    }
    async function getListProvince() {
        try {
            const res = await Province.getAll();
            setProvinceData(res.data);
        } catch (error) {
            toast.error("lỗi không thể lấy danh sách tỉnh.");
        }
    }
    async function getListCommune(provinceid) {
        try {
            if (provinceid) {
                const params = { provinceid: provinceid };
                const res = await Commune.getAll(params);
                setCommuneData(res.data);
            } else {
                setCommuneData([]);
                setHamletData([]);
            }
        } catch (error) {
            toast.error("lỗi không thể lấy danh sách xã.");
        }
    }
    async function getListHamlet(communeid) {
        try {
            if (communeid) {
                const params = { communeid: communeid };
                const res = await Hamlet.getAll(params);
                setHamletData(res.data);
            } else {
                setHamletData([]);
            }
        } catch (error) {
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    async function getListEthnicgroup() {
        try {
            const res = await Ethnicgroup.getAll();
            console.log("check >>>: ", res.data);
            setEthnicgroupData(res.data);
        } catch (error) {
            toast.error("lỗi không thể lấy danh sách các dân tộc.");
        }
    }
    async function getListOutpatientclinic(departmentid) {
        try {
            const params = { departmentid: departmentid };
            const response = await Outpatientclinic.getAll(params);
            setOutpatientclinicData(response.data);
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };
    async function getListDepartment() {
        try {
            const response = await Department.getAll();
            setDepartmentData(response.data);
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };
    useEffect(() => {
        getListProvince();
        getListEthnicgroup();
        getListDepartment();
    }, [location])
    useEffect(() => {
        getListCommune(receptionData?.provinceid);
    }, [receptionData?.provinceid])
    useEffect(() => {
        getListHamlet(receptionData?.communeid);
    }, [receptionData?.communeid])
    useEffect(() => {
        getListOutpatientclinic(receptionData?.departmentid);
    }, [receptionData?.departmentid])
    const postReception = async (e) => {
        console.log("body data: ", receptionData);
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Reception.create(receptionData);
            setLoadingpost(false);
            toast.success(response.message);
            window.open(`/His/Print/Reception/${response.data.outpatientregistrationid}`, "_blank", "noopener,noreferrer");
            navigate("/his/Reception");
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
            console.error("Error fetching Receptiontypes:", error);
        }
    };
    const handleUpdateAddress = (provinceid, communeid, hamletid) => {
        const provinceName = provinceData.find(p => String(p.provinceid) === String(provinceid))?.name || "";
        const communeName = communeData.find(c => String(c.communeid) === String(communeid))?.name || "";
        const hamletName = hamletData.find(h => String(h.hamletid) === String(hamletid))?.name || "";

        const fullAddress = [hamletName, communeName, provinceName]
            .filter(Boolean)
            .join(", ");
        setReceptionData(input => ({
            ...input,
            address: fullAddress
        }));
    };
    useEffect(() => {
        handleUpdateAddress(receptionData?.provinceid, receptionData?.communeid, receptionData?.hamletid);
    }, [receptionData?.provinceid, receptionData?.communeid, receptionData?.hamletid])
    useEffect(() => {
        handleUpdateAddress(receptionData?.provinceid, receptionData?.communeid, receptionData?.hamletid);
    }, [provinceData, communeData, hamletData])
    async function handlepersonalsearch() {
        setLoadingsearch(true);
        try {
            if (receptionData.personalid) {
                const response = await Patient.getDetail(receptionData.personalid);
                setReceptionData(prev => ({
                    ...prev,
                    ...response.data
                }))
                setLoadingsearch(false);
            }
        } catch (error) {
            setLoadingsearch(false);
            if (error.response && error.response.status === 404) {
                toast.error("Không tìm thấy bệnh nhân!");
            } else {
                console.error("Error fetching:", error);
                alert("Đã xảy ra lỗi khi tìm kiếm bệnh nhân!");
            }
        }
    }

    return (
        <>
            <div class="d-flex mb-1">
                <Link to="/His/Reception" class="btn btn-primary me-2"><i class="fa-solid fa-left-long"></i></Link>
                <h3 class="m-0">Tiếp nhận bệnh nhân</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" disabled={loadingpost} onClick={postReception}> {loadingpost ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Đăng ký khám")}</button>
                </div>
            </div>
            <form action="" method="post" class="pb-2" id="myform">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="py-1">
                            <label for="" class="fw-bold">CCCD</label>
                            <div class="input-group input-group-sm">
                                <input class="form-control border-primary" value={receptionData.personalid} type="text" name="personalid" onInput={handleChangeInput} />
                                <button disabled={loadingsearch} onClick={handlepersonalsearch} class="ms-2 btn btn-primary" type="button">{loadingsearch ? (<i className="fa-solid fa-spinner fa-spin"></i>) : (<i class="fa-solid fa-search"></i>)}</button>
                            </div>
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Họ và tên</label>
                            <input class="form-control form-control-sm border-primary" value={receptionData.fullname} type="text" name="fullname" onInput={handleChangeInput} />
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Ngày sinh</label>
                            <input class="form-control form-control-sm border-primary" value={receptionData.dateofbirth} type="date" name="dateofbirth" onInput={handleChangeInput} />
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Giới tính</label>
                            <select value={receptionData.gender} onChange={handleChangeInput} class="form-select form-select-sm border-primary" name="gender" aria-label="Default select example">
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Số điện thoại</label>
                            <input class="form-control form-control-sm border-primary" value={receptionData.phone} type="text" name="phone" onInput={handleChangeInput} />
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Email</label>
                            <input class="form-control form-control-sm border-primary" value={receptionData.email} type="text" name="email" />
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="py-1">
                            <label for="" class="fw-bold">Tỉnh</label>
                            <select onChange={handleChangeInput} value={receptionData.provinceid} class="form-select form-select-sm  border-primary" name="provinceid" aria-label="Default select example">
                                <option value="">Chọn tỉnh</option>
                                {provinceData.map((item) => {
                                    return (
                                        <option key={`provinceid-${item.provinceid}`} value={item.provinceid}>
                                            {item.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Xã,phường</label>
                            <select onChange={handleChangeInput} value={receptionData.communeid} class="form-select form-select-sm border-primary" name="communeid" aria-label="Default select example">
                                <option value="">Chọn Xã,phường</option>
                                {communeData.map(item => {
                                    return (
                                        <option key={`communeid-${item.communeid}`} value={item.communeid}>
                                            {item.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Thôn xóm</label>
                            <select value={receptionData.hamletid} onChange={handleChangeInput} class="form-select form-select-sm border-primary" name="hamletid" aria-label="Default select example">
                                <option value="">Chọn Thôn xóm</option>
                                {hamletData.map(item => {
                                    return (
                                        <option key={`hamletid-${item.hamletid}`} value={item.hamletid}>
                                            {item.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Địa chỉ</label>
                            <input onChange={handleChangeInput} class="form-control form-control-sm border-primary" value={receptionData.address} type="text" name="address" />
                        </div>
                        <div class="py-1">
                            <label for="" class="fw-bold">Dân tộc</label>
                            <select value={receptionData.ethnicid} onChange={handleChangeInput} class="form-select form-select-sm border-primary" name="ethnicid" aria-label="Default select example">
                                <option value="">Chọn Dân tộc</option>
                                {ethnicgroupData.map(item => {
                                    return (
                                        <option key={`ethnicid-${item.ethnicid}`} value={item.ethnicid}>
                                            {item.name}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div class="py-1 d-flex">
                            <div className='col-6 me-2'>
                                <label for="" class="fw-bold">Chọn khoa</label>
                                <select value={receptionData.departmentid} onChange={handleChangeInput} class="form-select form-select-sm border-primary" name="departmentid" aria-label="Default select example">
                                    <option selected>Chọn khoa</option>
                                    {departmentData.map(item => {
                                        return (
                                            <option key={`departmentid-${item.departmentid}`} value={item.departmentid}>
                                                {item.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-6'>
                                <label for="" class="fw-bold">Chọn phòng khám</label>
                                <select value={receptionData.outpatientclinicid} onChange={handleChangeInput} class="form-select form-select-sm border-primary" name="outpatientclinicid" aria-label="Default select example">
                                    <option selected>Chọn phòng khám</option>
                                    {outpatientclinicData.map(item => {
                                        return (
                                            <option key={`outpatientclinicid-${item.outpatientclinicid}`} value={item.outpatientclinicid}>
                                                {item.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}