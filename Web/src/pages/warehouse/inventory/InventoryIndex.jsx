import { useEffect, useState } from "react";
import React, { Fragment } from 'react';
import InventoryService from "../../../services/InventoryService";
import toast from 'react-hot-toast';
import { Link, useLocation } from "react-router-dom";
export default function InventoryIndex() {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    async function fetchInventorys() {
        try {
            setLoading(true);
            const res = await InventoryService.getAll();
            setInventoryData(res.data);
            setLoading(false)
        } catch (error) {
            toast.error("Loi khi lay du lieu");
            console.log("loi lay du lieu ton kho:  ", error);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchInventorys();
    }, [location])

    const getInventoryStatus = (expDate, qty) => {
        const today = new Date();
        const exp = new Date(expDate);
        const diffDays = (exp - today) / (1000 * 60 * 60 * 24);

        if (qty === 0) return "out";
        if (exp < today) return "expired";
        if (diffDays <= 90) return "nearexp";
        if (qty <= 50) return "low";
        return "ok";
    };
    const getStatusClass = (status) => {
        switch (status) {
            case "expired":
            case "out":
                return "bg-danger text-white";
            case "nearexp":
            case "low":
                return "bg-warning";
            default:
                return "bg-success text-white";
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "expired":
                return "fa-exclamation";
            case "out":
                return "fa-exclamation";
            case "nearexp":
                return "fa-clock";
            case "low":
                return "fa-triangle-exclamation";
            default:
                return "fa-check";
        }
    };
    const getMedicineStatus = (inventories) => {
        let hasExpired = false;
        let hasWarning = false;

        inventories?.forEach(i => {
            const status = getInventoryStatus(i.batch?.expirationdate, i.stockquantity);

            if (status === "expired" || status === "out") hasExpired = true;
            if (status === "nearexp" || status === "low") hasWarning = true;
        });

        if (hasExpired) return "expired";
        if (hasWarning) return "warning";
        return "ok";
    };

    return (
        <>
            <style>
                {`
                    .custom-button th .acc-icon {
                        transition: 0.2s;
                    }
                    .custom-button th .acc-icon::before {
                        content: "\\f054";
                    }
                    .custom-button:not(.collapsed) th .acc-icon::before {
                        content: "\\f078";
                    }
                `}
            </style>
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý tồn kho dược</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/admin/department" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <Link to="/admin/department/create" className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap"><i className="fa-solid fa-plus me-2"></i>Thêm</Link>
                    </div>
                    <div className="mb-2 d-flex flex-wrap gap-2">
                        <span className="badge bg-danger">
                            <i className="fa-solid fa-exclamation me-1"></i> Hết hạn / Hết hàng
                        </span>
                        <span className="badge bg-warning text-dark">
                            <i className="fa-solid fa-triangle-exclamation me-1"></i> Sắp hết(50 viên) / Sắp hết hạn(90 ngày)
                        </span>
                        <span className="badge bg-success">
                            <i className="fa-solid fa-check me-1"></i> Bình thường
                        </span>
                    </div>
                    <div class="table-responsive">
                        <table class="table w-100 table-borderless" style={{ tableLayout: 'fixed' }}>
                            <thead class="border-bottom-2 border-dark" >
                                <tr >
                                    <th class="text-primary" style={{ width: '30px', minWidth: '30px' }} scope="col"></th>
                                    <th class="text-primary" style={{ width: '80px', minWidth: '80px' }} scope="col">id</th>
                                    <th class="text-primary" >Tên dược phẩm</th>
                                    <th class="text-primary" style={{ width: '200px', minWidth: '200px' }}>Tổng tồn kho</th>
                                </tr>
                            </thead>
                            <tbody class="sidebar-nav">
                                {
                                    !loading && (
                                        inventoryData.map((item, index) => {
                                            const medStatus = getMedicineStatus(item.inventories);
                                            return (
                                                <>
                                                    <tr style={{ cursor: 'pointer' }} class="custom-button collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}
                                                        aria-expanded="false">
                                                        <th style={{ width: '30px', minWidth: '30px' }} class="align-middle" scope="row"><i
                                                            class="fa-solid acc-icon m-0"></i></th>
                                                        <td style={{ width: '80px', minWidth: '80px' }} class="align-middle">{item.medicineid}</td>
                                                        <td class="align-middle">
                                                            {item.name}
                                                            {medStatus === "expired" && (
                                                                <span className="badge bg-danger ms-2">
                                                                    <i className="fa-solid fa-exclamation"></i>
                                                                </span>
                                                            )}

                                                            {medStatus === "warning" && (
                                                                <span className="badge bg-warning text-dark ms-2">
                                                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td class="align-middle">
                                                            {item.totalstockquantity ?? 0}
                                                        </td>
                                                    </tr>
                                                    <tr id={`collapse${index}`} class="collapse" >
                                                        <td></td>
                                                        <td></td>
                                                        <td >
                                                            <div id={`collapse${index}`} class="collapse" data-bs-parent="#accordionExample">
                                                                <table class="table table-sm table-borderless">
                                                                    <thead>
                                                                        <tr>
                                                                            <td scope="col">Số lô nhập</td>
                                                                            <td scope="col">Nhà sản xuất</td>
                                                                            <td scope="col">Số lô nhà sản xuất</td>
                                                                            <td scope="col">Hạn sử dụng</td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            item.inventories?.map(item1 => {
                                                                                const status = getInventoryStatus(item1.batch?.expirationdate, item1.stockquantity);
                                                                                return (
                                                                                    <>
                                                                                        <tr>
                                                                                            <td>{item1.batchid}</td>
                                                                                            <td>{item1.supplier?.name}</td>
                                                                                            <td>{item1.batch?.lotnumber}</td>
                                                                                            <td className={getStatusClass(status)}>
                                                                                                <i className={`fa-solid ${getStatusIcon(status)} me-2`}></i>
                                                                                                {new Date(item1.batch?.expirationdate).toLocaleDateString("vi-vn")}
                                                                                            </td>

                                                                                        </tr>
                                                                                    </>);
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div id={`collapse${index}`} class="collapse" data-bs-parent="#accordionExample">
                                                                <table class="table table-sm table-borderless">
                                                                    <thead>
                                                                        <tr>
                                                                            <td scope="col">Số lượng còn lại</td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            item.inventories?.map(item1 => {
                                                                                const status = getInventoryStatus(item1.batch?.expirationdate, item1.stockquantity);
                                                                                return (
                                                                                    <>
                                                                                        <tr>
                                                                                            <td className={getStatusClass(status)}>
                                                                                                
                                                                                                {item1.stockquantity}
                                                                                            </td>

                                                                                        </tr>
                                                                                    </>);
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        })
                                    )
                                }

                            </tbody>
                        </table>
                        {loading &&
                            (
                                <div class="d-flex justify-content-center w-100 mb-3">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>

                            )
                        }
                    </div>
                </div>
            </div>


        </>
    );
}