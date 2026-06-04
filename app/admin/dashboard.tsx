import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/admin/addEnquiry")}
      >
        <FontAwesome name="plus-circle" size={22} color="#0A3D62" />
        <Text style={styles.cardText}>Add Enquiry</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/admin/enquiries")}
      >
        <FontAwesome name="list" size={22} color="#0A3D62" />
        <Text style={styles.cardText}>View Enquiries</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0A3D62",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 18,
    borderRadius: 10,
    backgroundColor: "#F2F6FA",
    marginBottom: 15,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A3D62",
  },
});
