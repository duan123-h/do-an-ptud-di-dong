import { useAuth } from "@/contexts/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function ProtectedAuth() {
  const { isLoggedIn } = useAuth(); 
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuth = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuth) {
      router.replace("/login");
    }

    if (isLoggedIn && inAuth) {
      router.replace("/patient");
    }
  }, [isLoggedIn, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}