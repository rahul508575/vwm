import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SideDrawer({ onClose }: any) {
  const MenuItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <FontAwesome name={icon} size={18} color="#0A3D62" />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.drawer}>
      <Text style={styles.heading}>Seller Menu</Text>

      <MenuItem
        icon="home"
        label="Dashboard"
        onPress={() => {
          onClose();
          router.push("/seller/dashboard");
        }}
      />

      <MenuItem
        icon="cube"
        label="My Products"
        onPress={() => {
          onClose();
          router.push("/seller/my-products");
        }}
      />

      <MenuItem
        icon="comments"
        label="Inquiries"
        onPress={() => {
          onClose();
          router.push("/seller/inquiries");
        }}
      />

      <MenuItem
        icon="sign-in"
        label="Login"
        onPress={() => {
          onClose();
          router.push("/register");
        }}
      />

      <MenuItem
        icon="user-plus"
        label="Sign Up"
        onPress={() => {
          onClose();
          router.push("/signup");
        }}
      />

      <View style={styles.divider} />

      <MenuItem
        icon="sign-out"
        label="Logout"
        onPress={() => {
          onClose();
          router.push("/logout");
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "#fff",
    padding: 20,
    elevation: 10,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 24,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  text: {
    fontSize: 16,
    color: "#333",
    marginLeft: 14,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
});
