import { useAuth } from '@/contexts/auth-context';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList, Image, ImageBackground, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBlogViewModel } from '@/viewmodels/blog/use-blog-view-model';
import { useStaffViewModel } from '@/viewmodels/staff/use-staff-view-model';
import { useEffect } from 'react';
import dayjs from "dayjs";
import { Dimensions } from "react-native";
import { useSliderViewModel } from '@/viewmodels/slider/use-slider-view-model';
import * as Linking from "expo-linking";
import CircleAvatar from '@/components/ui/avatars/circle-avatar';
// import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthGate } from '@/hooks/AuthGate';
cssInterop(Feather, {
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
export default function HomeScreen() {

  const { width } = Dimensions.get("window");
  const shimmerWidth = width - 22 - 16;

  // 2. Tính toán height dựa trên tỷ lệ 16/7
  const shimmerHeight = shimmerWidth * (7 / 16);
  const { user } = useAuth();
  const { blogs, loading: blogLoading, refreshBlogs } = useBlogViewModel();
  const { sliders, loading: sliderLoading, refreshSliders } = useSliderViewModel();
  const { staffs, loading: staffLoading, refreshStaffs } = useStaffViewModel();
  useEffect(() => {
    refreshBlogs(null)
    refreshStaffs({ limit: 4 })
    refreshSliders(null)
  }, []);

  function refres() {
    refreshBlogs(null),
      refreshStaffs({ limit: 4 })
    refreshSliders(null)
  }
  const handlePress = (item: any) => {
    if (!item?.linkurl) return;

    if (item.linkurl.startsWith("http")) {
      Linking.openURL(item.linkurl);
    } else {
      router.push(item.linkurl);
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-y-2">
      <View className="bg-primary-600 flex-row justify-between items-center p-3">
        <TouchableOpacity onPress={() => router.push("/patient/profile")} className="rounded-full w-16 h-16 border-2 border-yellow-600">
          <Image resizeMode="cover" style={{ width: "100%", height: "100%" }} className=" rounded-full" source={{ uri: user?.profile?.avatar }}></Image>
        </TouchableOpacity>
        <Text className="text-white font-bold text-xl">{user?.profile?.fullname}</Text>
        <TouchableOpacity className="border rounded-full w-10 h-10 flex items-center justify-center bg-white">
          <Feather name="search" size={20} color="black" />
        </TouchableOpacity>
      </View>


      <FlatList
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refres()} />}
        data={[1]}
        renderItem={() => (
          <>
            <View className="p-3">
              {
                sliderLoading ? (

                  <FlatList
                    className=""
                    data={[1, 2, 3, 4]}
                    keyExtractor={(item, index) => "sliders-" + index}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View
                        style={{ width: width - 22 }}
                        className="px-2 aspect-[16/7]"
                      >
                        <View className="bg-white rounded-2xl overflow-hidden">

                          <ShimmerPlaceHolder

                            LinearGradient={LinearGradient}
                            style={{
                              width: "100%",
                              height: '100%'
                            }}
                            shimmerColors={[
                              "#E1E9EE",
                              "#F2F8FC",
                              "#E1E9EE",
                            ]}
                            duration={400}
                          />

                        </View>
                      </View>
                    )}
                  ></FlatList>
                ) : (
                  <FlatList

                    className=""
                    data={sliders}
                    keyExtractor={(item) => "sliders-" + item.sliderid}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      < View style={{ width: width - 22 }} className="px-2">
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => handlePress(item)}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm"
                        >
                          <View className="w-full">
                            <Image resizeMode="cover" className="aspect-[16/7] rounded-md" source={{ uri: item.imagepath }}></Image>
                          </View>

                          {/* <View className="p-3">
                        <Text className="text-lg font-bold text-slate-800">
                          {item.title}
                        </Text>

                        <Text
                          numberOfLines={2}
                          className="text-slate-500 mt-1"
                        >
                          {item.description}
                        </Text>
                      </View> */}
                        </TouchableOpacity>
                      </View>
                    )}
                  ></FlatList>
                )
              }
            </View>
            <View className="p-3">
              <Text className="text-black font-bold text-xl">Nhóm dịch vụ</Text>
              <View className="flex-row flex-wrap">
                <TouchableOpacity onPress={() => router.push("/patient/chatbot")} className="w-1/3 items-center justify-center p-2  ">
                  <View className="gap-y-2 items-center rounded-2xl p-4 border-2 border-primary-600">
                    <Ionicons name="chatbubble-ellipses" size={26} className="text-primary-600" />
                    {/* <Feather name="plus-square" size={26} className="text-primary-600" /> */}
                    <Text className="text-black text-center font-bold ">Trợ lý AI</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>

            <View className="m-3" >
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-black font-bold text-xl ">Bài viết nổi bật</Text>
                <TouchableOpacity onPress={() => router.push("/patient/blog/")}><Text className="font-medium text-base">Xem thêm <Feather name="mouse-pointer" size={15} className="text-primary-500" /></Text></TouchableOpacity>
              </View>
              <ImageBackground
                className="rounded-xl overflow-hidden"
                source={require("@/assets/images/background.png")}
                resizeMode="cover"
              >
                {
                  blogLoading ? (

                    <FlatList
                      className=""
                      data={[1, 2, 3, 4]}
                      keyExtractor={(item, index) => "blogs-" + index}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <View className='py-3 px-2' style={{ width: width - 22 }}>
                          <View className="bg-white rounded-2xl  overflow-hidden gap-y-4 flex-1">

                            <View className="aspect-[16/7]">
                              <ShimmerPlaceHolder

                                LinearGradient={LinearGradient}
                                style={{
                                  width: "100%",
                                  height: '100%'
                                }}
                                shimmerColors={[
                                  "#E1E9EE",
                                  "#F2F8FC",
                                  "#E1E9EE",
                                ]}
                                duration={400}
                              />
                            </View>

                            <View className="gap-y-4 p-3">
                              <ShimmerPlaceHolder

                                LinearGradient={LinearGradient}
                                style={{
                                  width: "70%",
                                  height: 10
                                }}
                                shimmerColors={[
                                  "#E1E9EE",
                                  "#F2F8FC",
                                  "#E1E9EE",
                                ]}
                                duration={400}
                              />
                              <ShimmerPlaceHolder

                                LinearGradient={LinearGradient}
                                style={{
                                  width: "50%",
                                }}
                                shimmerColors={[
                                  "#E1E9EE",
                                  "#F2F8FC",
                                  "#E1E9EE",
                                ]}
                                duration={400}
                              />
                            </View>
                          </View>
                        </View>


                      )}
                    ></FlatList>
                  ) : (
                    <FlatList
                      data={blogs}
                      keyExtractor={(item) => "blog-" + item.blogid}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (

                        <View className='py-3 px-2' style={{ width: width - 22 }}>
                          <TouchableOpacity onPress={() => router.push({
                            pathname: "/patient/blog/detail",
                            params: { id: item.blogid }
                          })} className="bg-white rounded-2xl  overflow-hidden gap-y-4 flex-1">
                            <Image resizeMode="cover" className="aspect-[16/7] rounded-md" source={{ uri: item.image }}></Image>
                            <View className="gap-y-4 p-3">
                              <Text className="line-clamp-2">{item.title}</Text>
                              <Text className="text-gray-400"><Feather name="calendar" size={18} /> {dayjs("2025-03-13T13:40:59.000000Z").format("HH:mm DD-MM-YYYY")}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>


                      )}
                    ></FlatList>
                  )
                }

              </ImageBackground>


            </View>
            <View className="p-3" >
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-black font-bold text-xl ">ĐộI ngũ y tế kkk</Text>
                <TouchableOpacity onPress={() => router.push("/patient/staff/")}><Text className="font-medium text-base">Xem thêm <Feather name="mouse-pointer" size={15} className="text-primary-500" /></Text></TouchableOpacity>
              </View>
              <ImageBackground
                className="rounded-xl overflow-hidden"
                source={require("@/assets/images/background.png")}
                resizeMode="cover"
              >
                {
                  staffLoading ? (

                    <FlatList

                      className="m-3"


                      data={[1, 2, 3, 4]}
                      keyExtractor={(item, index) => "staff-" + index}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => (
                        <View style={{ width: 12 }} />
                      )}
                      renderItem={({ item }) => (

                        <View
                          className="p-0"
                          style={{ width: (width - 24 * 2) * 0.7 }}
                        >
                          <View className="bg-white rounded-3xl overflow-hidden flex-1">
                            <View className="w-full relative">
                              <View className="bg-gray-100 h-24" />
                              <View className="bg-gray-50 h-24" />

                              <View className="absolute inset-0 items-center justify-center">
                                <ShimmerPlaceHolder
                                  LinearGradient={LinearGradient}
                                  style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 999,
                                  }}
                                  shimmerColors={["#E1E9EE", "#F2F8FC", "#E1E9EE"]}
                                  duration={400}
                                />
                              </View>
                            </View>
                            <View className="px-3 pb-3 pt-14 gap-y-4 flex-1 items-center">
                              <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ width: "100%", height: 16, borderRadius: 8 }}
                                shimmerColors={["#E1E9EE", "#F2F8FC", "#E1E9EE"]}
                                duration={400}
                              />

                              <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ width: "100%", height: 14, borderRadius: 8 }}
                                shimmerColors={["#E1E9EE", "#F2F8FC", "#E1E9EE"]}
                                duration={400}
                              />

                              <View className="w-full mt-2 gap-y-2">
                                <ShimmerPlaceHolder
                                  LinearGradient={LinearGradient}
                                  style={{ width: "70%", height: 14, borderRadius: 8 }}
                                  shimmerColors={["#E1E9EE", "#F2F8FC", "#E1E9EE"]}
                                  duration={400}
                                />


                              </View>
                            </View>
                            <View className="justify-center items-center mb-4">
                              <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{
                                  width: "60%",
                                  height: 44,
                                  borderRadius: 999,
                                }}
                                shimmerColors={["#E1E9EE", "#F2F8FC", "#E1E9EE"]}
                                duration={400}
                              />
                            </View>

                          </View>
                        </View>

                      )}
                    ></FlatList>
                  ) : (
                    <FlatList

                      data={staffs}
                      keyExtractor={(item) => "staff-" + item.staffid}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      // ItemSeparatorComponent={() => (
                      //   <View style={{ width: 12 }} />
                      // )}
                      renderItem={({ item }) => (
                        <View className="px-2 py-3 " style={{ width: (width - 24 * 2) * 0.7 }} >
                          <View className=" p-0 bg-white gap-y-2 flex-1 rounded-3xl overflow-hidden">
                            <View className="w-full">
                              <View className="bg-gray-200 h-24">
                              </View>
                              <View className="bg-white h-24">
                              </View>
                              <View className=" absolute left-0 top-0 right-0 bottom-0 items-center justify-center">
                                <CircleAvatar className={'w-40 h-40 absolute border-4 border-primary-500'} image={item.avatar} gender={item.gender}></CircleAvatar>
                              </View>
                            </View>
                            <View className="px-3 pb-3 gap-y-3 flex-1">
                              <Text className="font-bold text-black text-xl text-center uppercase">{item?.stafftype?.code}. {item.fullname}</Text>
                              <Text className=" text-black text-base text-center uppercase">CHUYÊN KHOA {item?.department?.name}</Text>
                              {/* <Text className=" text-black text-base text-center line-clamp-2">{item.trainingexperience}</Text> */}
                              <Text className=" text-black text-lg font-medium">Chuyên môn: {item.specialization}</Text>
                            </View>
                            <View className="justify-center items-center mb-4">
                              <TouchableOpacity
                                onPress={() =>
                                  router.push({
                                    pathname: "/patient/staff/detail",
                                    params: { id: item.staffid },
                                  })
                                }
                                className="px-6 py-3 bg-primary-500 rounded-full shadow-sm active:scale-95"
                              >
                                <Text className="text-white font-semibold tracking-wide">
                                  XEM CHI TIẾT
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                      )}
                    ></FlatList>
                  )
                }

              </ImageBackground>

            </View>
          </>
        )
        }
      />
      {/* <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => refres()} />}
        showsVerticalScrollIndicator={false}>

        

      </ScrollView> */}
    </SafeAreaView >
  );
}
