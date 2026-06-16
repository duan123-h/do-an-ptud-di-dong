import { Route ,Routes} from "react-router-dom";
import HisLayout from "../../layouts/his/HisLayout";
import HisLogin from "../../pages/his/authpage/HisLogin";
import ProtectedRoute from "./ProtectedRoute";
import UserIndex from "../../pages/admin/userpage/UserIndex";
import HomeIndex from "../../pages/his/homepage/HomeIndex";
import ReceptionCreate from "../../pages/his/reception/ReceptionCreate";
import ReceptionIndex from "../../pages/his/reception/ReceptionIndex";
import ReceptionEdit from "../../pages/his/reception/ReceptionEdit";
import MedicalexamIndex from "../../pages/his/medicalexam/MedicalexamIndex";
import MedicalexamDetail from "../../pages/his/medicalexam/MedicalexamDetail";
import HandleCLSIndex from "../../pages/his/handleclspage/HandleCLSCDHAIndex";
import HandleCLSEdit from "../../pages/his/handleclspage/HandleCLSCDHAEdit";
import Reception from "../../pages/his/print/Reception";
import Prescription from "../../pages/his/print/Prescription";
import Hdcls from "../../pages/his/print/Hdcls";

export default function HisRoute(){
    return (
        <Routes>
            <Route path="/his/login" element={<HisLogin/>}>
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/his" element={<HisLayout />}>
                    <Route index element={<HomeIndex />} />
                    <Route path="user" element={<UserIndex />} />

                    <Route path="Reception" element={<ReceptionIndex />} />
                    <Route path="Reception/Create" element={<ReceptionCreate />} />
                    <Route path="Reception/edit/:id" element={<ReceptionEdit/>} />

                    <Route path="Medicalexam/" element={<MedicalexamIndex/>} />
                    <Route path="Medicalexam/Detail/:id" element={<MedicalexamDetail/>} />
                    
                    <Route path="clsrequest" element={<HandleCLSIndex/>}></Route>
                    <Route path="clsrequest/detail/:id" element={<HandleCLSEdit/>}></Route>
                </Route>
                <Route path="/his/print/reception/:id" element={<Reception/>}></Route>
                <Route path="/his/print/Prescription/:id" element={<Prescription/>}></Route>
                <Route path="/his/print/Hdcls/:id" element={<Hdcls/>}></Route>
            </Route>
        </Routes>
    );
}