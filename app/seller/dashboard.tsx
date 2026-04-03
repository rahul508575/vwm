import SellerHeader from "@/components/SellerHeader";
import SideDrawer from "@/components/SideDrawer";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CompanyProfileScreen from "../profile/company-profile";
import SellerAnalyticsScreen from "./analytics";

export default function SellerDashboard() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const stored = await AsyncStorage.getItem("user");
      if (!stored) return;

      const u = JSON.parse(stored);
      setUser(u);

      // 🔹 User Name
      const userRes = await fetch(
        "https://api.visionworldmart.com/backend/api/user/get-user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: u.email }),
        },
      );
      const userJson = await userRes.json();
      if (userJson.status) setName(userJson.name);

      // 🔹 Stats
      const statsRes = await fetch(
        `https://api.visionworldmart.com/backend/api/seller/dashboard-stats.php?seller_id=${u.id}`,
      );
      const stats = await statsRes.json();
      if (stats.status) {
        setProductCount(stats.products || 0);
        setInquiryCount(stats.inquiries || 0);
      }

      // 🔔 Unread enquiry count
      const countRes = await fetch(
        `https://api.visionworldmart.com/backend/api/seller/enquiry-count.php?seller_id=${u.id}`,
      );
      const countJson = await countRes.json();
      if (countJson.status) setUnreadCount(countJson.unread || 0);
    };

    loadDashboard();
  }, []);

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <SellerHeader onMenuPress={() => setOpen(true)} />

      {/* DRAWER */}
      {open && (
        <View style={styles.drawerWrapper}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setOpen(false)}
          />
          <SideDrawer onClose={() => setOpen(false)} />
        </View>
      )}

      {/* CONTENT */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Row */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcome}>Welcome, {name || "Seller"}</Text>
            <Text style={styles.subText}>Manage your business</Text>
          </View>

          {/* Notification */}
          <TouchableOpacity
            onPress={() => router.push("/seller/inquiries")}
            style={styles.notification}
          >
            <FontAwesome name="bell" size={22} color="#0A3D62" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.cardRow}>
          <StatCard icon="cube" label="My Products" value={productCount} />
          <StatCard icon="envelope" label="Inquiries" value={inquiryCount} />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <ActionBtn
            icon="plus"
            text="Add New Product"
            onPress={() => router.push("/seller/add-product")}
          />
          <ActionBtn
            icon="archive"
            text="My Products"
            onPress={() => router.push("/seller/my-products")}
          />
          <ActionBtn
            icon="comments"
            text="Buyer Inquiries"
            onPress={() => router.push("/seller/inquiries")}
          />
        </View>

        <CompanyProfileScreen />
        <SellerAnalyticsScreen />
      </ScrollView>

      {/* Footer */}
      <View style={styles.copy}>
        <Text style={styles.copyText}>© 1997–2026 Vision World Mart</Text>
        <Text style={styles.copyText}>Privacy Policy · Terms & Conditions</Text>
      </View>
    </View>
  );
}

/* 🔹 Reusable Components */

const StatCard = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    <FontAwesome name={icon} size={22} color="#0A3D62" />
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionBtn = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <FontAwesome name={icon} size={16} color="#0A3D62" />
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

/* 🔹 Styles */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  drawerWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
  },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },

  container: { flex: 1, padding: 20 },

  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  welcome: { fontSize: 24, fontWeight: "700", color: "#0A3D62" },
  subText: { color: "#555", marginTop: 4 },

  notification: { position: "relative", padding: 6 },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  badgeText: { color: "#fff", fontSize: 12 },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#F2F6FA",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A3D62",
    marginTop: 6,
  },
  statLabel: { color: "#555", marginTop: 4 },

  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0A3D62",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  actionText: { fontSize: 16, color: "#0A3D62", fontWeight: "500" },

  copy: { backgroundColor: "#F5F5F5", padding: 12 },
  copyText: { textAlign: "center", fontSize: 12, color: "#555" },
});
