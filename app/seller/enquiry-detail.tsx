/**
 * 🔐 ENQUIRY DETAIL SCREEN
 * Shows full details of a single enquiry
 *
 * NOTE: Data fetching abhi dummy/local hai (via getEnquiryDetail below).
 * Jab database integrate karna ho, sirf getEnquiryDetail() ke andar
 * apiService.getEnquiryById(id) jaisi real call daal dena — baaki
 * poora component (loading/error/UI) waisa hi chalega.
 */

import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EnquiryItem {
  id: number;
  product: string;
  name: string;
  mobile: string;
  company_name: string;
  message: string;
  created_at: string;
  is_read: number;
}

/* ==================== DUMMY DATA SOURCE ====================
   Isko future me apiService call se replace karna hai.
   Structure aisa rakha hai ki function signature same rahe,
   sirf andar ka implementation badalna padega.
============================================================= */
const MOCK_ENQUIRY_DB: Record<string, EnquiryItem> = {
  "1": {
    id: 1,
    product: "Stainless Steel Pipes",
    name: "Rajesh Kumar",
    mobile: "9876543210",
    company_name: "Kumar Traders",
    message:
      "I need 500 units of stainless steel pipes for a construction project. Please share your best price and delivery timeline.",
    created_at: new Date().toISOString(),
    is_read: 0,
  },
  "2": {
    id: 2,
    product: "Industrial Bearings",
    name: "Priya Sharma",
    mobile: "9123456780",
    company_name: "Sharma Industries",
    message:
      "Looking for bulk industrial bearings (SKF or equivalent). Can you send a catalog with pricing?",
    created_at: new Date().toISOString(),
    is_read: 0,
  },
};

/**
 * 🧪 MOCK FETCH FUNCTION
 * Abhi local/dummy data return karta hai.
 * Baad me isko aise kar dena:
 *
 *   const fetchEnquiryDetail = async (id: string) => {
 *     return await apiService.getEnquiryById(id);
 *   };
 *
 * Component ka baaki code bilkul same rahega.
 */
const fetchEnquiryDetail = async (
  id: string | undefined,
  fallback: EnquiryItem | null,
): Promise<EnquiryItem | null> => {
  // simulate network delay so loading state feels real
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Agar list screen se poora object already mil gaya (JSON.stringify),
  // to usi ko use karo — real app me yahan par bhi ek fresh API call
  // laga sakte ho taaki latest data mile.
  if (fallback) return fallback;

  if (id && MOCK_ENQUIRY_DB[id]) {
    return MOCK_ENQUIRY_DB[id];
  }

  return null;
};

export default function EnquiryDetail() {
  // list screen se do tareeke se data aa sakta hai:
  // 1) poora object "enquiry" param me (jaisa list screen abhi bhejta hai)
  // 2) sirf "id" param (future me jab list se sirf id bhejni ho, DB se fetch karne ke liye)
  const { enquiry, id } = useLocalSearchParams<{
    enquiry?: string;
    id?: string;
  }>();

  const [data, setData] = useState<EnquiryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let fallback: EnquiryItem | null = null;

      if (enquiry) {
        try {
          fallback = JSON.parse(
            Array.isArray(enquiry) ? enquiry[0] : enquiry,
          ) as EnquiryItem;
        } catch (parseErr) {
          console.error("Failed to parse enquiry param:", parseErr);
        }
      }

      const idParam = Array.isArray(id) ? id[0] : id;
      const result = await fetchEnquiryDetail(idParam, fallback);

      if (result) {
        setData(result);
      } else {
        setError("Enquiry not found");
      }
    } catch (err) {
      console.error("Load enquiry detail error:", err);
      setError("Failed to load enquiry details");
    } finally {
      setLoading(false);
    }
  }, [enquiry, id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const formatDate = (date: string) => {
    try {
      return new Date(date).toDateString();
    } catch {
      return "Unknown date";
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0A3D62" />
        <Text style={styles.loadingText}>Loading enquiry...</Text>
      </View>
    );
  }

  // ✅ ERROR STATE
  if (error || !data) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <FontAwesome name="exclamation-circle" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error || "No data found"}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadDetail}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.retryBtn, styles.backBtn]}
          onPress={() => router.back()}
        >
          <Text style={styles.retryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Product Header */}
      <View style={styles.headerCard}>
        <Text style={styles.product}>{data.product || "No Product"}</Text>
        <Text style={styles.date}>{formatDate(data.created_at)}</Text>
      </View>

      {/* 🔹 Customer Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{data.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{data.mobile}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Company</Text>
          <Text style={styles.value}>{data.company_name}</Text>
        </View>
      </View>

      {/* 🔹 Message */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Message</Text>
        <Text style={styles.message}>
          {data.message || "No message provided"}
        </Text>
      </View>

      {/* 🔹 Status */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Status</Text>

        <Text
          style={[
            styles.status,
            data.is_read == 0 ? styles.new : styles.replied,
          ]}
        >
          {data.is_read == 0 ? "New Enquiry" : "Replied"}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  headerCard: {
    backgroundColor: "#0A3D62",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },

  product: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  date: {
    marginTop: 5,
    color: "#D6EAF8",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0A3D62",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    color: "#777",
    fontSize: 14,
  },

  value: {
    fontWeight: "600",
    color: "#333",
  },

  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  status: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "700",
  },

  new: {
    backgroundColor: "#FFE6E6",
    color: "#C0392B",
  },

  replied: {
    backgroundColor: "#E8F8F5",
    color: "#117A65",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  errorText: {
    marginTop: 16,
    color: "#e74c3c",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: "#0A3D62",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtn: {
    marginTop: 10,
    backgroundColor: "#999",
  },
  retryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
