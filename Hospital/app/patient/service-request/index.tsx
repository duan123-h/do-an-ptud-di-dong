import { useEffect } from "react";
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import dayjs from "dayjs";

import LoadingOverlay from "@/components/ui/loadings/loading-overlay";
import { useServiceRequestViewModel } from "@/viewmodels/service-request/use-service-request-view-model";

export default function ServiceRequestListScreen() {
    const {
        serviceRequests,
        loading,
        refreshServiceRequests,
    } = useServiceRequestViewModel();

    useEffect(() => {
        refreshServiceRequests(null);
    }, []);

    const renderItem = ({ item }: any) => {
        return (
            <View className="border-b-2 border-gray-200 py-3">
                <TouchableOpacity
                    onPress={() => router.push({
                            pathname: "/patient/service-request/details",
                            params: { id: item.servicerequestid  }
                        })}

                    className="bg-white rounded-xl p-3 gap-y-2"
                >
                    <View className="flex-row items-center gap-x-3">
                        <Image
                            source={{
                                uri:
                                    item.patient?.avatar ||
                                    "https://i.imgur.com/1bX5QH6.png",
                            }}
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="flex-1">
                            <Text className="font-bold">
                                {item.patient?.fullname}
                            </Text>
                            <Text className="text-gray-500 text-xs">
                                SĐT: {item.patient?.phone}
                            </Text>
                        </View>
                    </View>

                    {/* Requester (doctor/staff) */}
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-600 text-sm">
                            Người chỉ định:{" "}
                            <Text className="font-semibold">
                                {item.requester?.fullname}
                            </Text>
                        </Text>

                        <Text className="text-xs text-gray-400">
                            {item.requester?.stafftype?.stafftypename}
                        </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-500 text-sm">
                            <Feather name="clock" size={14} />{" "}
                            {dayjs(item.requesttime).format("HH:mm DD-MM-YYYY")}
                        </Text>

                        <View className="flex-row items-center">
                            <FontAwesome name="file-text-o" size={14} />
                            <Text className="ml-2 text-gray-600">
                                ID: {item.medicalexaminationid}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <LoadingOverlay isLoading={loading} />
            <View className="bg-orange-50 flex-row items-center px-3 py-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={22} />
                </TouchableOpacity>

                <Text className="text-xl font-bold ml-4">
                    Yêu cầu chỉ định
                </Text>
            </View>
            <FlatList
                data={serviceRequests}
                keyExtractor={(item) => item.servicerequestid}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => refreshServiceRequests(null)}
                    />
                }
                contentContainerStyle={{ paddingHorizontal: 12 }}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-500">
                            Không có yêu cầu nào
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}