import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { apiService } from "../services/apiService"; // TODO: confirm relative path

export default function SideDrawer({ onClose }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login from AsyncStorage (IMPORTANT)
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem("userInfo"); // 👈 SAME KEY
      setIsLoggedIn(!!user);
    };

    checkLogin();
  }, []);

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

      {/* <MenuItem
        icon="cube"
        label="Admin Dashboard"
        onPress={() => {
          onClose();
          router.push("/admin/dashboard");
        }}
      /> */}
      <MenuItem
        icon="comments"
        label="Inquiries"
        onPress={() => {
          onClose();
          router.push("/seller/inquiries");
        }}
      />

      {/* ❌ NOT LOGGED IN → Show Login + Signup */}
      {!isLoggedIn && (
        <>
          <MenuItem
            icon="sign-in"
            label="Login"
            onPress={() => {
              onClose();
              router.push("/login");
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
        </>
      )}

      {/* ✅ LOGGED IN → Show Logout only */}
      {isLoggedIn && (
        <>
          <View style={styles.divider} />

          <MenuItem
            icon="sign-out"
            label="Logout"
            onPress={async () => {
              // apiService.logout() clears BOTH the correct "userInfo" key
              // AND the Keychain auth token — doing it here directly with
              // removeItem("user") missed the real key ("userInfo") and
              // left the auth token behind, which caused the "still
              // logged in" / no Login-Signup-option bug.
              await apiService.logout();
              setIsLoggedIn(false);
              onClose();
              router.replace("/login");
            }}
          />
        </>
      )}
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
    paddingTop: 70,
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
