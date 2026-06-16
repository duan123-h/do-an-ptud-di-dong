import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthService from "../../services/auth/AuthService";
import toast from 'react-hot-toast';
export default function ProtectedRoute() {
  const token = localStorage.getItem("access_token");
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsAllowed(false);
      return;
    }
  const roles = ["Admin"];
    const checkToken = async () => {
      try {
        const response = await AuthService.currentuser();
        localStorage.setItem('user', JSON.stringify(response.data));
        if(!roles.includes(response.data?.rolename)){
          setIsAllowed(false);
          toast.error("Tài khoản của bạn không đủ quyền");
          return;
        }
        setIsAllowed(true);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          Object.values(error.response.data.errors).map((errArray) =>
            errArray.map((msg) => toast.error(msg))
          );
        } else if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
        console.error("Error fetching users:", error);
        setIsAllowed(false);
      }
    };

    checkToken();
  }, [token]);

  if (isAllowed === null) return (
    <div style={{ width: '100%', height: '100vh' }} className="d-flex justify-content-center align-items-center">
      <div style={{ width: '50px', height: '50px' }} class="spinner-border text-primary" role="status">
        <span class="sr-only fs-5">Loading...</span>
      </div>
    </div>
  );
  if (!isAllowed) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
