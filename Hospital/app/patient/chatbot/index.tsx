import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

cssInterop(Ionicons, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
});

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Xin chào! Tôi là trợ lý AI của Bệnh viện Bạch Mai.\n\nTôi có thể giúp bạn:\n• Tư vấn sơ bộ về sức khỏe\n• Thông tin về bác sĩ, khoa\n• Giải đáp thắc mắc\n\nBạn có câu hỏi gì cho tôi?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const assistantTextRef = useRef("");
  const lastUpdateRef = useRef(0);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const assistantId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("token", "demo-token-1234");
      formData.append("question", userMessage.content);
      const BackendIpChatot = await AsyncStorage.getItem("BackendIpChatot");

      const res = await fetch(`http://${BackendIpChatot}/api/ai`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.text();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: data }
            : m
        )
      );
    } catch (e) {
      console.log("lỗi: ", e);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Lỗi khi gọi API hệ thống." }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";

    return (
      <View
        className={`flex-row items-start my-2 ${isUser ? "flex-row-reverse" : ""
          }`}
      >
        <View
          className={`w-8 h-8 rounded-full items-center justify-center mx-2 ${isUser ? "bg-slate-300" : "bg-[#038555]"
            }`}
        >
          {isUser ? (
            <Text className="text-white">👤</Text>
          ) : (
            <Ionicons name="chatbubble-ellipses" size={18} color="white" />
          )}
        </View>

        <View className="max-w-[75%]">
          <View
            className={`px-3 py-2 rounded-2xl border ${isUser
              ? "bg-[#038555] border-transparent"
              : "bg-white border-gray-200"
              }`}
          >
            {isUser ? (
              <Text className="text-[15px] leading-5 text-white">
                {item.content}
              </Text>
            ) : (
              <Markdown>
                {item.content}
              </Markdown>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 bg-primary-600">
        <TouchableOpacity onPress={() => router.back()} className=" mr-3"> <Ionicons name="arrow-back-outline" size={26} color="white" /></TouchableOpacity>

        <View className="w-9 h-9 bg-white rounded-full items-center justify-center mr-2">
          <Ionicons name="chatbubble-ellipses" size={20} color="#038555" />
        </View>

        <View className="flex-1">
          <Text className="text-white font-bold text-base">
            Trợ lý AI
          </Text>
          <Text className="text-white/70 text-xs">
            Bệnh viện Bạch Mai
          </Text>
        </View>

        <Text className="text-white text-xl">⋮</Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1 bg-gray-100"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          extraData={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerClassName="px-2 py-3"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {loading && (
          <View className="py-2 items-center">
            <ActivityIndicator color="#038555" />
          </View>
        )}

        <View className="flex-row items-center px-3 py-2 border-t border-gray-200 bg-white">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 border border-gray-200">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Nhập câu hỏi của bạn..."
              placeholderTextColor="#9ca3af"
              className="flex-1 py-2 text-gray-800 text-[15px]"
            />
            <Text className="text-xl text-gray-500">📎</Text>
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            className="ml-2 w-10 h-10 rounded-full items-center justify-center bg-primary-600"
          >
            <Text className="text-white text-lg">➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}