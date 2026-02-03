import supabase from "@/app/api/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../context/UserContext";

const PRIMARY_COLOR = "#0B1956";

export default function UpdateProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useUser();

  const [name, setName] = useState(profile?.name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim() || !username.trim()) {
      Alert.alert("Error", "Name and Username cannot be empty.");
      return;
    }

    try {
      setUpdating(true);
      const { error } = await supabase
        .from("users")
        .update({ name, username })
        .eq("id", profile?.id);

      if (error) throw error;

      updateProfile({ name, username });

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Update Failed", error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={PRIMARY_COLOR}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        {/* Placeholder View for alignment - No text or comments inside to be safe */}
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdate}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 25 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: PRIMARY_COLOR },
  form: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600", color: "#6B7280", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
