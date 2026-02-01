import supabase from "@/app/api/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
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
  const { profile, loading } = useUser();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace("/get-started");
          } catch (err) {
            console.error("Logout error:", err);
            Alert.alert("Error", "Could not log out correctly.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Syncing profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Blue Header Section */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.profileHeader}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: profile?.profile_picture }}
                style={styles.profilePic}
              />
              <TouchableOpacity style={styles.editBadge}>
                <MaterialCommunityIcons
                  name="camera"
                  size={18}
                  color={PRIMARY_COLOR}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.nameText}>{profile?.name || "User Name"}</Text>
            <Text style={styles.handleText}>
              @{profile?.username || "username"}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Settings Section */}
      <View style={styles.contentCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollInside}
        >
          <Text style={styles.menuLabel}>Account Settings</Text>

          <MenuOption
            icon="account-cog-outline"
            label="Personal Information"
            onPress={() => {}}
          />
          <MenuOption
            icon="chart-timeline-variant"
            label="Progress Overview"
            onPress={() => router.push("/Homepage/Insights")}
          />
          <MenuOption
            icon="bell-outline"
            label="Notifications"
            onPress={() => {}}
          />

          <Text style={[styles.menuLabel, { marginTop: 20 }]}>
            Support & Legal
          </Text>

          <MenuOption
            icon="shield-check-outline"
            label="Privacy Policy"
            onPress={() => {}}
          />
          <MenuOption
            icon="help-circle-outline"
            label="Help Center"
            onPress={() => {}}
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

// Helper Component for Menu Items
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
  loadingText: {
    color: "#fff",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
  },

  headerBackground: {
    paddingBottom: 40,
    backgroundColor: PRIMARY_COLOR,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
  },
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nameText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  handleText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginTop: 4,
  },

  contentCard: {
    flex: 1,
    backgroundColor: ACCENT_BG,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
  },
  scrollInside: {
    paddingTop: 30,
    paddingBottom: 120, // Space for Bottom Nav
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
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
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
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
