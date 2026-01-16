import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MainLayout from "./MainLayout";

export default function InsightsScreen() {
  const navigation = useNavigation();

  return (
    <MainLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }} 
      >
        {/* Section: What You Can Do */}
        <Text style={styles.sectionTitle}>What You Can Do</Text>
        <View style={styles.cardRow}>
          <View style={styles.actionCard}>
            <Text style={styles.cardText}>Track your meals daily</Text>
            <TouchableOpacity style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.cardText}>Drink 8 glasses of water</Text>
            <TouchableOpacity style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Health Tips */}
        <Text style={styles.sectionTitle}>Quick Health Tips</Text>
        <View style={styles.cardRow}>
          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="cup-water" size={30} color="#446CC3" />
            <Text style={styles.tipText}>Swap soda for water 3x this week</Text>
          </View>

          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="walk" size={30} color="#446CC3" />
            <Text style={styles.tipText}>Aim for 20 minutes of walking today</Text>
          </View>
        </View>

        {/* Progress */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            You’ve reduced your risk by{" "}
            <Text style={styles.highlight}>3%</Text> since last month!
          </Text>
        </View>

        {/* Streaks */}
        <Text style={styles.sectionTitle}>Streaks</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            You’ve logged healthy habits for{" "}
            <Text style={styles.highlight}>5 days</Text> in a row!
          </Text>
        </View>

        {/* Risk Factors */}
        <Text style={styles.sectionTitle}>What Affects Your Risk</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Glucose Levels: <Text style={styles.highlight}>45%</Text> Influence
          </Text>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 25,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  actionCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    width: "47%",
    height: 150,
    padding: 10,
    justifyContent: "space-between",
  },
  cardText: {
    fontSize: 15,
    color: "#000",
    textAlign: "center",
    marginTop: 25,
  },
  doneButton: {
    backgroundColor: "#446CC3",
    borderRadius: 30,
    alignSelf: "center",
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  doneText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  tipCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    width: "47%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  tipText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    marginTop: 10,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    marginHorizontal: 25,
  },
  infoText: {
    fontSize: 16,
    color: "#040415",
    textAlign: "center",
    fontWeight: "500",
  },
  highlight: {
    color: "#E4572E",
  },
});
