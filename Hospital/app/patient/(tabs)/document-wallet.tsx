
import { Dimensions, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import Entypo from '@expo/vector-icons/Entypo';
import { cssInterop } from 'nativewind';
import Feather from '@expo/vector-icons/Feather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthGate } from '@/hooks/AuthGate';
cssInterop(Feather, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});
cssInterop(Entypo, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});
cssInterop(MaterialCommunityIcons, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

export default function DocumentWalletScreen() {
  const { width } = Dimensions.get("window");
  const { user } = useAuth();

  


  return (
    <SafeAreaView className="flex-1">
      <ImageBackground

        source={require("@/assets/images/background.png")}
        resizeMode="cover"
      >
        <View className="m-6 gap-y-4">
          <Text className="text-black font-bold text-xl">Ví giấy tờ</Text>
          <Image style={{
            width: width - 24 * 2,
            height: (width - 24 * 2) * 9 / 16,
          }} resizeMode="cover" className="rounded-xl" source={require("@/assets/images/bhyt.webp")}></Image>
        </View>
      </ImageBackground>

      <ScrollView className="m-6">
        <Text className="mb-3 font-bold text-lg">Giấy tờ</Text>
        <View className="p-3">
          <View className="flex-row flex-wrap  -mx-4">
            <TouchableOpacity onPress={() => router.push("/patient/outpatient-registration")} className="w-1/3  mb-11">
              <View className="gap-y-4 items-center rounded-2xl">
                <Feather name="clipboard" size={50} className="text-primary-500" />
                {/* <Entypo name="documents" size={50} className="text-primary-500" /> */}
                <Text className="text-black text-center text-base">Phiếu đăng ký khám</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/patient/medical-examination")} className="w-1/3  mb-11">
              <View className="gap-y-4 items-center rounded-2xl">
                <Feather name="file-text" size={50} className="text-primary-500" />
                <Text className="text-black text-center text-base">Phiếu khám bệnh</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/patient/prescription")} className="w-1/3  mb-11">
              <View className="gap-y-4 items-center rounded-2xl">
                <MaterialCommunityIcons name="pill" size={50} className="text-primary-500" />
                <Text className="text-black text-center text-base">Đơn thuốc</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/patient/service-request")} className="w-1/3  mb-11">
              <View className="gap-y-4 items-center rounded-2xl">
                <Feather name="clipboard" size={50} className="text-primary-500" />
                {/* <Entypo name="documents" size={50} className="text-primary-500" /> */}
                <Text className="text-black text-center text-base">Phiếu chỉ định dịch vụ</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
