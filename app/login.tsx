import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1️⃣ Validation
    if (!login || !password) {
      Alert.alert("Error", "Email/Mobile and Password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://api.visionworldmart.com/backend/api/auth/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: login,
            password: password,
          }),
        },
      );

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);
      if (data.status) {
        // 🔥 SAVE USER IN ASYNC STORAGE
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        Alert.alert("Success", "Login successful");

        if (data.user.role === "seller") {
          router.replace("/seller/dashboard");
        } else {
          router.replace("/login");
        }
      }
    } catch (error) {
      console.log("LOGIN ERROR 👉", error);
      Alert.alert("Error", "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Logo / App Name */}
        <Text style={styles.logo}>VisionWorldMart</Text>
        <Text style={styles.subtitle}>B2B Marketplace Login</Text>

        {/* Email / Mobile */}
        <TextInput
          placeholder="Email or Mobile Number"
          placeholderTextColor="#999"
          style={styles.input}
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Links */}
        <View style={styles.links}>
          <Text style={styles.link}>Forgot Password?</Text>
          <Text style={styles.link} onPress={() => router.push("/signup")}>
            New User? login
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0A3D62",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
  },
  loginBtn: {
    backgroundColor: "#0A3D62",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  links: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#0A3D62",
    marginTop: 8,
    fontSize: 14,
  },
});
