import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PLANS = ["Gold", "Platinum", "PlatinumPro", "Exclusive"];

const PLAN_DATA: any = {
  Gold: {
    price: "₹ 18,000 /-",
    duration: "/ year",
    features: [
      ["Creating Customers New Website", "✔"],
      ["1 yr Domain + Hosting + Maintenance", "✔"],
      ["Vision Wrold Mart Listing", "✔"],
      ["Product Showcase on VWM Portal", "25"],
      ["Product Showcase on Website", "25"],
      ["SSL CERTIFIED Secure Website", "✖"],
      ["Website Admin Panel", "✖"],
      ["Access Business Inquiry contact", "04"],
      ["Regd. Old Buyer Database Access", "✖"],
      ["Verified Supplier (Trust Seal)", "✖"],
      ["Corporate Video of your Company", "✖"],
      ["Company E-Broucher Design", "✖"],
      ["Buyer Enquiry Alert through Email", "✔"],
      ["SEO & Website Promotion", "✖"],
      ["Language Convertor on Website", "✖"],
      ["Live Chat on Website", "✖"],
      ["Social Meida Profile Mangement", "✖"],
      ["12 Months Supports & Updates", "✔"],
    ],
  },

  Platinum: {
    price: "₹ 30,000 /-",
    duration: "/ year",
    features: [
      ["Creating Customers New Website", "✔"],
      ["1 yr Domain + Hosting + Maintenance", "✔"],
      ["Vision Wrold Mart Listing", "✔"],
      ["Product Showcase on VWM Portal", "50"],
      ["Product Showcase on Website", "50"],
      ["SSL CERTIFIED Secure Website", "✖"],
      ["Website Admin Panel", "✖"],
      ["Access Business Inquiry contact", "06"],
      ["Regd. Old Buyer Database Access", "✔"],
      ["Verified Supplier (Trust Seal)", "✖"],
      ["Corporate Video of your Company", "✖"],
      ["Company E-Broucher Design", "✖"],
      ["Buyer Enquiry Alert through Email", "✔"],
      ["SEO & Website Promotion", "✔"],
      ["Language Convertor on Website", "✖"],
      ["Live Chat on Website", "✖"],
      ["Social Meida Profile Mangement", "✔"],
      ["12 Months Supports & Updates", "✔"],
    ],
  },

  PlatinumPro: {
    price: "₹ 50,000",
    duration: "/ year",
    features: [
      ["Creating Customers New Website", "✔"],
      ["1 yr Domain + Hosting + Maintenance", "✔"],
      ["Vision Wrold Mart Listing", "✔"],
      ["Product Showcase on VWM Portal", "100"],
      ["Product Showcase on Website", "100"],
      ["SSL CERTIFIED Secure Website", "✔"],
      ["Website Admin Panel", "✔"],
      ["Access Business Inquiry contact", "10"],
      ["Regd. Old Buyer Database Access", "✔"],
      ["Verified Supplier (Trust Seal)", "✖"],
      ["Corporate Video of your Company", "✖"],
      ["Company E-Broucher Design", "✖"],
      ["Buyer Enquiry Alert through Email", "✔"],
      ["SEO & Website Promotion", "✔"],
      ["Language Convertor on Website", "✔"],
      ["Live Chat on Website", "✖"],
      ["Social Meida Profile Mangement", "✔"],
      ["12 Months Supports & Updates", "✔"],
    ],
  },

  Exclusive: {
    price: "₹ 82,000",
    duration: "/ year",
    features: [
      ["Creating Customers New Website", "✔"],
      ["1 yr Domain + Hosting + Maintenance", "✔"],
      ["Vision Wrold Mart Listing", "✔"],
      ["Product Showcase on VWM Portal", "130"],
      ["Product Showcase on Website", "130"],
      ["SSL CERTIFIED Secure Website", "✔"],
      ["Website Admin Panel", "✔"],
      ["Access Business Inquiry contact", "15"],
      ["Regd. Old Buyer Database Access", "✔"],
      ["Verified Supplier (Trust Seal)", "✔"],
      ["Corporate Video of your Company", "✔"],
      ["Company E-Broucher Design", "✔"],
      ["Buyer Enquiry Alert through Email", "✔"],
      ["SEO & Website Promotion", "✔"],
      ["Language Convertor on Website", "✔"],
      ["Live Chat on Website", "✖"],
      ["Social Meida Profile Mangement", "✔"],
      ["12 Months Supports & Updates", "✔"],
    ],
  },
};

