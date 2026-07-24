import AppFooter from "@/components/AppFooter";
import SellerHeader from "@/components/SellerHeader";
import SideDrawer from "@/components/SideDrawer";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

  // ✅ SAFE JSON PARSE
  const safeJsonParse = (text: any) => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };

  // 🔥 MAIN DASHBOARD LOADER
  const loadDashboard = async () => {
    try {
      const stored = await AsyncStorage.getItem("userInfo");
      console.log("STORED USER:", stored);
      if (!stored) return;

      const u = JSON.parse(stored);

      // ================= USER =================
      try {
        const userRes = await fetch(
          "https://api.visionworldmart.com/backend/api/user/get-user.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: u.email }),
          },
        );

        const text = await userRes.text();
        const userJson = safeJsonParse(text);
        console.log("USER JSON: -------->", userJson);

        if (userJson?.status) {
          setName(userJson.name || "Seller");
        }
      } catch (err) {
        console.log("USER ERROR:", err);
      }

      // ================= STATS =================
      try {
        const statsRes = await fetch(
          `https://api.visionworldmart.com/backend/api/seller/dashboard-stats.php?seller_id=${u.id}`,
        );

        const text = await statsRes.text();
        const statsJson = safeJsonParse(text);
        console.log("STATS JSON: -------->", statsJson);

        if (statsJson?.status) {
          setProductCount(statsJson.products || 0);
          setInquiryCount(statsJson.inquiries || 0);
        }
      } catch (err) {
        console.log("STATS ERROR:", err);
      }

      // ================= UNREAD =================
      // 🐛 FIX: get-enquiries.php reads $_GET['company_id'], not
      // "seller_id" — the param key here was wrong (was sending
      // u.company_id's VALUE under a "seller_id" KEY), which is why
      // the backend always replied "company_id required".
      try {
        const countRes = await fetch(
          `https://api.visionworldmart.com/backend/api/seller/get-enquiries.php?company_id=${u.company_id}`,
        );

        const text = await countRes.text();
        const countJson = safeJsonParse(text);
        console.log("COUNT JSON: -------", countJson);

        // get-enquiries.php doesn't return a "status" field (see the
        // file itself) — it returns { enquiries, total, unread }
        // directly on success, so check for that shape instead.
        if (countJson && !countJson.error) {
          setUnreadCount(countJson.unread || 0);
          setInquiryCount(countJson.total || 0);
        }
      } catch (err) {
        console.log("COUNT ERROR:", err);
      }
    } catch (error) {
      console.log("DASHBOARD ERROR:", error);
    }
  };

  // 🔥 AUTO REFRESH (EVERY 5 SEC)
  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 100000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 SCREEN FOCUS REFRESH
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, []),
  );

  return (
    <View style={styles.root}>
      <SellerHeader onMenuPress={() => setOpen(true)} />

      {open && (
        <View style={styles.drawerWrapper}>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setOpen(false)}
          />
          <SideDrawer onClose={() => setOpen(false)} />
        </View>
      )}

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.welcome}>Welcome, {name || "Seller"}</Text>
              <Text style={styles.subText}>Manage your business</Text>
            </View>

            <TouchableOpacity
              style={styles.notification}
              onPress={() => router.push("/seller/inquiries")}
            >
              <FontAwesome name="bell" size={22} color="#0A3D62" />

              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <StatCard icon="cube" label="My Products" value={productCount} />

            <TouchableOpacity
              onPress={() => router.push("/seller/inquiries")}
              style={{ flex: 1 }}
            >
              <StatCard
                icon="envelope"
                label="Inquiries"
                value={inquiryCount}
              />
            </TouchableOpacity>
          </View>

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
        </View>
        <CompanyProfileScreen />
        <SellerAnalyticsScreen />
        <AppFooter />
      </ScrollView>
    </View>
  );
}

/* COMPONENTS */
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) => (
  <View style={styles.statCard}>
    <FontAwesome name={icon} size={22} color="#0A3D62" />
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionBtn = ({
  icon,
  text,
  onPress,
}: {
  icon: string;
  text: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <FontAwesome name={icon} size={16} color="#0A3D62" />
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

/* STYLES */
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
  cardRow: { flexDirection: "row", gap: 12, marginBottom: 25 },
  statCard: {
    flex: 1,
    backgroundColor: "#F2F6FA",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A3D62",
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
  actionText: { fontSize: 16, color: "#0A3D62" },
});
