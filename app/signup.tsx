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

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyId, setCompanyId] = useState(""); // optional
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // ✅ VALIDATION (company removed)
    if (!name || !emailOrMobile || !password || !confirmPassword) {
      Alert.alert("Error", "All required fields must be filled");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://api.visionworldmart.com/backend/api/auth/signup.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "signup",
            name: name,
            email: emailOrMobile,
            mobile: emailOrMobile,
            password: password,
            role: "seller",
            company_id: companyId || null, // ✅ optional
          }),
        },
      );

      const data = await res.json();
      console.log("SIGNUP RESPONSE:", data);

      if (data.status) {
        Alert.alert("Success", "Account created successfully");

        await AsyncStorage.setItem("user", JSON.stringify(data.user || {}));

        router.replace("/seller/dashboard");
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (error) {
      console.log("SIGNUP ERROR:", error);
      Alert.alert("Error", "Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.logo}>VisionWorldMart</Text>
        <Text style={styles.subtitle}>Create Your B2B Account</Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email or Mobile Number"
          style={styles.input}
          value={emailOrMobile}
          onChangeText={setEmailOrMobile}
        />

        <TextInput
          placeholder="Create Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* OPTIONAL COMPANY FIELD */}
        <TextInput
          placeholder="Company ID (Optional)"
          style={styles.input}
          value={companyId}
          onChangeText={setCompanyId}
        />

        <TouchableOpacity
          style={styles.signupBtn}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.links}>
          <Text style={styles.link}>By signing up, you agree to our</Text>
          <Text style={styles.terms}>Terms & Conditions</Text>

          <Text
            style={[styles.link, { marginTop: 12 }]}
            onPress={() => router.replace("/login")}
          >
            Already have an account? Login
          </Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
  },
  signupBtn: {
    backgroundColor: "#0A3D62",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
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
  },
  terms: {
    fontSize: 13,
    color: "#0A3D62",
    fontWeight: "600",
    marginTop: 4,
  },
});
