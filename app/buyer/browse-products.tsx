import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BrowseProductsScreen() {
  const [categories, setCategories] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.visionworldmart.com/backend/api/category/browse-categories.php",
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.status) setCategories(json.categories);
      });
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const renderCategory = ({ item }) => {
    const isExpanded = expandedIds.includes(item.id);

    const subs = isExpanded
      ? item.subcategories
      : item.subcategories.slice(0, 4);

    return (
      <View style={styles.card}>
        {/* Title */}

        <Text style={styles.title}>
          {item.name}
          <Text style={styles.count}> - {item.subcategories.length} Items</Text>
        </Text>

        {/* Content Row */}
        <View style={styles.row}>
          {/* Image */}
          <Image
            source={{
              uri: item.image || "https://via.placeholder.com/100",
            }}
            style={styles.image}
          />

          {/* Sub categories */}
          <View style={styles.subList}>
            {subs.map((sub) => (
              <TouchableOpacity
                key={sub.category_id}
                style={styles.subRow}
                onPress={() =>
                  router.push(`/buyer/CategoryDetailScreen/${sub.category_id}`)
                }
              >
                <Text style={styles.subText}>{sub.category_name}</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}

            {item.subcategories.length > 4 && (
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <Text style={styles.viewAll}>
                  {isExpanded ? "View Less ↑" : "View All →"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={{ padding: 14, marginBottom: 5, elevation: 3 }}>
        <Text
          style={{
            color: "#000",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          Grow Your Business with Verified Buyers & Sellers
        </Text>
        <Text style={{ color: "#7e7e7e" }}>
          Connect with trusted buyers and verified sellers across India.
          Discover genuine business opportunities, expand your network, and grow
          your business faster on a secure B2B platform.
        </Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },

  count: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
  },

  row: {
    flexDirection: "row",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#eee",
  },

  subList: {
    flex: 1,
    marginLeft: 12,
  },

  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  subText: {
    color: "#1E5FD8",
    fontSize: 15,
  },

  arrow: {
    color: "#999",
    fontSize: 18,
  },

  viewAll: {
    marginTop: 8,
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
  },
});
