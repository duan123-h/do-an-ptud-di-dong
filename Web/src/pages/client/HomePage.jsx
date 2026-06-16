import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import SliderService from '../../services/SliderService';
import DoctorService from '../../services/DoctorService';
import BlogService from '../../services/BlogService';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getSlug from 'speakingurl';
export default function HomePage() {
    const Location = useLocation();
    const [sliderData, setSliderData] = useState([]);
    const [doctorData, setDoctorData] = useState([]);
    const [blogData, setBlogData] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchSliderData = async () => {
        try {
            const params = { status: 1 }
            const response = await SliderService.getAll(params);
            setSliderData(response.data);
        } catch (error) {
            console.error("Error fetching Menus:", error);
        }
    };
    const fetchDoctorData = async () => {
        try {
            const params = { limit: 6 }
            const response = await DoctorService.getAll(params);
            setDoctorData(response.data);
        } catch (error) {
            console.error("Error fetching Menus:", error);
        }
    };
    const fetchBlogData = async () => {
        try {
            const params = { limit: 6 }
            const response = await BlogService.getAll(params);
            setBlogData(response.data);
        } catch (error) {
            console.error("Error fetching Menus:", error);
        }
    };
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            await Promise.all([fetchSliderData(), fetchDoctorData(), fetchBlogData()]);
            setLoading(false);
        };
        fetchAll();
    }, []);
    return (

        <>
            {
                loading ? (
                    <div style={{ width: '100%', height: '100vh' }} className="d-flex justify-content-center align-items-center">
                        <div style={{ width: '50px', height: '50px' }} class="spinner-border text-primary" role="status">
                            <span class="sr-only fs-5">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="pt-4">
                            <Swiper
                                modules={[Autoplay]}
                                direction="horizontal"
                                loop={true}
                                autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: false
                                }}
                                speed={800}
                                spaceBetween={20}
                                breakpoints={{
                                    360: { slidesPerView: 1 },
                                    600: { slidesPerView: 1 },
                                    767: { slidesPerView: 1 },
                                    991: { slidesPerView: 1 },
                                    1200: { slidesPerView: 1 },
                                    1400: { slidesPerView: 1 },
                                }}
                                observer={true}
                                observeParents={true}
                            >
                                {
                                    sliderData.map(item => {
                                        return (
                                            <SwiperSlide key={`s${item.sliderid}`}>
                                                <div className="card" style={{ background: "none", border: "none" }}>
                                                    <Link>
                                                        <img src={item.imagepath} className="card-img-top" alt="..." />
                                                    </Link>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })
                                }
                            </Swiper>
                        </div>

                        <div
                            className="p-4 mb-3"
                            style={{ background: "#f5f5f5", borderRadius: "20px" }}
                        >
                            <h3 className="ps-2 fs-5 mb-0 text-dark">
                                <b>Tin tức mới nhất</b>
                            </h3>
                            <a className="ps-2 nav-link text-white pt-0 w-auto" to="/bai-viet/">
                                <p className="fs-6 text-dark" style={{ display: "inline-block" }}>
                                    Xem thêm &gt;
                                </p>
                            </a>
                            {
                                blogData.length != 0 && (
                                    <div className="row align-items-stretch">
                                        <div className="col-12 col-md-8 col-lg-8 col-xl-8 py-2">
                                            <div className="position-relative" style={{ borderRadius: "10px" }}>
                                                <Link to={`/bai-viet/${getSlug(blogData[0].title, { lang: 'vi', maintainCase: false })}/${blogData[0].blogid}`}>
                                                    <img
                                                        src={blogData[0].image}
                                                        alt={blogData[0].title}
                                                        style={{ aspectRatio: "12 / 5.5", objectFit: "cover", display: "block" }}
                                                        onError={(e) => (e.target.src = "https://bachmai.gov.vn/assets/images/default-image.png")}
                                                        className="card-img-top"
                                                    />
                                                </Link>
                                                <div
                                                    className="position-absolute bottom-0 start-0 w-100"
                                                    style={{
                                                        background: "linear-gradient(to bottom, rgba(0, 128, 255, 0) 0%, rgba(31, 135, 79, 1) 100%)",
                                                        borderBottomLeftRadius: "10px",
                                                        borderBottomRightRadius: "10px",
                                                        padding: "0.5rem",
                                                    }}
                                                >
                                                    <Link
                                                        className="nav-link text-white p-0 pt-1"
                                                        to={`/bai-viet/${getSlug(blogData[0].title, { lang: 'vi', maintainCase: false })}/${blogData[0].blogid}`}
                                                    >
                                                        <h6
                                                            className="fw-bold text-nowrap text-truncate text-white"
                                                        >
                                                            {blogData[0].title}
                                                        </h6>
                                                    </Link>
                                                    <p className="mb-0 text-white fs-6">
                                                        {new Date(blogData[0].createddate).toLocaleDateString("vi-VN")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {blogData.slice(1).map((item, index) => (
                                            <div key={index} className="col-12 col-md-4 col-lg-4 col-xl-4 py-2">
                                                <div className="h-100" style={{ background: "#eeeeee", borderRadius: "10px" }}>
                                                    <Link to={`/bai-viet/${getSlug(item.title, { lang: 'vi', maintainCase: false })}/${item.blogid}`}>
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            style={{
                                                                aspectRatio: "12 / 5.5",
                                                                objectFit: "cover",
                                                                display: "block",
                                                                borderTopLeftRadius: "10px",
                                                                borderTopRightRadius: "10px",
                                                            }}
                                                            className="card-img-top"
                                                            onError={(e) => (e.target.src = "https://bachmai.gov.vn/assets/images/default-image.png")}
                                                        />
                                                    </Link>
                                                    <div className="card-body py-3">
                                                        <Link
                                                            className="nav-link text-dark p-0"
                                                            to={`/bai-viet/${getSlug(item.title, { lang: 'vi', maintainCase: false })}/${item.blogid}`}
                                                        >
                                                            <h6 className="card-title fw-bold text-nowrap text-truncate text-dark">{item.title}</h6>
                                                        </Link>
                                                        <p className="fs-6">{new Date(item.createddate).toLocaleDateString("vi-VN")}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>
                        <div
                            className="p-4 mb-3"
                            style={{ background: "#f5f5f5", borderRadius: "20px" }}
                        >
                            <h3 className="ps-2 fs-5 mb-0 text-dark">
                                <b>Đội ngũ y bác sĩ</b>
                            </h3>
                            <a className="ps-2 nav-link text-white pt-0 w-auto" to="/bai-viet/">
                                <p className="fs-6 text-dark" style={{ display: "inline-block" }}>
                                    Xem thêm &gt;
                                </p>
                            </a>
                            <Swiper
                                modules={[Autoplay]}
                                direction="horizontal"
                                loop={true}
                                autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: false
                                }}
                                speed={800}
                                spaceBetween={20}
                                breakpoints={{
                                    360: { slidesPerView: 1 },
                                    600: { slidesPerView: 2 },
                                    767: { slidesPerView: 3 },
                                    991: { slidesPerView: 4 },
                                    1200: { slidesPerView: 5 },
                                    1400: { slidesPerView: 5 },
                                }}
                                observer={true}
                                observeParents={true}
                            >
                                {
                                    doctorData.map(doctor => {
                                        return (
                                            <SwiperSlide key={`s${doctor.doctorid}`}>
                                                <div className="card" style={{ background: "none", border: "none" }}>
                                                    <Link to={`/bac-si/${getSlug(doctor.fullname, { lang: 'vi', maintainCase: false })}/${doctor.doctorid}`}>
                                                        <img
                                                            src={doctor.avartar}
                                                            alt={doctor.fullname}
                                                            style={{
                                                                aspectRatio: "9 / 12",
                                                                objectFit: "cover",
                                                                display: "block",
                                                                borderRadius: "10px",
                                                            }}
                                                            className="card-img-top"
                                                        />
                                                    </Link>
                                                    <div className="card-body px-0" style={{ background: "none", border: "none" }}>
                                                        <Link
                                                            className="nav-link text-dark p-0"
                                                            to={`/bac-si/${getSlug(doctor.fullname, { lang: 'vi', maintainCase: false })}/${doctor.doctorid}`}
                                                        >
                                                            <h6 className="card-title text-center fs-6 text-dark">{doctor.specialization}</h6>
                                                        </Link>
                                                        <Link
                                                            className="nav-link p-0 text-dark"
                                                            to={`/bac-si/${getSlug(doctor.fullname, { lang: 'vi', maintainCase: false })}/${doctor.doctorid}`}
                                                        >
                                                            <h5 className="text-center fw-bold text-dark">{doctor.fullname}</h5>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })
                                }
                            </Swiper>
                        </div>
                    </>
                )
            }
        </>
    );
}