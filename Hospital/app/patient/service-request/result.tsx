import { useEffect } from "react";
import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";
import LoadingOverlay from "@/components/ui/loadings/loading-overlay";
import { useServiceRequestViewModel } from "@/viewmodels/service-request/use-service-request-view-model";

export default function ServiceRequestDetailResultScreen() {
    const { id } = useLocalSearchParams();
    console.log("id",id);
    const { resultDetail, loading, fetchServiceRequestDetailResult } =
        useServiceRequestViewModel();

    useEffect(() => {
        if (id) fetchServiceRequestDetailResult(id as string);
    }, [id]);

    const service = resultDetail?.service;
    const resultType = resultDetail?.resulttype;

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <LoadingOverlay isLoading={loading} />
            <View className="flex-row items-center bg-white px-4 py-4 border-b border-gray-200 shadow-sm">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} />
                </TouchableOpacity>

                <Text className="text-lg font-bold ml-4 text-gray-800">
                    Kết quả cận lâm sàng
                </Text>
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
                {resultDetail && (
                    <View className="space-y-4 pb-10">
                        <View className="bg-white rounded-2xl p-4 border border-gray-100">
                            <Text className="text-lg font-bold text-blue-800">
                                {service?.name}
                            </Text>

                            <Text className="text-gray-500 mt-1">
                                Mã dịch vụ: {service?.code}
                            </Text>

                            <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                <Text className="text-xs text-gray-400">
                                    {resultDetail.starttime &&
                                        dayjs(resultDetail.starttime).format(
                                            "HH:mm - DD/MM/YYYY"
                                        )}
                                </Text>

                                <View className="bg-orange-50 px-3 py-1 rounded-full">
                                    <Text className="text-orange-600 font-bold">
                                        {Number(service?.price || 0).toLocaleString()} VNĐ
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {resultType === "CDHA" && (
                            <View className="bg-white rounded-2xl p-4 border border-gray-100">
                                <Text className="text-blue-700 font-bold mb-3">
                                    🩻 Chẩn đoán hình ảnh
                                </Text>

                                <Text className="text-gray-500">Mô tả</Text>
                                <Text className="text-gray-800 mt-1 mb-3">
                                    {resultDetail.imagingresult?.description || "Không có"}
                                </Text>

                                <Text className="text-gray-500">Kết luận</Text>
                                <View className="bg-yellow-50 p-3 rounded-xl mt-1">
                                    <Text className="text-gray-900 font-semibold">
                                        {resultDetail.imagingresult?.conclusion ||
                                            "Chưa có kết luận"}
                                    </Text>
                                </View>

                                {resultDetail.imagingresult?.resultimage && (
                                    <Image
                                        source={{
                                            uri: resultDetail.imagingresult.resultimage,
                                        }}
                                        className="w-full h-64 rounded-xl mt-4"
                                        resizeMode="cover"
                                    />
                                )}
                            </View>
                        )}

                        {/* LAB */}
                        {resultType === "LAB" && (
                            <View className="bg-white rounded-2xl p-4 border border-gray-100">
                                <Text className="text-blue-700 font-bold mb-4">
                                    🧪 Kết quả xét nghiệm
                                </Text>

                                {/* header */}
                                <View className="flex-row pb-2 border-b border-gray-200">
                                    <Text className="flex-1 text-gray-500 font-semibold">
                                        Chỉ số
                                    </Text>
                                    <Text className="w-28 text-right text-gray-500 font-semibold">
                                        Kết quả
                                    </Text>
                                </View>

                                {resultDetail.labresults?.map((res: any, index: number) => {
                                    const param = service?.labparameters?.find(
                                        (p: any) =>
                                            p.labparameterid === res.labparameterid
                                    );

                                    return (
                                        <View
                                            key={index}
                                            className="flex-row py-3 border-b border-gray-50"
                                        >
                                            <Text className="flex-1 text-gray-700">
                                                {param?.name || "---"}
                                            </Text>

                                            <Text className="w-28 text-right font-bold text-gray-900">
                                                {res.resultvalue} {param?.unit}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* EMPTY */}
                        {!resultType && (
                            <View className="items-center py-12">
                                <Text className="text-gray-400">
                                    Chưa có kết quả trả về
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}