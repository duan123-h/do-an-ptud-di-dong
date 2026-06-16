import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useEffect, useMemo, useState } from 'react';
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
import { Dropdown } from "react-native-element-dropdown";

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
    const { refreshProvinces, provinces, loading: ProvinceListLoading } = useProvinceListViewModel();
    const { fetchCommunesByProvince, communes } = useCommuneListByProvinceViewModel();
    const { fetchHamletsByComune, hamlets } = useHamletListByComuneViewModel();
    const { refreshEthnicGroup, ethnicGroup, loading: EthnicGroupListLoading } = useEthnicGroupListViewModel();

    // ================= PROFILE STATE =================
    const [form, setForm] = useState({
        fullname: "",
        dateofbirth: "",
        gender: true,
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
                fullname: user?.profile?.fullname || "",
                dateofbirth: user?.profile?.dateofbirth || "",
                gender: user?.profile?.gender || "",
                address: user?.profile?.address || "",
                phone: user?.profile?.phone || "",
                email: user?.profile?.email || "",
                personalid: user?.profile?.personalid || "",
                provinceid: user?.profile?.provinceid || "",
                communeid: user?.profile?.communeid || "",
                hamletid: user?.profile?.hamletid || "",
                ethnicid: user?.profile?.ethnicid || "",
            });
        }
        if (user?.profile?.provinceid) {
            fetchCommunesByProvince(user?.profile?.provinceid);
        }
        if (user?.profile?.communeid) {
            fetchHamletsByComune(user?.profile?.communeid);
        }
        refreshProvinces();
        refreshEthnicGroup();
        console.log("ethnicGroup: ", user)
    }, []);


    // const addressText = useMemo(() => {
    //     const province = provinces?.find(p => p.provinceid == form.provinceid);
    //     const commune = communes?.find(c => c.communeid === form.communeid);
    //     const hamlet = hamlets?.find(h => h.hamletid === form.hamletid);

    //     return [
    //         hamlet?.name,
    //         commune?.name,
    //         province?.name,
    //     ].filter(Boolean).join(", ");
    // }, [form.provinceid, form.communeid, form.hamletid]);
    // useEffect(()=>{
    //     setForm(prev => ({ ...prev, address: addressText }))
    // },[addressText])

    function handleSubmitProfile() {
        if (!form.fullname.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập họ tên");
            return;
        }
        if (!form.personalid.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập số định danh cá nhân");
            return;
        }

        if (!form.phone.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập số điện thoại");
            return;
        }
        if (!form.provinceid) {
            Alert.alert("Thiếu thông tin", "Vui chọn tỉnh thành cư trú");
            return;
        }
        if (!form.communeid) {
            Alert.alert("Thiếu thông tin", "Vui chọn xã / phường cư trú");
            return;
        }
        if (!form.hamletid) {
            Alert.alert("Thiếu thông tin", "Vui chọn thôn / xóm cư trú");
            return;
        }
        if (!form.address) {
            Alert.alert("Thiếu thông tin", "Vui nhập địa chỉ cư trú");
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

    function onSelectProvince(id: string) {
        setForm(prev => ({
            ...prev,
            communeid: "",
            hamletid: "",
        }));

        fetchCommunesByProvince(id);
    }

    function onSelectCommune(id: string) {
        setForm(prev => ({
            ...prev,
            hamletid: "",
        }));

        fetchHamletsByComune(id);
    }
    const [gender, setGender] = useState("male");
    return (
        <SafeAreaView className="flex-1 bg-white">
            <LoadingOverlay isLoading={loading || ProvinceListLoading || EthnicGroupListLoading} />
            <View className="bg-orange-50 flex-row items-center px-6 py-4 border-b-2 border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-4">
                    <Ionicons name="arrow-back-outline" size={26} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView className="px-4 my-4 flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text className="text-black font-bold text-2xl mb-4">Cập nhật thông tin hồ sơ cá nhân</Text>
                <View className="gap-y-4 ">
                    <Text>Họ và tên<Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <TextInput value={form.fullname} onChangeText={(v) => setForm(prev => ({ ...prev, fullname: v }))} className="px-10 py-5" placeholder='Nhập họ và tên'></TextInput>
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.fullname.length > 0 && (
                                    <TouchableOpacity onPress={() => setForm(prev => ({ ...prev, fullname: "" }))} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Text>Số định danh cá nhân<Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <TextInput value={form.personalid} onChangeText={(v) => setForm(prev => ({ ...prev, personalid: v }))} className="px-10 py-5" placeholder='Nhập số định danh cá nhân'></TextInput>
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.personalid.length > 0 && (
                                    <TouchableOpacity onPress={() => setForm(prev => ({ ...prev, personalid: "" }))} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Text>Giới tính<Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="px-10 flex-row gap-5 border rounded-lg border-gray-300 focus:border-secondary-400 h-16">

                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <TouchableOpacity
                            onPress={() => setForm(prev => ({ ...prev, gender: true }))}
                            className="flex-row items-center"
                        >
                            <View className="h-5 w-5 rounded-full border-2 border-blue-500 items-center justify-center">
                                {form.gender && (
                                    <View className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                )}
                            </View>

                            <Text className="ml-2">Nam</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setForm(prev => ({ ...prev, gender: false }))}
                            className="flex-row items-center"
                        >
                            <View className="h-5 w-5 rounded-full border-2 border-pink-500 items-center justify-center">
                                {!form.gender && (
                                    <View className="h-2.5 w-2.5 rounded-full bg-pink-500" />
                                )}
                            </View>

                            <Text className="ml-2">Nữ</Text>
                        </TouchableOpacity>

                    </View>

                    <Text>Số điện thoại<Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <TextInput value={form.phone} onChangeText={(v) => setForm(prev => ({ ...prev, phone: v }))} className="px-10 py-5" placeholder='Nhập số điện thoại'></TextInput>
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.phone.length > 0 && (
                                    <TouchableOpacity onPress={() => setForm(prev => ({ ...prev, phone: "" }))} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Text>Email</Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <TextInput value={form.email} onChangeText={(v) => setForm(prev => ({ ...prev, email: v }))} className="px-10 py-5" placeholder='Nhập email'></TextInput>
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.email.length > 0 && (
                                    <TouchableOpacity onPress={() => setForm(prev => ({ ...prev, email: "" }))} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Text>Dân tộc</Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <Dropdown
                            data={ethnicGroup}
                            labelField="name"
                            valueField="ethnicid"
                            placeholder="Chọn tỉnh / thành"
                            value={form.ethnicid}
                            onChange={(item) => setForm(prev => ({ ...prev, ethnicid: item.ethnicid }))}
                            search
                            style={{
                                paddingHorizontal: 40,
                                paddingVertical: 16,
                            }}
                        />
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.provinceid != "" && (
                                    <TouchableOpacity onPress={() => setForm(prev => ({ ...prev, provinceid: "" }))} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>

                    <Text>Tỉnh<Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <Dropdown
                            data={provinces}
                            labelField="name"
                            valueField="provinceid"
                            placeholder="Chọn tỉnh / thành"
                            value={form.provinceid}
                            onChange={(item) => {
                                setForm(prev => ({ ...prev, provinceid: item.provinceid })); onSelectProvince(item.provinceid)
                            }}
                            search
                            style={{
                                paddingHorizontal: 40,
                                paddingVertical: 16,
                            }}
                        />
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.provinceid != "" && (
                                    <TouchableOpacity onPress={() => { setForm(prev => ({ ...prev, provinceid: "" })); onSelectProvince("") }} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Text>Xã / Phường<Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <Dropdown
                            data={communes}
                            labelField="name"
                            valueField="communeid"
                            placeholder="Chọn xã / phường"
                            value={form.communeid}
                            onChange={(item) => {
                                setForm(prev => ({ ...prev, communeid: item.communeid })); onSelectCommune(item.communeid)
                            }}
                            search
                            style={{
                                paddingHorizontal: 40,
                                paddingVertical: 16,
                            }}
                        />
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.provinceid != "" && (
                                    <TouchableOpacity onPress={() => {
                                        setForm(prev => ({ ...prev, provinceid: "" })); onSelectCommune("")
                                    }} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Text>Thôn / Xóm<Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <Dropdown
                            data={hamlets}
                            labelField="name"
                            valueField="hamletid"
                            placeholder="Chọn thôn / xóm"
                            value={form.hamletid}
                            onChange={(item) => setForm(prev => ({ ...prev, hamletid: item.hamletid }))}
                            search
                            style={{
                                paddingHorizontal: 40,
                                paddingVertical: 16,
                            }}
                        />
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.provinceid != "" && (
                                    <TouchableOpacity onPress={() => setForm(prev => ({ ...prev, provinceid: "" }))} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                    <Text>Địa chỉ<Text className="text-red-600 font-bold text-2xl">*</Text></Text>
                    <View className="border rounded-lg border-gray-300 focus:border-secondary-400">
                        <TextInput value={form.address} onChangeText={(v) => setForm(prev => ({ ...prev, address: v }))} className="px-10 py-5" placeholder='Nhập họ và tên'></TextInput>
                        <View className="h-full  items-center justify-center w-10 absolute left-0">
                            <SimpleLineIcons name="user" size={20} className="text-gray-500" />
                        </View>
                        <View className="h-full absolute right-0 flex-row items-center justify-center">
                            {
                                form.address.length > 0 && (
                                    <TouchableOpacity onPress={() => setForm(prev => ({ ...prev, address: "" }))} className="items-center justify-center w-10">
                                        <Ionicons name="close-circle" size={20} className="text-gray-500" />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View className="p-4">
                <TouchableOpacity onPress={() => handleSubmitProfile()} className="rounded-xl bg-primary-700 items-center justify-center h-14">
                    <Text className="text-white text-xl font-bold">Gửi yêu cầu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}