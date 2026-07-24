import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Math.max(Dimensions.get("window").width - 32, 300);

export default function SellerAnalyticsScreen() {
  const [months, setMonths] = useState([]);
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      const safeNumber = (val) => {
        const num = Number(val);
        return isFinite(num) ? num : 0;
      };

      const userData = await AsyncStorage.getItem("userInfo");
      if (!userData) return;

      const user = JSON.parse(userData);

      const res = await fetch(
        `https://api.visionworldmart.com/backend/api/seller/monthly-analytics.php?seller_id=${user.id}`,
      );
      const data = await res.json();

      if (data.status) {
        setMonths(data.analytics.map((i) => i.month));
        setProducts(data.analytics.map((i) => safeNumber(i.products)));
        setInquiries(data.analytics.map((i) => safeNumber(i.inquiries)));
      }
    };

    loadAnalytics();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📈 Last 6 Months Analytics</Text>

      {/* 🔹 Bar Chart */}
      <Text style={styles.chartTitle}>Products Added</Text>
      {products.length > 0 && (
        <BarChart
          data={{
            labels: months,
            datasets: [{ data: products }],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          fromZero
          style={styles.chart}
        />
      )}

      {inquiries.length > 0 && (
        <LineChart
          data={{
            labels: months,
            datasets: [{ data: inquiries }],
          }}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      )}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: () => "#0A3D62",
  labelColor: () => "#555",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A3D62",
    marginBottom: 16,
    textAlign: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  chart: {
    borderRadius: 10,
    marginBottom: 30,
  },
});
