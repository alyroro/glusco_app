import { supabase } from "@/app/api/client";
import { useUser } from "@/app/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define your categories here
const CATEGORIES = [
  "General",
  "Health",
  "Advice",
  "Question",
  "Discussion",
  "News",
];

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [showPicker, setShowPicker] = useState(false);

  const { profile, refreshForumData } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!profile?.id) {
      Alert.alert("Error", "You must be logged in to post.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      Alert.alert("Wait!", "Please add a title and a description.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("forum").insert([
      {
        title: title.trim(),
        description: description.trim(),
        user: profile.id,
        category: category, // Using the selected category state
        likes: 0,
      },
    ]);

    if (error) {
      Alert.alert("Error", error.message);
      setIsSubmitting(false);
    } else {
      await refreshForumData();
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Aesthetic Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color="#0B1956"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          onPress={handlePost}
          disabled={isSubmitting}
          style={[
            styles.postButton,
            (!title || !description) && styles.disabledButton,
          ]}
        >
          <Text style={styles.postButtonText}>
            {isSubmitting ? "..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.userInfo}>
            <View style={styles.avatarPlaceholder}>
              <Image
                source={{ uri: profile?.profile_picture }}
                style={styles.profilePic}
              />
            </View>
            <View>
              <Text style={styles.usernameText}>{profile?.username}</Text>
              {/* Category Dropdown Trigger */}
              <TouchableOpacity
                style={styles.categoryTrigger}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.categoryTriggerText}>{category}</Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={14}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor="#A1A8B0"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            multiline
          />

          <View style={styles.divider} />

          <TextInput
            style={styles.descriptionInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#A1A8B0"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Picker Modal */}
      <Modal visible={showPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryOption}
                onPress={() => {
                  setCategory(cat);
                  setShowPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    category === cat && styles.selectedCategoryText,
                  ]}
                >
                  {cat}
                </Text>
                {category === cat && (
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color="#0B1956"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#0B1956" },
  postButton: {
    backgroundColor: "#0B1956",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: { backgroundColor: "#E5E7EB" },
  postButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  form: { padding: 20 },
  userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#446CC3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "bold" },
  usernameText: { fontSize: 16, fontWeight: "600", color: "#333" },

  // Category Trigger Styles
  categoryTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 2,
    alignSelf: "flex-start",
  },
  categoryTriggerText: {
    fontSize: 12,
    color: "#666",
    marginRight: 4,
    fontWeight: "500",
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0B1956",
    paddingVertical: 10,
  },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 15 },
  descriptionInput: {
    fontSize: 16,
    color: "#444",
    minHeight: 200,
    lineHeight: 24,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B1956",
    marginBottom: 15,
    textAlign: "center",
  },
  categoryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoryOptionText: { fontSize: 16, color: "#444" },
  selectedCategoryText: { color: "#0B1956", fontWeight: "bold" },
});
