/**
 * 🔐 SECURE ENQUIRIES LIST SCREEN
 * Shows all enquiries for seller with search, filter, and status management
 */

import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// TODO: confirm relative path to your apiService.ts
import { apiService, EnquiryData, UserData } from "@/services/apiService";

type EnquiryItem = EnquiryData;

export default function SellerEnquiriesScreen() {
  // ✅ STATE MANAGEMENT
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<EnquiryItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read">(
    "all",
  );
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);

  // ✅ GET STORED USER (real logged-in seller — no mock fallback)
  const getStoredUser = useCallback(async (): Promise<UserData | null> => {
    try {
      const stored = await AsyncStorage.getItem("userInfo");
      if (!stored) {
        router.replace("/login");
        return null;
      }

      const userData = JSON.parse(stored);

      if (!userData.id || !userData.company_id) {
        router.replace("/login");
        return null;
      }

      return userData as UserData;
    } catch (err) {
      console.error("Failed to get stored user:", err);
      router.replace("/login");
      return null;
    }
  }, []);

  // ✅ LOAD ENQUIRIES — filtered to this seller's company_id via apiService
  const loadEnquiries = useCallback(
    async (pageNum: number = 1) => {
      try {
        setError(null);

        const userData = await getStoredUser();
        if (!userData || !userData.company_id) {
          setError("Missing company info for this account");
          return;
        }

        setUser(userData);

        const result = await apiService.getEnquiries(
          userData.company_id,
          pageNum,
          20,
        );

        if (result) {
          setEnquiries(result.enquiries);
          setTotalCount(result.total);
          setUnreadCount(result.unread);
          setPage(pageNum);
        } else {
          setError("Failed to load enquiries");
        }
      } catch (err) {
        console.error("Load enquiries error:", err);
        setError("Error loading enquiries");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getStoredUser],
  );

  // ✅ FILTER ENQUIRIES
  useEffect(() => {
    let filtered = enquiries;

    // Apply status filter
    if (filterStatus === "unread") {
      filtered = filtered.filter((e) => e.is_read === 0);
    } else if (filterStatus === "read") {
      filtered = filtered.filter((e) => e.is_read === 1);
    }

    // Apply search filter
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(search) ||
          e.mobile.includes(search) ||
          e.product.toLowerCase().includes(search) ||
          e.message.toLowerCase().includes(search),
      );
    }

    setFilteredEnquiries(filtered);
  }, [enquiries, filterStatus, searchText]);

  // ✅ INITIAL LOAD
  useEffect(() => {
    loadEnquiries(1);
  }, [loadEnquiries]);

  // ✅ REFRESH ON FOCUS
  useFocusEffect(
    useCallback(() => {
      loadEnquiries(1);
    }, [loadEnquiries]),
  );

  // ✅ HANDLE REFRESH
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEnquiries(1);
  }, [loadEnquiries]);

  // ✅ MARK AS READ
  const handleMarkRead = useCallback(async (enquiryId: number) => {
    try {
      const ok = await apiService.markEnquiryRead(enquiryId);

      if (ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, is_read: 1 } : e)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        Alert.alert("Error", "Failed to mark as read");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to mark as read");
    }
  }, []);

  // ✅ HANDLE ENQUIRY CLICK
  const handleEnquiryClick = useCallback(
    (enquiry: EnquiryItem) => {
      // Mark as read if not already
      if (enquiry.is_read === 0) {
        handleMarkRead(enquiry.id);
      }

      // Navigate to detail screen
      router.push({
        pathname: "/seller/enquiry-detail",
        params: {
          enquiry: JSON.stringify(enquiry),
        },
      });
    },
    [handleMarkRead],
  );

  // ✅ ERROR STATE
  if (error && loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <FontAwesome name="exclamation-circle" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => loadEnquiries(1)}
        >
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ LOADING STATE
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0A3D62" />
        <Text style={styles.loadingText}>Loading enquiries...</Text>
      </View>
    );
  }

  // ✅ EMPTY STATE
  if (enquiries.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <FontAwesome name="inbox" size={48} color="#ddd" />
        <Text style={styles.emptyText}>No enquiries yet</Text>
        <Text style={styles.emptySubtext}>
          Enquiries from buyers will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buyer Enquiries</Text>
        <View style={styles.headerStats}>
          <Text style={styles.headerCount}>{filteredEnquiries.length}</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount} New</Text>
            </View>
          )}
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, mobile, or product..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <FontAwesome name="times-circle" size={16} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterTabs}>
        <FilterTab
          label="All"
          count={totalCount}
          active={filterStatus === "all"}
          onPress={() => setFilterStatus("all")}
        />
        <FilterTab
          label="Unread"
          count={unreadCount}
          active={filterStatus === "unread"}
          onPress={() => setFilterStatus("unread")}
          badge
        />
        <FilterTab
          label="Read"
          count={totalCount - unreadCount}
          active={filterStatus === "read"}
          onPress={() => setFilterStatus("read")}
        />
      </View>

      {/* ENQUIRIES LIST */}
      <FlatList
        data={filteredEnquiries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EnquiryCard
            enquiry={item}
            onPress={() => handleEnquiryClick(item)}
            onMarkRead={() => handleMarkRead(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#0A3D62"
          />
        }
        contentContainerStyle={styles.listContent}
        scrollEnabled
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="search" size={32} color="#ddd" />
            <Text style={styles.emptyText}>No enquiries found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </View>
  );
}

