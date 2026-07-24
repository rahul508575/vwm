import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fetch(
          "https://api.visionworldmart.com/backend/api/auth/logout.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        );

        // Clear local session
        await AsyncStorage.removeItem("userInfo");

        // Redirect
        router.replace("/home");
      } catch (e) {
        console.log("Logout error", e);
      }
    };

    handleLogout();
  }, []);

  return null;
}
