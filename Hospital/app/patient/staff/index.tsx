import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Dimensions, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { useStaffViewModel } from '@/viewmodels/staff/use-staff-view-model';
import { useDepartmentViewModel } from '@/viewmodels/department/use-department-view-model';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { transformQuillHtml } from "@/utils/function"
import AntDesign from '@expo/vector-icons/AntDesign';
import CircleAvatar from '@/components/ui/avatars/circle-avatar';
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
export default function StaffListScreen() {
    const { width } = Dimensions.get("window");
    const [selectedDepartment, setSelectedDepartment] = useState({ departmentid: null });
    const { staffs, loading: satffLoading, refreshStaffs } = useStaffViewModel();
    const { departments, loading: departmentLoading, refreshDepartments } = useDepartmentViewModel();
    useEffect(() => { refreshStaffs(selectedDepartment) }, [selectedDepartment]);
    useEffect(() => { refreshDepartments(null) }, []);

    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={satffLoading || departmentLoading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-3 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-5">
                    <Ionicons name="arrow-back-outline" size={22} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Đội ngũ y bác sĩ</Text>
            </View>
            <View>
                <FlatList
                    className="flex-row p-3 border-b-2 border-gray-300"
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                    horizontal
                    data={departments}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                        <View className="w-3"></View>
                    )}
                    ListHeaderComponent={() => (
                        <TouchableOpacity
                            className={`me-3 py-2 px-6 rounded-full border ${selectedDepartment.departmentid == null
                                ? "bg-primary-600 border-primary-600"
                                : "bg-white border-gray-300"
                                }`}
                            style={
                                selectedDepartment.departmentid == null
                                    ? { elevation: 3 }
                                    : undefined
                            }
                            onPress={() => setSelectedDepartment({ departmentid: null })}
                        >
                            <Text
                                className={`text-base font-bold ${selectedDepartment.departmentid == null
                                    ? "text-white"
                                    : "text-gray-700"
                                    }`}
                            >
                                Tất cả
                            </Text>
                        </TouchableOpacity>

                    )}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className={`me-3 py-2 px-6 rounded-full border ${item.departmentid == selectedDepartment.departmentid
                                ? "bg-primary-600 border-primary-600"
                                : "bg-white border-gray-300"
                                }`}
                            style={
                                item.departmentid == selectedDepartment.departmentid
                                    ? { elevation: 3 }
                                    : undefined
                            }
                            onPress={() => setSelectedDepartment({ departmentid: item.departmentid })}
                        >
                            <Text
                                className={`text-base font-bold ${item.departmentid == selectedDepartment.departmentid
                                    ? "text-white"
                                    : "text-gray-700"
                                    }`}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>

                    )}
                >
                </FlatList>
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => refreshStaffs(null)}
                    />
                }
                className="flex-1"
                data={staffs}
                keyExtractor={(item) => "staffs-" + item.staffid}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View className="px-3 py-2">
                        <View className="bg-white rounded-2xl p-4 flex-1 shadow-sm border border-gray-100">

                            <View className="flex-row items-start">
                                <CircleAvatar className={"w-24 h-24 overflow-hidden border-2 border-primary-500"} image={item.avatar} gender={item.gender}>

                                </CircleAvatar>

                                <View className="flex-1 ms-3 gap-y-3">

                                    <Text className="font-bold text-black text-lg uppercase">
                                        {item?.stafftype?.code}. {item.fullname}
                                    </Text>

                                    <Text className="text-gray-700 text-base uppercase">
                                        CHUYÊN KHOA {item?.department?.name}
                                    </Text>

                                    <Text
                                        numberOfLines={2}
                                        className="text-gray-600 text-base leading-5"
                                    >
                                        {item.trainingexperience}
                                    </Text>
                                    <View className="mt-2">
                                        <TouchableOpacity
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/patient/staff/detail",
                                                    params: { id: item.staffid },
                                                })
                                            }
                                            className="self-start flex-row items-center bg-primary-500 px-4 py-2 rounded-full active:opacity-80"
                                        >
                                            <Text className="text-white text-xs font-semibold mr-2">
                                                XEM CHI TIẾT
                                            </Text>
                                            <AntDesign name="arrow-right" size={18} color="white" />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />

        </SafeAreaView>
    );
}
