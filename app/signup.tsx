/**
 * 🔒 SECURE SIGNUP SCREEN
 * With full input validation, error handling, and security best practices
 * UPDATED: Using expo-secure-store (Expo Go compatible)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
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
import {
  checkPasswordStrength,
  validateSignupForm,
} from "../utils/validationHelpers";

// NOTE: this already points straight at signup.php — do NOT append
// "/auth/signup.php" again in the fetch call below (that was the bug).
const API_BASE_URL =
  "https://api.visionworldmart.com/backend/api/auth/signup.php";
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "15000");

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [errors, setErrors] = useState({});

  // ✅ VALIDATE PASSWORD STRENGTH
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length > 0) {
      const strength = checkPasswordStrength(text);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  };

  // ✅ HANDLE SIGNUP WITH FULL VALIDATION
  const handleSignup = async () => {
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
      const formData = {
        name,
        emailOrMobile,
        password,
        confirmPassword,
        companyName,
      };

      const validation = validateSignupForm(formData);
      if (!validation.valid) {
        Alert.alert("Validation Error", validation.message);
        return;
      }

      if (!companyName.trim()) {
        Alert.alert("Validation Error", "Company name is required");
        return;
      }

      // 4️⃣ CHECK PASSWORD STRENGTH
      if (passwordStrength && passwordStrength.score < 2) {
        Alert.alert(
          "Weak Password",
          "Please create a stronger password.\n\n" +
            passwordStrength.suggestions.join("\n"),
        );
        return;
      }

      setLoading(true);

      // 5️⃣ PREPARE SIGNUP DATA
      // company_id is no longer sent from the app — the backend
      // auto-generates it from the company_name the seller typed.
      const signupData = {
        type: "signup",
        name: name.trim(),
        email: emailOrMobile,
        mobile: emailOrMobile,
        password: password,
        role: "seller",
        company_name: companyName.trim(),
      };

      // 6️⃣ MAKE API CALL WITH TIMEOUT
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 7️⃣ VALIDATE RESPONSE STATUS
      if (!res.ok) {
        if (res.status === 400) {
          Alert.alert("Validation Error", "Invalid signup data");
        } else if (res.status === 409) {
          Alert.alert("Error", "Email or mobile already registered");
        } else if (res.status === 429) {
          Alert.alert("Error", "Too many signup attempts. Try again later");
        } else if (res.status >= 500) {
          Alert.alert("Error", "Server error. Please try again later");
        } else {
          Alert.alert("Error", `HTTP Error: ${res.status}`);
        }
        return;
      }

      // 8️⃣ PARSE & VALIDATE RESPONSE
      const data = await res.json();

      if (!data || typeof data.status === "undefined") {
        Alert.alert("Error", "Invalid server response");
        return;
      }

      if (data.status && data.user) {
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
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          company_id: data.user.company_id,
          company_name: data.user.company_name,
          createdAt: new Date().toISOString(),
          // ❌ DO NOT STORE PASSWORD
        };

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

        Alert.alert("Success", "Account created successfully");
        setTimeout(() => {
          router.replace("/seller/dashboard");
        }, 500);
      } else {
        Alert.alert("Error", data.message || "Signup failed. Please try again");
      }
    } catch (error) {
      console.error("❌ SIGNUP EXCEPTION:", error);

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

  // ✅ PASSWORD STRENGTH INDICATOR
  const getStrengthColor = () => {
    if (!passwordStrength) return "#ddd";
    switch (passwordStrength.strength) {
      case "weak":
        return "#e74c3c";
      case "fair":
        return "#f39c12";
      case "good":
        return "#3498db";
      case "strong":
        return "#27ae60";
      default:
        return "#ddd";
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.logo}>VisionWorldMart</Text>
        <Text style={styles.subtitle}>Create Your B2B Account</Text>

        {/* FULL NAME */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            style={styles.input}
            value={name}
            onChangeText={setName}
            maxLength={50}
            editable={!loading}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* EMAIL OR MOBILE */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email or Mobile Number *</Text>
          <TextInput
            placeholder="example@email.com or 9876543210"
            placeholderTextColor="#999"
            style={styles.input}
            value={emailOrMobile}
            onChangeText={setEmailOrMobile}
            autoCapitalize="none"
            keyboardType="email-address"
            maxLength={100}
            editable={!loading}
          />
          {errors.emailOrMobile && (
            <Text style={styles.errorText}>{errors.emailOrMobile}</Text>
          )}
        </View>

        {/* PASSWORD */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Create Password *</Text>
          <TextInput
            placeholder="Create a strong password"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={handlePasswordChange}
            maxLength={50}
            editable={!loading}
          />

          {/* PASSWORD STRENGTH INDICATOR */}
          {password.length > 0 && passwordStrength && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: getStrengthColor(),
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.strengthText, { color: getStrengthColor() }]}
              >
                {passwordStrength.strength.toUpperCase()}
              </Text>
              {passwordStrength.suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {passwordStrength.suggestions.map((suggestion, index) => (
                    <Text key={index} style={styles.suggestionText}>
                      • {suggestion}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* CONFIRM PASSWORD */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            placeholder="Re-enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            maxLength={50}
            editable={!loading}
          />
          {confirmPassword && password && confirmPassword !== password && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
        </View>

        {/* COMPANY NAME (REQUIRED) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Company / Business Name *</Text>
          <TextInput
            placeholder="e.g. Kumar Traders"
            placeholderTextColor="#999"
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
            maxLength={100}
            editable={!loading}
          />
          <Text style={styles.hintText}>
            We'll set up your company account automatically — no need to contact
            support.
          </Text>
        </View>

        {/* SIGNUP BUTTON */}
        <TouchableOpacity
          style={[styles.signupBtn, loading && styles.signupBtnDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.signupText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* TERMS & LOGIN LINK */}
        <View style={styles.links}>
          <Text style={styles.link}>
            By signing up, you agree to our{"\n"}
            <Text style={styles.terms}>Terms & Conditions</Text>
          </Text>

          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={[styles.link, { marginTop: 12 }]}>
              Already have an account?{"\n"}
              <Text style={styles.terms}>Login here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
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
  hintText: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
  },
  strengthContainer: {
    marginTop: 10,
  },
  strengthBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 6,
  },
  suggestionText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 6,
  },
  signupBtn: {
    backgroundColor: "#0A3D62",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  signupBtnDisabled: {
    opacity: 0.6,
  },
  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  links: {
    marginTop: 25,
    alignItems: "center",
  },
  link: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
  terms: {
    color: "#0A3D62",
    fontWeight: "600",
  },
});
