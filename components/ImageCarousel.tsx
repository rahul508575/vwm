import { useRef, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: require("../assets/banner2.png"),
    title: "Export Your Products",
    cta: "Start Selling",
  },
  {
    id: "2",
    image: require("../assets/banner4.png"),
    title: "Find Verified Suppliers",
    cta: "Explore Now",
  },
  {
    id: "3",
    image: require("../assets/banner3.png"),
    title: "India’s Growing B2B Platform",
    cta: "Join Free",
  },
];

export default function ImageCarousel() {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const slideIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(slideIndex);
        }}
        renderItem={({ item }) => (
          <View>
            {/* Background Image */}
            <Image
              source={
                typeof item.image === "string"
                  ? { uri: item.image }
                  : item.image
              }
              style={styles.image}
            />

            {/* 🔤 TEXT OVERLAY */}
            {/* <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>

              <TouchableOpacity style={styles.ctaBtn}>
                <Text style={styles.ctaText}>{item.cta}</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, index === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width,
    height: 250,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  ctaBtn: {
    backgroundColor: "#FF9800",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
  },
  ctaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    // marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
    position: "absolute",
    bottom: 10,
  },
  activeDot: {
    backgroundColor: "#0A3D62",
    width: 10,
  },
});