/* ==================== FILTER TAB COMPONENT ==================== */

interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  badge?: boolean;
  onPress: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({
  label,
  count,
  active,
  badge,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.filterTab, active && styles.filterTabActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
      {label}
    </Text>
    <View style={[styles.filterCount, active && styles.filterCountActive]}>
      <Text
        style={[styles.filterCountText, active && styles.filterCountTextActive]}
      >
        {count}
      </Text>
    </View>
  </TouchableOpacity>
);

/* ==================== ENQUIRY CARD COMPONENT ==================== */

interface EnquiryCardProps {
  enquiry: EnquiryItem;
  onPress: () => void;
  onMarkRead: () => void;
}

const EnquiryCard: React.FC<EnquiryCardProps> = ({
  enquiry,
  onPress,
  onMarkRead,
}) => {
  const isUnread = enquiry.is_read === 0;
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return "Unknown";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.enquiryCard, isUnread && styles.enquiryCardUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* UNREAD INDICATOR */}
      {isUnread && <View style={styles.unreadIndicator} />}

      {/* MAIN CONTENT */}
      <View style={styles.cardContent}>
        {/* HEADER ROW */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitle}>
            <Text style={styles.customerName} numberOfLines={1}>
              {enquiry.name}
            </Text>
            {isUnread && <View style={styles.newBadge} />}
          </View>
          <Text style={styles.cardDate}>{formatDate(enquiry.created_at)}</Text>
        </View>

        {/* PRODUCT & MOBILE */}
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <FontAwesome name="cube" size={12} color="#666" />
            <Text style={styles.metaText} numberOfLines={1}>
              {enquiry.product || "No product specified"}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <FontAwesome name="phone" size={12} color="#666" />
            <Text style={styles.metaText}>{enquiry.mobile}</Text>
          </View>
        </View>

        {/* MESSAGE PREVIEW */}
        <Text style={styles.messagePreview} numberOfLines={2}>
          {enquiry.message || "No message"}
        </Text>
      </View>

      {/* ACTION BUTTON */}
      {isUnread && (
        <TouchableOpacity
          style={styles.markReadBtn}
          onPress={(e) => {
            e.stopPropagation();
            onMarkRead();
          }}
        >
          <FontAwesome name="check" size={14} color="#0A3D62" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#0A3D62",
    padding: 16,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  unreadBadge: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: "#0A3D62",
    borderColor: "#0A3D62",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterLabelActive: {
    color: "#fff",
  },
  filterCount: {
    backgroundColor: "#e8e8e8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  filterCountActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
  },
  filterCountTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 13,
    color: "#999",
  },
  enquiryCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ddd",
  },
  enquiryCardUnread: {
    backgroundColor: "#f0f7ff",
    borderLeftColor: "#0A3D62",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0A3D62",
    marginTop: 6,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  newBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e74c3c",
  },
  cardDate: {
    fontSize: 12,
    color: "#999",
  },
  cardMeta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
    maxWidth: 120,
  },
  messagePreview: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
  },
  markReadBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e8f2f7",
    justifyContent: "center",
    alignItems: "center",
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
  retryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
