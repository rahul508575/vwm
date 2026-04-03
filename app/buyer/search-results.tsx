import EnquiryModal from "@/components/EnquiryModal";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
    FlatList,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * 🔴 IMPORTANT
 * Agar browser me ye URL JSON deta hai tabhi kaam karega
 * http://10.0.2.2:8000/api/search.php
 */
const API_BASE = "https://api.visionworldmart.com/backend/api/search.php";

export default function SearchResultsScreen() {
  const { type, q } = useLocalSearchParams<{
    type?: string;
    q?: string;
  }>();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  /* ================= SUBMIT ENQUIRY ================= */
  const submitEnquiry = async () => {
    if (!name || !mobile || !message) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "https://api.visionworldmart.com/backend/api/enquiry.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_name: selectedCompany.comp_name,
            customer_name: name,
            customer_mobile: mobile,
            enquiry_message: message,
            enquiry_source: "App",
          }),
        },
      );

      const result = await response.json();

      if (result.status) {
        alert("Enquiry sent successfully");
        setModalVisible(false);
        setName("");
        setMobile("");
        setMessage("");
      } else {
        alert("Failed to send enquiry");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  useEffect(() => {
    if (!type || !q) {
      setLoading(false);
      return;
    }

    const url = `${API_BASE}?type=${type}&q=${encodeURIComponent(q)}`;
    console.log("🔎 SEARCH URL 👉", url);

    setLoading(true);
    setError(null);

    fetch(url)
      .then(async (res) => {
        const text = await res.text();

        // 🔴 HTML response guard
        if (text.trim().startsWith("<")) {
          console.log("❌ HTML RESPONSE RECEIVED:", text);
          throw new Error("Server returned HTML instead of JSON");
        }

        return JSON.parse(text);
      })
      .then((json) => {
        console.log("✅ SEARCH RESPONSE 👉", json);

        if (json?.status === true && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.log("❌ SEARCH ERROR:", err.message);
        setError("Server error. Please try again later.");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [type, q]);

  /* ================= COMPANY CARD ================= */
  const renderCompany = ({ item }: any) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => {
          router.push(`/catalogue/${item.id}`);
        }}
      >
        <View style={styles.logoWrapper}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.logo} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.comp_name?.charAt(0)?.toUpperCase() || "C"}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.details}>
        <Text style={styles.name}>{item.comp_name}</Text>
        <Text style={styles.info}>Name : {item.name}</Text>

        {!!item.business_type && (
          <Text style={styles.info}>{item.business_type}</Text>
        )}

        {!!item.comp_city && (
          <Text style={styles.info}>
            {item.comp_city}, {item.comp_state_name}
          </Text>
        )}
        {!!item.membership && (
          <Text style={styles.badge}>{item.membership}</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => Linking.openURL(`tel:"7838362273"}`)}
          >
            <Text style={styles.callText}>📞 Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.enquiryBtn}
            onPress={() => {
              setSelectedCompany(item);
              setModalVisible(true);
            }}
          >
            <Text style={styles.enquiryText}>✉ Send Enquiry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /* ================= BUY LEAD CARD ================= */
  const renderLead = ({ item }: any) => (
    <View style={styles.leadCard}>
      <Text style={styles.leadTitle}>{item.product_name}</Text>

      {!!item.quantity && (
        <Text style={styles.info}>Quantity: {item.quantity}</Text>
      )}

      {!!item.location && (
        <Text style={styles.info}>Location: {item.location}</Text>
      )}

      <TouchableOpacity style={styles.joinBtn}>
        <Text style={styles.joinText}>Join This Deal</Text>
      </TouchableOpacity>
    </View>
  );

  /* ================= STATES ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading results...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.center}>
        <Text>No results found for "{q}"</Text>
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
      <View style={styles.container}>
        <Text style={styles.heading}>
          Results for "{q}" ({type})
        </Text>

        <FlatList
          data={data}
          keyExtractor={(item, index) =>
            item.id ? String(item.id) : String(index)
          }
          renderItem={type === "buy-leads" ? renderLead : renderCompany}
          showsVerticalScrollIndicator={false}
        />

        <EnquiryModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={submitEnquiry}
          name={name}
          setName={setName}
          mobile={mobile}
          setMobile={setMobile}
          message={message}
          setMessage={setMessage}
          // company={selectedCompany}
        />
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF4FF",
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  avatar: {
    backgroundColor: "#0A3D62",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  details: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D62",
  },

  info: {
    fontSize: 13,
    color: "#555",
    marginVertical: 2,
  },

  leadCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  leadTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D62",
  },

  joinBtn: {
    marginTop: 10,
    backgroundColor: "#F26522",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  joinText: {
    color: "#fff",
    fontWeight: "700",
  },
  badge: {
    marginTop: 4,
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#F26522",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
  },

  callText: {
    color: "#0A3D62",
    fontWeight: "600",
  },
  enquiryText: {
    color: "#fff",
    fontWeight: "600",
  },

  topRow: {
    flexDirection: "row",
  },

  callBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0A3D62",
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 8,
    alignItems: "center",
  },

  enquiryBtn: {
    flex: 1,
    backgroundColor: "#0A3D62",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
});
