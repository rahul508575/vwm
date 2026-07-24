import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MyProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const userData = await AsyncStorage.getItem("userInfo");

      if (!userData) {
        console.log("❌ No user found");
        return;
      }

      const user = JSON.parse(userData);
      const sellerId = user.id; // 🔥 correct

      console.log("SELLER ID:", sellerId);

      const res = await fetch(
        `https://api.visionworldmart.com/backend/api/seller/my-products.php?seller_id=${sellerId}`,
      );

      const data = await res.json();
      console.log("PRODUCT API:", data);

      if (data.status) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loader
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A3D62" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Products</Text>
        <Text style={styles.subtitle}>Manage your listed products</Text>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#777" }}>
            No products added yet
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price}</Text>

              <Text style={[styles.status, { color: "green" }]}>
                {item.status}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  router.push({
                    pathname: "/seller/edit-product",
                    params: { id: item.id },
                  })
                }
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  router.push({
                    pathname: "/seller/delete-product",
                    params: { id: item.id },
                  })
                }
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Product */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/seller/add-product")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0A3D62" },
  subtitle: { fontSize: 14, color: "#555", marginTop: 4 },
  card: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "600", color: "#0A3D62" },
  price: { fontSize: 14, color: "#555", marginTop: 2 },
  status: { fontSize: 13, marginTop: 4, fontWeight: "600" },
  actions: { alignItems: "flex-end" },
  editBtn: {
    borderWidth: 1,
    borderColor: "#0A3D62",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  deleteBtn: {
    backgroundColor: "#FFE6E6",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionText: { color: "#0A3D62", fontSize: 13, fontWeight: "500" },
  deleteText: { color: "#C0392B", fontSize: 13, fontWeight: "500" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#0A3D62",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  fabText: { color: "#ffffff", fontSize: 28, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
