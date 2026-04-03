import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function BuyerCategoryDetailScreen() {
  const { category_id } = useLocalSearchParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.visionworldmart.com/backend/api/products/get-products-by-category.php?category_id=${category_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setProducts(data.products);
        }
      });
  }, []);

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />

          <Text style={styles.company}>{item.company_name}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>

          <Text style={styles.badge}>{item.membership}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  company: {
    fontWeight: "700",
    marginTop: 8,
  },
  name: {
    color: "#333",
  },
  price: {
    color: "#0A3D62",
    fontWeight: "600",
  },
  badge: {
    marginTop: 4,
    color: "#fff",
    backgroundColor: "red",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});
