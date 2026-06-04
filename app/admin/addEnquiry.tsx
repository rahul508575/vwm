import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddEnquiry() {
  const [sellerId, setSellerId] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [product, setProduct] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!sellerId || !name || !mobile) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    try {
      const res = await fetch(
        "https://api.visionworldmart.com/backend/api/admin/add-enquiry.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seller_id: sellerId,
            name,
            mobile,
            product,
            message,
          }),
        },
      );

      const json = await res.json();

      if (json.status) {
        Alert.alert("Success", "Enquiry Added");
        setSellerId("");
        setName("");
        setMobile("");
        setProduct("");
        setMessage("");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Enquiry</Text>

      <TextInput
        placeholder="Seller ID"
        style={styles.input}
        value={sellerId}
        onChangeText={setSellerId}
      />

      <TextInput
        placeholder="Customer Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Mobile"
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="Product"
        style={styles.input}
        value={product}
        onChangeText={setProduct}
      />

      <TextInput
        placeholder="Message"
        style={[styles.input, { height: 100 }]}
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Submit Enquiry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0A3D62",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  btn: {
    backgroundColor: "#0A3D62",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
