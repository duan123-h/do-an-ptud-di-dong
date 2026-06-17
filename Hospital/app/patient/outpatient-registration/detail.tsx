import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Dimensions, FlatList, Image, ImageBackground, RefreshControl, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useOutpatientRegistrationViewModel } from '@/viewmodels/Outpatient-Registration/use-outpatient-registration-view-model';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import RenderHTML from "react-native-render-html";
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
cssInterop(Feather, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(MaterialIcons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(MaterialCommunityIcons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(Fontisto, {
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

export default function RegistrationDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { width } = useWindowDimensions();
    const { outpatientRegistration, loading, fetchOutpatientRegistration } = useOutpatientRegistrationViewModel();
    useEffect(() => { fetchOutpatientRegistration(id) }, []);

    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={loading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-6 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-4">
                    <Ionicons name="arrow-back-outline" size={26} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Chi tiết phiếu đăng ký khám</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="bg-white rounded-2xl p-4 m-4 shadow-sm border border-slate-100">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="person-circle" size={28} color="#475569" />
                            <Text className="text-xl font-bold text-slate-800">Mã phiếu: {outpatientRegistration?.outpatientregistrationid}</Text>
                        </View>
                        {
                            outpatientRegistration.examinationstatus == 1 && (
                                <View className="bg-yellow-400 px-3 py-1 rounded-full">
                                    <Text className="text-yellow-900 font-semibold text-base">Chờ khám</Text>
                                </View>
                            )
                        }
                        {
                            outpatientRegistration.examinationstatus == 2 && (
                                <View className="bg-blue-400 px-3 py-1 rounded-full">
                                    <Text className="text-white font-semibold text-base">Đang khám</Text>
                                </View>
                            )
                        }
                        {
                            outpatientRegistration.examinationstatus == 3 && (
                                <View className="bg-green-600 px-3 py-1 rounded-full">
                                    <Text className="text-white font-semibold text-base">Đã khám</Text>
                                </View>
                            )
                        }

                    </View>


                    <View className="flex-row gap-2">
                        <Text className="text-2xl font-black text-slate-800">Số thứ tự: #{outpatientRegistration?.queueorder}</Text>
                    </View>
                </View>
                <View className="px-4">
                    <Text className="text-lg font-bold text-slate-800 mb-2">
                        1. THÔNG TIN BỆNH NHÂN
                    </Text>
                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-col gap-2 ">
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="person" size={18} color="#94a3b8" />
                            <Text className="text-slate-700 text-lg">Tên: {outpatientRegistration?.patient?.fullname}</Text>
                        </View>
                        <View className="flex-row items-center gap-3">
                            <Ionicons name="person" size={18} color="#94a3b8" />
                            <Text className="text-slate-500 text-lg">Mã bệnh nhân: {outpatientRegistration?.patient?.patientid}</Text>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <Ionicons name="calendar" size={18} color="#94a3b8" />
                            <Text className="text-slate-700 text-lg">Ngày sinh: {dayjs(outpatientRegistration?.patient?.dateofbirth).format("DD-MM-YYYY")}</Text>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <Ionicons name="call" size={18} color="#94a3b8" />
                            <Text className="text-slate-700 text-lg">Số điện thoại: {outpatientRegistration?.patient?.phone}</Text>
                        </View>

                        <View className="flex-row items-start gap-3">
                            <Ionicons name="location" size={18} color="#94a3b8" />
                            <Text className="text-slate-700 text-lg flex-1">
                                Địa chỉ: {outpatientRegistration?.patient?.address}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="px-4 mt-5">
                    <Text className="text-lg font-bold text-slate-800 mb-2">
                        2. THÔNG TIN NƠI KHÁM
                    </Text>
                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-col gap-2">
                        <View className="flex-row items-center gap-3">
                            <MaterialCommunityIcons name="flask" size={18} color="#94a3b8" />
                            <Text className="text-slate-700 text-lg">Khoa: {outpatientRegistration?.department?.name}</Text>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <MaterialCommunityIcons name="hospital-building" size={18} color="#94a3b8" />
                            <Text className="text-slate-700 text-lg">Phòng khám: {outpatientRegistration?.outpatientclinic?.name}</Text>
                        </View>
                    </View>
                </View>

                <View className="px-4 mt-5 mb-8">
                    <Text className="text-lg font-bold text-slate-800 mb-2">
                        3. THÔNG TIN ĐĂNG KÝ
                    </Text>
                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex-col gap-2">
                        <View className="flex-row items-center  gap-2">
                            <Ionicons name="person" size={18} color="#94a3b8" />
                            <Text className="text-slate-700 text-lg">Người đăng ký: {outpatientRegistration?.registrar?.stafftype?.code}. {outpatientRegistration?.registrar?.fullname}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="time" size={20} color="#64748b" />
                            <Text className="text-slate-600 text-lg">Thời gian đăng ký:  {dayjs(outpatientRegistration?.registrationtime).format("DD-MM-YYYY HH:mm")}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

