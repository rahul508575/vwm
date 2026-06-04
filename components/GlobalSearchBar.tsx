import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TABS = ["products", "companies", "buy-leads"];

export default function GlobalSearchBar({ onSearch }: any) {
  const [activeTab, setActiveTab] = useState("products");
  const [query, setQuery] = useState("");

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeText]}
            >
              {tab === "products"
                ? "Products "
                : tab === "companies"
                  ? "Companies"
                  : "Buy Leads"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔍 Search Input */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder={`Search ${activeTab}...`}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => onSearch(activeTab, query)}
        >
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    margin: 12,
    elevation: 3,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D6E4FF",
    marginHorizontal: 4,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#0A3D62",
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0A3D62",
  },

  activeText: {
    color: "#fff",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },

  searchBtn: {
    backgroundColor: "#F26522",
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    marginLeft: 8,
  },

  searchText: {
    color: "#fff",
    fontWeight: "700",
  },
});
