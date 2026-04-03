import { router } from "expo-router";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
const REGIONS = [
  {
    id: 1,
    city: "New Delhi",
    image:
      "https://cdn.iconscout.com/icon/free/png-256/free-india-gate-icon-svg-download-png-139357.png",
  },
  {
    id: 2,
    city: "Maharashtra",
    image:
      "https://thumbs.dreamstime.com/b/detailed-front-facing-view-magnificent-taj-mahal-palace-hotel-mumbai-historic-landmark-known-its-grand-399668789.jpg",
  },
  {
    id: 3,
    city: "Uttar Pradesh",
    image:
      "https://t4.ftcdn.net/jpg/13/41/43/65/360_F_1341436500_IREnmejivmHTW6VMUt8hPjnERUKOt1aF.jpg",
  },
  {
    id: 4,
    city: "Gujrat",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/001/511/259/small/indian-national-building-and-monument-icons-free-vector.jpg",
  },
  {
    id: 5,
    city: "Haryana",
    image:
      "https://w7.pngwing.com/pngs/576/197/png-transparent-mahabharata-krishna-kurukshetra-war-arjuna-driver-mode-of-transport-fictional-character-cartoon-thumbnail.png",
  },
  {
    id: 6,
    city: "Madhya Pradesh",
    image:
      "https://img.freepik.com/premium-vector/gwalior-fort-vector-illustration_549515-2043.jpg",
  },
  {
    id: 7,
    city: "Punjab",
    image:
      "https://www.shutterstock.com/image-vector/beautiful-vector-graphic-golden-temple-600nw-2659955829.jpg",
  },
  {
    id: 8,
    city: "West Bengal",
    image: "https://img.icons8.com/bubbles/1200/kolkata.jpg",
  },
];

export default function FindSuppliersByRegion() {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/buyer/state-companies/${item.city}`)}
    >
      <Image source={{ uri: item.image }} style={styles.icon} />
      <Text style={styles.city}>{item.city}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Find Suppliers by Region</Text>

      <FlatList
        horizontal
        data={REGIONS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    color: "#515151",
  },
  card: {
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },
  city: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
});
