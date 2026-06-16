import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Dimensions, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';
import { useBlogViewModel } from '@/viewmodels/blog/use-blog-view-model';
import LoadingOverlay from '@/components/ui/loadings/loading-overlay';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import RenderHTML from "react-native-render-html";

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

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { width } = useWindowDimensions();
    const { blog, loading: blogLoading, fetchBlog, addFavoriteBlog, deleteFavoriteBlog } = useBlogViewModel();
    useEffect(() => { fetchBlog(id) }, []);

    return (

        <SafeAreaView className="flex-1">
            <LoadingOverlay isLoading={blogLoading}></LoadingOverlay>
            <View className="bg-orange-50 flex-col justify-start px-3 py-4 ">
                <TouchableOpacity onPress={() => router.back()} className="flex justify-start me-5 mb-3">
                    <Ionicons name="arrow-back-outline" size={22} color="black" />
                </TouchableOpacity>
                <Text className="text-gray-400 font-medium"><Feather name="calendar" size={18} /> {dayjs(blog.createdate).format("HH:mm DD-MM-YYYY")}</Text>
            </View>

            <ScrollView className="px-3 mb-3">
                <Text className="font-bold text-black text-2xl my-3">{blog.title}</Text>
                <RenderHTML
                    contentWidth={width}
                    source={{ html: blog.detail }}
                />
            </ScrollView>
            <View className="items-center justify-center pt-1 pb-3">
                {
                    blog.isfavorite ? (
                        <TouchableOpacity onPress={() => deleteFavoriteBlog(blog.blogid)} className="flex-row items-center">
                            <Text className="me-2 text-primary-500 text-lg">Quan tâm</Text>
                            <FontAwesome name="bookmark" size={18} className="text-primary-500" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => addFavoriteBlog({ blogid: blog.blogid })} className="flex-row items-center">
                            <Text className="me-2 text-gray-500 text-lg">Quan tâm</Text>
                            <FontAwesome name="bookmark-o" size={18} className="text-gray-500" />
                        </TouchableOpacity>
                    )
                }

            </View>

        </SafeAreaView>
    );
}
