import { useUser } from "@/app/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForumScreen() {
  const [activeTab, setActiveTab] = useState("Popular");
  const { forumData, loading, refreshForumData, profile } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshForumData();
    setRefreshing(false);
  };

  // --- COMBINED FILTERING LOGIC ---
  const filteredPosts = useMemo(() => {
    let posts = Array.isArray(forumData)
      ? forumData
      : forumData
        ? [forumData]
        : [];

    // 1. Tab Filtering
    if (activeTab === "My Posts") {
      posts = posts.filter((post) => post.user === profile?.id);
    }

    // 2. Search Filtering (Case Insensitive)
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query) ||
          post.category?.toLowerCase().includes(query),
      );
    }

    return posts;
  }, [forumData, activeTab, profile, searchQuery]);

  if (loading && !forumData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0B1956" />
        <Text style={[styles.loadingText, { marginTop: 20 }]}>
          Loading Forums...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar with Clear Button */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#A1A8B0" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search topics, titles, or categories..."
          placeholderTextColor="#A1A8B0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="#A1A8B0"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Popular", "My Posts"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0B1956"
          />
        }
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                router.push(`/Homepage/forum/${String(item.id)}` as any)
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.profilePicContainer}>
                  <Image
                    source={{ uri: item.users?.profile_picture }}
                    style={styles.profilePic}
                  />
                </View>
                <View>
                  <Text style={styles.username}>{item.users?.username}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.comment} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.actions}>
                <View style={styles.iconGroup}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.iconText}>
                    {item.forum_likes_count || 0}
                  </Text>
                </View>
                <View style={styles.iconGroup}>
                  <MaterialCommunityIcons
                    name="comment-outline"
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.iconText}>{item.comment_count || 0}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="text-search-variant"
              size={60}
              color="#E5E7EB"
            />
            <Text style={styles.emptyText}>
              `No posts found matching {searchQuery}`
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/Homepage/forum/create")}
      >
        <MaterialCommunityIcons name="pencil-plus" size={20} color="#fff" />
        <Text style={styles.floatingButtonText}>New Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  searchInput: { marginLeft: 8, fontSize: 15, color: "#000", flex: 1 },
  tabs: { flexDirection: "row", marginBottom: 15, marginHorizontal: 20 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#F3F4F6",
  },
  activeTab: { backgroundColor: "#0B1956" },
  tabText: { color: "#666", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  profilePicContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 10,
  },
  profilePic: { width: "100%", height: "100%" },
  username: { fontSize: 14, fontWeight: "700", color: "#333" },
  categoryBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  categoryText: {
    color: "#4338CA",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B1956",
    marginBottom: 6,
  },
  comment: { fontSize: 14, color: "#4B5563", lineHeight: 20 },
  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  iconGroup: { flexDirection: "row", alignItems: "center", marginLeft: 15 },
  iconText: { marginLeft: 4, fontSize: 12, color: "#666" },
  floatingButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    flexDirection: "row",
    backgroundColor: "#0B1956",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",

    zIndex: 999,
    elevation: 10,
  },
  floatingButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { color: "#A1A8B0", marginTop: 10, fontSize: 14 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#0B1956", fontWeight: "500" },
});
