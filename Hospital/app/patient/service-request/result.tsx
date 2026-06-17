import { useEffect } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";

import LoadingOverlay from "@/components/ui/loadings/loading-overlay";
import { useServiceRequestViewModel } from "@/viewmodels/service-request/use-service-request-view-model";

export default function ServiceRequestDetailResultScreen() {
    const { id } = useLocalSearchParams();

    const {
        resultDetail,
        loading,
        fetchServiceRequestDetailResult,
    } = useServiceRequestViewModel();

    useEffect(() => {
        fetchServiceRequestDetailResult(id as string);
    }, [id]);

    const resultType = resultDetail?.resulttype;

    const hasLabResult =
        resultDetail?.labresults && resultDetail.labresults.length > 0;

    const hasImagingResult =
        resultDetail?.imagingresult &&
        (resultDetail.imagingresult.description ||
            resultDetail.imagingresult.conclusion ||
            resultDetail.imagingresult.resultimage);

    const hasAnyResult = hasLabResult || hasImagingResult;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <LoadingOverlay isLoading={loading} />

            {/* HEADER */}
            <View className="flex-row items-center bg-orange-50 px-3 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={22} />
                </TouchableOpacity>

                <Text className="text-xl font-bold ml-4">
                    Chi tiết kết quả CLS
                </Text>
            </View>

            <ScrollView className="px-3 py-2">
                {!resultDetail ? null : (
                    <View className="bg-white rounded-xl p-4 border border-gray-200">
                        {/* SERVICE INFO */}
                        <Text className="font-bold text-lg mb-2">
                            {resultDetail.service?.name}
                        </Text>

                        <Text className="text-gray-500 text-sm">
                            Mã: {resultDetail.service?.code}
                        </Text>

                        <Text className="text-gray-500 text-sm">
                            Phòng: {resultDetail.service?.outpatientclinic?.name}
                        </Text>

                        <Text className="text-gray-700 mt-1">
                            Giá: {Number(resultDetail.service?.price).toLocaleString()} VNĐ
                        </Text>

                        <Text className="text-xs text-gray-400 mt-1">
                            {resultDetail.starttime &&
                                dayjs(resultDetail.starttime).format("HH:mm DD-MM-YYYY")}
                        </Text>

                        {/* ===================== EMPTY ===================== */}
                        {!hasAnyResult && (
                            <View className="mt-6 items-center">
                                <Text className="text-gray-500 font-semibold">
                                    Chưa có kết quả
                                </Text>
                            </View>
                        )}

                        {/* ===================== LAB ===================== */}
                        {resultType === "LAB" && hasLabResult && (
                            <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <Text className="font-bold text-blue-600 mb-2">
                                    Kết quả xét nghiệm
                                </Text>

                                {resultDetail.labresults?.map((r: any) => (
                                    <View
                                        key={r.labresultdetailid}
                                        className="flex-row justify-between py-1"
                                    >
                                        <Text className="text-gray-700">
                                            {r.labparameter?.name}
                                        </Text>
                                        <Text className="font-bold">
                                            {r.resultvalue}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* ===================== CDHA ===================== */}
                        {resultType === "CDHA" && hasImagingResult && (
                            <View className="mt-4 p-3 bg-green-50 rounded-lg gap-y-2">
                                <Text className="font-bold text-green-600">
                                    Kết quả chẩn đoán hình ảnh
                                </Text>

                                {resultDetail.imagingresult?.description && (
                                    <Text>
                                        📝 {resultDetail.imagingresult.description}
                                    </Text>
                                )}

                                {resultDetail.imagingresult?.conclusion && (
                                    <Text className="font-semibold">
                                        📌 {resultDetail.imagingresult.conclusion}
                                    </Text>
                                )}

                                {resultDetail.imagingresult?.resultimage && (
                                    <Image
                                        source={{
                                            uri: resultDetail.imagingresult.resultimage,
                                        }}
                                        className="w-full h-52 rounded-lg mt-2"
                                        resizeMode="cover"
                                    />
                                )}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}