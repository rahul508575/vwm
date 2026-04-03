import { router } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const BLOGS = [
  {
    id: 1,
    title: "How B2B Platforms Help Small Businesses Grow",
    short_desc:
      "Learn how B2B marketplaces like Vision World Mart help manufacturers and suppliers expand faster.",
    image:
      "https://img.freepik.com/free-photo/business-people-meeting_53876-15178.jpg",
    category: "B2B Insights",
    date: "29 Jan 2026",
  },
  {
    id: 2,
    title: "Top Export Opportunities from India in 2026",
    short_desc:
      "Discover trending export products and international demand for Indian suppliers.",
    image:
      "https://img.freepik.com/free-photo/container-cargo-ship-sea_53876-14652.jpg",
    category: "Export",
    date: "25 Jan 2026",
  },
];

export default function BlogListScreen() {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/blogs/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.desc} numberOfLines={3}>
          {item.short_desc}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.readMore}>Read More →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={BLOGS}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<Text style={styles.heading}>Latest Blogs</Text>}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",

    height: 180,
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: "#F26522",
    fontWeight: "600",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  readMore: {
    fontSize: 14,
    color: "#1E5FD8",
    fontWeight: "600",
  },
});
