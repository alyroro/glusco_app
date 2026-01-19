import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Slot, usePathname } from "expo-router"; // Use expo-router instead!
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserProvider } from "../context/UserContext";

export default function MainLayout() {
  const pathname = usePathname(); // Get current path

  return (
    <UserProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>

        <View style={styles.bottomNav}>
          {/* Dashboard/Home */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/Homepage/Dashboard")} // Changed to expo-router
          >
            <MaterialCommunityIcons
              name="home"
              size={26}
              color={pathname === "/Homepage/Dashboard" ? "#0B1956" : "#000"} // Check pathname
            />
            <Text
              style={[
                styles.navLabel,
                pathname === "/Homepage/Dashboard" && styles.navLabelActive,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Insights */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/Homepage/Insights")} // Check your actual file name
          >
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={26}
              color={pathname === "/Homepage/Insights" ? "#0B1956" : "#4372b9"}
            />
            <Text
              style={[
                styles.navLabel,
                pathname === "/Homepage/Insights" && styles.navLabelActive,
              ]}
            >
              Insights
            </Text>
          </TouchableOpacity>

          {/* Camera */}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => router.push("/")}
          >
            <MaterialCommunityIcons name="camera" size={30} color="#fff" />
          </TouchableOpacity>

          {/* Forum */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/Homepage/Forum")} // Check your actual file name
          >
            <MaterialCommunityIcons
              name="forum-outline"
              size={26}
              color={pathname === "/Homepage/Forum" ? "#0B1956" : "#000"}
            />
            <Text
              style={[
                styles.navLabel,
                pathname === "/Homepage/Forum" && styles.navLabelActive,
              ]}
            >
              Forum
            </Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/Homepage/Profile")} // Check your actual file name
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={26}
              color={pathname === "/Homepage/Profile" ? "#0B1956" : "#000"}
            />
            <Text
              style={[
                styles.navLabel,
                pathname === "/Homepage/Profile" && styles.navLabelActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  bottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    height: 70,
    backgroundColor: "#F8F3ED",
    borderRadius: 18,
    borderTopWidth: 0,
    borderColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cameraButton: {
    backgroundColor: "#0B1956",
    width: 65,
    height: 65,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
  },
  navLabel: { fontSize: 12, textAlign: "center", color: "#000", marginTop: 2 },
  navLabelActive: { color: "#0B1956", fontWeight: "600" },
});
