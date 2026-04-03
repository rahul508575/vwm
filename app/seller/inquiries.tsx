import { FlatList, StyleSheet, Text, View } from "react-native";

const DUMMY_ENQUIRIES = [
  {
    id: "1",
    product: "Agriculture Seeds",
    supplier: "Green Agro Pvt Ltd",
    message: "Need bulk supply for export",
    date: "22 Jan 2026",
    status: "Replied",
  },
  {
    id: "2",
    product: "Electrical Wires",
    supplier: "Sharma Electricals",
    message: "Looking for price & MOQ",
    date: "20 Jan 2026",
    status: "New",
  },
  {
    id: "3",
    product: "Organic Fertilizer",
    supplier: "FarmCare India",
    message: "Please share brochure",
    date: "18 Jan 2026",
    status: "Closed",
  },
];

export default function BuyerEnquiriesScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.rowBetween}>
        <Text style={styles.product}>{item.product}</Text>
        <Text
          style={[
            styles.status,
            item.status === "Replied" && styles.replied,
            item.status === "New" && styles.new,
            item.status === "Closed" && styles.closed,
          ]}
        >
          {item.status}
        </Text>
      </View>

      {/* Supplier */}
      <Text style={styles.supplier}>
        Supplier: <Text style={styles.bold}>{item.supplier}</Text>
      </Text>

      {/* Message */}
      <Text style={styles.message}>"{item.message}"</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.view}>View Details →</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Enquiries</Text>
      <Text style={styles.subtitle}>Track responses from suppliers</Text>

      <FlatList
        data={DUMMY_ENQUIRIES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  product: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A3D62",
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },

  new: {
    backgroundColor: "#FFE6E6",
    color: "#C0392B",
  },

  replied: {
    backgroundColor: "#E8F8F5",
    color: "#117A65",
  },

  closed: {
    backgroundColor: "#ECECEC",
    color: "#555",
  },

  supplier: {
    marginTop: 6,
    color: "#444",
  },

  bold: {
    fontWeight: "600",
  },

  message: {
    marginTop: 8,
    fontStyle: "italic",
    color: "#333",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },

  date: {
    fontSize: 12,
    color: "#999",
  },

  view: {
    fontSize: 13,
    color: "#0A3D62",
    fontWeight: "600",
  },
});
