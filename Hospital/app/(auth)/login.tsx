import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import { useAuth } from '@/contexts/auth-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useEffect, useState } from 'react';
import { FlatList, Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserViewModel } from "@/viewmodels/user/use-user-view-model"

import AsyncStorage from "@react-native-async-storage/async-storage";

cssInterop(SimpleLineIcons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(AntDesign, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(Ionicons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});


export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { loading: useAuthLoading, isLoggedIn, hasProfile, user, updateHasProfile } = useAuth();
    const { handleLogin, loading, error, isLoginSuccess } = useUserViewModel();
    const [isHidenPass, setIsHidenPass] = useState(true);


    const [backendIp, setBackendIp] = useState<string>("");

    useEffect(() => {
        const setIP = async () => {
            const BackendIp = await AsyncStorage.getItem("BackendIp");
            if (BackendIp != null) {
                setBackendIp(BackendIp)
            }
        };
        setIP();
    }, []);
    async function saveIP(ip: string) {
        await AsyncStorage.setItem("BackendIp", ip);
    }

    return (
        <SafeAreaView className="p-6 flex-1">
            <Text>Backend IP</Text>
            <View className="border rounded-lg border-gray-300">
                <TextInput
                    value={backendIp}
                    onChangeText={setBackendIp}
                    className="ps-10 py-5"
                    placeholder="VD: 192.168.1.10:3000"
                />
                <View className="h-full items-center justify-center w-10 absolute left-0">
                    <Ionicons name="server-outline" size={20} className="text-gray-500" />
                </View>
            </View>
            <TouchableOpacity
                onPress={() => saveIP(backendIp)}
                className="mt-3 bg-primary-700 py-3 rounded-xl items-center"
            >
                <Text className="text-white font-bold">Lưu IP</Text>
            </TouchableOpacity>
            <LoadingOverlay isLoading={loading || useAuthLoading} />
            <FlatList
                data={[0]}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1 gap-y-7">
                            <Text className="text-2xl text-black font-bold">Vui lòng nhập thông tin đăng nhập để tiếp tục</Text>
                            {
                                hasProfile ? (
                                    <>
                                        <View className=" gap-y-4">
                                            <View className="px-4 flex-row border rounded-lg border-secondary-400 items-center justify-between h-24">
                                                <View>
                                                    <Text className="font-bold text-lg">
                                                        {user?.profile?.fullname}
                                                    </Text>
                                                    <Text className=" text-lg">
                                                        040******041
                                                    </Text>
                                                </View>
                                                <View className=" w-16 h-16 rounded-full border-2 border-yellow-600">
                                                    <Image style={{ width: "100%", height: "100%" }} className="rounded-full" source={require("@/assets/images/logo.webp")}></Image>
                                                </View>

                                            </View>
                                            <Text>Mật khẩu</Text>
                                            <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                                                <TextInput value={password} onChangeText={setPassword} className="ps-10 pe-20 py-5" secureTextEntry={isHidenPass} placeholder='Nhập mật khẩu'></TextInput>
                                                <View className="h-full  items-center justify-center w-10 absolute left-0">
                                                    <SimpleLineIcons name="lock" size={20} className="text-gray-500" />
                                                </View>
                                                <View className="h-full absolute right-0 flex-row items-center justify-center">
                                                    {
                                                        password.length > 0 && (
                                                            <TouchableOpacity onPress={() => setPassword("")} className="items-center justify-center w-10">
                                                                <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                    {
                                                        isHidenPass ? (
                                                            <TouchableOpacity onPress={() => setIsHidenPass(!isHidenPass)} className="items-center justify-center w-10">
                                                                <Ionicons name="eye-off" size={20} className="text-gray-500" />
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <TouchableOpacity onPress={() => setIsHidenPass(!isHidenPass)} className="items-center justify-center w-10">
                                                                <Ionicons name="eye" size={20} className="text-gray-500" />
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                </View>

                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => handleLogin(user.username, password)} className="rounded-xl bg-primary-700 items-center justify-center h-14">
                                            <Text className="text-white text-xl font-bold">Đăng nhập</Text>
                                        </TouchableOpacity>
                                        <View className='flex-row justify-between'>
                                            <Text className="text-primary-600 font-bold">Quên mật khẩu</Text>
                                            <TouchableOpacity onPress={() => updateHasProfile(false)} className='items-center flex-row'>
                                                <Text className="text-gray-700 font-bold me-2">Đổi tài khoản</Text>
                                                <SimpleLineIcons className='text-primary-600' name="refresh" size={16} />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View className=" gap-y-4">
                                            <Text>Tài khoản (Số CCCD)</Text>
                                            <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                                                <TextInput value={username} onChangeText={setUsername} className="ps-10 py-5" placeholder="Nhập tài khoản / số định danh cá nhân"></TextInput>
                                                <View className="h-full  items-center justify-center w-10 absolute left-0">
                                                    <AntDesign name="idcard" size={20} className="text-gray-500" />
                                                </View>
                                            </View>
                                            <Text>Mật khẩu</Text>
                                            <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                                                <TextInput value={password} onChangeText={setPassword} className="ps-10 pe-10 py-5" secureTextEntry={isHidenPass} placeholder='Nhập mật khẩu'></TextInput>
                                                <View className="h-full  items-center justify-center w-10 absolute left-0">
                                                    <SimpleLineIcons name="lock" size={20} className="text-gray-500" />
                                                </View>
                                                {
                                                    isHidenPass ? (
                                                        <TouchableOpacity onPress={() => setIsHidenPass(!isHidenPass)} className="h-full  items-center justify-center w-10 absolute right-0">
                                                            <Ionicons name="eye-off" size={20} className="text-gray-500" />
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity onPress={() => setIsHidenPass(!isHidenPass)} className="h-full  items-center justify-center w-10 absolute right-0">
                                                            <Ionicons name="eye" size={20} className="text-gray-500" />
                                                        </TouchableOpacity>
                                                    )
                                                }

                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => handleLogin(username, password)} className="rounded-xl bg-primary-700 items-center justify-center h-14">
                                            <Text className="text-white text-xl font-bold">Đăng nhập</Text>
                                        </TouchableOpacity>
                                        <Text className="text-primary-800 font-bold">Quên mật khẩu</Text>
                                    </>
                                )
                            }
                        </View>
                    </TouchableWithoutFeedback>
                )}
            >
            </FlatList>
            <View className="items-center pb-4">
                <Text className="text-gray-700">Phiên bản 1.0.0</Text>
            </View>
        </SafeAreaView>
    )
}