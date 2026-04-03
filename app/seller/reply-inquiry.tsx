import { router } from "expo-router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// 🔌 Socket connection
const socket = io("http://192.168.1.35:3001");

const INITIAL_MESSAGES = [
  {
    id: "1",
    text: "Hello, I need bulk tomatoes for export.",
    sender: "buyer",
    time: "10:30 AM",
  },
  {
    id: "2",
    text: "Sure, please tell me required quantity.",
    sender: "seller",
    time: "10:32 AM",
  },
  {
    id: "3",
    text: "500 Kg initially. What is your best price?",
    sender: "buyer",
    time: "10:35 AM",
  },
];

export default function ReplyInquiryScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const ROOM_ID = "inquiry_101"; // buyer + seller same room

  // 🔁 Join room & listen messages
  useEffect(() => {
    socket.emit("join_room", ROOM_ID);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // 📤 Send Message
  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      roomId: ROOM_ID,
      text: message,
      sender: "seller",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.buyerName}>Rahul Traders</Text>
          <Text style={styles.product}>Product: Fresh Tomato</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "seller"
                ? styles.sellerBubble
                : styles.buyerBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender === "seller" && { color: "#fff" },
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.time,
                item.sender === "seller" && { color: "#EAF2F8" },
              ]}
            >
              {item.time}
            </Text>
          </View>
        )}
      />

      {/* Input Box */}
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  back: {
    fontSize: 22,
    marginRight: 12,
    color: "#0A3D62",
  },
  buyerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A3D62",
  },
  product: {
    fontSize: 12,
    color: "#555",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 14,
  },
  buyerBubble: {
    backgroundColor: "#F2F2F2",
    alignSelf: "flex-start",
  },
  sellerBubble: {
    backgroundColor: "#0A3D62",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
  },
  time: {
    fontSize: 10,
    color: "#777",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#0A3D62",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  sendText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
