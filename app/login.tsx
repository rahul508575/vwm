/**
 * 🔒 SECURE LOGIN SCREEN - FIXED VERSION
 * With debugging, proper navigation, and error handling
 * UPDATED: Using expo-secure-store (Expo Go compatible)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useRef, useState } from "react";
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
import { validateLoginForm } from "../utils/validationHelpers";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://api.visionworldmart.com/backend/api";
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "15000");

// ✅ RATE LIMITER CLASS
class LoginRateLimiter {
  private attempts: { timestamp: number; identifier: string }[] = [];
  private readonly MAX_ATTEMPTS = 5;
  private readonly TIME_WINDOW = 15 * 60 * 1000; // 15 minutes

  isLimited(identifier: string): boolean {
    const now = Date.now();

    // Remove old attempts outside time window
    this.attempts = this.attempts.filter(
      (attempt) => now - attempt.timestamp < this.TIME_WINDOW,
    );

    // Count attempts for this identifier
    const recentAttempts = this.attempts.filter(
      (attempt) => attempt.identifier === identifier,
    );

    if (recentAttempts.length >= this.MAX_ATTEMPTS) {
      return true;
    }

    // Add current attempt
    this.attempts.push({ timestamp: now, identifier });

    return false;
  }

  getRemainingTime(identifier: string): number {
    const now = Date.now();
    const oldestAttempt = this.attempts
      .filter((attempt) => attempt.identifier === identifier)
      .sort((a, b) => a.timestamp - b.timestamp)[0];

    if (!oldestAttempt) return 0;

    const remainingMs = this.TIME_WINDOW - (now - oldestAttempt.timestamp);
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  }
}

const rateLimiter = new LoginRateLimiter();

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loginAttemptCountRef = useRef(0);

  // ✅ HANDLE LOGIN WITH FULL VALIDATION & SECURITY
  const handleLogin = async () => {
    try {
      // 1️⃣ CLEAR PREVIOUS ERRORS
      setErrors({});

      // 2️⃣ CHECK NETWORK CONNECTION
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        Alert.alert("No Internet", "Please check your internet connection");
        return;
      }

      // 3️⃣ VALIDATE FORM DATA
      const formData = { login, password };
      const validation = validateLoginForm(formData);

      if (!validation.valid) {
        Alert.alert("Validation Error", validation.message);
        return;
      }

      // 4️⃣ CHECK RATE LIMITING
      if (rateLimiter.isLimited(login)) {
        const remainingTime = rateLimiter.getRemainingTime(login);
        const minutes = Math.ceil(remainingTime / 60);

        Alert.alert(
          "Too Many Attempts",
          `Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}`,
        );
        return;
      }

      setLoading(true);

      // 5️⃣ MAKE API CALL WITH TIMEOUT
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const loginUrl = `${API_BASE_URL}/auth/login.php`;
      console.log("🔐 LOGIN REQUEST:", {
        url: loginUrl,
        login,
        timestamp: new Date().toISOString(),
      });

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login.trim(),
          password: password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 6️⃣ VALIDATE RESPONSE STATUS
      if (!res.ok) {
        if (res.status === 401) {
          Alert.alert("Login Failed", "Invalid email or password");
        } else if (res.status === 429) {
          Alert.alert("Error", "Too many requests. Please try again later");
        } else if (res.status >= 500) {
          Alert.alert("Error", "Server error. Please try again later");
        } else {
          Alert.alert("Error", `HTTP Error: ${res.status}`);
        }
        return;
      }

      // 7️⃣ PARSE RESPONSE SAFELY
      const text = await res.text();
      console.log("🔐 LOGIN RESPONSE TEXT:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("❌ JSON PARSE ERROR:", parseError);
        Alert.alert("Error", "Invalid server response format");
        return;
      }

      console.log("🔐 LOGIN RESPONSE DATA:", JSON.stringify(data, null, 2));

      // 8️⃣ VALIDATE RESPONSE STRUCTURE
      if (!data || typeof data.status === "undefined") {
        console.error("❌ INVALID RESPONSE STRUCTURE");
        Alert.alert("Error", "Invalid server response");
        return;
      }

      // 9️⃣ SUCCESS LOGIN
      if (data.status && data.user) {
        console.log("✅ LOGIN SUCCESS");
        console.log("📊 USER DATA:", JSON.stringify(data.user, null, 2));
        console.log("🎭 USER ROLE:", data.user.role);
        console.log("🆔 USER ID:", data.user.id);
        console.log("📧 USER EMAIL:", data.user.email);

        // ✅ RESET RATE LIMITER ON SUCCESS
        loginAttemptCountRef.current = 0;

        // ✅ VALIDATE USER DATA
        if (!data.user.id || !data.user.email) {
          console.error("❌ MISSING USER ID OR EMAIL");
          Alert.alert("Error", "Invalid user data from server");
          return;
        }

        // ✅ STORE TOKEN SECURELY IN EXPO SECURE STORE (Expo Go Compatible)
        if (data.token) {
          try {
            await SecureStore.setItemAsync("vwm_token", data.token);
            console.log("✅ TOKEN STORED IN SECURE STORE");
          } catch (secureStoreError) {
            console.error("❌ SECURE STORE ERROR:", secureStoreError);
            // Non-critical error, continue anyway
          }
        }

        // ✅ STORE NON-SENSITIVE USER INFO IN ASYNCSTORAGE
        const userInfo = {
          id: data.user.id,
          name: data.user.name || "User",
          email: data.user.email,
          role: data.user.role || "buyer", // DEFAULT ROLE
          company_id: data.user.company_id || null,
          createdAt: new Date().toISOString(),
        };

        console.log("💾 STORING USER INFO:", JSON.stringify(userInfo, null, 2));

        try {
          await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
          console.log("✅ USER INFO STORED");
        } catch (storageError) {
          console.error("❌ STORAGE ERROR:", storageError);
          Alert.alert("Error", "Failed to save user data");
          return;
        }

        // ✅ SAVE SESSION TIMESTAMP FOR TIMEOUT
        await AsyncStorage.setItem("lastActive", Date.now().toString());

        // ✅ DETERMINE NAVIGATION ROUTE
        const userRole = data.user.role || "buyer";
        console.log("🚀 NAVIGATING WITH ROLE:", userRole);

        let navigationRoute = "/home"; // DEFAULT

        if (userRole === "seller") {
          navigationRoute = "/seller/dashboard";
        } else if (userRole === "company") {
          navigationRoute = "/company/dashboard";
        } else if (userRole === "buyer") {
          navigationRoute = "/home";
        } else if (userRole === "admin") {
          navigationRoute = "/admin/dashboard";
        }

        console.log("🎯 NAVIGATION ROUTE:", navigationRoute);

        // Show success message
        Alert.alert("Success", "Login successful");

        // IMPORTANT: Use setTimeout to ensure state updates complete
        setTimeout(() => {
          console.log("📱 EXECUTING NAVIGATION TO:", navigationRoute);
          router.replace(navigationRoute);
        }, 500);
      }
      // ❌ LOGIN FAILED
      else {
        console.log("❌ LOGIN FAILED - Status:", data.status);
        console.log("❌ LOGIN ERROR MESSAGE:", data.message);

        Alert.alert(
          "Login Failed",
          data.message || "Please check your credentials",
        );

        // ✅ INCREMENT FAILED ATTEMPT COUNTER
        loginAttemptCountRef.current += 1;
      }
    } catch (error) {
      console.error("❌ LOGIN EXCEPTION:", error);

      if (error.name === "AbortError") {
        Alert.alert("Error", "Request timeout. Please try again");
      } else if (error instanceof TypeError) {
        Alert.alert("Error", "Network error. Please check your connection");
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* LOGO */}
        <Text style={styles.logo}>VisionWorldMart</Text>
        <Text style={styles.subtitle}>B2B Marketplace Login</Text>

        {/* EMAIL / MOBILE */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email or Mobile Number *</Text>
          <TextInput
            placeholder="example@email.com or 9876543210"
            placeholderTextColor="#999"
            style={styles.input}
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            maxLength={100}
          />
          {errors.login && <Text style={styles.errorText}>{errors.login}</Text>}
        </View>

        {/* PASSWORD */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            maxLength={50}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* FORGOT PASSWORD LINK */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => router.push("/forgot-password")}
        >
          <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* SIGNUP LINK */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>New User?{"\n"}</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}>Create an account here</Text>
          </TouchableOpacity>
        </View>

        {/* SECURITY INFO */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityText}>
            🔒 Your data is encrypted and secure
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
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 6,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordLink: {
    color: "#0A3D62",
    fontSize: 13,
    fontWeight: "500",
  },
  loginBtn: {
    backgroundColor: "#0A3D62",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  signupText: {
    color: "#555",
    fontSize: 13,
  },
  signupLink: {
    color: "#0A3D62",
    fontSize: 13,
    fontWeight: "600",
  },
  securityInfo: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  securityText: {
    color: "#27ae60",
    fontSize: 12,
    fontWeight: "500",
  },
});
