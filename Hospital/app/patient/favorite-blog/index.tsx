import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Dimensions, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth-context';
import React, { useEffect } from 'react';
import { useFavoriteBlogViewModel } from '@/viewmodels/favorite-blog/use-favorite-blog-view-model';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
cssInterop(Feather, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});
cssInterop(FontAwesome, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
        },
    },
});

export default function FavoriteBlogListScreen() {
    const { width } = Dimensions.get("window");
    const { favoriteblogs, loading: favoriteblogListLoading, refreshFavoriteBlogs, deleteFavoriteBlog } = useFavoriteBlogViewModel();
    useEffect(() => { refreshFavoriteBlogs(null) }, []);

    return (
        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={favoriteblogListLoading}></LoadingOverlay>
            <View className="bg-orange-50 flex-row items-center px-3 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex items-center justify-center me-5">
                    <Ionicons name="arrow-back-outline" size={22} color="black" />
                </TouchableOpacity>
                <Text className="text-black font-bold text-xl">Danh sách bài viết quan tâm</Text>
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={() => refreshFavoriteBlogs(null)} />}
                className="p-3 flex-1"
                data={favoriteblogs}
                keyExtractor={(item) => item.blogid}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View className="p-0 border-b-2 border-gray-300">
                        <TouchableOpacity onPress={() => router.push({
                            pathname: "/patient/blog/detail",
                            params: { id: item.blogid }
                        })} className="bg-white rounded-xl py-3 gap-y-4 flex-1 ">
                            <Text className="font-bold line-clamp-2">{item.blog.title}</Text>
                            <View className="w-full">
                                <Image resizeMode="cover" className="aspect-[16/7] " source={{ uri: item.blog.image }}></Image>
                            </View>
                            <Text className=" text-gray-400 line-clamp-2">{item.blog.description}</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-500"><Feather name="calendar" size={18} /> {dayjs(item.blog?.createddate).format("HH:mm DD-MM-YYYY")}</Text>
                            <TouchableOpacity onPress={() => deleteFavoriteBlog(item.blogid)} className="flex-row items-center">
                                <Text className="me-2 text-primary-500">Quan tâm</Text>
                                <FontAwesome name="bookmark" size={18} className="text-primary-500" />
                            </TouchableOpacity>
                        </View>
                    </View>

                )}
            />

        </SafeAreaView>
    );
}
