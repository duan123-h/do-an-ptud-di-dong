
import { Redirect, usePathname } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { useAuthStore } from "@/stores/ReturnUrlSotre";
import { Text, View } from "react-native";
import { useEffect } from "react";

export function RoleGuard({ children, allowedRoles = [] }: any) {
    const { user } = useAuth();
    const setReturnUrl = useAuthStore((s) => s.setReturnUrl);

    const role = user?.role?.name;
    const hasAccess =
        !allowedRoles.length ||
        (!!role && allowedRoles.includes(role));

    if (!hasAccess) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Text className="text-xl">🔒</Text>

                <Text className="text-red-500 font-semibold text-base mt-2">
                    Bạn không có quyền truy cập màn hình này
                </Text>

                <Text className="text-gray-500 text-center mt-2">
                    Vui lòng liên hệ quản trị viên để được cấp quyền
                </Text>
            </View>
        );
    }

    return children;
}