import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SellerHeader({ onMenuPress }: any) {
  return (
    <View style={styles.header}>
      {/* Hamburger */}
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={styles.menu}>☰</Text>
      </TouchableOpacity>

      {/* Logo / Title */}
      <Text
        style={styles.title}
        onPress={() => {
          router.push("/webview/visionworldmart");
        }}
      >
        <Text style={{ color: "#0A3D62", fontWeight: "bold", fontSize: 24 }}>
          <Image
            source={require("../assets/logo1.png")}
            style={{ width: 200, height: 50, marginTop: 2 }}
          />{" "}
        </Text>
      </Text>

      {/* Right Button */}
      <TouchableOpacity style={styles.joinBtn}>
        <Text style={styles.joinText}>Join Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8FBFF",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menu: {
    fontSize: 26,
    color: "#0A3D62",
  },
  title: {
    fontSize: 18,
  },
  joinBtn: {
    backgroundColor: "#1E5FD8",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  joinText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
