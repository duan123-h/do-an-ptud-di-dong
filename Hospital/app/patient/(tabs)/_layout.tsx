import { Stack, Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/contexts/auth-context';
export default function TabLayout() {
  const {count} = useAuth();
  const colorScheme = useColorScheme();

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#15803d",
        headerShown: false,
        tabBarLabelStyle: { fontSize: 14 },
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 80,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Entypo name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="document-wallet"
        options={{
          title: 'Ví giấy tờ',
          tabBarIcon: ({ color }) => <Entypo name="wallet" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ color }) =>( <MaterialCommunityIcons
            name="bell-outline"
            size={28}
            color={color}
            
          />),
          tabBarBadge: count > 0 ? count : undefined,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="hexagon-slice-6" size={28} color={color} />,
        }}
      />

    </Tabs>
    </>
  );
}
