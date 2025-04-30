import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [username, setUsername] = useState("Loading...");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        setUsername(storedUsername || "Guest");
      } catch (error) {
        console.error("Failed to retrieve username:", error);
        setUsername("Error");
      }
    };
    fetchUsername();
  }, []);

  const startPulseAnimation = () => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    animationRef.current.start();
  };

  const stopPulseAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    scaleAnim.setValue(1);
  };

  const handleSOS = async () => {
    if (sosActive) {
      // Turn OFF SOS
      stopPulseAnimation();
      setSosActive(false);
      Alert.alert("SOS Disabled", "You have turned off the SOS.");
      return;
    }

    // Turn ON SOS
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required to send SOS.");
      return;
    }

    setLoading(true);
    startPulseAnimation();

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = location.coords;

      console.log("Sending SOS request:", { username, latitude, longitude });

      const response = await axios.post("http://192.168.100.134:10000/api/sos/send", {
        username,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      console.log("SOS response:", response.data);
      Alert.alert("SOS Enabled", "Your location was sent successfully.");
      setSosActive(true);
    } catch (error) {
      console.error(
        axios.isAxiosError(error) ? error.response?.data || error.message : error
      );
      Alert.alert("Error", "Failed to send location.");
      stopPulseAnimation();
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.userContainer}>
          <TouchableOpacity onPress={toggleDropdown} style={styles.hamburgerButton}>
            <Ionicons name="menu-outline" size={24} color="#fff" />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>Hello, {username}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/Users")} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>Users</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/Settings")} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/Privacy")} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>Privacy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async () => {
                await AsyncStorage.removeItem("username");
                setUsername("Guest");
                router.replace("/");
              }} style={[styles.dropdownItem, styles.logoutButton]}>
                <Text style={[styles.dropdownText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <Animated.View
            style={[
              styles.sosButton,
              {
                transform: [{ scale: scaleAnim }],
                backgroundColor: sosActive ? "#ff3b3b" : "#8c01c0",
              },
            ]}
          >
            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}
              onPress={handleSOS}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <Text style={styles.sosText}>SOS</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomContainer}>
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/Home")}>
              <View style={styles.iconContainer}>
                <Ionicons name="home" size={17} color="white" />
              </View>
              <Text style={styles.actionText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/News")}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="newspaper" size={17} color="white" />
              </View>
              <Text style={styles.actionText}>News</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/Chat")}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="chat" size={17} color="white" />
              </View>
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  userContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#8c01c0",
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  hamburgerButton: {
    marginLeft: "auto",
    padding: 5,
  },
  dropdownContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: 160,
    elevation: 20,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 15,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#f8d7da",
  },
  logoutText: {
    color: "#a94442",
    fontWeight: "bold",
  },
  sosContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  sosText: {
    fontSize: 75,
    fontWeight: "bold",
    color: "#ffffff",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#eddff7",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    paddingVertical: 5,
  },
  iconContainer: {
    backgroundColor: "#b68def",
    padding: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
  },
});

export default Home;
