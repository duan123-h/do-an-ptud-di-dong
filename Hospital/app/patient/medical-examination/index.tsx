import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import { useMedicalExaminationViewModel } from '@/viewmodels/medical-examination/use-medical-examination-view-model';
import { router } from 'expo-router';
import dayjs from 'dayjs';


export default function ExamListScreen() {
    const { medicalExaminations, loading, refreshMedicalExaminations } = useMedicalExaminationViewModel();
    useEffect(() => { refreshMedicalExaminations(null) }, []);

    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={loading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-3 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-5">
                    <Ionicons name="arrow-back-outline" size={22} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Danh sách phiếu khám bệnh</Text>
            </View>
            <FlatList
                className="p-3"
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => refreshMedicalExaminations(null)}
                    />
                }
                data={medicalExaminations}
                keyExtractor={(item) => item.medicalexaminationid.toString()}
                renderItem={({ item }) => {
                    const age =
                        new Date().getFullYear() -
                        new Date(item.patient.dateofbirth).getFullYear();

                    return (
                        <TouchableOpacity
                        onPress={() => router.push({
                            pathname: "/patient/medical-examination/detail",
                            params: { id: item.medicalexaminationid }
                        })}
                            className={`rounded-2xl p-4 mb-4 border ${item.examinationendtime
                                ? 'bg-teal-50/50 border-teal-200'
                                : 'bg-white border-slate-200'
                                }`}
                        >
                            <View className="flex-row justify-between items-center ">
                                <View className="flex-1 gap-y-4">
                                    <Text className="text-lg font-bold text-slate-800">
                                        Tên BN: {item.patient.fullname} ({age} tuổi)
                                    </Text>

                                    <Text className="text-base text-slate-700 font-semibold">
                                        Mã Khám:{' '}
                                        <Text className="font-normal">
                                            {item.medicalexaminationid}
                                        </Text>
                                    </Text>

                                    <Text className="text-base text-slate-700 font-semibold">
                                        Mã ĐK:{' '}
                                        <Text className="font-normal">
                                            {item.outpatientregistrationid}
                                        </Text>
                                    </Text>

                                    <Text className="text-base text-slate-700 font-semibold">
                                        Giờ bắt đầu khám:{' '}
                                        <Text className="font-normal">
                                            {dayjs(item.examinationstarttime).format("HH:mm DD-MM-YYYY")}
                                        </Text>
                                    </Text>
                                    <Text className="text-base text-slate-700 font-semibold">
                                        Giờ kết thúc khám:{' '}
                                        <Text className="font-normal">
                                            {dayjs(item.examinationendtime).format("HH:mm DD-MM-YYYY")}
                                        </Text>
                                    </Text>

                                    <Text className="text-base text-slate-700 font-semibold">
                                        Bệnh chính:{' '}
                                        <Text className="font-normal">
                                            {item.diseasename}
                                        </Text>
                                    </Text>

                                    <Text className="text-base text-slate-700 font-semibold">
                                        Khoa:{' '}
                                        <Text className="font-normal">
                                            {item.department.name}
                                        </Text>
                                    </Text>

                                    <Text className="text-base text-slate-700 font-semibold">
                                        {item.outpatientclinic.name}
                                    </Text>
                                </View>

                                <View className="items-center justify-center ml-2">
                                    <Text className="text-lg text-slate-500 mb-1">
                                        Trạng Thái
                                    </Text>

                                    <View
                                        className={`px-3 py-1.5 rounded-full ${item.examinationendtime
                                            ? 'bg-slate-300'
                                            : 'bg-amber-100'
                                            }`}
                                    >
                                        <Text
                                            className={`text-xs font-bold ${item.examinationendtime
                                                ? 'text-slate-700'
                                                : 'text-amber-800'
                                                }`}
                                        >
                                            {item.examinationendtime
                                                ? 'Đã Khám'
                                                : 'Chờ Khám'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                showsVerticalScrollIndicator={false}
            />

        </SafeAreaView>
    );
}