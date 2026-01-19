import supabase from "@/app/api/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Logout error:", err);
      Alert.alert("Error", "Could not log out. Try again.");
      return;
    }

    router.replace("/get-started");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <View style={styles.topBackground} />

      {/* Bottom white section */}
      <View style={styles.bottomSection} />

      {/* Profile Image */}
      <View style={styles.profileImage} />

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton}>
        <MaterialCommunityIcons name="camera-outline" size={24} color="#000" />
      </TouchableOpacity>

      {/* Username */}
      <Text style={styles.username}>Username</Text>

      {/* Options */}
      <TouchableOpacity style={[styles.option, { top: 372 }]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="account-cog-outline"
            size={22}
            color="#000"
          />
        </View>
        <Text style={styles.optionText}>Account Settings</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#555" />
      </TouchableOpacity>

      <View style={[styles.divider, { top: 428 }]} />

      <TouchableOpacity style={[styles.option, { top: 442 }]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="chart-bar" size={22} color="#000" />
        </View>
        <Text style={styles.optionText}>Progress Overview</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#555" />
      </TouchableOpacity>

      <View style={[styles.divider, { top: 498 }]} />

      <TouchableOpacity
        style={[styles.option, { top: 513 }]}
        onPress={handleLogout}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="logout" size={22} color="#000" />
        </View>
        <Text style={styles.optionText}>Log out</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#555" />
      </TouchableOpacity>

      <View style={[styles.divider, { top: 568 }]} />
      <View style={[styles.divider, { top: 638 }]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1956" },
  topBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#0B1956",
  },
  bottomSection: {
    position: "absolute",
    top: 322,
    bottom: 0,
    width: "100%",
    backgroundColor: "#F8F3ED",
  },
  profileImage: {
    position: "absolute",
    top: 112,
    left: "50%",
    marginLeft: -65.5,
    width: 131,
    height: 126,
    borderRadius: 9999,
    backgroundColor: "#D9D9D9",
  },
  editButton: {
    position: "absolute",
    top: 181,
    left: "50%",
    marginLeft: 41,
    width: 67,
    height: 68,
    borderRadius: 9999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    position: "absolute",
    top: 262,
    left: "50%",
    marginLeft: -40,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  option: {
    position: "absolute",
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 9999,
    backgroundColor: "#E8F3F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(0,0,0,0.8)",
  },
  divider: {
    position: "absolute",
    left: 20,
    width: 335,
    height: 1,
    backgroundColor: "#E8F3F1",
  },
});
