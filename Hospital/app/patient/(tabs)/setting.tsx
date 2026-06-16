import { useAuth } from '@/contexts/auth-context';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from "react-native";
import { useUserViewModel } from '@/viewmodels/user/use-user-view-model';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
export default function SettingScreen() {
  const { handleLogout, loading, error } = useUserViewModel();
  function Logout() {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc muốn đăng xuất không?",
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () =>{
            handleLogout();
          }
        }
      ]
    );

  }
  return (
    <SafeAreaView className="flex-1">
      <LoadingOverlay isLoading={loading} />
      <View className="bg-orange-50 flex-row items-center px-6 py-4 border-b-2 border-gray-200">
        <Text className="text-black font-bold text-xl">Cài đặt</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 border-gray-200 border-b-8 ">
          <Text className="text-gray-600 font-bold text-lg">Tài khoản</Text>
          <TouchableOpacity onPress={() => router.push("/patient/profile/update")} className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Cập nhật thông tin</Text>
            <Feather name="info" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/patient/profile/change-password")} className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Đổi mật khẩu</Text>
            <MaterialIcons name="password" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Cài đặt thông báo</Text>
            <MaterialCommunityIcons name="bell-cog-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="px-4 pt-4 border-b-8 border-gray-200">
          <Text className="text-gray-600 font-bold text-lg">Ứng dụng</Text>
          <TouchableOpacity className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Điều khoản sử dụng ứng dụng và dịch vụ</Text>
            <Feather name="info" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Chính sách quyền riêng tư</Text>
            <MaterialIcons name="password" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Phiên bản ứng dụng</Text>
            <Text className="text-gray-600  font-medium">1.0.0</Text>
          </TouchableOpacity>
        </View>
        <View className="px-4 pt-4">
          <Text className="text-gray-600 font-bold text-lg">Hỗ trợ</Text>
          <TouchableOpacity className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Hotline</Text>
            <Text className="text-primary-700 font-bold text-lg">1900.0xxx</Text>
          </TouchableOpacity>
          <TouchableOpacity className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Hướng dẫn sử dụng</Text>
            <MaterialIcons name="password" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="justify-between flex-row border-b-2 border-gray-100 py-6">
            <Text className="text-black  font-normal">Câu hỏi thường gặp</Text>
            <Text className="text-gray-600  font-medium">1.0.0</Text>
          </TouchableOpacity>
        </View>
        <View className="px-4 py-8">
          <TouchableOpacity onPress={() => Logout()} className="justify-center items-center rounded-xl bg-rose-200 p-4">
            <Text className="text-red-700  font-bold">Đăng xuất</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

