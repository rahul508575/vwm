import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SitemapScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Sitemap</Text>
        <Text style={styles.subtitle}>
          Explore Vision World Mart B2B Marketplace
        </Text>
      </View>

      {/* GENERAL LINKS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Solutions</Text>

        <View style={styles.card}>
          <Text style={styles.item}>
            • Get confirmed buyers & dealers of agricultural, fashion,
            industrial and home supplies
          </Text>
          <Text style={styles.item}>
            • Find best manufacturers and suppliers of agricultural, fashion,
            industrial and home supplies
          </Text>
          <Text style={styles.item}>
            • Vision World Mart B2B Marketplace Solutions connecting businesses
            worldwide
          </Text>
          <Text style={styles.item}>
            • Purchase leads for profitable deals | Get buy leads for your
            business
          </Text>
          <Text style={styles.item}>
            • Find manufacturers, suppliers & dealers near you
          </Text>
          <Text style={styles.item}>
            • Trusted suppliers for your business profile
          </Text>
        </View>
      </View>

      {/* INDUSTRY CATEGORIES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Industry Categories</Text>

        <View style={styles.card}>
          <Text style={styles.link}>
            • Best Manufacturers and Suppliers of Agricultural Commodity
          </Text>
          <Text style={styles.link}>
            • Best Manufacturers and Suppliers of Electrical & Home Appliances
          </Text>
          <Text style={styles.link}>
            • Manufacturers and Suppliers of Apparel & Fashion
          </Text>
          <Text style={styles.link}>
            • Best Manufacturers and Suppliers of Industrial Machinery &
            Supplies
          </Text>
          <Text style={styles.link}>
            • Best Manufacturers and Suppliers of Home Furnishings & Furnitures
          </Text>
        </View>
      </View>

      {/* FOOTER NOTE */}
      <View style={[styles.card, styles.footerCard]}>
        <Text style={styles.footerText}>
          Vision World Mart helps buyers and sellers connect efficiently across
          industries. Our sitemap ensures easy navigation and quick access to
          the most searched business categories.
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
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0A3D62",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    elevation: 2,
  },

  item: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    marginBottom: 6,
  },

  link: {
    fontSize: 14,
    color: "#1E5FD8",
    lineHeight: 22,
    marginBottom: 6,
    fontWeight: "500",
  },

  footerCard: {
    backgroundColor: "#EAF2FF",
  },

  footerText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
