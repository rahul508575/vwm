import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BuyerEnquiriesScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      const stored = await AsyncStorage.getItem("user");

      if (!stored) return;

      const user = JSON.parse(stored);

      const res = await fetch(
        `https://api.visionworldmart.com/backend/api/seller/get-enquiries.php?seller_id=${user.company_id}`,
      );

      const json = await res.json();

      if (json.status) {
        setData(json.enquiries || []);
      }
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 MARK AS READ FUNCTION
  const markAsRead = async (id) => {
    try {
      await fetch(
        "https://api.visionworldmart.com/backend/api/seller/mark-enquiry-read.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        },
      );
    } catch (err) {
      console.log("READ ERROR:", err);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toDateString();
  };

  const renderItem = ({ item }) => {
    const status = item.is_read == 0 ? "New" : "Replied";

    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.product}>{item.product || "No Product"}</Text>

          <Text
            style={[
              styles.status,
              status === "Replied" && styles.replied,
              status === "New" && styles.new,
            ]}
          >
            {status}
          </Text>
        </View>

        <Text style={styles.supplier}>
          Supplier:
          <Text style={styles.bold}>{item.company_name || "N/A"}</Text>
        </Text>

        <Text style={styles.message}>"{item.message || "No message"}"</Text>

        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>

          <TouchableOpacity
            onPress={async () => {
              // 🔥 BACKEND UPDATE
              await markAsRead(item.id);

              // 🔥 INSTANT UI UPDATE
              setData((prev) =>
                prev.map((i) => (i.id === item.id ? { ...i, is_read: 1 } : i)),
              );

              // 🔥 NAVIGATE
              router.push({
                pathname: "/seller/enquiry-detail",
                params: { item: JSON.stringify(item) },
              });
            }}
          >
            <Text style={styles.view}>View Details →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A3D62" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Enquiries</Text>
      <Text style={styles.subtitle}>Track responses from suppliers</Text>

      {data.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          No enquiries found
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
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
  },

  new: {
    backgroundColor: "#FFE6E6",
    color: "#C0392B",
  },

  replied: {
    backgroundColor: "#E8F8F5",
    color: "#117A65",
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
