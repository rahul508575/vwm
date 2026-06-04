import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function CompanyProfileScreen() {
  const [personal, setPersonal] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [completion, setCompletion] = useState(0);
  const safeJsonParse = (text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log("JSON ERROR:", text);
      return null;
    }
  };
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (!userData) return;

        const user = JSON.parse(userData);
        console.log("USER DATA:", user);

        // 🔥 COMPANY PROFILE (NOW USING company_id ✅)
        const res1 = await fetch(
          `https://api.visionworldmart.com/backend/api/profile/get-company-profile.php?company_id=${user.company_id}`,
        );

        const text1 = await res1.text();
        console.log("PROFILE RAW:", text1);

        const pData = safeJsonParse(text1);

        // 🔥 BUSINESS DETAILS (ALSO company_id ✅)
        const res2 = await fetch(
          `https://api.visionworldmart.com/backend/api/profile/get-business-details.php?company_id=${user.company_id}`,
        );

        const text2 = await res2.text();
        console.log("BUSINESS RAW:", text2);

        const bData = safeJsonParse(text2);

        // 🔥 SAFE SET
        if (pData?.status) setPersonal(pData.company || {});
        if (bData?.status) setBusiness(bData.company || {});

        // 🔥 COMPLETION CALCULATION
        if (pData?.status) {
          calculateCompletion(pData.company || {}, bData?.company || {});
        }
      } catch (error) {
        console.log("PROFILE ERROR:", error);
      }
    };

    loadProfile();
  }, []);

  const calculateCompletion = (p: any, b: any) => {
    let total = 7;
    let filled = 0;

    // Personal
    if (p.name) filled++;
    if (p.email) filled++;
    if (p.mobile) filled++;

    // Business
    if (p.company_name) filled++;
    if (b.gstin) filled++;
    if (b.pan) filled++;
    if (b.address) filled++;

    setCompletion(Math.round((filled / total) * 100));
  };

  if (!personal) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Company Profile</Text>

      {/* Profile Completion */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>Profile Completed</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completion}%` }]} />
        </View>

        <Text style={styles.percent}>{completion}%</Text>
      </View>

      {/* Personal Details */}
      <View style={[styles.card, styles.personalCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Personal Details</Text>
          <Text
            style={styles.edit}
            onPress={() => router.push("/profile/edit-personal-details")}
          >
            Edit »
          </Text>
        </View>

        <Text style={styles.cardText}>Name : {personal.name || "N/A"}</Text>
        <Text style={styles.cardText}>
          Mobile : {business.comp_mobile || "N/A"}
        </Text>
        <Text style={styles.cardText}>
          Email : {business.comp_email || "N/A"}
        </Text>
      </View>

      {/* Business Details */}
      <View style={[styles.card, styles.businessCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Business Details</Text>
          <Text
            style={styles.edit}
            onPress={() => router.push("/profile/edit-business-details")}
          >
            Edit »
          </Text>
        </View>

        <Text style={styles.cardText}>
          Company Name : {personal?.company_name || "N/A"}
        </Text>
        <Text style={styles.cardText}>
          GSTIN No : {business?.gstin || "N/A"}
        </Text>
        <Text style={styles.cardText}>PAN No : {business?.pan || "N/A"}</Text>
        <Text style={styles.cardText}>
          Address : {business?.comp_address || "N/A"}
        </Text>
      </View>

      {/* Mini Catalog */}
      <View style={styles.catalog}>
        <Text style={styles.catalogTitle}>Mini Catalog URL :</Text>
        <Text style={styles.catalogLink}>
          https://visionworldmart.com/
          {business?.company_name
            ? business.company_name.replace(/\s+/g, "-").toLowerCase()
            : "seller"}
        </Text>

        <View style={styles.shareRow}>
          <Text style={styles.shareText}>Share Your Catalog</Text>

          <View style={styles.icons}>
            <FontAwesome name="facebook-square" size={26} color="#1877F2" />
            <FontAwesome name="twitter-square" size={26} color="#000" />
            <FontAwesome name="whatsapp" size={26} color="#25D366" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F2F2F2",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
  },
  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#2E86DE",
  },
  percent: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  personalCard: {
    backgroundColor: "#6FB89B",
  },
  businessCard: {
    backgroundColor: "#7A9EC3",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  edit: {
    fontSize: 14,
    color: "#fff",
  },
  cardText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },
  catalog: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
  },
  catalogTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  catalogLink: {
    fontSize: 14,
    color: "#1E5FD8",
    marginBottom: 14,
  },
  shareRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shareText: {
    fontSize: 14,
    color: "#777",
  },
  icons: {
    flexDirection: "row",
    gap: 10,
  },
});
