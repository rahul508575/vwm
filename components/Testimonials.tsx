import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const API_URL =
  "https://api.visionworldmart.com/backend/api/testimonial/testimonials.php";

export default function Testimonials() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        if (json.status) setData(json.data);
      });
  }, []);
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* Avatar */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>
            {item.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      {/* Content */}
      <Text style={styles.message}>"{item.message}"</Text>

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.company}>{item.company}</Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>What Our Clients Say</Text>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    paddingLeft: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
  },
  card: {
    width: 260,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginRight: 14,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 12,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A3D62",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  message: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
    fontStyle: "italic",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A3D62",
  },
  company: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
});
