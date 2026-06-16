import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Dimensions, FlatList, Image, ImageBackground, RefreshControl, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useStaffViewModel } from '@/viewmodels/staff/use-staff-view-model';
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

export default function StaffDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { width } = useWindowDimensions();
    const { staff, loading: staffLoading, fetchStaff } = useStaffViewModel();
    useEffect(() => { fetchStaff(id) }, []);

    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={staffLoading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-6 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-4">
                    <Ionicons name="arrow-back-outline" size={26} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Thông tin chi tiết đội ngũ y tế</Text>
            </View>

            <FlatList
                data={[1]}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={() => fetchStaff(id)} />}
                showsVerticalScrollIndicator={false}
                renderItem={() => (
                    <View className="m-4">
                        <View className="rounded-2xl overflow-hidden shadow-md">
                            <ImageBackground

                                source={require("@/assets/images/background.png")}
                                resizeMode="cover"
                            >
                                <View className="h-40 justify-center items-center">
                                    <Image resizeMode="cover" className="rounded-full w-32 h-32 border-4 border-primary-500" source={{ uri: staff.avatar }}></Image>
                                </View>
                            </ImageBackground>

                            <View className="bg-white gap-y-2 p-4">
                                <View className="px-3 pb-3 gap-y-3">
                                    <Text className="font-bold text-black text-xl text-center uppercase">{staff?.stafftype?.code}. {staff.fullname}</Text>
                                    <Text className=" text-black text-base text-center uppercase">CHUYÊN KHOA {staff?.department?.name}</Text>
                                </View>
                            </View>
                        </View>
                        <View className="py-4 bg-white mt-3">
                            <TouchableOpacity className="w-1/3 py-2 border-b-4 border-primary-600">
                                <Text className="text-base font-bold text-primary-600 text-center">Thông tin</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="py-4 bg-white gap-y-3">
                            <Text className="text-lg font-bold text-black">Thông tin cá nhân</Text>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <FontAwesome name="transgender" size={24} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Họ và Tên</Text>
                                    <Text className="text-lg">{staff?.fullname}</Text>
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <FontAwesome name="transgender" size={24} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Giới tính</Text>
                                    <Text className="text-lg">{staff?.gender ? ("Nam") : ("Nữ")}</Text>
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <Fontisto name="date" size={22} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Ngày sinh</Text>
                                    <Text className="text-lg">{dayjs(staff?.dateofbirth).format("DD-MM-YYYY")}</Text>
                                </View>
                            </View>
                        </View>
                        <View className="py-4 bg-white gap-y-3">
                            <Text className="text-lg font-bold text-black">Thông tin liên hệ</Text>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <MaterialCommunityIcons name="map-marker-outline" size={30} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Địa chỉ</Text>
                                    <Text className="text-lg">{staff?.address}</Text>
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <MaterialIcons name="local-phone" size={24} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Số điện thoại</Text>
                                    <Text className="text-lg">{staff?.phone}</Text>
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <MaterialCommunityIcons name="email-outline" size={24} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Địa chỉ email</Text>
                                    <Text className="text-lg">{staff?.email}</Text>
                                </View>
                            </View>
                        </View>
                        <View className="py-4 bg-white gap-y-3">
                            <Text className="text-lg font-bold text-black">Hồ sơ nghề nghiệp</Text>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <FontAwesome name="transgender" size={24} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Khoa</Text>
                                    <Text className="text-lg">{staff?.department?.name}</Text>
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <FontAwesome name="transgender" size={24} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Chuyên ngành</Text>
                                    <Text className="text-lg">{staff?.specialization}</Text>
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <Ionicons name="school-outline" size={24} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Quá trình đào tạo</Text>
                                    <Text className="text-lg">{staff?.trainingexperience}</Text>
                                </View>
                            </View>
                            <View className="flex-row">
                                <View className="w-12 h-12 rounded-full bg-primary-50  items-center justify-center overflow-hidden">
                                    <FontAwesome name="transgender" size={24} className="text-primary-700" />
                                </View>
                                <View className="ms-2 flex-col">
                                    <Text className="text-lg font-bold">Kinh nghiệm làm việc</Text>
                                    <Text className="text-lg">{staff?.strengthexperience}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                )}
            >


            </FlatList>
        </SafeAreaView>
    );
}
