import supabase from "@/app/api/client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert(error.message || "Unknown error");
        return;
      }

      const { data: hasAnswered, error: didNotAnswer } = await supabase
        .from("user_formdata")
        .select("*")
        .eq("uuid", authData.user.id)
        .single();

      if (didNotAnswer) {
        router.replace("/SurveyForm/SurveyForm");
        return;
      }

      router.replace("/Homepage/Dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert(
        "Login failed",
        err?.message || "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header: Back Button & Logo */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/get-started")}
          style={styles.backBtn}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>
          <Text style={{ color: "#0B1956" }}>glus</Text>
          <Text style={{ color: "#446CC3" }}>co</Text>
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>
        Welcome back! Stay on top of your diabetes risk.
      </Text>

      {/* Input Fields */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#A1A8B0"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#A1A8B0"
          secureTextEntry={!passwordVisible}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color="#707784"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Social Buttons */}
      <TouchableOpacity style={styles.socialBtn}>
        <Image
          source={require("../../assets/images/thesis-illus/google.png")}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    paddingTop: 20,
    marginBottom: 30,
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: 0,
  },
  backArrow: {
    fontSize: 22,
    color: "#101623",
  },
  logo: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#101623",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#707784",
    marginBottom: 30,
    lineHeight: 20,
    alignSelf: "flex-start",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 16,
    position: "relative",
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#101623",
  },
  eyeBtn: {
    position: "absolute",
    right: 20,
    top: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#0B1956",
    fontSize: 14,
    fontWeight: "500",
  },
  loginBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#0B1956",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  orText: {
    marginHorizontal: 10,
    color: "#A1A8B0",
    fontSize: 16,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 56,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 15,
    justifyContent: "center",
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: "contain",
  },
  socialText: {
    fontSize: 16,
    color: "#101623",
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  footerText: {
    fontSize: 15,
    color: "#717784",
  },
  signUpText: {
    color: "#0B1956",
    fontWeight: "600",
  },
});
