import { Route, Routes } from "react-router-dom";
import HisLayout from "../layouts/his/HisLayout";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import HomeIndex from "../pages/his/homepage/HomeIndex";
import ReceptionCreate from "../pages/his/reception/ReceptionCreate";
import ReceptionIndex from "../pages/his/reception/ReceptionIndex";
import ReceptionEdit from "../pages/his/reception/ReceptionEdit";
import MedicalexamIndex from "../pages/his/medicalexam/MedicalexamIndex";
import MedicalexamDetail from "../pages/his/medicalexam/MedicalexamDetail";


import HandleCLSCDHAIndex from "../pages/his/handleclspage/HandleCLSCDHAIndex";
import HandleCLSCDHAEdit from "../pages/his/handleclspage/HandleCLSCDHAEdit";

import HandleCLSXNIndex from "../pages/his/handleclspage/HandleCLSXNIndex";
import HandleCLSCXNEdit from "../pages/his/handleclspage/HandleCLSCXNEdit";

import Reception from "../pages/his/print/Reception";
import Prescription from "../pages/his/print/Prescription";
import Hdcls from "../pages/his/print/Hdcls";


import UserIndex from '../pages/admin/userpage/UserIndex';
import UserCreate from '../pages/admin/userpage/UserCreate';
import UserEdit from '../pages/admin/userpage/UserEdit';
import DepartmentIndex from '../pages/admin/departmentpage/DepartmentIndex';
import DepartmentCreate from '../pages/admin/departmentpage/DepartmentCreate';
import DepartmentEdit from '../pages/admin/departmentpage/DepartmentEdit';
import AdminLayout from '../layouts/admin/AdminLayout';
import DoctorIndex from '../pages/admin/DoctorPage/DoctorIndex';
import DoctorCreate from '../pages/admin/DoctorPage/DoctorCreate';
import DoctorEdit from '../pages/admin/DoctorPage/DoctorEdit';
import OutpatientclinicIndex from '../pages/admin/outpatientclinicpage/OutpatientclinicIndex';
import OutpatientclinicEdit from '../pages/admin/outpatientclinicpage/OutpatientclinicEdit';
import OutpatientclinicCreate from '../pages/admin/outpatientclinicpage/OutpatientclinicCreate';
import RoomtypeIndex from '../pages/admin/roomtypepage/RoomtypeIndex';
import RoomtypeEdit from '../pages/admin/roomtypepage/RoomtypeEdit';
import RoomtypeCreate from '../pages/admin/roomtypepage/RoomtypeCreate';
import RoomIndex from '../pages/admin/roompage/RoomIndex';
import RoomCreate from '../pages/admin/roompage/RoomCreate';
import RoomEdit from '../pages/admin/roompage/RoomEdit';
import DiseasegroupIndex from '../pages/admin/diseasegrouppage/DiseasegroupIndex';
import DiseasegroupCreate from '../pages/admin/diseasegrouppage/DiseasegroupCreate';
import DiseasegroupEdit from '../pages/admin/diseasegrouppage/DiseasegroupEdit';
import DiseaseIndex from '../pages/admin/diseasepage/DiseaseIndex';
import DiseaseCreate from '../pages/admin/diseasepage/DiseaseCreate';
import DiseaseEdit from '../pages/admin/diseasepage/DiseaseEdit';
import ServicecategoryIndex from '../pages/admin/servicecategorypage/ServicecategoryIndex';
import ServicecategoryCreate from '../pages/admin/servicecategorypage/ServicecategoryCreate';
import ServicecategoryEdit from '../pages/admin/servicecategorypage/ServicecategoryEdit';
import ServiceIndex from '../pages/admin/servicepage/ServiceIndex';
import ServiceCreate from '../pages/admin/servicepage/ServiceCreate';
import ServiceEdit from '../pages/admin/servicepage/ServiceEdit';
import DosageformCreate from '../pages/admin/dosageformpage/DosageformCreate';
import DosageformEdit from '../pages/admin/dosageformpage/DosageformEdit';
import DosageformIndex from '../pages/admin/dosageformpage/DosageformIndex';
import MedicineEdit from '../pages/admin/medicinepage/MedicineEdit';
import MedicineCreate from '../pages/admin/medicinepage/MedicineCreate';
import MedicineIndex from '../pages/admin/medicinepage/MedicineIndex';
import AdminLogin from '../pages/admin/authpage/AdminLogin';
import WarehouseIndex from '../pages/admin/warehousepage/WarehouseIndex';
import WarehouseCreate from '../pages/admin/warehousepage/WarehouseCreate';
import WarehouseEdit from '../pages/admin/warehousepage/WarehouseEdit';
import MenuCreate from '../pages/admin/menupage/MenuCreate';
import MenuEdit from '../pages/admin/menupage/MenuEdit';
import MenuIndex from '../pages/admin/menupage/MenuIndex';
import BlogIndex from '../pages/admin/blogpage/BlogIndex';
import BlogCreate from '../pages/admin/blogpage/BlogCreate';
import BlogEdit from '../pages/admin/blogpage/BlogEdit';
import SliderIndex from '../pages/admin/sliderpage/SliderIndex';
import SliderCreate from '../pages/admin/sliderpage/SliderCreate';
import SliderEdit from '../pages/admin/sliderpage/SliderEdit';
import Patient from '../pages/admin/statisticspage/Patient';
import Outpatient from '../pages/admin/statisticspage/Outpatient';
import Examination from '../pages/admin/statisticspage/Examination';
import UpdateDataAi from '../pages/admin/aipage/UpdateDataAi';


