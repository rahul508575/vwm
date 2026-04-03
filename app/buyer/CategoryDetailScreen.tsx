import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function CategoryDetailScreen() {
  const { category_id } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.visionworldmart.com/backend/api/products/get-products-by-category.php?category_id=${category_id}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setProducts(json.products);
        }
      })
      .finally(() => setLoading(false));
  }, [category_id]);

  if (loading) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  if (products.length === 0) {
    return <Text style={{ padding: 20 }}>No products found</Text>;
  }

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

          <Text style={styles.membership}>{item.membership}</Text>
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
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
  },
  company: {
    fontWeight: "700",
    fontSize: 15,
    marginTop: 8,
    color: "#0A3D62",
  },
  name: {
    color: "#333",
    marginTop: 2,
  },
  price: {
    color: "#2E7D32",
    fontWeight: "600",
    marginTop: 4,
  },
  membership: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#D32F2F",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
});
