import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserChangePassViewModel } from '@/viewmodels/user/use-user-view-model';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
cssInterop(Feather, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
export default function ChangePasswordScreen() {
    const { handleChangePass, loading: useChangePassLoading, error, ischangeSuccess } = useUserChangePassViewModel();
    function handleChangePassword(pass: String, newPass: String, checkPass: String) {
        if (!pass.trim()) {
            console.log(alert('Vui lòng nhập mật khẩu hiện tại'));
            return;
        }
        if (!newPass.trim()) {
            console.log(alert('Vui lòng nhập mật khẩu mới'));
            return;
        }
        if (!checkPass.trim()) {
            console.log(alert('Vui lòng nhập lại mật khẩu mới'));
            return;
        }
        if (newPass !== checkPass) {
            alert('Mật khẩu xác nhận không khớp');
            return;
        }

        Alert.alert(
            "Đổi mật khẩu",
            "Bạn có chắc muốn gửi yêu cầu đổi mật khẩu không?",
            [
                { text: "Huỷ", style: "cancel" },
                {
                    text: "Gửi yêu cầu",
                    style: "destructive",
                    onPress: () => {
                        handleChangePass(pass, newPass, checkPass);
                    }
                }
            ]
        );

    }
    const [isHidenCurentPass, setIsHidenCurentPass] = useState(true);
    const [isHidenNewPass, setIsHidenNewPass] = useState(true);
    const [isHidenCheckNewPass, setIsHidenCheckNewPass] = useState(true);

    const [curentPass, setCurentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [checkNewPass, setCheckNewPass] = useState("");

    const [isLogin, setIsLogin] = useState(false);
    const [isTK, setIsTK] = useState(true);
    return (
        <SafeAreaView className=' flex-1'>
            <LoadingOverlay isLoading={useChangePassLoading} />
            <View className="bg-orange-50 flex-row items-center px-6 py-4 border-b-2 border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-4">
                    <Ionicons name="arrow-back-outline" size={26} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView className="p-4 flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text className="text-black font-bold text-2xl mb-4">Đổi mật khẩu</Text>
                <View className="gap-y-4">
                    <Text>Mật khẩu hiện tại <Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <TextInput value={curentPass} onChangeText={setCurentPass} className="ps-10 pe-20 py-5" secureTextEntry={isHidenCurentPass} placeholder='Nhập mật khẩu hiện tại'></TextInput>
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="lock" size={20} className="text-gray-500" />
                        </View>
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                curentPass.length > 0 && (
                                    <TouchableOpacity onPress={() => setCurentPass("")} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                isHidenCurentPass ? (
                                    <TouchableOpacity onPress={() => setIsHidenCurentPass(!isHidenCurentPass)} className="items-center justify-center w-10">
                                        <Ionicons name="eye-off" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => setIsHidenCurentPass(!isHidenCurentPass)} className="items-center justify-center w-10">
                                        <Ionicons name="eye" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>

                    </View>
                    <Text>Mật khẩu mới <Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <TextInput value={newPass} onChangeText={setNewPass} className="ps-10 pe-20 py-5" secureTextEntry={isHidenNewPass} placeholder='Nhập mật khẩu mới'></TextInput>
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="lock" size={20} className="text-gray-500" />
                        </View>
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                newPass.length > 0 && (
                                    <TouchableOpacity onPress={() => setNewPass("")} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                isHidenNewPass ? (
                                    <TouchableOpacity onPress={() => setIsHidenNewPass(!isHidenNewPass)} className="items-center justify-center w-10 ">
                                        <Ionicons name="eye-off" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => setIsHidenNewPass(!isHidenNewPass)} className="items-center justify-center w-10 ">
                                        <Ionicons name="eye" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Text>Nhập lại mật khẩu mới <Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <TextInput value={checkNewPass} onChangeText={setCheckNewPass} className="ps-10 pe-20 py-5" secureTextEntry={isHidenCheckNewPass} placeholder='Nhập lại mật khẩu'></TextInput>
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="lock" size={20} className="text-gray-500" />
                        </View>
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                checkNewPass.length > 0 && (
                                    <TouchableOpacity onPress={() => setCheckNewPass("")} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                isHidenCheckNewPass ? (
                                    <TouchableOpacity onPress={() => setIsHidenCheckNewPass(!isHidenCheckNewPass)} className="items-center justify-center w-10 ">
                                        <Ionicons name="eye-off" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => setIsHidenCheckNewPass(!isHidenCheckNewPass)} className="items-center justify-center w-10">
                                        <Ionicons name="eye" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View className="p-4">
                <TouchableOpacity onPress={() => handleChangePassword(curentPass, newPass, checkNewPass)} className="rounded-xl bg-primary-700 items-center justify-center h-14">
                    <Text className="text-white text-xl font-bold">Gửi yêu cầu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
