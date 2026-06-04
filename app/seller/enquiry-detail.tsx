import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function EnquiryDetail() {
  const { item } = useLocalSearchParams();
  const itemString = Array.isArray(item) ? item[0] : item;
  const data = JSON.parse(itemString);

  const formatDate = (date) => {
    return new Date(date).toDateString();
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Product Header */}
      <View style={styles.headerCard}>
        <Text style={styles.product}>{data.product || "No Product"}</Text>
        <Text style={styles.date}>{formatDate(data.created_at)}</Text>
      </View>

      {/* 🔹 Customer Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{data.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{data.mobile}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Company</Text>
          <Text style={styles.value}>{data.company_name}</Text>
        </View>
      </View>

      {/* 🔹 Message */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Message</Text>
        <Text style={styles.message}>
          {data.message || "No message provided"}
        </Text>
      </View>

      {/* 🔹 Status */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Status</Text>

        <Text
          style={[
            styles.status,
            data.is_read == 0 ? styles.new : styles.replied,
          ]}
        >
          {data.is_read == 0 ? "New Enquiry" : "Replied"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },

  headerCard: {
    backgroundColor: "#0A3D62",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  product: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  date: {
    marginTop: 5,
    color: "#D6EAF8",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0A3D62",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    color: "#777",
    fontSize: 14,
  },

  value: {
    fontWeight: "600",
    color: "#333",
  },

  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  status: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "700",
  },

  new: {
    backgroundColor: "#FFE6E6",
    color: "#C0392B",
  },

  replied: {
    backgroundColor: "#E8F8F5",
    color: "#117A65",
  },
});
