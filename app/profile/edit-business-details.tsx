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

export default function EditBusinessDetailsScreen() {
  const [userId, setUserId] = useState<number | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");

  // 🔹 Load logged-in user + existing business details
  useEffect(() => {
    const loadData = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      setUserId(user.id);

      const res = await fetch(
        `https://api.visionworldmart.com/backend/api/profile/get-business-details.php?user_id=${user.id}`,
      );
      const data = await res.json();

      if (data.status) {
        setCompanyName(data.business.company_name || "");
        setGstin(data.business.gstin || "");
        setPan(data.business.pan || "");
        setAddress(data.business.address || "");
      }
    };

    loadData();
  }, []);

  // 🔹 Save business details
  const handleSave = async () => {
    if (!companyName) {
      Alert.alert("Error", "Company name is required");
      return;
    }

    try {
      const res = await fetch(
        "https://api.visionworldmart.com/backend/api/profile/update-business-details.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            company_name: companyName,
            gstin,
            pan,
            address,
          }),
        },
      );

      const data = await res.json();

      if (data.status) {
        Alert.alert("Success", "Business details updated");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (err) {
      console.log("BUSINESS UPDATE ERROR 👉", err);
      Alert.alert("Error", "Server not responding");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Edit Business Details</Text>

      {/* Company Name */}
      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Enter company name"
      />

      {/* GSTIN */}
      <Text style={styles.label}>GSTIN Number</Text>
      <TextInput
        style={styles.input}
        value={gstin}
        onChangeText={setGstin}
        placeholder="Enter GSTIN number"
      />

      {/* PAN */}
      <Text style={styles.label}>PAN Number</Text>
      <TextInput
        style={styles.input}
        value={pan}
        onChangeText={setPan}
        placeholder="Enter PAN number"
      />

      {/* Address */}
      <Text style={styles.label}>Business Address</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter full address"
        multiline
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
  textArea: {
    height: 110,
    textAlignVertical: "top",
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
