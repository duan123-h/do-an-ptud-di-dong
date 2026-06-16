import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Dimensions, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useOutpatientRegistrationViewModel } from '@/viewmodels/Outpatient-Registration/use-outpatient-registration-view-model';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { transformQuillHtml } from "@/utils/function"
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
cssInterop(Feather, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(AntDesign, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(FontAwesome, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
export default function OutpatientRegistrationListScreen() {
    const { width } = Dimensions.get("window");
    const [selectedStatus, setSelectedStatus] = useState<{ status: number | null; }>({ status: null });
    const { outpatientRegistrations, loading, refreshOutpatientRegistrations } = useOutpatientRegistrationViewModel();
    useEffect(() => { refreshOutpatientRegistrations(selectedStatus) }, [selectedStatus]);


    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={loading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-3 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-5">
                    <Ionicons name="arrow-back-outline" size={22} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Danh sách đăng ký khám</Text>
            </View>
            <View className="m-3 items-center justify-start">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 8 }}
                >
                    <TouchableOpacity
                        className={`me-3 py-2 px-6 rounded-full border ${selectedStatus.status === null
                                ? "bg-primary-600 border-primary-600"
                                : "bg-white border-gray-300"
                            }`}
                        style={
                            selectedStatus.status === null
                                ? { elevation: 3 }
                                : undefined
                        }
                        onPress={() => setSelectedStatus({ status: null })}
                    >
                        <Text
                            className={`text-base font-bold ${selectedStatus.status === null
                                    ? "text-white"
                                    : "text-gray-700"
                                }`}
                        >
                            Tất cả
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`me-3 py-2 px-6 rounded-full border ${selectedStatus.status === 0
                                ? "bg-primary-600 border-primary-600"
                                : "bg-white border-gray-300"
                            }`}
                        style={selectedStatus.status === 0 ? { elevation: 3 } : undefined}
                        onPress={() => setSelectedStatus({ status: 0 })}
                    >
                        <Text
                            className={`text-base font-bold ${selectedStatus.status === 0
                                    ? "text-white"
                                    : "text-gray-700"
                                }`}
                        >
                            Đang chờ khám
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`me-3 py-2 px-6 rounded-full border ${selectedStatus.status === 1
                                ? "bg-primary-600 border-primary-600"
                                : "bg-white border-gray-300"
                            }`}
                        style={selectedStatus.status === 1 ? { elevation: 3 } : undefined}
                        onPress={() => setSelectedStatus({ status: 1 })}
                    >
                        <Text
                            className={`text-base font-bold ${selectedStatus.status === 1
                                    ? "text-white"
                                    : "text-gray-700"
                                }`}
                        >
                            Đang khám
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={() => refreshOutpatientRegistrations(null)} />}
                className="flex-1"
                data={outpatientRegistrations}
                keyExtractor={(item) => "outpatient-registration-" + item.outpatientregistrationid}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    item.examinationstatus === 0 ? (
                        <TouchableOpacity onPress={() => router.push({
                            pathname: "/patient/outpatient-registration/detail",
                            params: { id: item.outpatientregistrationid }
                        })} className="rounded-2xl flex-row overflow-hidden m-3 shadow-2xl">
                            <View className="w-2 bg-amber-500"></View>

                            <View className="w-36 items-center justify-center bg-amber-100 p-4">
                                <Text className="text-lg text-amber-900">Số thứ tự</Text>
                                <Text className="font-bold text-4xl text-amber-800">#{item.queueorder}</Text>
                            </View>

                            <View className="bg-white flex-1 p-4 gap-y-2">
                                <Text className="font-bold text-xl text-gray-900">{item.patient?.fullname}</Text>
                                <Text className="text-lg text-gray-600">{item.department?.name}</Text>

                                <Text className="text-lg bg-amber-500 px-3 py-1 rounded-full text-white self-start">
                                    Chờ khám
                                </Text>
                            </View>

                            <View className="bg-white items-center justify-center">
                                <MaterialIcons name="navigate-next" size={40} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    ) : item.examinationstatus === 1 ? (
                        <TouchableOpacity onPress={() => router.push({
                            pathname: "/patient/outpatient-registration/detail",
                            params: { id: item.outpatientregistrationid }
                        })} className="rounded-2xl flex-row overflow-hidden m-3 shadow-2xl">
                            <View className="w-2 bg-sky-500"></View>

                            <View className="w-36 items-center justify-center bg-sky-100 p-4">
                                <Text className="text-lg text-sky-900">Số thứ tự</Text>
                                <Text className="font-bold text-4xl text-sky-800">#{item.queueorder}</Text>
                            </View>

                            <View className="bg-white flex-1 p-4 gap-y-2">
                                <Text className="font-bold text-xl text-gray-900">{item.patient?.fullname}</Text>
                                <Text className="text-lg text-gray-600">{item.department?.name}</Text>

                                <Text className="text-lg bg-sky-500 px-3 py-1 rounded-full text-white self-start">
                                    Đang khám
                                </Text>
                            </View>

                            <View className="bg-white items-center justify-center">
                                <MaterialIcons name="navigate-next" size={40} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => router.push({
                            pathname: "/patient/outpatient-registration/detail",
                            params: { id: item.outpatientregistrationid }
                        })} className="rounded-2xl flex-row overflow-hidden m-3 shadow-2xl">
                            <View className="w-2 bg-emerald-500"></View>

                            <View className="w-36 items-center justify-center bg-emerald-100 p-4">
                                <Text className="text-lg text-emerald-900">Số thứ tự</Text>
                                <Text className="font-bold text-4xl text-emerald-800">#{item.queueorder}</Text>
                            </View>

                            <View className="bg-white flex-1 p-4 gap-y-2">
                                <Text className="font-bold text-xl text-gray-900">{item.patient?.fullname}</Text>
                                <Text className="text-lg text-gray-600">{item.department?.name}</Text>

                                <Text className="text-lg bg-emerald-500 px-3 py-1 rounded-full text-white self-start">
                                    Đã khám
                                </Text>
                            </View>

                            <View className="bg-white items-center justify-center">
                                <MaterialIcons name="navigate-next" size={40} color="#9CA3AF" />
                            </View>
                        </TouchableOpacity>
                    )
                )}
            />

        </SafeAreaView>
    );
}
