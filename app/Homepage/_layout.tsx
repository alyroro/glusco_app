import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Slot, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserProvider } from "../context/UserContext";

const ACTIVE_COLOR = "#0B1956";
const INACTIVE_COLOR = "#9CA3AF";

export default function MainLayout() {
  const pathname = usePathname();

  // 1. Determine if we should HIDE the bottom nav
  // We hide it if we are looking at a specific post (id) or creating a post
  const isDetailScreen =
    pathname.includes("/forum/") && pathname !== "/Homepage/forum";
  const isSurveyScreen = pathname.includes("/SurveyForm");

  const shouldHideNav = isDetailScreen || isSurveyScreen;

  const isActive = (route: string) => {
    if (route === "/Homepage/forum") {
      return pathname.startsWith("/Homepage/forum");
    }
    return pathname === route;
  };

  const NavItem = ({ icon, label, route, iconActive }: any) => {
    const active = isActive(route);
    const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;

    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push(route)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={active && iconActive ? iconActive : icon}
          size={24}
          color={color}
        />
        <Text
          style={[styles.navLabel, { color }, active && styles.navLabelActive]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <UserProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          <Slot />
        </View>

        {/* 2. Only render navigation if we aren't on a detail screen */}
        {!shouldHideNav && (
          <View style={styles.bottomNav}>
            <NavItem
              icon="home-outline"
              iconActive="home"
              label="Home"
              route="/Homepage/Dashboard"
            />
            <NavItem
              icon="lightbulb-outline"
              iconActive="lightbulb"
              label="Insights"
              route="/Homepage/Insights"
            />
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => router.push("/RetakeSurveyForm/SurveyForm")}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="plus" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <NavItem
              icon="forum-outline"
              iconActive="forum"
              label="Forum"
              route="/Homepage/forum"
            />
            <NavItem
              icon="account-outline"
              iconActive="account"
              label="Profile"
              route="/Homepage/Profile"
            />
          </View>
        )}
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1 },
  bottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 30 : 16,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%",
  },
  actionButtonContainer: {
    width: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    backgroundColor: ACTIVE_COLOR,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: ACTIVE_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  navLabel: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
  },
  navLabelActive: { fontWeight: "700" },
});
