import toast from 'react-hot-toast';
import Slider from "../../../services/SliderService";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Editor from '../../../components/Editor';

export default function SliderCreate() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loadingpost, setLoadingpost] = useState(false);

    const [sliderData, setSliderData] = useState({
        title: "",
        description: "",
        displayorder: 0,
        imagepath: "",
        isactive: 1
    });

    const [previewImage, setPreviewImage] = useState("");

    function handleChangeInput(e) {
        const { name, value } = e.target;
        setSliderData(input => ({
            ...input,
            [name]: value
        }));

        if (name === "imagepath") {
            setPreviewImage(value);
        }
    }

    function handleChangeEditorDescription(content) {
        setSliderData(input => ({
            ...input,
            description: content
        }));
    }

    const postSlider = async (e) => {
        e.preventDefault();
        setLoadingpost(true);

        try {
            const response = await Slider.create(sliderData);
            setLoadingpost(false);
            toast.success(response.message);
            navigate("/admin/slider");

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
        }
    };

    return (
        <>
            <div className="d-flex mb-1">
                <Link to="/admin/slider" className="btn btn-primary me-2">
                    <i className="fa-solid fa-left-long"></i>
                </Link>
                <h3 className="m-0">Thêm mới Slider</h3>
                <div className="d-flex flex ms-auto">
                    <button
                        type="button"
                        className="btn btn-primary ms-auto fs-5"
                        onClick={postSlider}
                    >
                        {loadingpost ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                        ) : (
                            "Thêm"
                        )}
                    </button>
                </div>
            </div>

            <form className="pb-2">
                <div className="row">
                    <div className="col-12">
                        <div className="py-1">
                            <label className="fw-bold">Tiêu đề Slider</label>
                            <input
                                onInput={handleChangeInput}
                                className="form-control border-primary"
                                value={sliderData.title}
                                type="text"
                                name="title"
                            />
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Thứ tự Slider</label>
                            <input
                                onInput={handleChangeInput}
                                className="form-control border-primary"
                                value={sliderData.displayorder}
                                type="number"
                                name="displayorder"
                            />
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Trạng thái</label>
                            <select
                                defaultValue={true}
                                value={sliderData.isactive}
                                className="form-select border-primary"
                                onChange={handleChangeInput}
                                name="isactive"
                            >
                                <option value={true}>Hiện</option>
                                <option value={false}>Ẩn</option>
                            </select>
                        </div>

                        <div className="py-1">
                            <label className="fw-bold">Nội dung Slider</label>
                            <Editor
                                onChange={handleChangeEditorDescription}
                                value={sliderData.description}
                            />
                        </div>

                        <div className="py-1 d-flex flex-column">
                            <label className="fw-bold">Ảnh Slider</label>
                            <input
                                className="form-control border-primary"
                                type="text"
                                name="imagepath"
                                value={sliderData.imagepath}
                                onInput={handleChangeInput}
                            />
                            {previewImage && (
                                <img
                                    style={{ width: "250px" }}
                                    className="img-fluid mx-auto mt-2"
                                    src={previewImage}
                                    alt="preview"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
