import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function HomeIndex(){
    const location=useLocation();
    const [doctorData,setDoctorData]=useState({});
    function getDataDoctor(){
        const Doctor = JSON.parse(localStorage.getItem("user"));
        setDoctorData(Doctor);
    }
    useEffect(()=>{
        getDataDoctor();
    },location);
    return (
         <div class="container d-flex justify-content-center align-items-center min-vh-100">
            <div class="card shadow-lg" style={{width:'100%',maxWidth:'400px'}} >
            <div class="card-body text-center">
                <h1 class="card-title mb-4">Chào mừng bác sĩ</h1>
                <p id="doctor-name" class="fs-4 text-primary">Chào bác sĩ<span class="fw-bold"> {doctorData.fullname}</span> quay trở lại làm việc!</p>
            </div>
            </div>
        </div>
    );
}