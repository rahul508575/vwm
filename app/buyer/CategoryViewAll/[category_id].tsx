import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const API_URL =
  "https://api.visionworldmart.com/backend/api/category/browse-categories.php";

export default function CategoryViewAllScreen() {
  const { category_id } = useLocalSearchParams();
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          const found = json.categories.find(
            (c: any) => c.id.toString() === category_id,
          );
          setCategory(found);
        }
      });
  }, [category_id]);

  if (!category) return null;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        {/* HEADER */}
        <Text style={styles.title}>{category.name}</Text>

        {/* GRID */}
        <FlatList
          data={category.subcategories}
          keyExtractor={(item) => item.category_id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push(`/buyer/CategoryDetailScreen/${item.category_id}`)
              }
            >
              <Image
                source={{
                  uri:
                    item.image ||
                    category.image ||
                    "https://via.placeholder.com/150",
                }}
                style={styles.image}
              />
              <Text style={styles.text}>{item.category_name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 14,
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 14,
    overflow: "hidden",
  },

  image: {
    width: "100%",

    height: 120,
  },

  text: {
    padding: 10,
    textAlign: "center",
    color: "#1E5FD8",
    fontWeight: "500",
  },
});
