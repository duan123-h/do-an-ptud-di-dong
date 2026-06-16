import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth-context';
import CircleAvatar from '@/components/ui/avatars/circle-avatar';
cssInterop(Feather, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
export default function ProfileScreen() {
    const { user } = useAuth();
    return (
        <SafeAreaView className="flex-1">
            <View className="bg-orange-50 flex-row items-center px-6 py-4 border-b-2 border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-4">
                    <Ionicons name="arrow-back-outline" size={26} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Thông tin cá nhân</Text>
            </View>
            <ScrollView>
                <ImageBackground

                    source={require("@/assets/images/background.png")}
                    resizeMode="cover"
                >
                    <View className="justify-center items-center p-8 gap-y-4">
                        <CircleAvatar className={'w-32 h-32 border-4 border-white'} image={user?.profile?.avatar} gender={user?.profile?.gender}></CircleAvatar>
                        {/* <Image resizeMode="cover" className=" rounded-full " source={{ uri: user?.profile?.avatar }}></Image> */}
                        <Text className="text-black font-bold text-xl">{user?.profile?.fullname}</Text>
                    </View>
                </ImageBackground>

                <View className="p-6">
                    <View className="justify-between flex-row border-b-2 border-gray-100 py-6">
                        <Text className="text-gray-500  font-normal me-2">Số định danh cá nhân</Text>
                        <Text className="text-gray-600  font-medium">{user?.profile?.personalid}</Text>
                    </View>
                    <View className="justify-between flex-row border-b-2 border-gray-100 py-6">
                        <Text className="text-gray-500  font-normal me-2">Giới tính</Text>
                        <Text className="text-gray-600  font-medium">{user?.profile?.gender ? ("Nam") : ("Nữ")}</Text>
                    </View>
                    <View className="justify-between flex-row border-b-2 border-gray-100 py-6">
                        <Text className="text-gray-500  font-normal me-2">ngày sinh</Text>
                        <Text className="text-gray-600  font-medium">{user?.profile?.dateofbirth}</Text>
                    </View>
                    <View className="justify-between flex-row border-b-2 border-gray-100 py-6">
                        <Text className="text-gray-500  font-normal me-2">Số điện thoại</Text>
                        <Text className="text-gray-600  font-medium">{user?.profile?.phone}</Text>
                    </View>
                    <View className="justify-between flex-row border-b-2 border-gray-100 py-6">
                        <Text className="text-gray-500  font-normal me-2">Địa chỉ</Text>
                        <Text className="text-gray-600  font-medium">{user?.profile?.address}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
