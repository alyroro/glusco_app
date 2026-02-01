import { supabase } from "@/app/api/client";
import { useUser } from "@/app/context/UserContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const { profile, refreshForumData } = useUser();
  const [isLiked, setIsLiked] = useState(false);

  const isOwner = profile?.id === post?.user;

  useFocusEffect(
    useCallback(() => {
      fetchPostDetails();
    }, [id]),
  );

  const fetchPostDetails = async () => {
    try {
      if (!post) setLoading(true);
      const { data, error } = await supabase
        .from("forum")
        .select(
          `
          *,
          users (username, profile_picture),
          comments (
            *,
            users (username, profile_picture)
          ),
          forum_likes (user)
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && profile && post) {
      const userHasLiked = post.forum_likes?.some(
        (l: any) => l.user === profile.id,
      );
      setIsLiked(!!userHasLiked);
    }
  }, [id, profile, post]);

  const handleDeletePost = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post forever?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("forum")
                .delete()
                .eq("id", id);
              if (error) throw error;
              if (refreshForumData) await refreshForumData();
              router.replace("/Homepage/forum");
            } catch (error) {
              Alert.alert("Error", "Could not delete post.");
            }
          },
        },
      ],
    );
  };

  const handleToggleLike = async () => {
    if (!profile || !post) return;
    const previousLikedStatus = isLiked;
    const previousLikesArray = [...(post.forum_likes || [])];

    setIsLiked(!previousLikedStatus);
    if (previousLikedStatus) {
      setPost((prev: any) => ({
        ...prev,
        forum_likes: prev.forum_likes.filter((l: any) => l.user !== profile.id),
      }));
    } else {
      setPost((prev: any) => ({
        ...prev,
        forum_likes: [...prev.forum_likes, { user: profile.id }],
      }));
    }

    try {
      if (previousLikedStatus) {
        await supabase
          .from("forum_likes")
          .delete()
          .eq("forum", id)
          .eq("user", profile.id);
        await supabase.rpc("decrement_likes", { row_id: id });
      } else {
        await supabase
          .from("forum_likes")
          .insert([{ forum: id, user: profile.id }]);
        await supabase.rpc("increment_likes", { row_id: id });
      }
    } catch (error) {
      setIsLiked(previousLikedStatus);
      setPost((prev: any) => ({ ...prev, forum_likes: previousLikesArray }));
    }
  };

  const handleSendComment = async () => {
    if (comment.trim().length === 0 || !profile || !id) return;
    try {
      const forumId = parseInt(id as string, 10);
      const { data, error: insertError } = await supabase
        .from("comments")
        .insert([{ user: profile.id, forum: forumId, comment: comment.trim() }])
        .select(`*, users (username, profile_picture)`)
        .single();

      if (insertError) throw insertError;

      setPost((prevPost: any) => ({
        ...prevPost,
        comment_count: (Number(prevPost.comment_count) || 0) + 1,
        comments: [data, ...(prevPost.comments || [])],
      }));
      setComment("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Comment Error:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#0B1956" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerAction}
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#0B1956"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Post Thread</Text>
            <View style={styles.headerAction}>
              {isOwner && (
                <TouchableOpacity onPress={handleDeletePost}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color="#E02424"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.profilePicContainer}>
                  <Image
                    source={{ uri: post.users?.profile_picture }}
                    style={styles.profilePic}
                  />
                </View>
                <View>
                  <Text style={styles.username}>{post.users?.username}</Text>
                  <Text style={styles.category}>{post.category}</Text>
                </View>
              </View>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.description}>{post.description}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.iconGroup}
                  onPress={handleToggleLike}
                >
                  <MaterialCommunityIcons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={isLiked ? "#E02424" : "#000"}
                  />
                  <Text style={styles.iconText}>
                    {post.forum_likes?.length ?? 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.commentSectionHeader}>
              <Text style={styles.commentCountText}>Comments</Text>
            </View>

            {post.comments?.length > 0 ? (
              post.comments.map((item: any) => (
                <View key={item.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={{ uri: item.users?.profile_picture }}
                      style={styles.commentProfilePic}
                    />
                    <View style={styles.commentInfo}>
                      <Text style={styles.commentUsername}>
                        {item.users?.username}
                      </Text>
                      <Text style={styles.commentDate}>
                        {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              ))
            ) : (
              <View style={styles.noCommentsContainer}>
                <Text style={styles.noCommentsText}>No comments yet.</Text>
              </View>
            )}
          </ScrollView>

          {/* Comment Input Section */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !comment.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSendComment}
                disabled={!comment.trim()}
              >
                <MaterialCommunityIcons name="send" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerAction: { width: 30, alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#0B1956" },
  scrollContent: { paddingBottom: 20 },
  card: { padding: 20, backgroundColor: "#fff" },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" ? 50 : 60, // Manual padding for bottom bar
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 15,
    maxHeight: 100,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#0B1956",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: { backgroundColor: "#A1A8B0" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#0B1956",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: { width: 44, height: 44, borderRadius: 22 },
  username: { marginLeft: 12, fontSize: 16, fontWeight: "bold", color: "#000" },
  category: { marginLeft: 12, fontSize: 12, color: "#666" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0B1956",
    marginVertical: 10,
  },
  description: { fontSize: 16, color: "#444", lineHeight: 24 },
  actions: {
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  iconGroup: { flexDirection: "row", alignItems: "center", marginRight: 25 },
  iconText: { marginLeft: 8, fontSize: 14, color: "#000" },
  commentSectionHeader: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  commentCountText: { fontWeight: "bold", color: "#666" },
  commentCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#fff",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentProfilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  commentInfo: { marginLeft: 10 },
  commentUsername: { fontSize: 14, fontWeight: "bold", color: "#000" },
  commentDate: { fontSize: 11, color: "#9CA3AF" },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginLeft: 42,
  },
  noCommentsContainer: { padding: 40, alignItems: "center" },
  noCommentsText: { color: "#9CA3AF", textAlign: "center", fontSize: 14 },
});
