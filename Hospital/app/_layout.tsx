import { AuthProvider } from "@/contexts/auth-context";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import "../global.css";
import Toast from 'react-native-toast-message';

import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import { Platform } from 'react-native';
import { StatusBar } from "expo-status-bar";
import {useAuth} from "@/contexts/auth-context"
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export default function RootLayout() {
  

  useEffect(() => {
    // Hàm khởi tạo Channel cho Android
    async function setupNotifications() {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('appointment-reminders', {
          name: 'Thông báo lịch hẹn',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    }





    setupNotifications();
  }, []);

  const colorScheme = "light";
  const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,

      background: "#ffffff",
      card: "#ffffff",
      border: "#e5e5e5",
      text: "#000000",
      primary: "#16a34a",
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </AuthProvider>
    </ThemeProvider>

  );
}