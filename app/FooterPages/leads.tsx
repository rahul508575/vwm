import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const LEADS = [
  {
    id: 1,
    product: "Lotus Flower Pinny",
    location: "India",
    quantity: "2 Barrel",
    status: "Active",
  },
  {
    id: 2,
    product: "MOZZ Flower",
    location: "India",
    quantity: "80 Foot",
    status: "Active",
  },
  {
    id: 3,
    product: "Basmati Rice",
    location: "Russia",
    quantity: "150 Tons",
    status: "Active",
  },
];

export default function BuyLeadsScreen() {
  const renderRow = ({ item }: any) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.product]}>{item.product}</Text>
      <Text style={styles.cell}>{item.location}</Text>
      <Text style={styles.cell}>{item.quantity}</Text>
      <Text style={[styles.cell, styles.status]}>{item.status}</Text>
      <TouchableOpacity style={styles.actionBtn}>
        <Text style={styles.actionText}>Join Deal</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Latest Buy Leads</Text>

      {/* Horizontal scroll for table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* TABLE HEADER */}
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.product]}>
              Product Name
            </Text>
            <Text style={styles.headerCell}>Location</Text>
            <Text style={styles.headerCell}>Quantity</Text>
            <Text style={styles.headerCell}>Status</Text>
            <Text style={styles.headerCell}>Action</Text>
          </View>

          {/* TABLE BODY */}
          <FlatList
            data={LEADS}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRow}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    padding: 16,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
    color: "#0A3D62",
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#1E5FD8",
    paddingVertical: 12,
  },

  headerCell: {
    width: 140,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    alignItems: "center",
  },

  cell: {
    width: 140,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 6,
  },

  product: {
    width: 200,
    textAlign: "left",
    paddingLeft: 12,
    fontWeight: "600",
    color: "#0A3D62",
  },

  status: {
    color: "#2E7D32",
    fontWeight: "600",
  },

  actionBtn: {
    width: 120,
    marginHorizontal: 10,
    backgroundColor: "#E53935",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
