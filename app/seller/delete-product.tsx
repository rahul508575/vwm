import { router, useLocalSearchParams } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DeleteProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleDelete = async () => {
    try {
      const res = await fetch(
        "https://api.visionworldmart.com/backend/api/seller/delete-product.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        },
      );

      const data = await res.json();

      if (data.status) {
        Alert.alert("Deleted", "Product deleted successfully", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Delete failed");
      }
    } catch (error) {
      Alert.alert("Error", "Server not responding");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Product</Text>

      <Text style={styles.warning}>
        Are you sure you want to delete this product?
      </Text>

      <Text style={styles.subText}>This action cannot be undone.</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#C0392B",
    textAlign: "center",
    marginBottom: 14,
  },
  warning: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 30,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0A3D62",
    padding: 14,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#C0392B",
    padding: 14,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#0A3D62",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
