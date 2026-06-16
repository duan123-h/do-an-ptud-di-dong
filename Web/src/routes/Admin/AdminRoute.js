import {Routes,Route} from 'react-router-dom';
import UserIndex from '../../pages/admin/userpage/UserIndex';
import UserCreate from '../../pages/admin/userpage/UserCreate';
import UserEdit from '../../pages/admin/userpage/UserEdit';
import DepartmentIndex from '../../pages/admin/departmentpage/DepartmentIndex';
import DepartmentCreate from '../../pages/admin/departmentpage/DepartmentCreate';
import DepartmentEdit from '../../pages/admin/departmentpage/DepartmentEdit';
import AdminLayout from '../../layouts/admin/AdminLayout';
import DoctorIndex from '../../pages/admin/DoctorPage/DoctorIndex';
import DoctorCreate from '../../pages/admin/DoctorPage/DoctorCreate';
import DoctorEdit from '../../pages/admin/DoctorPage/DoctorEdit';
import OutpatientclinicIndex from '../../pages/admin/outpatientclinicpage/OutpatientclinicIndex';
import OutpatientclinicEdit from '../../pages/admin/outpatientclinicpage/OutpatientclinicEdit';
import OutpatientclinicCreate from '../../pages/admin/outpatientclinicpage/OutpatientclinicCreate';
import RoomtypeIndex from '../../pages/admin/roomtypepage/RoomtypeIndex';
import RoomtypeEdit from '../../pages/admin/roomtypepage/RoomtypeEdit';
import RoomtypeCreate from '../../pages/admin/roomtypepage/RoomtypeCreate';
import RoomIndex from '../../pages/admin/roompage/RoomIndex';
import RoomCreate from '../../pages/admin/roompage/RoomCreate';
import RoomEdit from '../../pages/admin/roompage/RoomEdit';
import DiseasegroupIndex from '../../pages/admin/diseasegrouppage/DiseasegroupIndex';
import DiseasegroupCreate from '../../pages/admin/diseasegrouppage/DiseasegroupCreate';
import DiseasegroupEdit from '../../pages/admin/diseasegrouppage/DiseasegroupEdit';
import DiseaseIndex from '../../pages/admin/diseasepage/DiseaseIndex';
import DiseaseCreate from '../../pages/admin/diseasepage/DiseaseCreate';
import DiseaseEdit from '../../pages/admin/diseasepage/DiseaseEdit';
import ServicecategoryIndex from '../../pages/admin/servicecategorypage/ServicecategoryIndex';
import ServicecategoryCreate from '../../pages/admin/servicecategorypage/ServicecategoryCreate';
import ServicecategoryEdit from '../../pages/admin/servicecategorypage/ServicecategoryEdit';
import ServiceIndex from '../../pages/admin/servicepage/ServiceIndex';
import ServiceCreate from '../../pages/admin/servicepage/ServiceCreate';
import ServiceEdit from '../../pages/admin/servicepage/ServiceEdit';
import DosageformCreate from '../../pages/admin/dosageformpage/DosageformCreate';
import DosageformEdit from '../../pages/admin/dosageformpage/DosageformEdit';
import DosageformIndex from '../../pages/admin/dosageformpage/DosageformIndex';
import MedicineEdit from '../../pages/admin/medicinepage/MedicineEdit';
import MedicineCreate from '../../pages/admin/medicinepage/MedicineCreate';
import MedicineIndex from '../../pages/admin/medicinepage/MedicineIndex';
import AdminLogin from '../../pages/admin/authpage/AdminLogin';
import ProtectedRoute from './ProtectedRoute';
import WarehouseIndex from '../../pages/admin/warehousepage/WarehouseIndex';
import WarehouseCreate from '../../pages/admin/warehousepage/WarehouseCreate';
import WarehouseEdit from '../../pages/admin/warehousepage/WarehouseEdit';
import MenuCreate from '../../pages/admin/menupage/MenuCreate';
import MenuEdit from '../../pages/admin/menupage/MenuEdit';
import MenuIndex from '../../pages/admin/menupage/MenuIndex';
import BlogIndex from '../../pages/admin/blogpage/BlogIndex';
import BlogCreate from '../../pages/admin/blogpage/BlogCreate';
import BlogEdit from '../../pages/admin/blogpage/BlogEdit';
import SliderIndex from '../../pages/admin/sliderpage/SliderIndex';
import SliderCreate from '../../pages/admin/sliderpage/SliderCreate';
import SliderEdit from '../../pages/admin/sliderpage/SliderEdit';
import Patient from '../../pages/admin/statisticspage/Patient';
import Outpatient from '../../pages/admin/statisticspage/Outpatient';
import Examination from '../../pages/admin/statisticspage/Examination';
import UpdateDataAi from '../../pages/admin/aipage/UpdateDataAi';
export default function AdminRoute(){
    return(
        <Routes>
            <Route path="/admin/login" element={<AdminLogin/>}>
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="user" element={<UserIndex/>}/>
                    <Route path="user/create" element={<UserCreate/>}/>
                    <Route path="user/edit/:id" element={<UserEdit/>}/>

                    <Route path="department" element={<DepartmentIndex/>}/>
                    <Route path="department/create" element={<DepartmentCreate/>}/>
                    <Route path="department/edit/:id" element={<DepartmentEdit/>}/>

                    <Route path="Doctor" element={<DoctorIndex/>}/>
                    <Route path="Doctor/create" element={<DoctorCreate/>}/>
                    <Route path="Doctor/edit/:id" element={<DoctorEdit/>}/>

                    <Route path="Outpatientclinic" element={<OutpatientclinicIndex/>}/>
                    <Route path="Outpatientclinic/create" element={<OutpatientclinicCreate/>}/>
                    <Route path="Outpatientclinic/edit/:id" element={<OutpatientclinicEdit/>}/>

                    <Route path="Roomtype" element={<RoomtypeIndex/>}/>
                    <Route path="Roomtype/create" element={<RoomtypeCreate/>}/>
                    <Route path="Roomtype/edit/:id" element={<RoomtypeEdit/>}/>

                    <Route path="Room" element={<RoomIndex/>}/>
                    <Route path="Room/create" element={<RoomCreate/>}/>
                    <Route path="Room/edit/:id" element={<RoomEdit/>}/>

                    <Route path="Diseasegroup" element={<DiseasegroupIndex/>}/>
                    <Route path="Diseasegroup/create" element={<DiseasegroupCreate/>}/>
                    <Route path="Diseasegroup/edit/:id" element={<DiseasegroupEdit/>}/>

                    <Route path="Disease" element={<DiseaseIndex/>}/>
                    <Route path="Disease/create" element={<DiseaseCreate/>}/>
                    <Route path="Disease/edit/:id" element={<DiseaseEdit/>}/>

                    <Route path="Servicecategory" element={<ServicecategoryIndex/>}/>
                    <Route path="Servicecategory/create" element={<ServicecategoryCreate/>}/>
                    <Route path="Servicecategory/edit/:id" element={<ServicecategoryEdit/>}/>

                    <Route path="Service" element={<ServiceIndex/>}/>
                    <Route path="Service/create" element={<ServiceCreate/>}/>
                    <Route path="Service/edit/:id" element={<ServiceEdit/>}/>

                    <Route path="Dosageform" element={<DosageformIndex/>}/>
                    <Route path="Dosageform/create" element={<DosageformCreate/>}/>
                    <Route path="Dosageform/edit/:id" element={<DosageformEdit/>}/>

                    <Route path="Medicine" element={<MedicineIndex/>}/>
                    <Route path="Medicine/create" element={<MedicineCreate/>}/>
                    <Route path="Medicine/edit/:id" element={<MedicineEdit/>}/>

                    <Route path="Warehouse" element={<WarehouseIndex/>}/>
                    <Route path="Warehouse/create" element={<WarehouseCreate/>}/>
                    <Route path="Warehouse/edit/:id" element={<WarehouseEdit/>}/>

                    <Route path="Menu" element={<MenuIndex/>}/>
                    <Route path="Menu/create" element={<MenuCreate/>}/>
                    <Route path="Menu/edit/:id" element={<MenuEdit/>}/>

                    <Route path="Blog" element={<BlogIndex/>}/>
                    <Route path="Blog/create" element={<BlogCreate/>}/>
                    <Route path="Blog/edit/:id" element={<BlogEdit/>}/>

                    <Route path="Slider" element={<SliderIndex/>}/>
                    <Route path="Slider/create" element={<SliderCreate/>}/>
                    <Route path="Slider/edit/:id" element={<SliderEdit/>}/>

                    <Route path="Statistics/Patient" element={<Patient/>}/>
                    <Route path="Statistics/Outpatient" element={<Outpatient/>}/>
                    <Route path="Statistics/Examination" element={<Examination/>}/>

                    <Route path="Ai/UpdateData" element={<UpdateDataAi/>}/>
                </Route>
            </Route>
        </Routes>
    );
}