import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    ImageBackground,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API = "https://api.visionworldmart.com/backend/api/company-catalogue.php";

export default function CompanyDetailScreen() {
  const { company_id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [slider, setSlider] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [showFullProfile, setShowFullProfile] = useState(false);

  useEffect(() => {
    if (!company_id) return;

    fetch(`${API}?company_id=${company_id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setCompany(json.company);
          setSlider(json.slider || []);
          setProducts(json.products || []);
          setGallery(json.gallery || []);
        }
      })
      .catch((err) => console.log("API ERROR ❌", err))
      .finally(() => setLoading(false));
  }, [company_id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading company details...</Text>
      </View>
    );
  }

  if (!company) {
    return (
      <View style={styles.center}>
        <Text>Company not found</Text>
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
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 🔥 FULL WIDTH SLIDER */}
          {slider.length > 0 && (
            <FlatList
              data={slider}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.banner}
                  resizeMode="cover"
                >
                  <View style={styles.bannerOverlay}>
                    {!!item.title && (
                      <Text style={styles.bannerTitle}>{item.title}</Text>
                    )}
                    {!!item.desc && (
                      <Text style={styles.bannerDesc}>{item.desc}</Text>
                    )}
                  </View>
                </ImageBackground>
              )}
            />
          )}

          {/* 🏢 ABOUT COMPANY */}
          <View style={styles.aboutSection}>
            <Text style={styles.heading}>Welcome to {company.name}</Text>

            {!!company.profile && (
              <>
                <Text
                  style={styles.text}
                  numberOfLines={showFullProfile ? undefined : 6}
                >
                  {company.profile}
                </Text>

                {company.profile.length > 300 && (
                  <TouchableOpacity
                    onPress={() => setShowFullProfile(!showFullProfile)}
                  >
                    <Text style={styles.seeMore}>
                      {showFullProfile ? "See Less ▲" : "See More ▼"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* 📊 COMPANY INFO */}
          <View style={styles.stats}>
            {infoCard("Business Type", company.business_type, "industry")}
            {infoCard(
              "Established",
              company.year_of_establish,
              "calendar-today",
            )}
            {infoCard("GST No", company.gst, "badge")}
            {infoCard("Employees", company.employees, "groups")}
            {infoCard("Turnover", company.turnover, "payments")}
            {infoCard("Market", company.market, "public")}
          </View>

          {/* 📦 PRODUCTS */}
          {products.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Products</Text>
              <FlatList
                horizontal
                data={products}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.productCard}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.productImg}
                    />
                    <Text style={styles.productName}>{item.name}</Text>
                  </View>
                )}
              />
            </View>
          )}

          {/* 🖼 GALLERY */}
          {gallery.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photo Gallery</Text>
              <View style={styles.gallery}>
                {gallery.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={styles.galleryImg}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* 📞 CTA */}
        <View style={styles.cta}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:+91 7838362273`)}
          >
            <Text style={styles.callText}>📞 Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.enquiryBtn}>
            <Text style={styles.enquiryText}>✉ Send Enquiry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* INFO CARD */
function infoCard(label: string, value: any, icon: any) {
  if (!value) return null;
  return (
    <View style={styles.infoCard}>
      <MaterialIcons name={icon} size={26} color="#0A3D62" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  banner: {
    width: "100%",
    height: 260,
    justifyContent: "flex-end",
  },
  bannerOverlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 16,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  bannerDesc: {
    color: "#eee",
    marginTop: 6,
    fontSize: 14,
  },

  aboutSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },
  seeMore: {
    marginTop: 6,
    color: "#0A3D62",
    fontWeight: "700",
  },

  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#F5F7FA",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  infoCard: {
    width: "50%",
    alignItems: "center",
    padding: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  infoValue: {
    fontWeight: "700",
    textAlign: "center",
  },

  section: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },

  productCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  productImg: {
    height: 120,
    width: "100%",
  },
  productName: {
    padding: 8,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  galleryImg: {
    width: "48%",
    height: 120,
    margin: "1%",
    borderRadius: 8,
  },

  cta: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  callBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0A3D62",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  enquiryBtn: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#0A3D62",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  callText: {
    color: "#0A3D62",
    fontWeight: "700",
  },
  enquiryText: {
    color: "#fff",
    fontWeight: "700",
  },
});
