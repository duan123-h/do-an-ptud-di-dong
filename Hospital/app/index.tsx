import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Redirect, router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function Index() {
    // const { isLoggedIn, loading } = useAuth();
    // useEffect(() => {
    //     if (isLoggedIn) {
    //         router.replace("/patient");
    //     } else {
    //         router.replace("/login");
    //     }
    // }, [isLoggedIn, loading]);
    // useSaveLastRoute();
    return (
        <>
            <Redirect href="/patient" />
        </>
    );
}