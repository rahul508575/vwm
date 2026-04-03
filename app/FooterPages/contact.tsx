import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ContactUsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>
          We’re here to help your business grow
        </Text>
      </View>

      {/* CONTACT INFO */}
      <View style={styles.card}>
        <InfoRow
          icon={<Ionicons name="call" size={20} color="#1E5FD8" />}
          label="Phone"
          value="+91 78383 62273"
          onPress={() => Linking.openURL("tel:+917838362273")}
        />

        <InfoRow
          icon={<MaterialIcons name="email" size={20} color="#1E5FD8" />}
          label="Email"
          value="info@visionworldmart.com"
          onPress={() => Linking.openURL("mailto:info@visionworldmart.com")}
        />

        <InfoRow
          icon={<Ionicons name="location" size={20} color="#1E5FD8" />}
          label="Address"
          value="Vision World Mart, India"
        />
      </View>

      {/* CONTACT FORM */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Us a Message</Text>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Your Name"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Email Address"
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Mobile Number"
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Your Message"
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SUPPORT NOTE */}
      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Our support team will get back to you within 24 hours.
        </Text>
      </View>
    </ScrollView>
  );
}

/* -------- SMALL COMPONENT -------- */

function InfoRow({ icon, label, value, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.6 : 1}
      onPress={onPress}
      style={styles.infoRow}
    >
      <View style={styles.iconBox}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

/* -------- STYLES -------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    padding: 16,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0A3D62",
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
    borderRadius: 10,
    padding: 14,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  infoLabel: {
    fontSize: 13,
    color: "#666",
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    elevation: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E1E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  submitBtn: {
    backgroundColor: "#F26522",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  footerNote: {
    marginTop: 20,
    alignItems: "center",
  },

  footerText: {
    fontSize: 13,
    color: "#666",
  },
});
