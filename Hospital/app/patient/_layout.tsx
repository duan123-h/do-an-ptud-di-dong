import { useAuthGate } from '@/hooks/AuthGate';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DefaultTheme } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { RouteGuard } from '@/components/RouteGuard';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootPatientLayout() {
  const colorScheme = useColorScheme();
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
const {updateCount} = useAuth();
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(() => {
      updateCount();
    });

    return () => subscription.remove();
  }, []);
  useEffect(() => {
    updateCount();
  }, []);
  return (
    <>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </RouteGuard>
    </>
  );
}
