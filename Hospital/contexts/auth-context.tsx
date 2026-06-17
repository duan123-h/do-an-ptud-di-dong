import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "@/services/UserService";
import { Redirect, router } from "expo-router";
import { Text, View } from "react-native";

import * as Notifications from "expo-notifications";
import UserDeviceService from "@/services/UserDeviceService";
import NotificationService from "@/services/NotificationService";
import * as Device from "expo-device";
import { useAuthStore } from "@/stores/ReturnUrlSotre";


type AuthContextType = {
  isLoggedIn: boolean;
  hasProfile: boolean;
  user: any | null;
  count: any | null;
  loading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  updateUser: (userData: any) => void;
  updateCount: (count: number | null) => void;
  updateHasProfile: (Data: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const returnUrl = useAuthStore((s) => s.returnUrl);
  const setReturnUrl = useAuthStore((s) => s.setReturnUrl);

  async function registerForPush() {
    const { status: existingStatus } = await Notifications.requestPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Bạn chưa cấp quyền thông báo!');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'a332c505-613e-48fb-81f5-7e0f5fcc0d07'
    });
    return token.data;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState<any | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("vao")
      try {
        const token = await AsyncStorage.getItem("access_token");
        const savedUser = await AsyncStorage.getItem("user_info");
        if (savedUser != null) {
          setHasProfile(true);
          setUser(JSON.parse(savedUser));
        }

        if (token) {
          const response = await UserService.getProfile() as any;

          if (response && response.data) {
            setUser(response.data);
            setIsLoggedIn(true);
            await AsyncStorage.setItem("user_info", JSON.stringify(response.data));
            if (returnUrl) {
              router.replace(returnUrl as any);
              setReturnUrl(null);
            } else {
              router.replace("/");
            }
          } else {
            setIsLoggedIn(false);
          }
        }

      } catch (e) {
        console.error("lỗi đăng nhập");
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  const login = async (token: string, userData: any) => {
    await AsyncStorage.setItem("access_token", token);
    await AsyncStorage.setItem("user_info", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
    setHasProfile(true);

    try {
      const pushToken = await registerForPush();

      if (pushToken) {
        const response = await UserDeviceService.saveUserDevice({
          deviceid: Device.modelName,
          devicename: Device.modelName,
          platform: Device.osName,
          pushtoken: pushToken,
          isactive: 1
        })
      }
    } catch (err) {
      console.log("Push token error:", err);
    }

  };

  const logout = async () => {
    if (user) {
      try {

        const response = await UserDeviceService.saveUserDevice({
          deviceid: Device.modelName,
          isactive: 0
        })
      } catch (err) {
        console.log("Push token error:", err);
      }
    }
    setIsLoggedIn(false);
    setHasProfile(false);
    setUser(null);
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("user_info");

  };

  const updateUser = async (userData: any) => {
    await AsyncStorage.setItem("user_info", JSON.stringify(userData));
    setUser(userData);
    setHasProfile(true);
  };
  const updateCount = async (c: Number | null) => {
    console.log("gọi lấy thông báo chưa đọc");
    try {
      if (c) {
        setCount(count - 1);
      } else {
        const res = await NotificationService.getCountNotRead();
        setCount(res.data?.count || 0);
      }


    } catch (err) {
      console.log("Loi:", err);
    }

  };
  const updateHasProfile = async (Data: boolean) => {
    setHasProfile(Data);
  };

  // if (loading) return <View className="w-full h-full items-center justify-center"><Text>Count</Text></View>;

  return (
    <AuthContext.Provider value={{ loading, isLoggedIn, hasProfile, count, user, updateCount, login, logout, updateUser, updateHasProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}