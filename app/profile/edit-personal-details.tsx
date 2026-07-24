import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function EditPersonalDetailsScreen() {
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  // 🔹 Load current user data
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) return;

      const user = JSON.parse(userData);
      setUserId(user.id);
      setName(user.name || "");
      setMobile(user.mobile || "");
      setEmail(user.email || "");
    };

    loadUser();
  }, []);

  // 🔹 Save changes
  const handleSave = async () => {
    if (!name || !mobile || !email) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const res = await fetch(
        "https://api.visionworldmart.com/backend/api/profile/update-personal-details.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: userId,
            name,
            mobile,
            email,
          }),
        },
      );

      const data = await res.json();

      if (data.status) {
        // 🔹 Update AsyncStorage also
        const updatedUser = {
          id: userId,
          name,
          mobile,
          email,
        };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        Alert.alert("Success", "Profile updated successfully");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (err) {
      console.log("UPDATE PROFILE ERROR 👉", err);
      Alert.alert("Error", "Server not responding");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Edit Personal Details</Text>

      {/* Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter full name"
      />

      {/* Mobile */}
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        placeholder="Enter mobile number"
      />

      {/* Email */}
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Enter email"
      />

      {/* Save */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#0A3D62",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: "#0A3D62",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancel: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 14,
    color: "#0A3D62",
  },
});
