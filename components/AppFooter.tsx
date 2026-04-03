import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AppFooter() {
  const [open, setOpen] = useState<string | null>("quick");

  const Section = ({ title, sectionKey, children }: any) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setOpen(open === sectionKey ? null : sectionKey)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons
          name={open === sectionKey ? "chevron-up" : "chevron-down"}
          size={18}
          color="#fff"
        />
      </TouchableOpacity>

      {open === sectionKey && (
        <View style={styles.sectionBody}>{children}</View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* OUR SERVICES */}
      <Section title="OUR SERVICES" sectionKey="services">
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/seller/advertise-with-us");
          }}
        >
          Advertise with us
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/seller/advertise-with-us");
          }}
        >
          Membership Plan
        </Text>
      </Section>

      {/* BUYERS */}
      <Section title="BUYERS" sectionKey="buyers">
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/buyer/post-buy-requirement");
          }}
        >
          Post Buy Requirement
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/buyer/browse-products");
          }}
        >
          Browse Products
        </Text>
      </Section>

      {/* SELLERS */}
      <Section title="BUSINESS DIRECTORY" sectionKey="business">
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/FooterPages/industries");
          }}
        >
          Browse Categories
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/FooterPages/MakePayment");
          }}
        >
          Make Payments
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/FooterPages/leads");
          }}
        >
          Find Buy Leads
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/FooterPages/sitemap");
          }}
        >
          Sitemap
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/buyer/browse-products");
          }}
        >
          Find Supplier
        </Text>
      </Section>

      <Section title="PAN INDIA SERVE" sectionKey="pan">
        <Text style={styles.link}>New Delhi</Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/buyer/state-companies/Maharashtra");
          }}
        >
          Maharastra
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/buyer/state-companies/Uttar Pradesh");
          }}
        >
          Uttar Pradesh
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/buyer/state-companies/Gujrat");
          }}
        >
          Gujrat
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/buyer/state-companies/Haryana");
          }}
        >
          Haryana
        </Text>
        <Text
          style={styles.link}
          onPress={() => {
            router.push("/buyer/state-companies/Madhya Pradesh");
          }}
        >
          Madhya Pradesh
        </Text>
      </Section>

      {/* QUICK LINKS */}
      <Section title="QUICK LINKS" sectionKey="quick">
        <View style={styles.quickRow}>
          <View>
            <Text
              style={styles.link}
              onPress={() => {
                router.push("/FooterPages/about");
              }}
            >
              About Us
            </Text>
            <Text style={styles.link}>Jobs & Careers</Text>
            <Text style={styles.link}>Feedback</Text>
            <Text style={styles.link}>Testimonials</Text>
            <Text style={styles.link}>Sitemap</Text>
          </View>

          <View>
            <Text style={styles.link}>Web Stories</Text>
            <Text
              style={styles.link}
              onPress={() => {
                router.push("/FooterPages/contact");
              }}
            >
              Contact Us
            </Text>
            <Text style={styles.link}>Complaint</Text>
            <Text style={styles.link}>Disclaimer</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeLive}>LIVE</Text>
              <Text style={styles.badgeText}>COVERAGE</Text>
            </View>
          </View>
        </View>
      </Section>

      {/* STORE BUTTONS */}
      <View style={styles.storeRow}>
        <Image
          source={{
            uri: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
          }}
          style={styles.storeBtn}
        />
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
          }}
          style={styles.storeBtn}
        />
      </View>

      {/* SOCIAL */}
      <Text style={styles.connect}>Connect with us</Text>
      <View style={styles.socialRow}>
        <FontAwesome name="facebook" size={24} color="#1877F2" />
        <FontAwesome name="twitter" size={24} color="#fff" />
        <FontAwesome name="linkedin" size={24} color="#0A66C2" />
        <FontAwesome name="pinterest" size={24} color="#E60023" />
        <FontAwesome name="instagram" size={24} color="#E1306C" />
      </View>

      {/* COPYRIGHT */}
      <View style={styles.copy}>
        <Text style={styles.copyText}>
          Copyright © 1997-2026 Vision World Mart.
        </Text>
        <Text style={styles.copyText}>Privacy Policy · Terms & Conditions</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#162B4D",
    paddingBottom: 30,
  },
  section: {
    borderBottomWidth: 1,
    borderColor: "#243D63",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  sectionTitle: {
    color: "#FF9800",
    fontSize: 15,
    fontWeight: "600",
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  link: {
    color: "#D6E1F2",
    fontSize: 14,
    marginBottom: 10,
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    marginTop: 10,
  },
  badgeLive: {
    backgroundColor: "#E65100",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  badgeText: {
    backgroundColor: "#0A3D62",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  storeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 20,
  },
  storeBtn: {
    width: 150,
    height: 45,
    resizeMode: "contain",
  },
  connect: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  copy: {
    backgroundColor: "#F5F5F5",
    padding: 12,
  },
  copyText: {
    textAlign: "center",
    fontSize: 12,
    color: "#555",
  },
});
