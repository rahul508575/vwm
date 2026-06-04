import AppFooter from "@/components/AppFooter";
import GlobalSearchBar from "@/components/GlobalSearchBar";
import ImageCarousel from "@/components/ImageCarousel";
import SellerHeader from "@/components/SellerHeader";
import SideDrawer from "@/components/SideDrawer";
import Testimonials from "@/components/Testimonials";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
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
import BlogListScreen from "./BlogListScreen";
import FindSuppliersByRegion from "./FindSuppliersByRegion";

const API_URL =
  "https://api.visionworldmart.com/backend/api/category/browse-categories.php";
const trendingProducts = [
  {
    id: 1,
    name: "Agricultural Commodity",
    icon: <MaterialIcons name="agriculture" size={44} color="#0A3D62" />,
  },
  {
    id: 2,
    name: "Electrical & Home Appliance",
    icon: (
      <MaterialIcons name="electrical-services" size={44} color="#0A3D62" />
    ),
  },
  {
    id: 3,
    name: "Apparel & Fashion",
    icon: <Ionicons name="shirt" size={44} color="#0A3D62" />,
  },
  {
    id: 4,
    name: "Industrial Machinery & Supplies",
    icon: (
      <MaterialCommunityIcons name="state-machine" size={44} color="#0A3D62" />
    ),
  },
  {
    id: 5,
    name: "Home Furnishings & Furnitures",
    icon: (
      <MaterialCommunityIcons
        name="table-furniture"
        size={44}
        color="#0A3D62"
      />
    ),
  },
  {
    id: 6,
    name: "Health Beauty Care",
    icon: <MaterialIcons name="health-and-safety" size={44} color="#0A3D62" />,
  },
];

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(API_URL);

        const text = await res.text();

        if (!text) {
          console.log("Empty response from API");
          return;
        }

        const json = JSON.parse(text);

        if (json?.status) {
          setCategories(json.categories || []);
        }
      } catch (error) {
        console.log("API Error:", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SellerHeader onMenuPress={() => setOpen(true)} />
      <GlobalSearchBar
        onSearch={(type: string, keyword: string) => {
          router.push(`/buyer/search-results?type=${type}&q=${keyword}`);
        }}
      />

      {open && (
        <View style={styles.drawerWrapper}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setOpen(false)}
          />
          <SideDrawer onClose={() => setOpen(false)} />
        </View>
      )}

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ImageCarousel />
            <View style={styles.container}>
              <Text style={styles.trendingTitle}>Browse by Categories</Text>

              <FlatList
                horizontal
                data={trendingProducts}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.trendingCard}>
                    <View style={styles.iconWrapper}>{item.icon}</View>
                    <Text style={styles.trendingText}>{item.name}</Text>
                  </View>
                )}
              />
            </View>
          </>
        }
        renderItem={({ item: cat }) => (
          <View style={styles.container}>
            {/* SECTION HEADER */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{cat.name}</Text>
              <Text
                style={styles.viewAll}
                onPress={() => router.push(`/buyer/CategoryViewAll/${cat.id}`)}
              >
                View All →
              </Text>
            </View>

            {/* SUB CATEGORIES */}
            <FlatList
              horizontal
              data={cat.subcategories.slice(0, 4)}
              keyExtractor={(i) => i.category_id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.trendingCard}
                  onPress={() =>
                    router.push(
                      `/buyer/CategoryDetailScreen/${item.category_id}`,
                    )
                  }
                >
                  <Image
                    source={{
                      uri:
                        item.image ||
                        cat.image ||
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                    }}
                    style={styles.trendingImage}
                    onError={(e) =>
                      console.log("IMAGE ERROR ❌", e.nativeEvent)
                    }
                  />
                  <Text style={styles.trendingText}>{item.category_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        ListFooterComponent={
          <>
            <FindSuppliersByRegion />
            <Testimonials />
            {/* ✅ BlogListScreen allowed here */}
            <View style={{ padding: 16 }}>
              <BlogListScreen />
            </View>

            <View style={styles.content}>
              <Text style={styles.contentText}>
                Vision World Mart is a trusted B2B marketplace connecting buyers
                and sellers across industries with verified suppliers.
              </Text>
            </View>
            <AppFooter />
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewAll: {
    color: "#1E5FD8",
    fontSize: 14,
  },
  categoryCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#fff",
  },
  icon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    textAlign: "center",
    color: "#333",
  },
  trendingTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 14,
  },
  trendingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trendingCard: {
    width: 120, // ✅ FIXED width for horizontal list
    marginRight: 12, // spacing between cards
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  trendingImage: {
    width: 120,
    height: 120,
  },
  trendingText: {
    color: "#707070",
    padding: 10,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  left: {
    flex: 1,
    paddingRight: 10,
  },
  rightImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  accordionItem: {
    fontSize: 14,
    color: "#1E5FD8",
    marginBottom: 8,
  },

  accordion: {
    borderWidth: 1,
    borderColor: "#D6E4FF",
    borderRadius: 10,
    marginBottom: 12,
    marginTop: 12,
    backgroundColor: "#F5FAFF",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 14,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0A3D62",
  },
  accordionContent: {
    // flexDirection: "row",
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  //   accordionItem: {
  //     fontSize: 14,
  //     color: "#1E5FD8",
  //     paddingVertical: 6,
  //   },
  accordionHeaderText: {
    padding: 14,
    fontSize: 15,
    fontWeight: "600",
    color: "#0A3D62",
  },
  /* Drawer overlay */
  drawerWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    elevation: 2,
    margin: 14,
  },
  contentText: {
    textAlign: "justify",
    fontSize: 16,
  },
  iconWrapper: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FAFF",
  },
});
