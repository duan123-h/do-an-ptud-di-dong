import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../services/auth/AuthService";
import toast from "react-hot-toast";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem("access_token");
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsAllowed(false) ;
      return;
    }

    const checkToken = async () => {
      try {
        const response = await AuthService.currentuser();
        const user = response.data;

        localStorage.setItem("user", JSON.stringify(user));

        if (
          allowedRoles.length > 0 &&
          !allowedRoles.includes(user?.role?.name)
        ) {
          toast.error("Tài khoản không đủ quyền");
          setIsAllowed(false);
          return;
        }

        setIsAllowed(true);
      } catch (error) {
        toast.error("Phiên đăng nhập không hợp lệ");
        setIsAllowed(false);
      }
    };

    checkToken();
  }, [token,allowedRoles]);

  if (isAllowed === null) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );

  if (!isAllowed) return <Navigate to="/login" replace />;

  return <Outlet />;
}