import supabase from "@/app/api/client";
import { UserDB } from "@/app/types/UserDB";
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

const profile_images = [
  "https://gvaujsnaspqbtqusdoio.supabase.co/storage/v1/object/public/avatars/01.png",
  "https://gvaujsnaspqbtqusdoio.supabase.co/storage/v1/object/public/avatars/02.png",
  "https://gvaujsnaspqbtqusdoio.supabase.co/storage/v1/object/public/avatars/03.png",
  "https://gvaujsnaspqbtqusdoio.supabase.co/storage/v1/object/public/avatars/04.png",
  "https://gvaujsnaspqbtqusdoio.supabase.co/storage/v1/object/public/avatars/05.png",
];

export default function SignUp() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName?.trim()) {
      Alert.alert("Validation", "Full name is required.");
      return;
    }
    if (!email || !password) {
      Alert.alert("Validation", "Email and password are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert("Sign up failed", error.message || "Unknown error");
        return;
      }

      
      const userId = data?.user?.id;
      if (userId) {
        const newUser: Partial<UserDB> = {
          email: email.trim(),
          name: fullName.trim(),
          profile_picture: profile_images[Math.floor(Math.random() * 5)]
        };

        const { error: insertError } = await supabase
          .from("users")
          .insert(newUser);

        if (insertError) {
          Alert.alert("Failed to insert user row:", insertError.message);
        }
      }

      
      router.replace("/Auth/PrivacyAgreement");
    } catch (err: any) {
      console.error("Signup error:", err);
      Alert.alert("Sign up failed", err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header: Back Button & Logo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/get-started")} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>
          <Text style={{ color: "#0B1956" }}>glus</Text>
          <Text style={{ color: "#446CC3" }}>co</Text>
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Create your account and take the first step toward better health.
      </Text>

      {/* Input Fields */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Full name"
          placeholderTextColor="#A1A8B0"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </View>

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

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Confirm your password"
          placeholderTextColor="#A1A8B0"
          secureTextEntry={!confirmPasswordVisible}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        >
          <Ionicons
            name={confirmPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="#707784"
          />
        </TouchableOpacity>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        style={[styles.registerBtn, loading && { opacity: 0.7 }]}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>Register</Text>}
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

      <TouchableOpacity style={styles.socialBtn}>
        <Image
          source={require("../../assets/images/thesis-illus/facebook.png")}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Sign in with Facebook</Text>
      </TouchableOpacity>

      {/* Already have account */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/Auth/Signin")}>
          <Text style={styles.signInText}>Sign In</Text>
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
    fontSize: 22,
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
  registerBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#0B1956",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
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
  signInText: {
    color: "#0B1956",
    fontWeight: "600",
  },
});
