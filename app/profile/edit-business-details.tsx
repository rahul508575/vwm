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
  const [companyId, setCompanyId] = useState(null);

  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");

  // 🔥 SAFE JSON PARSE
  const safeJsonParse = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      console.log("JSON ERROR:", text);
      return null;
    }
  };

  // 🔹 LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userInfo");
        if (!userData) return;

        const user = JSON.parse(userData);

        if (!user?.company_id) {
          console.log("No company linked");
          return;
        }

        setCompanyId(user.company_id);

        const res = await fetch(
          `https://api.visionworldmart.com/backend/api/profile/get-business-details.php?company_id=${user.company_id}`,
        );

        const text = await res.text();
        console.log("BUSINESS RAW:", text);

        const data = safeJsonParse(text);

        // ✅ EXISTING DATA
        if (data?.status && data.business) {
          setCompanyName(data.business.company_name || "");
          setGstin(data.business.gstin || "");
          setPan(data.business.pan || "");
          setAddress(data.business.address || "");
        }
        // ❗ NEW USER → empty form (auto handled)
      } catch (err) {
        console.log("LOAD ERROR:", err);
      }
    };

    loadData();
  }, []);

  // 🔹 SAVE (INSERT + UPDATE)
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId, // ✅ FIXED
            company_name: companyName,
            gstin,
            pan,
            address,
          }),
        },
      );

      const text = await res.text();
      const data = safeJsonParse(text);

      console.log("SAVE RESPONSE:", data);

      if (data?.status) {
        Alert.alert("Success", "Business details saved");
        router.back();
      } else {
        Alert.alert("Error", data?.message || "Save failed");
      }
    } catch (err) {
      console.log("SAVE ERROR:", err);
      Alert.alert("Error", "Server not responding");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Edit Business Details</Text>

      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Enter company name"
      />

      <Text style={styles.label}>GSTIN Number</Text>
      <TextInput
        style={styles.input}
        value={gstin}
        onChangeText={setGstin}
        placeholder="Enter GSTIN number"
      />

      <Text style={styles.label}>PAN Number</Text>
      <TextInput
        style={styles.input}
        value={pan}
        onChangeText={setPan}
        placeholder="Enter PAN number"
      />

      <Text style={styles.label}>Business Address</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter full address"
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

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
