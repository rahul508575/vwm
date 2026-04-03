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
const socket = io("http://YOUR_SERVER_IP:3001");

export default function BuyerChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const ROOM_ID = "inquiry_101"; // SAME room as seller

  useEffect(() => {
    socket.emit("join_room", ROOM_ID);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId: ROOM_ID,
      text: message,
      sender: "buyer",
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
          <Text style={styles.sellerName}>VisionWorldMart Seller</Text>
          <Text style={styles.product}>Product: Fresh Tomato</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === "buyer"
                ? styles.buyerBubble
                : styles.sellerBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender === "buyer" && { color: "#fff" },
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.time,
                item.sender === "buyer" && { color: "#EAF2F8" },
              ]}
            >
              {item.time}
            </Text>
          </View>
        )}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Type your inquiry..."
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
  sellerName: {
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
    backgroundColor: "#0A3D62",
    alignSelf: "flex-end",
  },
  sellerBubble: {
    backgroundColor: "#F2F2F2",
    alignSelf: "flex-start",
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
