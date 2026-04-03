import { MaterialIcons } from "@expo/vector-icons";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PaymentScreen() {
  const PAYMENT_URL = "https://pmny.in/dI9lLowZx61h";

  const handlePayment = () => {
    Linking.openURL(PAYMENT_URL);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="payments" size={48} color="#0A3D62" />
        <Text style={styles.title}>Complete Your Payment</Text>
        <Text style={styles.subtitle}>
          Secure & trusted payment powered by Razorpay
        </Text>
      </View>

      {/* PAYMENT CARD */}
      <View style={styles.card}>
        <Text style={styles.infoText}>
          Proceed to payment to activate your services on Vision World Mart.
        </Text>

        <Text style={styles.note}>
          ✔ 100% Secure Payment{`\n`}✔ Instant Confirmation{`\n`}✔ Trusted by
          Businesses
        </Text>

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <MaterialIcons name="lock" size={20} color="#fff" />
          <Text style={styles.payText}>Click to Pay</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        You will be redirected to Razorpay to complete your transaction
        securely.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },

  infoText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
  },

  note: {
    fontSize: 13,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },

  payButton: {
    flexDirection: "row",
    backgroundColor: "#0A3D62",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
});
