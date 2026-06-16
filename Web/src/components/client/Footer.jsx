

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../../services/MenuService"
import toast from 'react-hot-toast';
export default function Footer() {

    return (
        <footer>
            <div style={{ background: "rgba(239,239,239,1)" }}>
                <div className="d-flex container-md px-2 py-4">
                    <div className="col-6">
                        <a className="navbar-brand fs-5 d-flex align-items-center" href="/">
                            <div className="me-1 d-inline" style={{ minWidth: "80px", width: "80px" }}>
                                <svg
                                    viewBox="0 0 166.63 146.21"
                                    preserveAspectRatio="none"
                                    width="auto"
                                    height="auto"
                                >
                                    <path
                                        d="M73.11 41.43a31.68 31.68 0 1 0 31.68 31.68 31.68 31.68 0 0 0-31.68-31.68m19.9 38H79.43v13.65H66.78V79.43H53.21V66.78h13.57V53.13h12.65v13.65H93Z"
                                        fill="#49bce2"
                                    />
                                    <path
                                        d="M73.11 125.24A52.13 52.13 0 0 1 21 74.49V21.88a73.09 73.09 0 1 0 107.67 98.74L112.71 107a52 52 0 0 1-39.6 18.24M73.11 0A72.82 72.82 0 0 0 44.3 5.91l-.3.15a3.76 3.76 0 0 0-2.13 3.37v22A52.14 52.14 0 0 1 113.36 40l16.19-13.33A73 73 0 0 0 73.11 0"
                                        fill="#49bce2"
                                    />
                                </svg>
                            </div>
                            Bệnh viện bạch mai
                        </a>
                        <div className="mt-3 fs-6">
                            <i className="fa-solid fa-location-dot me-2"></i>
                            <b>Địa chỉ: </b>78 Đường Lê Duẩn, Thành phố Vinh, Nghệ An
                        </div>
                        <div className="mt-3 fs-6">
                            <i className="fa-solid fa-phone me-2"></i>
                            <b>Tổng đài: </b>1900.666.888
                        </div>
                        <div className="mt-3 fs-6">
                            <i className="fa-solid fa-truck-medical me-2"></i>
                            <b>Hotline: </b>0922.333.888
                        </div>
                    </div>

                    <div className="col-6">
                        <a className="navbar-brand fs-5 d-flex align-items-center" href="/">
                            <i className="fa-solid fa-circle-h me-2"></i> Về Bệnh viện A
                        </a>
                        <a className="navbar-brand fs-5 d-flex align-items-center" href="/">
                            <i className="fa-solid fa-stethoscope me-2"></i> Đội ngũ bác sĩ
                        </a>
                    </div>
                </div>
            </div>

            <div style={{ background: "rgba(100,185,229,1)", height: "80px" }}>
                <div className="container-md px-2 py-4"></div>
            </div>
        </footer>

    );
}