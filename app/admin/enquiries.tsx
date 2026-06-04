import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function AdminEnquiries() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch(
      "https://api.visionworldmart.com/backend/api/seller/get-enquiries.php?company_id=20",
    );

    const json = await res.json();
    console.log("ENQUIRIES:", json);
    if (json.status) setData(json.enquiries);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Enquiries</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.mobile}</Text>
            <Text>{item.product}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#0A3D62",
  },

  card: {
    padding: 15,
    backgroundColor: "#F2F6FA",
    borderRadius: 10,
    marginBottom: 12,
  },

  name: {
    fontWeight: "700",
    color: "#0A3D62",
  },
});
