import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { usePrescriptionViewModel } from '@/viewmodels/prescription/use-prescription-view-model';


export default function PrescriptionListScreen() {
    const { prescriptions, loading, refreshPrescriptions } = usePrescriptionViewModel();
    useEffect(() => { refreshPrescriptions(null) }, []);

    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={loading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-3 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-5">
                    <Ionicons name="arrow-back-outline" size={22} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Danh sách đơn thuốc</Text>
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => refreshPrescriptions(null)}
                    />
                }
                data={prescriptions}
                keyExtractor={(item) =>
                    item.prescriptionid.toString()
                }
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity onPress={() => router.push({
                                                    pathname: "/patient/prescription/detail",
                                                    params: { id: item.medicalexaminationid }
                                                })} className="bg-white rounded-2xl gap-y-4 p-4 mb-4 shadow-sm border border-slate-200">
                            <View className="flex-row justify-between items-start mb-2 ">
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-slate-800">
                                        Đơn thuốc #{item.prescriptionid}
                                    </Text>

                                    <Text className="text-slate-500 text-lg">
                                        Ngày kê:{" "}
                                        {dayjs(item.prescriptiondate).format(
                                            "HH:mm DD/MM/YYYY"
                                        )}
                                    </Text>
                                </View>
                                <View
                                    className={`px-3 py-1 rounded-full ${item.isdispensed
                                        ? "bg-green-100"
                                        : "bg-amber-100"
                                        }`}
                                >
                                    <Text
                                        className={`text-base font-bold ${item.isdispensed
                                            ? "text-green-700"
                                            : "text-amber-700"
                                            }`}
                                    >
                                        {item.isdispensed
                                            ? "Đã cấp thuốc"
                                            : "Chờ cấp thuốc"}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-slate-700 font-semibold text-base">
                                Bệnh nhân:{" "}
                                <Text className="font-normal">
                                    {item.patient?.fullname}
                                </Text>
                            </Text>
                            <Text className="text-slate-700 font-semibold text-base mt-1">
                                Bác sĩ:{" "}
                                <Text className="font-normal">
                                    {item.doctor?.stafftype?.code}. {item.doctor?.fullname}
                                </Text>
                            </Text>
                            <Text className="text-slate-700 font-semibold text-base mt-1">
                                Chẩn đoán:{" "}
                                <Text className="font-normal">
                                    {item.medicalexamination?.diagnosis}
                                </Text>
                            </Text>

                            <Text className="text-slate-500 mt-1">
                                Bệnh chính: {item.medicalexamination?.diseasename}
                            </Text>
                            <View className="mt-3 p-3 bg-slate-50 rounded-xl">
                                <Text className="text-slate-700 font-semibold text-base mb-1">
                                    Lời dặn bác sĩ
                                </Text>
                                <Text className="text-slate-600 text-base">
                                    {item.doctoradvice}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />

        </SafeAreaView>
    );
}