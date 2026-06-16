import { Redirect, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export function useAuthGate(allowedRoles: string[] = []) {
    const pathname = usePathname();
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // if (!isLoggedIn) {
    //     return <Redirect href="/login" />;
    // }

    if (allowedRoles.length > 0) {
        const role = "test";
        console.log("roe: ", role);
        return <Redirect href="/login" />;
    }

    return null;
}