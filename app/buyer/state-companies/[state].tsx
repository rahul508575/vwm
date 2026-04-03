import EnquiryModal from "@/components/EnquiryModal";
import { useLocalSearchParams } from "expo-router";
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

const API =
  "https://api.visionworldmart.com/backend/api/companies/by-state.php";

export default function StateCompaniesScreen() {
  const { state } = useLocalSearchParams();

  const [companies, setCompanies] = useState<any[]>([]);

  // 🔹 MODAL STATES
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // 🔹 FORM STATES
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API}?state=${state}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status) setCompanies(json.companies);
      });
  }, [state]);

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

  /* ================= CARD ================= */
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* TOP ROW */}
      <View style={styles.topRow}>
        <View style={styles.logoWrapper}>
          {item.logo ? (
            <Image source={{ uri: item.logo }} style={styles.logo} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.comp_name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          <Text style={styles.name}>{item.comp_name}</Text>
          {!!item.comp_gst && (
            <Text style={styles.info}>GST: {item.comp_gst}</Text>
          )}
          <Text style={styles.info}>
            {item.comp_city}, {item.comp_state_name}
          </Text>
          {!!item.business_type && (
            <Text style={styles.type}>{item.business_type}</Text>
          )}
          {!!item.membership && (
            <Text style={styles.badge}>{item.membership}</Text>
          )}
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() =>
            Linking.openURL(`tel:${item.comp_mobile || "7838362273"}`)
          }
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
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Top Suppliers in {state}</Text>

      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* ✅ SINGLE MODAL */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F7F7",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D62",
  },
  info: {
    fontSize: 13,
    color: "#666",
    marginVertical: 2,
  },
  type: {
    fontSize: 13,
    color: "#444",
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
  logoWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0A3D62",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
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

  details: {
    flex: 1,
    marginLeft: 12,
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
