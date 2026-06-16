import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

    const [isHidenPass, setIsHidenPass] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [isTK, setIsTK] = useState(true);
    const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));
    const handleLogin = async () => {
        Keyboard.dismiss()
        setIsLogin(true);

        await sleep(2000);

        setIsLogin(false);
    };
    return (
        <SafeAreaView className="p-6 flex-1">
            {
                isLogin && (
                    <View className="absolute  bg-black/15 top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    </View>
                )
            }
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 gap-y-7">
                    <Text className="text-2xl text-black font-bold">Vui lòng nhập thông tin đăng nhập để tiếp tục</Text>


                    <View className=" gap-y-4">
                        <View className="px-4 flex-row border rounded-lg border-secondary-400 items-center justify-between h-24">
                            <View>
                                <Text className="font-bold ">
                                    Hoàng Văn Duẩn
                                </Text>
                                <Text>
                                    040******041
                                </Text>
                            </View>
                            <View className=" w-16 h-16 rounded-full border-2 border-secondary-500">
                                <Image className="w-full h-full rounded-full" source={require("@/assets/images/logo.webp")}></Image>
                            </View>

                        </View>
                        <Text>Mật khẩu</Text>
                        <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                            <TextInput className="ps-10 pe-10 py-5" secureTextEntry={isHidenPass} placeholder='Nhập mật khẩu'></TextInput>
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

                    <TouchableOpacity onPress={() => handleLogin()} className="rounded-xl bg-primary-700 items-center justify-center h-14">
                        <Text className="text-white text-xl font-bold">Đăng nhập</Text>
                    </TouchableOpacity>
                    <View className='flex-row justify-between'>
                        <Text className="text-primary-600 font-bold">Quên mật khẩu</Text>
                        <View className='items-center flex-row'>
                            <Text className="text-gray-700 font-bold me-2">Đổi tài khoản</Text>
                            <SimpleLineIcons className='text-primary-600' name="refresh" size={16} />
                        </View>
                    </View>

                </View>
            </TouchableWithoutFeedback>
            <View className="items-center pb-4">
                <Text className="text-gray-700">Phiên bản 1.0.0</Text>
            </View>


        </SafeAreaView>
    )
}