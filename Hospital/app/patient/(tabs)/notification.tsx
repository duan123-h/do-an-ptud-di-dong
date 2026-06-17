import { useNotificationViewModel } from '@/viewmodels/notification/use-notification-view-model';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from "expo-linking";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useAuthGate } from '@/hooks/AuthGate';
import { RoleGuard } from '@/components/RoleGuard';
import { useAuthStore } from '@/stores/ReturnUrlSotre';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import { useAuth } from '@/contexts/auth-context';
dayjs.extend(relativeTime);
dayjs.locale('vi');
export default function NotificationScreen() {
    const setReturnUrl = useAuthStore((s) => s.setReturnUrl);
    const { Notifications, loading, refreshNotifications, markAsReadNotification } = useNotificationViewModel();
    useFocusEffect(
        useCallback(() => {
            refreshNotifications(null);
        }, [])
    );
    const handlePressNotification = (item: any) => {
        if (!item.isread) {
            markAsReadNotification(item.notificationid);
        }
        if (!item?.notification?.linkurl) return;

        if (item.notification.linkurl.startsWith("http")) {
            Linking.openURL(item.notification.linkurl);
        } else {
            router.push(item.notification.linkurl);
        }
    };
    return (


        <SafeAreaView className="flex-1 bg-white">
            <View className="bg-orange-50 flex-row items-center px-6 py-4 border-b border-gray-200">
                <Text className="text-black font-bold text-xl">
                    Thông báo
                </Text>
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={() => refreshNotifications(null)} />}
                className="flex-1"
                data={Notifications}
                keyExtractor={(item) => item.notificationid}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => handlePressNotification(item)}
                        className={`px-4 py-4 border-b border-gray-100 flex-row items-start ${!item.isread ? 'bg-orange-50' : 'bg-white'}`}
                    >
                        <View className="w-12 h-12 rounded-full bg-orange-100 justify-center items-center mr-3">
                            <MaterialCommunityIcons
                                name="bell-outline"
                                size={24}
                                color="#ea580c"
                            />
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-center justify-between">
                                <Text
                                    className={` text-base  ${!item.isread ? 'font-bold text-black' : 'font-semibold text-gray-800'}`}
                                >
                                    {item.notification.title}
                                </Text>

                                {!item.isread && (
                                    <View className="w-2 h-2 rounded-full bg-orange-500" />
                                )}
                            </View>

                            <Text numberOfLines={2} className="text-gray-600 mt-1 leading-5">
                                {item.notification.content}
                            </Text>

                            <Text className="text-gray-400 text-xs mt-2">
                                {dayjs(item.notification.createdat).fromNow()}
                            </Text>
                        </View>
                    </TouchableOpacity>

                )}
            />
        </SafeAreaView>

    );
}