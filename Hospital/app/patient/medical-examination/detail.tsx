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

export default function ExamDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { width } = useWindowDimensions();
    const { medicalExamination, loading, fetchMedicalExamination } = useMedicalExaminationViewModel();
    useEffect(() => { fetchMedicalExamination(id) }, []);


    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={loading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-6 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-4">
                    <Ionicons name="arrow-back-outline" size={26} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Chi tiết phiếu khám bệnh</Text>
            </View>

            <ScrollView className="flex-1 bg-slate-50 p-4" showsVerticalScrollIndicator={false}>

                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 items-center">
                    <CircleAvatar className={'w-24 h-24 mb-3'} image={medicalExamination.patient?.avatar} gender={medicalExamination.patient?.gender}></CircleAvatar>


                    {/* <Image
                        source={{ uri: medicalExamination.patient?.avatar }}
                        className="w-24 h-24 rounded-full mb-3"
                    /> */}

                    <Text className="text-xl font-bold text-slate-800">
                        {medicalExamination.patient?.fullname}
                    </Text>

                    <Text className="text-slate-500">
                        {medicalExamination.patient?.dateofbirth != null && (new Date().getFullYear() - new Date(medicalExamination.patient.dateofbirth).getFullYear())} tuổi • {medicalExamination.patient?.gender ? "Nam" : "Nữ"}
                    </Text>

                    <Text className="text-slate-500 text-center mt-1">
                        {medicalExamination.patient?.address}
                    </Text>
                </View>

                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 gap-y-4">
                    <Text className="font-bold text-slate-800 mb-3">
                        Thông tin khám
                    </Text>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500">Mã khám</Text>
                        <Text className="text-slate-800 font-semibold">
                            {medicalExamination.medicalexaminationid}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500">Mã đăng ký</Text>
                        <Text className="text-slate-800 font-semibold">
                            {medicalExamination.outpatientregistrationid}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500">Bắt đầu</Text>
                        <Text className="text-slate-800 font-semibold">
                            {dayjs(medicalExamination.examinationstarttime).format("HH:mm DD/MM/YYYY")}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500">Kết thúc</Text>
                        <Text className="text-slate-800 font-semibold">
                            {dayjs(medicalExamination.examinationendtime).format("HH:mm DD/MM/YYYY")}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500">Phòng khám</Text>
                        <Text className="text-slate-800 font-semibold text-right flex-1 text-base">
                            {medicalExamination?.outpatientclinic?.name}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500">Bác sĩ</Text>
                        <Text className="text-slate-800 font-semibold text-right flex-1 text-base">
                            {medicalExamination?.doctor?.stafftype?.code}. {medicalExamination?.doctor?.fullname}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500">Chức danh</Text>
                        <Text className="text-slate-800 font-semibold text-right flex-1 text-base">
                            {medicalExamination.doctor?.stafftype?.stafftypename}
                        </Text>
                    </View>
                </View>

                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                    <Text className="font-bold text-slate-800 mb-3 text-lg">
                        Chỉ số sinh tồn
                    </Text>

                    <View className="flex-row flex-wrap gap-4">

                        <View className=" py-2 rounded-full mr-2 mb-2">
                            <Text className="text-slate-800 text-base font-semibold">
                                Nhiệt độ: {medicalExamination.temperature} °C
                            </Text>
                        </View>

                        <View className=" py-2 rounded-full mr-2 mb-2">
                            <Text className="text-slate-800 text-base font-semibold">
                                Nhịp tim: {medicalExamination.heartrate} bpm
                            </Text>
                        </View>

                        <View className=" py-2 rounded-full mr-2 mb-2">
                            <Text className="text-slate-800 text-base font-semibold">
                                Huyết áp: {medicalExamination.bloodpressure}
                            </Text>
                        </View>

                        <View className=" py-2 rounded-full mr-2 mb-2">
                            <Text className="text-slate-800 text-base font-semibold">
                                Chiều cao: {medicalExamination.height} cm
                            </Text>
                        </View>

                        <View className=" py-2 rounded-full mr-2 mb-2">
                            <Text className="text-slate-800 text-base font-semibold">
                                Cân nặng: {medicalExamination.weight} kg
                            </Text>
                        </View>

                        <View className=" py-2 rounded-full mr-2 mb-2">
                            <Text className="text-slate-800 text-base font-semibold">
                                BMI: {medicalExamination.bmi}
                            </Text>
                        </View>

                        {medicalExamination.bmi == null ? (
                            <View className="px-3 py-1 rounded-full bg-slate-100 self-start">
                                <Text className="text-slate-600 text-sm font-semibold">
                                    Chưa có dữ liệu
                                </Text>
                            </View>
                        ) : medicalExamination.bmi < 18.5 ? (
                            <View className="px-3 py-1 rounded-full bg-blue-100 self-start">
                                <Text className="text-blue-800 text-sm font-semibold">
                                    BMI: Gầy
                                </Text>
                            </View>
                        ) : medicalExamination.bmi < 25 ? (
                            <View className="px-3 py-1 rounded-full bg-green-100 self-start">
                                <Text className="text-green-800 text-sm font-semibold">
                                    BMI: Bình thường
                                </Text>
                            </View>
                        ) : medicalExamination.bmi < 30 ? (
                            <View className="px-3 py-1 rounded-full bg-yellow-100 self-start">
                                <Text className="text-yellow-800 text-sm font-semibold">
                                    BMI: Thừa cân
                                </Text>
                            </View>
                        ) : (
                            <View className="px-3 py-1 rounded-full bg-red-100 self-start">
                                <Text className="text-red-800 text-sm font-semibold">
                                    BMI: Béo phì
                                </Text>
                            </View>
                        )}

                    </View>
                </View>

                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4  gap-y-4">
                    <Text className="font-bold text-slate-800 mb-3">
                        Kết quả khám
                    </Text>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500 text-base">Toàn trạng</Text>
                        <Text className="text-slate-800 font-semibold text-right flex-1">
                            {medicalExamination.generalexam}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500 text-base">Bộ phận</Text>
                        <Text className="text-slate-800 font-semibold text-right flex-1">
                            {medicalExamination.bodypartexam}
                        </Text>
                    </View>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500 text-base">Xét nghiệm</Text>
                        <Text className="text-slate-800 font-semibold text-right flex-1 text-base">
                            {medicalExamination.labresults}
                        </Text>
                    </View>
                </View>
                <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 gap-y-4">
                    <Text className="font-bold text-slate-800 mb-2">
                        Chẩn đoán
                    </Text>

                    <Text className="text-red-600 font-bold text-lg mb-2">
                        {medicalExamination.diagnosis}
                    </Text>

                    <Text className="text-black mb-1 text-base">
                        Bệnh chính: <Text className="font-bold">{medicalExamination.disease?.diseasename}</Text>
                    </Text>

                    {medicalExamination.secondarydiseasenames && (
                        <Text className="text-black text-base">
                            Bệnh phụ: <Text className="font-bold"> {medicalExamination.secondarydiseasenames}</Text>
                        </Text>
                    )}
                </View>

                <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                    <Text className="font-bold text-slate-800 mb-3 text-lg">
                        Xử trí
                    </Text>

                    <View className="flex-row justify-between py-1">
                        <Text className="text-slate-500">Phương án xử trí</Text>
                        <Text className="text-slate-800 font-semibold text-right flex-1">
                            {medicalExamination.disposition?.name || "Chưa có"}
                        </Text>
                    </View>
                </View>

            </ScrollView>


        </SafeAreaView>
    );
}