export default function AdvertiseWithUsScreen() {
  const [tab, setTab] = useState<"membership" | "banner">("membership");
  const [selectedPlan, setSelectedPlan] =
    useState<keyof typeof PLAN_DATA>("Platinum");

  const currentPlan = PLAN_DATA[selectedPlan];
  const tableRow = (label: string, value: string) => (
    <View style={styles.tableRow}>
      <View style={styles.tableLeft}>
        <Text style={styles.tableText}>{label}</Text>
      </View>

      <View style={styles.tableRight}>
        <Text
          style={[
            styles.tableValue,
            value === "✔" && { color: "green" },
            value === "✖" && { color: "red" },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#0A3D62", "#0A3D62", "#2A7B9B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Advertise with us</Text>
          <Text style={styles.headerSubtitle}>
            to get more exposure for your business
          </Text>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === "membership" && styles.activeTab]}
            onPress={() => setTab("membership")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "membership" && styles.activeTabText,
              ]}
            >
              Membership Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, tab === "banner" && styles.activeTab]}
            onPress={() => setTab("banner")}
          >
            <Text
              style={[styles.tabText, tab === "banner" && styles.activeTabText]}
            >
              Banner Advertisement
            </Text>
          </TouchableOpacity>
        </View>

        {/* Membership Plans */}
        {tab === "membership" && (
          <>
            {/* Plan Selector */}
            <View style={styles.planRow}>
              {PLANS.map((plan) => (
                <TouchableOpacity
                  key={plan}
                  style={[
                    styles.planBtn,
                    selectedPlan === plan && styles.activePlan,
                  ]}
                  onPress={() => setSelectedPlan(plan)}
                >
                  <Text
                    style={[
                      styles.planText,
                      selectedPlan === plan && styles.activePlanText,
                    ]}
                  >
                    {plan}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Features */}
            <View style={styles.features}>
              <Text style={styles.featureTitle}>
                Explore Advertising Features – {selectedPlan}
              </Text>

              {/* Table */}
              <View style={styles.table}>
                {currentPlan.features.map(
                  ([label, value]: any, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.tableRow,
                        index % 2 === 0 && { backgroundColor: "#FAFAFA" },
                      ]}
                    >
                      <View style={styles.tableLeft}>
                        <Text style={styles.tableText}>{label}</Text>
                      </View>

                      <View style={styles.tableRight}>
                        <Text
                          style={[
                            styles.tableValue,
                            value === "✔" && { color: "green" },
                            value === "✖" && { color: "red" },
                          ]}
                        >
                          {value}
                        </Text>
                      </View>
                    </View>
                  ),
                )}
              </View>

              {/* Price Section */}
              <View style={styles.priceRow}>
                <Text style={styles.gstText}>
                  All given rates are excluding of 18% GST
                </Text>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={styles.price}>{currentPlan.price}</Text>
                  <Text style={styles.perYear}>{currentPlan.duration}</Text>
                </View>

                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => {
                    router.push("FooterPages/MakePayment");
                  }}
                >
                  <Text style={styles.buyText}>
                    BUY {selectedPlan.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Banner Advertisement Placeholder */}
        {tab === "banner" && (
          <View style={styles.bannerBox}>
            <Text style={styles.bannerText}>
              Banner Advertisement plans coming soon 🚀
            </Text>
          </View>
        )}

        {/* Inquiry Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Have any questions?</Text>
          <Text style={styles.formSub}>
            Shoot us a message and we’ll get back to you
          </Text>

          <TextInput placeholder="Your name" style={styles.input} />
          <TextInput placeholder="Your E-mail" style={styles.input} />
          <TextInput placeholder="Mobile Number" style={styles.input} />

          <TextInput
            placeholder="Your message"
            style={[styles.input, styles.textArea]}
            multiline
          />

          <TouchableOpacity style={styles.requestBtn}>
            <Text style={styles.requestText}>Request a Quote</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.descWrapper}
          contentContainerStyle={styles.descContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.descTitle}>Disclaimer</Text>

          <Text style={styles.descText}>
            In today's highly competitive business landscape, finding trusted
            suppliers is essential for sustained success and growth. Whether
            you're running a small startup or managing a large corporation, your
            suppliers play a crucial role in your supply chain, product quality,
            and overall reputation.
          </Text>

          <Text style={styles.descText}>
            Trusted suppliers consistently deliver high-quality materials and
            products. This reliability is essential to maintain the quality of
            your own offerings and ensure customer satisfaction. Late deliveries
            can disrupt your production schedule and affect customer trust.
          </Text>

          <Text style={styles.descText}>
            Market Research: Start by researching suppliers in your industry.
            Utilize online directories, trade shows, and industry associations
            to identify potential partners. Pay attention to their reputation,
            history, and client reviews.
          </Text>

          <Text style={styles.descText}>
            Continuously monitor your suppliers' performance. Regular
            evaluations help identify any issues early on and allow for
            constructive feedback.
          </Text>

          <Text style={styles.descText}>
            In conclusion, finding trusted suppliers is a crucial aspect of your
            business's success. Investing time and effort in selecting, vetting,
            and nurturing these relationships can lead to enhanced product
            quality, cost efficiency, and long-term growth.
          </Text>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F6FA" },

  header: {
    padding: 30,
    // borderBottomLeftRadius: 22,
    // borderBottomRightRadius: 22,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#F1F6FB",
    marginTop: 6,
    fontSize: 14,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    padding: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#0A3D62",
  },
  tabText: {
    color: "#777",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#0A3D62",
  },

  planRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  planBtn: {
    width: "48%",
    padding: 12,
    backgroundColor: "#EEE",
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  activePlan: {
    backgroundColor: "#0A3D62",
  },
  planText: {
    color: "#333",
    fontWeight: "600",
  },
  activePlanText: {
    color: "#fff",
  },

  priceRow: {
    alignItems: "center",
    marginVertical: 10,
  },
  price: {
    fontSize: 26,
    fontWeight: "700",
    color: "#D32F2F",
  },
  perYear: {
    alignContent: "flex-end",
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  buyBtn: {
    backgroundColor: "#0A3D62",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 22,
    marginTop: 12,
  },
  buyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  features: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  featureTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  featureText: {
    flex: 1,
    color: "#444",
  },
  featureValue: {
    fontWeight: "600",
  },

  bannerBox: {
    padding: 40,
    alignItems: "center",
  },
  bannerText: {
    fontSize: 16,
    color: "#555",
  },

  form: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 10,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  formSub: {
    color: "#777",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  requestBtn: {
    backgroundColor: "#0288D1",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  requestText: {
    color: "#fff",
    fontWeight: "700",
  },

  table: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    overflow: "hidden",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  tableLeft: {
    flex: 3,
    padding: 12,
    backgroundColor: "#FAFAFA",
  },

  tableRight: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  tableText: {
    fontSize: 13,
    color: "#333",
  },

  tableValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  gstText: {
    fontSize: 12,
    color: "#707070",
  },
  descWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 20,
  },

  descContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
  },

  descTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 12,
  },

  descText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    marginBottom: 12,
  },
});
