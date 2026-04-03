// app/FooterPages/industries.tsx
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function IndustriesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Industries We Serve</Text>
        <Text style={styles.subtitle}>
          Connecting Businesses with Trusted Manufacturers & Suppliers
        </Text>
      </View>

      {/* INTRO */}
      <View style={styles.card}>
        <Text style={styles.paragraph}>
          In today’s global marketplace, finding the right manufacturers and
          suppliers is crucial for business success. Whether you are a startup
          or an established enterprise, supplier quality directly impacts your
          growth and customer trust.
        </Text>
      </View>

      {/* WHY CHOOSE US */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Our Portal?</Text>

        <View style={styles.card}>
          <Text style={styles.pointTitle}>🌍 Extensive Network</Text>
          <Text style={styles.paragraph}>
            Access a wide network of verified manufacturers and suppliers across
            multiple industries and regions.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.pointTitle}>✅ Quality Assurance</Text>
          <Text style={styles.paragraph}>
            We partner only with trusted suppliers known for quality,
            reliability, and industry compliance.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.pointTitle}>📦 Diverse Categories</Text>
          <Text style={styles.paragraph}>
            From electronics and textiles to machinery, chemicals, and raw
            materials — everything under one platform.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.pointTitle}>🔍 Smart Search & Filters</Text>
          <Text style={styles.paragraph}>
            Easily filter suppliers by industry, location, product type, and
            more to find the perfect match.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.pointTitle}>⭐ Verified Reviews</Text>
          <Text style={styles.paragraph}>
            Make informed decisions using genuine ratings and reviews from real
            buyers and businesses.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.pointTitle}>🔐 Secure Transactions</Text>
          <Text style={styles.paragraph}>
            Your data and payments are protected with secure systems for a safe
            procurement experience.
          </Text>
        </View>
      </View>

      {/* FOOTER MESSAGE */}
      <View style={[styles.card, styles.footerCard]}>
        <Text style={styles.footerText}>
          Finding the right suppliers is the foundation of business success.
          Vision World Mart simplifies this journey with trusted partners, smart
          tools, and a secure ecosystem.
        </Text>

        <Text style={styles.footerHighlight}>
          Register today and grow your business with confidence.
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },

  pointTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 6,
  },

  paragraph: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  footerCard: {
    marginTop: 10,
    backgroundColor: "#EAF2FF",
  },

  footerText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  footerHighlight: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#0A3D62",
  },
});
