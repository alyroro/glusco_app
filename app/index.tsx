import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/get-started");
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoMain}>glus</Text>
        <Text style={styles.logoAccent}>co</Text>
      </View>
      <Text style={styles.subtitle}>Track. Predict. Prevent.</Text>
      <View style={styles.bar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  logoMain: {
    color: "#0B1956",
    fontSize: 50,
    fontWeight: "700",
    fontFamily: "Montserrat",
  },
  logoAccent: {
    color: "#446CC3",
    fontSize: 50,
    fontWeight: "700",
    fontFamily: "Montserrat",
  },
  subtitle: {
    marginTop: 10,
    color: "#717784",
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "500",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  bar: {
    position: "absolute",
    bottom: 15,
    width: 134,
    height: 5,
    backgroundColor: "white",
    borderRadius: 100,
  },
});
