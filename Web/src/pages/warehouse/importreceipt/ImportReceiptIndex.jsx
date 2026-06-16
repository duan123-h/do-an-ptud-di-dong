import { useEffect, useState } from "react";
import React, { Fragment } from 'react';
import ImportReceiptService from "../../../services/ImportReceiptService";
import MedicineService from "../../../services/MedicineService";
import SupplierService from "../../../services/SupplierService";
import toast from 'react-hot-toast';
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"
export default function ImportReceiptIndex() {
    const mysal = withReactContent(swal);
    const [importReceiptData, setImportReceiptData] = useState([]);
    const [importReceipt, setImportReceipt] = useState({
        importdate: new Date(),
        details: [
            {
                id: crypto.randomUUID(),
                medicineid: null,
                lotnumber: null,
                unitprice: null,
                totalamount: null,
                supplierid: null,
            }
        ]
    });
    const [listMedicineData, setListMedicineData] = useState([]);
    const [optionMedicineData, setOptionMedicineData] = useState([]);
    const [listSupplierData, setListSupplierData] = useState([]);
    const [optionSupplierData, setOptionSupplierData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    async function fetchImportReceipt() {
        try {
            setLoading(true);
            const res = await ImportReceiptService.getAll();
            setImportReceiptData(res.data);
            setLoading(false)
        } catch (error) {
            toast.error("Loi khi lay du lieu");
            console.log("loi lay du lieu phie nhap duoc:  ", error);
            setLoading(false);
        }
    }
    async function fetchListMedicine() {
        try {
            const res = await MedicineService.getAll();
            setListMedicineData(res.data);
            const options = res.data.map((item) => ({
                value: item.medicineid,
                label: item.name,
            }));
            setOptionMedicineData(options);
        } catch (error) {
            toast.error("Loi khi lay du lieu");
            console.log("loi lay du lieu duoc pham:  ", error);;
        }
    }
    async function fetchListSupplier() {
        try {
            const res = await SupplierService.getAll();
            setListSupplierData(res.data);
            const options = res.data.map((item) => ({
                value: item.supplierid,
                label: item.name,
            }));
            setOptionSupplierData(options);
        } catch (error) {
            toast.error("Loi khi lay du lieu");
            console.log("loi lay du lieu duoc pham:  ", error);;
        }
    }
    useEffect(() => {
        fetchImportReceipt();
    }, [location])
    useEffect(() => {
        fetchListMedicine();
        fetchListSupplier();
    }, [])
    function handleRemoveImportReceipt(id) {
        setImportReceipt(prev => ({
            ...prev,
            details: prev.details.filter(item => item.id !== id)
        }));
    }
    async function handleImportReceiptSave() {
        try {
            setLoadingSave(true);
            const res = await ImportReceiptService.create(importReceipt);
            setLoadingSave(false);
            fetchImportReceipt();
            setShowModal(false);
            toast.success("Lưu thông tin phiếu nhập kho dược thành công.");
        } catch (error) {
            setLoadingSave(false);
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
    }
    function handleImportReceiptProcess(importReceiptId) {
        mysal.fire({
            title: `Bạn có chắc muốn xác nhận nhập kho cho phiếu nhập kho có mã ${importReceiptId} không?`,
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            preConfirm: async () => {
                try {
                    const res = await ImportReceiptService.process(importReceiptId);
                    mysal.fire('Đã nhập kho!', res.message, 'success');
                    fetchImportReceipt();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xác nhận nhập kho không thành công.', 'errors');
                }
            },
        })
    }
    function handleImportReceiptDestroy(importReceiptId) {
        mysal.fire({
            title: `Bạn có chắc muốn xác nhận xóa phiếu nhập kho có mã ${importReceiptId} không?`,
            text: "Hành động này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            preConfirm: async () => {
                try {
                    const res = await ImportReceiptService.destroy(importReceiptId);
                    mysal.fire('Đã xóa!', res.message, 'success');
                    fetchImportReceipt();
                } catch (error) {
                    swal.fire('Lỗi!', 'Xóa phiếu nhập kho không thành công.', 'errors');
                }
            },
        })
    }
    return (
        <>
            <style>
                {`
                    .custom-button .acc-icon {
                        transition: 0.2s;
                    }
                    .custom-button .acc-icon::before {
                        content: "\\f054";
                    }
                    .custom-button:not(.collapsed) .acc-icon::before {
                        content: "\\f078";
                    }
                `}
            </style>
            {showModal && (
                <div
                    className="modal fade show"
                    id="clinicModal"
                    tabIndex="-1"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog" style={{ maxWidth: "75vw", width: '100%' }}>
                        <div className="modal-content text-white ">
                            <div className="modal-header border-0 bg-primary bg-opacity-25">
                                <h5 className="modal-title fw-bold text-primary">Tạo phiếu nhập kho</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body" >
                                <div className="d-block">
                                    <h4 class="card-title p-0 mb-2">Danh sách dược phẩm</h4>
                                    <div className="">
                                        {
                                            importReceipt?.details.map((item, index) => {
                                                const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-secondary bg-opacity-25";
                                                return (
                                                    <div key={item.id} className={`d-flex p-3 my-2 rounded ${rowBgClass}`}>
                                                        <div className="row">
                                                            <div className="col-3 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Tên dược phẩm</label>
                                                                    <Select
                                                                        styles={{
                                                                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                                            menu: base => ({
                                                                                ...base,
                                                                                backgroundColor: "white"
                                                                            }),
                                                                            control: base => ({
                                                                                ...base,
                                                                                backgroundColor: "white"
                                                                            })
                                                                        }}
                                                                        onChange={(selected) => {
                                                                            setImportReceipt(prev => ({
                                                                                ...prev,
                                                                                details: prev.details.map(d =>
                                                                                    d.id === item.id
                                                                                        ? { ...d, medicineid: selected?.value || "" }
                                                                                        : d
                                                                                )
                                                                            }));
                                                                        }}
                                                                        options={optionMedicineData}
                                                                        value={optionMedicineData.find(
                                                                            (opt) => opt.value === item.medicineid
                                                                        )}
                                                                        placeholder="-- Chọn dược phẩm --"
                                                                        isSearchable
                                                                        isClearable
                                                                        menuPortalTarget={document.body}
                                                                        menuPosition="fixed"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-3 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Mã dược phẩm</label>
                                                                    <input type="text" value={item.medicineid} class="form-control" readonly></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Nhà sản xuất</label>
                                                                    <input type="text" class="form-control" value={(listMedicineData.find(m => m.medicineid == item.medicineid))?.manufacturer?.name} readonly></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Nhà cung cấp</label>
                                                                    <Select
                                                                        placeholder="-- Chọn nhà cung cấp --"
                                                                        styles={{
                                                                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                                            menu: base => ({
                                                                                ...base,
                                                                                backgroundColor: "white"
                                                                            }),
                                                                            control: base => ({
                                                                                ...base,
                                                                                backgroundColor: "white"
                                                                            })
                                                                        }}
                                                                        onChange={(selected) => {
                                                                            setImportReceipt(prev => ({
                                                                                ...prev,
                                                                                details: prev.details.map(d =>
                                                                                    d.id === item.id
                                                                                        ? { ...d, supplierid: selected?.value || "" }
                                                                                        : d
                                                                                )
                                                                            }));
                                                                        }}
                                                                        options={optionSupplierData}
                                                                        value={optionSupplierData.find(
                                                                            (opt) => opt.value === item.supplierid
                                                                        )}
                                                                        isSearchable
                                                                        isClearable
                                                                        menuPortalTarget={document.body}
                                                                        menuPosition="fixed"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-3 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Số lô sản xuất</label>
                                                                    <input type="text" value={item.lotnumber} class="form-control" onChange={(e) => {
                                                                        setImportReceipt(prev => ({
                                                                            ...prev,
                                                                            details: prev.details.map(d =>
                                                                                d.id === item.id
                                                                                    ? { ...d, lotnumber: e.target.value }
                                                                                    : d
                                                                            )
                                                                        }));

                                                                    }}></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-2 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Hạn sử dụng</label>
                                                                    <input type="date" value={item.expirationdate} class="form-control" onChange={(e) => {
                                                                        setImportReceipt(prev => ({
                                                                            ...prev,
                                                                            details: prev.details.map(d =>
                                                                                d.id === item.id
                                                                                    ? { ...d, expirationdate: e.target.value }
                                                                                    : d
                                                                            )
                                                                        }));

                                                                    }}></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-2 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Số lượng</label>
                                                                    <input type="number" value={item.quantity} class="form-control" onChange={(e) => {
                                                                        setImportReceipt(prev => ({
                                                                            ...prev,
                                                                            details: prev.details.map(d =>
                                                                                d.id === item.id
                                                                                    ? { ...d, quantity: e.target.value }
                                                                                    : d
                                                                            )
                                                                        }));

                                                                    }}></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-2 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Đơn giá</label>
                                                                    <input type="number" value={item.unitprice} class="form-control" onChange={(e) => {
                                                                        setImportReceipt(prev => ({
                                                                            ...prev,
                                                                            details: prev.details.map(d =>
                                                                                d.id === item.id
                                                                                    ? { ...d, unitprice: e.target.value }
                                                                                    : d
                                                                            )
                                                                        }));

                                                                    }}></input>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 my-2">
                                                                <div class="form-group">
                                                                    <label for="exampleInputEmail1" className="text-dark mb-1">Thành tiền</label>
                                                                    <input type="number" value={item.quantity * item.unitprice} class="form-control"></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <button className="btn btn-secondary btn-sm mx-2" onClick={() => handleRemoveImportReceipt(item.id)}>
                                                                <i className="fa-regular fa-trash-can fs-6" ></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                        <div>
                                            <h4 style={{ cursor: 'pointer' }} class="card-title p-0 my-3 text-primary" onClick={() => {
                                                setImportReceipt(prev => {
                                                    const updatedDetails = [...prev.details];
                                                    updatedDetails.push({
                                                        id: crypto.randomUUID(),
                                                        medicineid: null,
                                                        lotnumber: null,
                                                        unitprice: null,
                                                        totalamount: null,
                                                        supplierid: null
                                                    });
                                                    return {
                                                        ...prev,
                                                        details: updatedDetails
                                                    };
                                                });
                                            }}><i className="fa-solid fa-plus me-2"></i>Thêm sản phẩm</h4>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-dark" htmlFor="note" >Ghi chú</label>
                                        <textarea className="form-control" name="note" id="note" onChange={(e) => {
                                            setImportReceipt(prev => ({
                                                ...prev,
                                                note: e.target.value
                                            }));
                                        }}></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer border-0">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Đóng
                                </button>
                                <button className="btn btn-primary" disabled={loadingSave} onClick={handleImportReceiptSave}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div class="card shadow-sm">
                <div class="card-body">
                    <h4 class="card-title">Quản lý nhập kho dược</h4>
                    <div className="d-sm-flex flex-row d-block align-items-center">
                        <form action="" method="get" className="d-flex flex-row align-items-center">
                            <input name="search" type="text" className="form-control border-dark me-2" style={{ Width: '250px' }}
                                id="exampleFormControlInput1" placeholder="name@example.com" />
                            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-search"></i></button>
                            <Link to="/warehouse/importreceipt/" className="btn btn-primary ms-2"><i className="fa-solid fa-rotate-right"></i></Link>
                        </form>
                        <button className="btn btn-success mx-0 my-2 ms-sm-auto text-nowrap" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus me-2"></i>Nhập kho</button>
                    </div>
                    <div class="table-responsive ">
                        <table class="table w-100 " style={{ tableLayout: 'fixed' }}>
                            <thead class="border-bottom-2 border-dark" >
                                <tr >
                                    <th class="text-primary" style={{ width: '30px', minWidth: '30px' }} scope="col"></th>
                                    <th class="text-primary" style={{ width: '120px', minWidth: '120px' }} scope="col">Mã phiếu</th>
                                    <th class="text-primary" scope="col">Ngày nhập kho</th>
                                    <th class="text-primary" scope="col">Người nhập kho</th>
                                    <th class="text-primary" scope="col">Ghi chú</th>
                                    <th class="text-primary" scope="col">Tổng tiền nhập</th>
                                    <th class="text-primary" scope="col">Trạng thái</th>
                                    <th class="text-primary" style={{ width: '80px', maxWidth: '80px' }} scope="col">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody class="sidebar-nav">
                                {
                                    !loading && (
                                        importReceiptData.map((item, index) => {
                                            return (
                                                <>
                                                    <tr style={{ cursor: 'pointer' }}
                                                        aria-expanded="false">
                                                        <th style={{ width: '30px', minWidth: '30px' }} class="align-middle custom-button collapsed  collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} scope="row"><i
                                                            class="fa-solid acc-icon m-0"></i></th>
                                                        <td style={{ width: '120px', minWidth: '120px' }} class="align-middle  custom-button collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>{item.importreceiptid}</td>
                                                        <td class="align-middle" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                                            {new Date(item.importdate).toLocaleString("vi-vn")}
                                                        </td>
                                                        <td class="align-middle custom-button collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                                            {item.user?.name}
                                                        </td>
                                                        <td class="align-middle custom-button collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                                            {item.note}
                                                        </td>
                                                        <td class="align-middle custom-button collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                                            {item.totalamount}
                                                        </td>
                                                        <td class="align-middle custom-button collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                                            {item.status ? (
                                                                <div className="text-success">
                                                                    Đã nhập
                                                                </div>
                                                            ) : (
                                                                <div className="text-secondary">
                                                                    Bản nháp
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td class="align-middle text-nowrap">
                                                            {!item.status && (
                                                                <>
                                                                    <div className="text-secondary m-2 text-center" onClick={() => handleImportReceiptProcess(item.importreceiptid)}>
                                                                        <i class="fa-solid fa-circle-check fs-4"></i>
                                                                    </div>
                                                                    <div className="text-danger m-2 text-center" onClick={() => handleImportReceiptDestroy(item.importreceiptid)}>
                                                                        <i class="fa-regular fa-trash-can fs-4"></i>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr id={`collapse${index}`} class="collapse">
                                                        <td></td>
                                                        <td colspan="6">
                                                            <div id={`collapse${index}`} class="collapse" data-bs-parent="#accordionExample">
                                                                <table class="table table-borderless">
                                                                    <thead>
                                                                        <tr>
                                                                            <td style={{ width: '80px', minWidth: '80px' }} scope="col">Mã dược</td>
                                                                            <td scope="col">Tên dược phẩm</td>
                                                                            <td scope="col">Nhà cung cấp</td>
                                                                            <td scope="col">Số lô nhà cung cấp</td>
                                                                            <td scope="col">Hạn sử dụng</td>
                                                                            <td scope="col">Số lượng</td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            item.details?.map(item1 => {
                                                                                return (
                                                                                    <>
                                                                                        <tr>
                                                                                            <td style={{ width: '80px', minWidth: '80px' }}>{item1.medicine?.medicineid}</td>
                                                                                            <td>{item1.medicine?.name}</td>
                                                                                            <td>{item1.supplier?.name}</td>
                                                                                            <td>{item1.batch?.lotnumber}</td>
                                                                                            <td>{new Date(item1.batch?.expirationdate).toLocaleString("vi-vn")}</td>
                                                                                            <td>{item1.batch?.quantity}</td>
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