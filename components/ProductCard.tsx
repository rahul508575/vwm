import { useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EnquiryModal from "./EnquiryModal"; // path adjust kar lena

export const ProductCard = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Submit Enquiry Logic
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_name: item.name,
            company_name: item.comp_name,
            customer_name: name,
            customer_mobile: mobile,
            enquiry_message: message,
          }),
        },
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("Enquiry sent successfully");
        setModalVisible(false);
        setName("");
        setMobile("");
        setMessage("");
      } else {
        alert("Failed to send enquiry");
      }
    } catch (error) {
      console.log(error);
      alert("Server error. Try again later");
    }
  };

  return (
    <View style={styles.card}>
      {/* Product Name */}
      <Text style={styles.title}>{item.name}</Text>

      <View style={styles.row}>
        {/* Image */}
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* Product Info */}
        <View style={{ flex: 1 }}>
          {item.name && <Text style={styles.info}>Name : {item.name}</Text>}

          {item.year_of_establish && (
            <Text style={styles.info}>
              Country of Origin : {item.year_of_establish}
            </Text>
          )}

          {item.business_type && (
            <Text style={styles.info}>
              Business Type : {item.business_type}
            </Text>
          )}

          {item.comp_gst && (
            <Text style={styles.info}>GST : {item.comp_gst}</Text>
          )}
        </View>
      </View>

      {/* Company Info */}
      <View style={styles.companyRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.comp_name?.charAt(0)}</Text>
        </View>

        <View>
          <Text style={styles.company}>{item.comp_name}</Text>
          <Text style={styles.location}>
            {item.comp_city}, {item.comp_state_name}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:"7838362273"}`)}
        >
          <Text style={styles.callText}>📞 Call Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.enquiryBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.enquiryText}>✉ Send Enquiry</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Enquiry Modal (Button ke bahar) */}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  info: {
    fontSize: 13,
    color: "#444",
    fontWeight: "bold",
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4AA3DF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
  company: {
    fontWeight: "600",
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
  },
  callBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0A3D62",
    padding: 10,
    borderRadius: 6,
    marginRight: 6,
    alignItems: "center",
  },
  enquiryBtn: {
    flex: 1,
    backgroundColor: "#0A3D62",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  callText: {
    color: "#0A3D62",
    fontWeight: "600",
  },
  enquiryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
