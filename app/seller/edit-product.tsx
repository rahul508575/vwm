import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      const res = await fetch(
        `https://api.visionworldmart.com/backend/api/seller/get-product.php?id=${id}`,
      );
      const data = await res.json();

      if (data.status) {
        const p = data.product;
        setProductName(p.name);
        setCategory(p.category);
        setPrice(p.price);
        setMoq(p.moq);
        setDescription(p.description);
        setExistingImage(p.image);
      }
    };
    loadProduct();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("id", id);
    formData.append("product_name", productName);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("min_order_qty", moq);
    formData.append("description", description);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        name: "product.jpg",
        type: "image/jpeg",
      });
    }

    const res = await fetch(
      "https://api.visionworldmart.com/backend/api/seller/update-product.php",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (data.status) {
      Alert.alert("Success", "Product updated");
      router.back();
    } else {
      Alert.alert("Error", data.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

      <Image
        source={{ uri: image ? image.uri : existingImage }}
        style={styles.image}
      />

      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageText}>Change Image</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={productName}
        onChangeText={setProductName}
        placeholder="Product Name"
      />

      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
      />

      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Price"
      />

      <TextInput
        style={styles.input}
        value={moq}
        onChangeText={setMoq}
        placeholder="Minimum Order Qty"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
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
    marginBottom: 20,
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  imageBtn: {
    alignSelf: "center",
    marginBottom: 20,
  },
  imageText: {
    color: "#0A3D62",
    fontSize: 14,
    fontWeight: "600",
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
  saveBtn: {
    backgroundColor: "#0A3D62",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    textAlign: "center",
    color: "#0A3D62",
    fontSize: 14,
    marginTop: 14,
  },
});
