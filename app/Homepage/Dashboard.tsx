import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import MainLayout from "./MainLayout";

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  
  const handleDayPress = (day: any) => {
    setSelectedDay(day.dateString); 
    // navigation.push("log-habits" as never);
  };

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.username}>Hi, Username</Text>
            <Text style={styles.greeting}>Good morning!</Text>
          </View>
          <View style={styles.profilePicContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.profilePic}
            />
          </View>
        </View>

        {/* Risk Level Circular Progress */}
        <View style={styles.riskContainer}>
          <AnimatedCircularProgress
            size={180}
            width={15}
            fill={49}
            tintColor="#F3A712"
            backgroundColor="#E5E7EB"
            rotation={0}
          >
            {(fill: number) => (
              <View style={styles.innerCircleContent}>
                <Text style={styles.riskPercent}>{`${Math.round(fill)}%`}</Text>
              </View>
            )}
          </AnimatedCircularProgress>

          {/* Risk Level below circle */}
          <View style={styles.riskLevelContainer}>
            <Text style={styles.riskLevelLabel}>Risk Level: Moderate</Text>
            <Text style={styles.riskMessage}>
              Your lifestyle habits are stable. Keep tracking daily!
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <View >
          <Calendar
            onDayPress={handleDayPress}
            markedDates={
              selectedDay
                ? { [selectedDay]: { selected: true, selectedColor: "#D3B3DC" } }
                : {}
            }
            theme={{
              selectedDayBackgroundColor: "#D3B3DC",
              todayTextColor: "#0B1956",
              arrowColor: "#0B1956",
              textDayFontWeight: "500",
              monthTextColor: "#0B1956",
            }}
          />
        </View>

        {/* Summary Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#000" />
            <Text style={styles.cardTitle}>Blood Pressure</Text>
            <Text style={styles.cardValue}>118 / 76 mmHg</Text>
            <Text style={styles.cardSub}>Normal</Text>
          </View>

          <View style={styles.card}>
            <MaterialCommunityIcons name="water" size={24} color="#000" />
            <Text style={styles.cardTitle}>Blood Sugar</Text>
            <Text style={styles.cardValue}>120 mg/dL</Text>
            <Text style={styles.cardSub}>Normal</Text>
          </View>

          <View style={styles.card}>
            <MaterialCommunityIcons name="food-apple" size={24} color="#000" />
            <Text style={styles.cardTitle}>Diet Overview</Text>
            <Text style={styles.cardSub}>Balanced eating this week</Text>
          </View>

          <View style={styles.card}>
            <MaterialCommunityIcons name="run" size={24} color="#000" />
            <Text style={styles.cardTitle}>Exercise</Text>
            <Text style={styles.cardSub}>30 mins, 4x/week</Text>
          </View>

          <View style={styles.card}>
            <MaterialCommunityIcons name="sleep" size={24} color="#000" />
            <Text style={styles.cardTitle}>Sleep</Text>
            <Text style={styles.cardSub}>7.5 hrs avg/night</Text>
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  greeting: {
    fontSize: 15,
    color: "#000",
    marginTop: 5,
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#0B1956",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  riskContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  innerCircleContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  riskPercent: {
    fontSize: 36,
    fontWeight: "700",
    color: "#121212",
  },

  
  riskLevelContainer: {
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 20,
    marginBottom: 28, 
  },
  riskLevelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#121212",
    textTransform: "capitalize",
    marginBottom: 10,
  },

  riskTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, 
  },
  riskLevel: { fontSize: 16, fontWeight: "500", color: "#121212", marginTop: 5 },
  riskMessage: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginTop: 5,
    width: 260,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 25,
    marginTop: 25,
  },

  
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginTop: 30,
    paddingHorizontal: 8,
    gap: 12,
  },
  card: {
    width: 190,       
    height: 150,       
    backgroundColor: "#E8D9EE",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,      
    fontWeight: "700",
    marginTop: 8,
  },
  cardValue: {
    fontSize: 18,      
    fontWeight: "600",
    color: "#121212",
    marginTop: 6,
  },
  cardSub: {
    fontSize: 13,      
    textAlign: "center",
    marginTop: 8,
    color: "#446CC3",
  },

  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  dayLabel: { fontSize: 10, color: "#000" },
  dayNumber: { fontSize: 10, color: "#000" },
});
