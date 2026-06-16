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
import { useMedicalExaminationViewModel } from '@/viewmodels/medical-examination/use-medical-examination-view-model';
import { usePrescriptionViewModel } from '@/viewmodels/prescription/use-prescription-view-model';
import CircleAvatar from '@/components/ui/avatars/circle-avatar';
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

export default function PrescriptionDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { width } = useWindowDimensions();
    const { prescription, loading, fetchPrescription } = usePrescriptionViewModel();
    useEffect(() => { fetchPrescription(id) }, []);


    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={loading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-6 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-4">
                    <Ionicons name="arrow-back-outline" size={26} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Chi tiết phiếu khám bệnh</Text>
            </View>



            <ScrollView className="flex-1 bg-slate-50 p-4">
                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 items-center">
                    <CircleAvatar className={'w-24 h-24 mb-3'} image={prescription.patient?.avatar} gender={prescription.patient?.gender}></CircleAvatar>

                    <Text className="text-xl font-bold text-slate-800">
                        {prescription.patient?.fullname}
                    </Text>

                    <Text className="text-slate-500">
                        {dayjs().year() - dayjs(prescription.patient?.dateofbirth).year()} tuổi
                    </Text>

                    <Text className="text-slate-500 text-center mt-1">
                        {prescription.patient?.address}
                    </Text>
                </View>
                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 gap-y-4">
                    <Text className="text-lg font-bold text-slate-800">
                        Bác sĩ kê đơn
                    </Text>

                    <Text className="text-slate-700 font-semibold text-lg">
                        {prescription.doctor?.stafftype?.code}. {prescription.doctor?.fullname}
                    </Text>

                    <Text className="text-slate-500 text-lg">
                        Chuyên khoa: {prescription.doctor?.specialization}
                    </Text>

                    <Text className="text-slate-500 text-lg">
                        Chức danh: {prescription.doctor?.stafftype.stafftypename}
                    </Text>
                </View>
                <View className="bg-white rounded-2xl p-4 shadow-sm gap-y-4 mb-4">
                    <Text className="text-lg font-bold text-slate-800">
                        Chẩn đoán
                    </Text>

                    <Text className="text-red-600 font-bold text-base">
                        {prescription.medicalexamination?.diagnosis}
                    </Text>

                    <Text className="text-slate-600 mt-1 text-lg">
                        Bệnh chính: {prescription.medicalexamination?.diseasename}
                    </Text>
                </View>
                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 gap-y-4">
                    <Text className="text-lg font-bold text-slate-800">
                        Thông tin đơn thuốc
                    </Text>

                    <Text className="text-slate-700 text-lg">
                        Ngày kê: {dayjs(prescription.prescriptiondate).format("HH:mm DD/MM/YYYY")}
                    </Text>
                    <View className='flex-row mt-1 '>
                        <Text className="text-slate-700 text-lg">Trạng thái: </Text>
                        <Text className={`font-semibold text-lg ${prescription.isdispensed ? "text-green-600" : "text-amber-600"
                            }`}>
                            {prescription.isdispensed ? "Đã cấp thuốc" : "Chờ cấp thuốc"}
                        </Text>
                    </View>

                    <Text className="text-slate-600 mt-2 text-lg">
                        Lời dặn: {prescription.doctoradvice}
                    </Text>
                </View>
                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                    <Text className="text-lg font-bold text-slate-800 mb-3">
                        Danh sách thuốc
                    </Text>

                    {prescription.details?.map((item: any) => (
                        <View
                            key={item.prescriptiondetailid}
                            className="mb-4 p-3 border border-slate-200 rounded-xl gap-y-4"
                        >
                            <Text className="text-slate-800 font-bold text-lg">
                                {item.medicine.name}
                            </Text>

                            <Text className="text-slate-600 text-lg">
                                Số lượng: {item.quantity}
                            </Text>

                            <Text className="text-slate-600 text-lg">
                                Cách dùng: {item.usageinstructions}
                            </Text>

                            <Text className="text-slate-500 text-lg">
                                Hoạt chất: {item.medicine.activeingredients}
                            </Text>

                        </View>
                    ))}
                </View>

            </ScrollView>


        </SafeAreaView>
    );
}

