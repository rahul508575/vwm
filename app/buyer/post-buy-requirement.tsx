import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostBuyRequirementScreen() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [preference, setPreference] = useState("all");

  const [name, setName] = useState("Varun");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const submitRequirement = async () => {
    if (!product || !mobile || !email) {
      Alert.alert("Required", "Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://api.visionworldmart.com/backend/api/buyer/submit-enquiry.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            comp_id: null,
            enquiry_name: name,
            enquiry_comp_name: "",
            enquiry_mobile: mobile,
            enquiry_email: email,
            enquiry_address: "",
            enquiry_subject: product,
            enquiry_detail: `Quantity: ${quantity} ${unit}\nPreference: ${preference}`,
            enquiry_source: "Mobile App",
            country_name: "India",
          }),
        },
      );

      const json = await res.json();

      if (json.status) {
        Alert.alert("Success", "Your requirement has been submitted");
        setProduct("");
        setQuantity("");
        setUnit("");
        setMobile("");
        setEmail("");
      } else {
        Alert.alert("Error", json.message || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Network Error", "Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={["#2C3E91", "#1AA6B7"]} style={styles.header}>
          <Text style={styles.headerText}>
            Just complete these simple steps.
          </Text>
          <Text style={styles.headerSub}>
            Get Instant quotes from Verified Suppliers
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.label}>Product / Service *</Text>
          <TextInput
            placeholder="Products / Services you are looking for"
            style={styles.input}
            value={product}
            onChangeText={setProduct}
          />

          <Text style={styles.label}>Quantity</Text>
          <View style={styles.row}>
            <TextInput
              placeholder="Quantity"
              style={[styles.input, styles.half]}
              value={quantity}
              onChangeText={setQuantity}
            />
            <TextInput
              placeholder="Unit"
              style={[styles.input, styles.half]}
              value={unit}
              onChangeText={setUnit}
            />
          </View>

          <Text style={styles.label}>Supplier Preference</Text>
          <View style={styles.radioRow}>
            {radio("All India", "all", preference, setPreference)}
            {radio("Near Me", "near", preference, setPreference)}
            {radio("Specific States", "state", preference, setPreference)}
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={submitRequirement}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? "Submitting..." : "Submit Requirement"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By clicking Submit Requirement, I accept the{" "}
            <Text style={styles.link}>T&C</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Your Contact Information</Text>

          <TextInput
            placeholder="Your Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Mobile Number"
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Email ID"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Helpers ---------- */

const radio = (label, value, selected, setSelected) => (
  <TouchableOpacity style={styles.radioItem} onPress={() => setSelected(value)}>
    <View
      style={[styles.radioOuter, selected === value && styles.radioOuterActive]}
    >
      {selected === value && <View style={styles.radioInner} />}
    </View>
    <Text>{label}</Text>
  </TouchableOpacity>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F4F4" },

  header: { padding: 24, alignItems: "center" },
  headerText: { color: "#fff", fontSize: 22, fontWeight: "600" },
  headerSub: { color: "#EAF6FF", marginTop: 6, textAlign: "center" },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 10,
    padding: 16,
  },

  label: { fontWeight: "600", marginBottom: 6, marginTop: 12 },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },
  half: { width: "48%" },

  radioRow: { flexDirection: "row", justifyContent: "space-between" },
  radioItem: { flexDirection: "row", alignItems: "center" },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: "#0A3D62" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0A3D62",
  },

  submitBtn: {
    backgroundColor: "#F26522",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  terms: { fontSize: 12, color: "#777", marginTop: 12, textAlign: "center" },
  link: { color: "#0A3D62", textDecorationLine: "underline" },

  contactCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 10,
    padding: 16,
  },
  contactTitle: { fontWeight: "700", fontSize: 16, marginBottom: 10 },
});
