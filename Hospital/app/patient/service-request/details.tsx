import { useEffect } from "react";
import {
    FlatList,
    Text,
    View,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";

import LoadingOverlay from "@/components/ui/loadings/loading-overlay";
import { useServiceRequestViewModel } from "@/viewmodels/service-request/use-service-request-view-model";

export default function ServiceRequestDetailScreen() {
    const { id } = useLocalSearchParams();

    const {
        serviceRequestDetails,
        loading,
        fetchServiceRequestDetails,
    } = useServiceRequestViewModel();

    useEffect(() => {
        fetchServiceRequestDetails(id as string);
    }, [id]);

    const renderStatus = (status: number) => {
        switch (status) {
            case 0:
                return (
                    <Text className="text-yellow-500 font-semibold">
                        Chờ thực hiện
                    </Text>
                );
            case 1:
                return (
                    <Text className="text-blue-500 font-semibold">
                        Đã tiếp nhận
                    </Text>
                );
            case 2:
                return (
                    <Text className="text-green-600 font-semibold">
                        Hoàn thành
                    </Text>
                );
            default:
                return (
                    <Text className="text-gray-500">Không xác định</Text>
                );
        }
    };

    const renderItem = ({ item }: any) => {
        const service = item.service;

        return (
            <TouchableOpacity 
            onPress={() => router.push({
                            pathname: "/patient/service-request/result",
                            params: { id: item.servicerequestid  }
                        })}
            
            className="border-b border-gray-200 py-3">
                <View className="bg-white rounded-xl p-3 gap-y-2">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-bold flex-1">
                            {service?.name}
                        </Text>

                        <View className="flex-row items-center">
                            <FontAwesome name="sort-numeric-asc" size={16} />
                            <Text className="ml-2 font-semibold">
                                #{item.queueorder}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-gray-500 text-sm">
                        Mã: {service?.code}
                    </Text>

                    <Text className="text-gray-500 text-sm">
                        Phòng: {service?.outpatientclinic?.name}
                    </Text>

                    <Text className="text-gray-500 text-sm">
                        Mô tả: {service?.description}
                    </Text>
                    <Text className="text-gray-700 font-semibold">
                        Giá: {Number(service?.price).toLocaleString()} VNĐ
                    </Text>
                    <View className="flex-row justify-between items-center mt-1">
                        {renderStatus(item.status)}

                        {item.starttime && (
                            <Text className="text-xs text-gray-400">
                                <Feather name="clock" size={12} />{" "}
                                {dayjs(item.starttime).format(
                                    "HH:mm DD-MM-YYYY"
                                )}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <LoadingOverlay isLoading={loading} />

            <View className="flex-row items-center bg-orange-50 px-3 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={22} />
                </TouchableOpacity>

                <Text className="text-xl font-bold ml-4">
                    Chi tiết phiếu chỉ định
                </Text>
            </View>

            <FlatList
                data={serviceRequestDetails}
                keyExtractor={(item) => item.servicerequestdetailid}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => fetchServiceRequestDetails(id as string)}
                    />
                }
                contentContainerStyle={{ paddingHorizontal: 12 }}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-500">
                            Không có dịch vụ nào
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}