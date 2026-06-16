import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserUpdateProfileViewModel } from '@/viewmodels/user/use-user-view-model';
import { useProvinceListViewModel, useCommuneListByProvinceViewModel } from '@/viewmodels/province/use-province-view-model';
import { useHamletListByComuneViewModel } from '@/viewmodels/commune/use-commune-view-model';
import { useEthnicGroupListViewModel } from '@/viewmodels/ethnic-group/use-ethnic-group-view-model';

import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import { useAuth } from '@/contexts/auth-context';

cssInterop(SimpleLineIcons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});

export default function UpdateProfileScreen() {
    const { user } = useAuth();

    const { handleUpdateProfile, loading } = useUserUpdateProfileViewModel();
    const { refreshProvinces } = useProvinceListViewModel();
    const { fetchCommunesByProvince } = useCommuneListByProvinceViewModel();
    const { fetchHamletsByComune } = useHamletListByComuneViewModel();
    const { refreshEthnicGroup } = useEthnicGroupListViewModel();

    // ================= PROFILE STATE =================
    const [form, setForm] = useState({
        fullname: "",
        dateofbirth: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
        personalid: "",
        provinceid: "",
        communeid: "",
        hamletid: "",
        ethnicid: "",
    });

    // ================= INIT USER =================
    useEffect(() => {
        if (user) {
            setForm({
                fullname: user.fullname || "",
                dateofbirth: user.dateofbirth || "",
                gender: user.gender || "",
                address: user.address || "",
                phone: user.phone || "",
                email: user.email || "",
                personalid: user.personalid || "",
                provinceid: user.provinceid || "",
                communeid: user.communeid || "",
                hamletid: user.hamletid || "",
                ethnicid: user.ethnicid || "",
            });
        }

        refreshProvinces();
        refreshEthnicGroup();
    }, [user]);

    // ================= HANDLE UPDATE =================
    function handleSubmitProfile() {
        if (!form.fullname.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập họ tên");
            return;
        }

        if (!form.phone.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập số điện thoại");
            return;
        }

        Alert.alert(
            "Cập nhật hồ sơ",
            "Bạn có chắc muốn cập nhật thông tin không?",
            [
                { text: "Huỷ", style: "cancel" },
                {
                    text: "Cập nhật",
                    onPress: () => handleUpdateProfile(form),
                },
            ]
        );
    }

    // ================= LOCATION FLOW =================
    async function onSelectProvince(id: string) {
        setForm(prev => ({
            ...prev,
            provinceid: id,
            communeid: "",
            hamletid: "",
        }));

        await fetchCommunesByProvince(id);
    }

    async function onSelectCommune(id: string) {
        setForm(prev => ({
            ...prev,
            communeid: id,
            hamletid: "",
        }));

        await fetchHamletsByComune(id);
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <LoadingOverlay isLoading={loading} />

            {/* HEADER */}
            <View className="bg-orange-50 flex-row items-center px-6 py-4 border-b">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={26} />
                </TouchableOpacity>
            </View>

            <ScrollView className="p-4" keyboardShouldPersistTaps="handled">

                <Text className="text-2xl font-bold mb-4">
                    Cập nhật thông tin
                </Text>

                {/* FULLNAME */}
                <Text>Họ và tên *</Text>
                <View className="border rounded-lg mb-3 flex-row items-center px-3">
                    <SimpleLineIcons name="user" size={18} />
                    <TextInput
                        className="flex-1 p-3"
                        value={form.fullname}
                        onChangeText={(v) =>
                            setForm(prev => ({ ...prev, fullname: v }))
                        }
                    />
                </View>

                {/* PHONE */}
                <Text>Số điện thoại *</Text>
                <View className="border rounded-lg mb-3 flex-row items-center px-3">
                    <SimpleLineIcons name="phone" size={18} />
                    <TextInput
                        className="flex-1 p-3"
                        keyboardType="phone-pad"
                        value={form.phone}
                        onChangeText={(v) =>
                            setForm(prev => ({ ...prev, phone: v }))
                        }
                    />
                </View>

                {/* EMAIL */}
                <Text>Email</Text>
                <TextInput
                    className="border rounded-lg p-3 mb-3"
                    value={form.email}
                    onChangeText={(v) =>
                        setForm(prev => ({ ...prev, email: v }))
                    }
                />

                {/* ADDRESS */}
                <Text>Địa chỉ</Text>
                <TextInput
                    className="border rounded-lg p-3 mb-3"
                    value={form.address}
                    onChangeText={(v) =>
                        setForm(prev => ({ ...prev, address: v }))
                    }
                />

                {/* CCCD */}
                <Text>CCCD</Text>
                <TextInput
                    className="border rounded-lg p-3 mb-3"
                    value={form.personalid}
                    onChangeText={(v) =>
                        setForm(prev => ({ ...prev, personalid: v }))
                    }
                />

                {/* GENDER */}
                <Text>Giới tính</Text>
                <TextInput
                    className="border rounded-lg p-3 mb-3"
                    value={form.gender}
                    onChangeText={(v) =>
                        setForm(prev => ({ ...prev, gender: v }))
                    }
                />

                {/* DATE OF BIRTH */}
                <Text>Ngày sinh</Text>
                <TextInput
                    className="border rounded-lg p-3 mb-3"
                    value={form.dateofbirth}
                    onChangeText={(v) =>
                        setForm(prev => ({ ...prev, dateofbirth: v }))
                    }
                />

                {/* ================= BUTTON ================= */}
                <TouchableOpacity
                    onPress={handleSubmitProfile}
                    className="bg-blue-600 p-4 rounded-xl mt-6"
                >
                    <Text className="text-white text-center font-bold">
                        Cập nhật thông tin
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}