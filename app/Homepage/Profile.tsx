import supabase from "@/app/api/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";

const PRIMARY_COLOR = "#0B1956";
const ACCENT_BG = "#F8F3ED";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, updateProfile } = useUser();

  // Local state to handle the profile picture update immediately
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Sync local state with context when profile loads
  useEffect(() => {
    if (profile?.profile_picture) {
      setProfilePic(profile.profile_picture);
    }
  }, [profile]);

  const handleEditPhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Gallery access is required to change your photo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Pick error:", error);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);

      const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // This method now works because it's coming from 'expo-file-system/legacy'
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const arrayBuffer = decode(base64);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt === "png" ? "png" : "jpeg"}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_picture: publicUrl })
        .eq("id", profile?.id);

      if (!updateError) {
        // THIS IS THE KEY: This triggers a re-render on every page
        // that uses 'profile' from useUser()
        updateProfile({ profile_picture: publicUrl });

        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error: any) {
      console.error("Upload Error:", error);
      Alert.alert("Upload Failed", error.message);
    } finally {
      setUploading(false);
    }
  };
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/get-started");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.profileHeader}>
            <View style={styles.imageWrapper}>
              {uploading ? (
                <View style={[styles.profilePic, styles.centerContent]}>
                  <ActivityIndicator color={PRIMARY_COLOR} />
                </View>
              ) : (
                <Image
                  source={{
                    uri: profilePic || "https://via.placeholder.com/150",
                  }}
                  style={styles.profilePic}
                />
              )}
              <TouchableOpacity
                style={styles.editBadge}
                onPress={handleEditPhoto}
                disabled={uploading}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={18}
                  color={PRIMARY_COLOR}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.nameText}>{profile?.name || "User"}</Text>
            <Text style={styles.handleText}>
              @{profile?.username || "username"}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.contentCard}>
        <ScrollView contentContainerStyle={styles.scrollInside}>
          <Text style={styles.menuLabel}>Account Settings</Text>
          <MenuOption
            icon="account-cog-outline"
            label="Personal Information"
            onPress={() => router.push("/Homepage/UpdateProfile")}
          />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={22} color="#E02424" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

// MenuOption remains the same as your previous code...
function MenuOption({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.optionRow}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={22} color={PRIMARY_COLOR} />
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY_COLOR },
  centerContent: { justifyContent: "center", alignItems: "center" },
  headerBackground: { paddingBottom: 40, backgroundColor: PRIMARY_COLOR },
  profileHeader: { alignItems: "center", marginTop: 20 },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 3,
    position: "relative",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "#D9D9D9",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  nameText: { color: "#fff", fontSize: 22, fontWeight: "bold", marginTop: 15 },
  handleText: { color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 4 },
  contentCard: {
    flex: 1,
    backgroundColor: ACCENT_BG,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
  },
  scrollInside: { paddingTop: 30, paddingBottom: 120 },
  menuLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionLabel: { flex: 1, fontSize: 16, fontWeight: "600", color: "#1F2937" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    padding: 15,
    borderRadius: 16,
    backgroundColor: "rgba(224, 36, 36, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(224, 36, 36, 0.2)",
  },
  logoutText: {
    marginLeft: 10,
    color: "#E02424",
    fontSize: 16,
    fontWeight: "bold",
  },
});
