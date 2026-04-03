import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddProductScreen() {
  const [sellerId, setSellerId] = useState(null);

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [minQty, setMinQty] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // 🔹 Load logged-in seller
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setSellerId(user.id);
      }
    };
    loadUser();
  }, []);

  // 🔹 Submit product
  const handleSubmit = async () => {
    if (!productName || !category || !price) {
      Alert.alert("Error", "Product Name, Category and Price are required");
      return;
    }

    if (!sellerId) {
      Alert.alert("Error", "Seller not logged in");
      return;
    }

    if (!image) {
      Alert.alert("Error", "Please select product image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("seller_id", sellerId);
      formData.append("product_name", productName);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("min_order_qty", minQty);
      formData.append("description", description);

      formData.append("image", {
        uri: image.uri,
        name: "product.jpg",
        type: "image/jpeg",
      });

      const res = await fetch(
        "https://api.visionworldmart.com/backend/api/seller/add-product.php",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const text = await res.text();
      console.log("ADD PRODUCT RAW RESPONSE 👉", text);

      const data = JSON.parse(text);

      if (data.status) {
        Alert.alert("Success", "Product added successfully");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to add product");
      }
    } catch (error) {
      console.log("ADD PRODUCT ERROR 👉", error);
      Alert.alert("Error", "Server not responding");
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add New Product</Text>
        <Text style={styles.subtitle}>
          Fill product details to list on VisionWorldMart
        </Text>
      </View>

      {/* Product Name */}
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        placeholder="e.g. Fresh Tomato"
        style={styles.input}
        value={productName}
        onChangeText={setProductName}
      />

      {/* Category */}
      <Text style={styles.label}>Category</Text>
      <TextInput
        placeholder="e.g. Vegetables"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      {/* Price */}
      <Text style={styles.label}>Price</Text>
      <TextInput
        placeholder="e.g. ₹20 / Kg"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      />

      {/* Minimum Order Quantity */}
      <Text style={styles.label}>Minimum Order Quantity</Text>
      <TextInput
        placeholder="e.g. 100 Kg"
        style={styles.input}
        value={minQty}
        onChangeText={setMinQty}
      />

      {/* Product Description */}
      <Text style={styles.label}>Product Description</Text>
      <TextInput
        placeholder="Write product details, quality, packaging etc."
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
      />

      {/* Upload Image (UI only) */}
      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageText}>
          {image ? "✅ Image Selected" : "📷 Upload Product Image"}
        </Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Product</Text>
      </TouchableOpacity>

      {/* Back */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A3D62",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  imageBtn: {
    borderWidth: 1,
    borderColor: "#0A3D62",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 25,
  },
  imageText: {
    color: "#0A3D62",
    fontSize: 15,
    fontWeight: "500",
  },
  submitBtn: {
    backgroundColor: "#0A3D62",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  backText: {
    textAlign: "center",
    color: "#0A3D62",
    fontSize: 14,
  },
});
