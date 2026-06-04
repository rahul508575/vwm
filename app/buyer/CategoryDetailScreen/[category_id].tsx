import { ProductCard } from "@/components/ProductCard";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CategoryDetailScreen() {
  const { category_id } = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.visionworldmart.com/backend/api/products/by-category.php?category_id=${category_id}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.status) setProducts(json.products);
      })
      .finally(() => setLoading(false));
  }, [category_id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A3D62" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No products found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.heading}>Products ({products.length})</Text>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F2F6FA",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    fontSize: 16,
    color: "#666",
  },
});
