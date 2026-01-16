import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MainLayout from "./MainLayout";

export default function ForumScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Popular");

  const posts = [
    { id: "1", user: "Username", comment: "Comment. Comment. Comment", likes: 123, comments: 35 },
    { id: "2", user: "Username", comment: "Comment. Comment. Comment", likes: 123, comments: 35 },
    { id: "3", user: "Username", comment: "Comment. Comment. Comment", likes: 123, comments: 35 },
  ];

  return (
    <MainLayout>
      <SafeAreaView style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#A1A8B0" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#A1A8B0"
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["Popular", "My Posts", "My Comments"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 180 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="account-circle" size={28} color="#000" />
                <Text style={styles.username}>{item.user}</Text>
              </View>
              <Text style={styles.comment}>{item.comment}</Text>
              <View style={styles.actions}>
                <View style={styles.iconGroup}>
                  <MaterialCommunityIcons name="heart-outline" size={18} color="#000" />
                  <Text style={styles.iconText}>{item.likes}</Text>
                </View>
                <View style={styles.iconGroup}>
                  <MaterialCommunityIcons name="comment-outline" size={18} color="#000" />
                  <Text style={styles.iconText}>{item.comments}</Text>
                </View>
              </View>
            </View>
          )}
        />

        {/* Floating Add Comment Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            console.log("Add comment button pressed");
          }}
        >
          <MaterialCommunityIcons name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 32,
    paddingHorizontal: 15,
    height: 40,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  searchInput: { marginLeft: 8, fontSize: 16, color: "#000", flex: 1 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    paddingVertical: 8,
    borderRadius: 32,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.5)",
  },
  activeTab: { backgroundColor: "#0B1956" },
  tabText: { color: "#A1A8B0", fontSize: 15 },
  activeTabText: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  username: { marginLeft: 8, fontSize: 16, color: "#000" },
  comment: { marginTop: 10, fontSize: 16, color: "#000" },
  actions: { flexDirection: "row", marginTop: 10, alignItems: "center" },
  iconGroup: { flexDirection: "row", alignItems: "center", marginRight: 24 },
  iconText: { marginLeft: 6, fontSize: 12, color: "#000" },

  
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#F8F3ED",
    borderTopWidth: 1,
    borderColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  cameraButton: {
    backgroundColor: "#0B1956",
    width: 65,
    height: 65,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -35,
  },
  navLabel: { fontSize: 12, textAlign: "center", color: "#000", marginTop: 2 },
  navLabelActive: { fontSize: 12, textAlign: "center", color: "#0B1956", marginTop: 2 },

  
  floatingButton: {
    position: "absolute",
    bottom: 90, 
    right: 20,
    width: 67,
    height: 68,
    borderRadius: 9999,
    backgroundColor: "#446CC3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
