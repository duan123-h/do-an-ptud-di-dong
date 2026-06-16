import { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import AuthService from "../../services/auth/AuthService";
import { useAuth } from "../../contexts/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAuthStore } from "@/stores/ReturnUrlSotre";

export const useUserProfileViewModel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await UserService.getProfile();
      setUser(response.data);
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchUserProfile();
  // }, []);

  return {
    user,
    loading,
    error,
    refreshProfile: fetchUserProfile
  };
};



export const useUserViewModel = () => {
  const returnUrl = useAuthStore((s) => s.returnUrl);
  const setReturnUrl = useAuthStore((s) => s.setReturnUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const { login, logout } = useAuth();

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError("");
    setIsLoginSuccess(false);

    try {
      console.log("test login: ", { username, password })
      const response = await AuthService.login({ username, password });

      if (response.token && response.data) {
        console.log("data: ", response.data)
        await login(response.token, response.data);
        setIsLoginSuccess(true);
        if (returnUrl) {
            router.replace(returnUrl);
            setReturnUrl(null);
        } else {
            router.replace("/");
        }
      }
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log(alert("Đăng nhập thất bại"))
      console.error(err.response?.data?.message || "Đăng nhập thất bại");
      console.error(err.response?.data?.message || "Đăng nhập thất bại");
      setError(err.response?.data?.message || "Đăng nhập thất bại");
      setIsLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      await logout();
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log(alert("Đăng xuất thất bại"))
      console.error(err.response?.data?.message || "Đăng xuất thất bại");
      console.error(err.response?.data?.message || "Đăng xuất thất bại");
      setError(err.response?.data?.message || "Đăng xuất thất bại");
    } finally {
      setLoading(false);
      router.replace("/(auth)/login")
    }
  };

  return {
    handleLogin,
    handleLogout,
    loading,
    error,
    isLoginSuccess
  };
};



export const useUserChangePassViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ischangeSuccess, setIsChangeSuccess] = useState(null);

  const { login } = useAuth();

  const handleChangePass = async (pass, newpass, checkpass) => {
    setLoading(true);
    setError("");

    try {
      const response = await UserService.chagnePass({
        current_password: pass,
        new_password: newpass,
        new_password_confirmation: checkpass
      });
      setIsChangeSuccess(true);
      if (response && response.message) {
        console.log(alert(response.message))
      } else {
        console.log(alert("Thay đổi mật khẩu thành công"))
      }
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log(alert(err.response?.data?.message || "Thay đổi mật khẩu không thành công"))
      console.error(err.response?.data?.message || "Thay đổi mật khẩu không thành công");
      setError(err.response?.data?.message || "Thay đổi mật khẩu không thành công");
      setIsChangeSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleChangePass,
    loading,
    error,
    ischangeSuccess
  };
};

export const useUserUpdateProfileViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpadeProfileSuccess, setIsUpadeProfileSuccess] = useState(null);

  const { updateUser } = useAuth();

  const handleUpdateProfile = async (data) => {
    console.log("payload: ", data)
    setLoading(true);
    setError("");

    try {
      const response = await UserService.updateProfile(data);
      if (response && response.message) {
        console.log(alert(response.message))
      } else {
        console.log(alert("Cập nhật hồ sơ cá nhân thành công"))
      }
      if (response && response.data) {
        console.log("data: ", response.data)
        await updateUser(response.data);
      }
      setIsUpadeProfileSuccess(true);
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log(alert(err.response?.data?.message || "Cập nhật hồ sơ cá nhân không thành công"))
      console.error(err.response?.data?.message || "Cập nhật hồ sơ cá nhân không thành công");
      setError(err.response?.data?.message || "Cập nhật hồ sơ cá nhân không thành công");
      setIsUpadeProfileSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleUpdateProfile,
    loading,
    error,
    isUpadeProfileSuccess
  };
};