import HomePage from "../pages/client/HomePage";
import ClientLayout from "../layouts/client/ClientLayout";
import BlogDetail from "../pages/client/blogpage/BlogDetail";

export default function MyRoute() {
    return (
        <Routes>
            <Route path="login" element={<Login />}>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Admin", "Doctor"]} />}>
                <Route path="/his" element={<AdminLayout />}>
                    {/* docter */}
                    <Route index element={<HomeIndex />} />
                    <Route path="user" element={<UserIndex />} />

                    <Route path="Reception" element={<ReceptionIndex />} />
                    <Route path="Reception/Create" element={<ReceptionCreate />} />
                    <Route path="Reception/edit/:id" element={<ReceptionEdit />} />

                    <Route path="Medicalexam/" element={<MedicalexamIndex />} />
                    <Route path="Medicalexam/Detail/:id" element={<MedicalexamDetail />} />

                    <Route path="clsxnrequest" element={<HandleCLSXNIndex />}></Route>
                    <Route path="clsxnrequest/detail/:id" element={<HandleCLSCXNEdit />}></Route>

                    <Route path="clscdharequest" element={<HandleCLSCDHAIndex />}></Route>
                    <Route path="clscdharequest/detail/:id" element={<HandleCLSCDHAEdit />}></Route>

                </Route>
                <Route path="/his/print/reception/:id" element={<Reception />}></Route>
                <Route path="/his/print/Prescription/:id" element={<Prescription />}></Route>
                <Route path="/his/print/Hdcls/:id" element={<Hdcls />}></Route>

            </Route>

            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                <Route path="/his" element={<AdminLayout />}>

                    {/* admin */}

                    <Route path="user" element={<UserIndex />} />
                    <Route path="user/create" element={<UserCreate />} />
                    <Route path="user/edit/:id" element={<UserEdit />} />

                    <Route path="department" element={<DepartmentIndex />} />
                    <Route path="department/create" element={<DepartmentCreate />} />
                    <Route path="department/edit/:id" element={<DepartmentEdit />} />

                    <Route path="Doctor" element={<DoctorIndex />} />
                    <Route path="Doctor/create" element={<DoctorCreate />} />
                    <Route path="Doctor/edit/:id" element={<DoctorEdit />} />

                    <Route path="Outpatientclinic" element={<OutpatientclinicIndex />} />
                    <Route path="Outpatientclinic/create" element={<OutpatientclinicCreate />} />
                    <Route path="Outpatientclinic/edit/:id" element={<OutpatientclinicEdit />} />

                    <Route path="Roomtype" element={<RoomtypeIndex />} />
                    <Route path="Roomtype/create" element={<RoomtypeCreate />} />
                    <Route path="Roomtype/edit/:id" element={<RoomtypeEdit />} />

                    <Route path="Room" element={<RoomIndex />} />
                    <Route path="Room/create" element={<RoomCreate />} />
                    <Route path="Room/edit/:id" element={<RoomEdit />} />

                    <Route path="Diseasegroup" element={<DiseasegroupIndex />} />
                    <Route path="Diseasegroup/create" element={<DiseasegroupCreate />} />
                    <Route path="Diseasegroup/edit/:id" element={<DiseasegroupEdit />} />

                    <Route path="Disease" element={<DiseaseIndex />} />
                    <Route path="Disease/create" element={<DiseaseCreate />} />
                    <Route path="Disease/edit/:id" element={<DiseaseEdit />} />

                    <Route path="Servicecategory" element={<ServicecategoryIndex />} />
                    <Route path="Servicecategory/create" element={<ServicecategoryCreate />} />
                    <Route path="Servicecategory/edit/:id" element={<ServicecategoryEdit />} />

                    <Route path="Service" element={<ServiceIndex />} />
                    <Route path="Service/create" element={<ServiceCreate />} />
                    <Route path="Service/edit/:id" element={<ServiceEdit />} />

                    <Route path="Dosageform" element={<DosageformIndex />} />
                    <Route path="Dosageform/create" element={<DosageformCreate />} />
                    <Route path="Dosageform/edit/:id" element={<DosageformEdit />} />

                    <Route path="Medicine" element={<MedicineIndex />} />
                    <Route path="Medicine/create" element={<MedicineCreate />} />
                    <Route path="Medicine/edit/:id" element={<MedicineEdit />} />

                    <Route path="Warehouse" element={<WarehouseIndex />} />
                    <Route path="Warehouse/create" element={<WarehouseCreate />} />
                    <Route path="Warehouse/edit/:id" element={<WarehouseEdit />} />

                    <Route path="Menu" element={<MenuIndex />} />
                    <Route path="Menu/create" element={<MenuCreate />} />
                    <Route path="Menu/edit/:id" element={<MenuEdit />} />

                    <Route path="Blog" element={<BlogIndex />} />
                    <Route path="Blog/create" element={<BlogCreate />} />
                    <Route path="Blog/edit/:id" element={<BlogEdit />} />

                    <Route path="Slider" element={<SliderIndex />} />
                    <Route path="Slider/create" element={<SliderCreate />} />
                    <Route path="Slider/edit/:id" element={<SliderEdit />} />

                    <Route path="Statistics/Patient" element={<Patient />} />
                    <Route path="Statistics/Outpatient" element={<Outpatient />} />
                    <Route path="Statistics/Examination" element={<Examination />} />

                    <Route path="Ai/UpdateData" element={<UpdateDataAi />} />

                </Route>

            </Route>
            <Route path="/" element={<ClientLayout />}>
                <Route index element={<HomePage />} />
                <Route path="Home" element={<HomePage />} />
                <Route path="bai-viet/:alias/:id" element={<BlogDetail />} />
            </Route>
        </Routes>
    );
}