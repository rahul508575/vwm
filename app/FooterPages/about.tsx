import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutUsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>About Vision World Mart</Text>
          <Text style={styles.subtitle}>
            B2B Marketplace Solutions Connecting Businesses Worldwide
          </Text>
        </View>

        {/* INTRO */}
        <View style={styles.card}>
          <Text style={styles.paragraph}>
            Vision World Mart B2B Marketplace Solutions specializes in providing
            comprehensive and innovative B2B marketplace solutions that connect
            businesses worldwide. As a leading provider in the industry, we
            empower companies to expand their reach, enhance growth, and thrive
            in the ever-evolving digital economy.
          </Text>
        </View>

        {/* MISSION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Our Mission</Text>
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              Our mission is to revolutionize the way businesses operate by
              offering a dynamic B2B marketplace platform that streamlines
              procurement, promotes global trade, and enables efficient
              connections between buyers and sellers.
            </Text>
          </View>
        </View>

        {/* SERVICES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠 Services & Solutions</Text>

          {SERVICES.map((item, index) => (
            <View key={index} style={styles.listCard}>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.paragraph}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* WHY CHOOSE US */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Why Choose Us</Text>

          {WHY_CHOOSE_US.map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* FOOTER NOTE */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            Vision World Mart is your trusted partner for discovering verified
            manufacturers, suppliers, and buyers across multiple industries.
            Register today and experience smarter B2B trade.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------- DATA -------- */

const SERVICES = [
  {
    title: "B2B Marketplace Platform",
    desc: "A feature-rich and customizable platform enabling businesses to discover opportunities, connect with partners, and trade securely.",
  },
  {
    title: "Supplier & Buyer Network",
    desc: "Access a vast and diverse network of verified suppliers and buyers across industries and geographies.",
  },
  {
    title: "Secure Transactions",
    desc: "Robust security measures including encrypted data transmission and secure payment gateways.",
  },
  {
    title: "Data Insights & Analytics",
    desc: "Advanced analytics and reporting tools to help businesses make informed decisions.",
  },
  {
    title: "Customization & Integration",
    desc: "Tailor the platform to your needs with seamless ERP and CRM integrations.",
  },
];

const WHY_CHOOSE_US = [
  "Extensive industry experience and expertise",
  "Global reach with verified buyers and suppliers",
  "Advanced technology and AI-powered search",
  "Customer-centric support and assistance",
  "Scalable solutions for growing businesses",
];

/* -------- STYLES -------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    padding: 16,
  },

  header: {
    marginBottom: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    textAlign: "center",
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    elevation: 2,
  },

  listCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    elevation: 1,
    marginBottom: 12,
  },

  listTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E5FD8",
    marginBottom: 6,
  },

  paragraph: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  bullet: {
    fontSize: 20,
    marginRight: 6,
    color: "#1E5FD8",
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },

  footerCard: {
    marginTop: 30,
    backgroundColor: "#0A3D62",
    padding: 16,
    borderRadius: 10,
  },

  footerText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
});
