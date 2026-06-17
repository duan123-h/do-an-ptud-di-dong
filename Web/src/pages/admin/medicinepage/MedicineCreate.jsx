import toast from 'react-hot-toast';
import Medicine from "../../../services/MedicineService";
import Dosageform from "../../../services/DosageformService";
import Manufacturer from "../../../services/ManufacturerService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css'
export default function MedicineCreate() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loadingpost, setLoadingpost] = useState(false);
    const [medicineData, setMedicineData] = useState({});
    const [dosageformData, setDosageformData] = useState([]);
    const [manufacturerData, setManufacturerData] = useState([]);
    function handleChangeInput(e) {
        var name = e.target.name;
        var value = e.target.value;
        setMedicineData(input => ({
            ...input,
            [name]: value
        }))
    }
    async function getListDosageform() {
        try {
            const res = await Dosageform.getAll();
            setDosageformData(res.data);
        } catch (error) {
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    async function getListManufacturernu() {
        try {
            const res = await Manufacturer.getAll();
            setManufacturerData(res.data);
        } catch (error) {
            toast.error("lỗi không thể lấy danh sách khoa.");
        }
    }
    useEffect(() => {
        getListDosageform();
        getListManufacturernu();
    }, [location])
    const postMedicine = async (e) => {
        setLoadingpost(true);
        e.preventDefault();
        try {
            const response = await Medicine.create(medicineData);
            setLoadingpost(false);
            console.log(">>> check message: ", response)
            toast.success(response.message);
            navigate("/his/Medicine");
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
            console.error("Error fetching Medicinetypes:", error);
        }
    };

    return (
        <>
            <div className="d-flex mb-1">
                <Link to="/his/Medicine" className="btn btn-primary me-2"><i className="fa-solid fa-left-long"></i></Link>
                <h3 class="m-0">Thêm mới thuốc</h3>
                <div className="d-flex flex ms-auto">
                    <button type="button" className="btn btn-primary ms-auto fs-5" onClick={postMedicine}> {loadingpost ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Thêm")}</button>
                </div>
            </div>
            <form className="pb-2" onSubmit={postMedicine}>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="py-1">
                            <label className="fw-bold">Tên thuốc</label>
                            <input
                                className="form-control border-primary"
                                type="text"
                                name="name"
                                value={medicineData.name}
                                onChange={handleChangeInput}
                                required
                            />
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Thành phần hoạt chất</label>
                            <textarea
                                className="form-control border-primary"
                                name="activeingredients"
                                value={medicineData.activeingredients}
                                onChange={handleChangeInput}
                                required
                            ></textarea>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Dạng bào chế</label>
                            <select
                                className="form-select border-primary"
                                name="dosageformid"
                                onChange={handleChangeInput}
                                required
                            >
                                <option value="">-- Chọn dạng bào chế --</option>
                                {dosageformData.map((form) => (
                                    <option key={form.dosageformid} value={form.dosageformid}>
                                        {form.dosageformname}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="py-1">
                            <label className="fw-bold">Nhà sản xuất</label>
                            <select
                                className="form-select border-primary"
                                name="manufacturerid"
                                onChange={handleChangeInput}
                                required
                            >
                                <option value="">-- Chọn nhà sản xuất --</option>
                                {manufacturerData.map((form) => (
                                    <option key={form.manufacturerid} value={form.manufacturerid}>
                                        {form.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="py-1">
                            <label className="fw-bold">Chỉ định</label>
                            <textarea
                                className="form-control border-primary"
                                name="indications"
                                value={medicineData.indications}
                                onChange={handleChangeInput}
                                required
                            ></textarea>
                        </div>


                        <div className="py-1">
                            <label className="fw-bold">Liều dùng</label>
                            <textarea
                                className="form-control border-primary"
                                name="dosage"
                                value={medicineData.dosage}
                                onChange={handleChangeInput}
                                required
                            ></textarea>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Chống chỉ định</label>
                            <textarea
                                className="form-control border-primary"
                                name="contraindications"
                                value={medicineData.contraindications}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Thận trọng</label>
                            <textarea
                                className="form-control border-primary"
                                name="precautions"
                                value={medicineData.precautions}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="py-1">
                            <label className="fw-bold">Mang thai & cho con bú</label>
                            <textarea
                                className="form-control border-primary"
                                name="pregnancybreastfeeding"
                                value={medicineData.pregnancybreastfeeding}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Lái xe & vận hành máy</label>
                            <textarea
                                className="form-control border-primary"
                                name="drivingmachineuse"
                                value={medicineData.drivingmachineuse}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>
                        <div className="py-1">
                            <label className="fw-bold">Tương tác thuốc</label>
                            <textarea
                                className="form-control border-primary"
                                name="interactions"
                                value={medicineData.interactions}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Tác dụng phụ</label>
                            <textarea
                                className="form-control border-primary"
                                name="sideeffects"
                                value={medicineData.sideeffects}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Xử trí khi quá liều</label>
                            <textarea
                                className="form-control border-primary"
                                name="overdosetreatment"
                                value={medicineData.overdosetreatment}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Đóng gói</label>
                            <input
                                className="form-control border-primary"
                                type="text"
                                name="packaging"
                                value={medicineData.packaging}
                                onChange={handleChangeInput}
                            />
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Điều kiện bảo quản</label>
                            <textarea
                                className="form-control border-primary"
                                name="storageconditions"
                                value={medicineData.storageconditions}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Tiêu chuẩn chất lượng</label>
                            <textarea
                                className="form-control border-primary"
                                name="qualitystandards"
                                value={medicineData.qualitystandards}
                                onChange={handleChangeInput}
                            ></textarea>
                        </div>

                    </div>
                </div>
            </form>
        </>
    );
}