import { Stack, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Image
        source={{
          uri: "https://img.freepik.com/free-photo/business-people-meeting_53876-15178.jpg",
        }}
        style={styles.banner}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          How B2B Platforms Help Small Businesses Grow
        </Text>

        <Text style={styles.meta}>29 Jan 2026 · Vision World Mart</Text>

        <Text style={styles.text}>
          B2B marketplaces are transforming the way manufacturers, suppliers,
          and exporters connect with buyers across India and globally...
        </Text>

        <Text style={styles.text}>
          Platforms like Vision World Mart offer verified buyers, enquiry
          management, product listings, and analytics to grow faster.
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  banner: {
    width: "100%",

    height: 220,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0A3D62",
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    color: "#777",
    marginBottom: 14,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 12,
  },
});
