import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [username, setUsername] = useState("username"); 
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error("Failed to retrieve username:", error);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("username");
      router.replace("/LoginScreen");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

 const handleSOS = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Denied", "Location permission is required to send SOS.");
    return;
  }

  try {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    console.log("Sending SOS request:", { username, latitude, longitude });

    const response = await axios.post("http://192.168.100.184:10000/api/sos/send", {
      username, // Use the state variable directly
      latitude,
      longitude,
    });

    console.log("SOS response:", response.data);
    Alert.alert("SOS Enabled", "Your location was sent successfully.");
  } catch (error) {
    console.error(
      axios.isAxiosError(error) ? error.response?.data || error.message : error
    );
    Alert.alert("Error", "Failed to send location.");
  }
};

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.container}>
      <View style={styles.userContainer}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.userButton}>
          <Text style={styles.userText}>{username}</Text>
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.sosContainer}>
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topBottomContainer}>
        <Text style={styles.topBottomText}>Additional Info or Features Here</Text>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/Home")}>
            <View style={styles.iconContainer}>
              <Ionicons name="home" size={17} color="white" />
            </View>
            <Text style={styles.actionText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/MapScreen")}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="map-marker-alt" size={17} color="white" />
            </View>
            <Text style={styles.actionText}>Track</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/Chat")}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="chat" size={17} color="white" />
            </View>
            <Text style={styles.actionText}>Chat</Text>
          </TouchableOpacity>
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
    alignSelf: "flex-start",
    backgroundColor: "#b68def",
    padding: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    width: "100%",
  },
  userText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userButton: {
    padding: 2,
  },
  dropdownContainer: {
    position: "absolute",
    top: 70,
    left: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 0,
    width: 90,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 5,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 10,
  },
  sosContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sosButton: {
    backgroundColor: "#b68def",
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
    marginTop: 10,
  },
  sosText: {
    fontSize: 75,
    fontWeight: "bold",
    color: "#ffffff",
  },
  topBottomContainer: {
    backgroundColor: "#eddff7",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: "center",
  },
  topBottomText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bottomContainer: {
    backgroundColor: "#eddff7",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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