
import { Redirect, usePathname } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { useAuthStore } from "@/stores/ReturnUrlSotre";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";

export function RouteGuard({ children }: any) {
    const pathname = usePathname();
    const { isLoggedIn, loading } = useAuth();
    const setReturnUrl = useAuthStore((s) => s.setReturnUrl);

    useEffect(() => {
        if (!isLoggedIn && pathname) {
            setReturnUrl(pathname);
        }
    }, [isLoggedIn, pathname]);


    if (loading) return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ActivityIndicator size="large" />
        </View>
    );;
    

    if (!isLoggedIn) {
        return <Redirect href="/login" />;
    }

    return children;
}