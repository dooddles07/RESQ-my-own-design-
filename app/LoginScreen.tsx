import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Use the router for navigation

  const handleLogin = async () => {
    try {
      const res = await fetch("http://192.168.100.184:10000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        // Navigate to HomeScreen
        router.push("./Home");
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const handleRegister = () => {
    // Navigate to Register screen
    router.push("./Register");
  };

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/images/bg1.png")} style={styles.logo} />

      {/* Username Input */}
      <Text style={styles.label}>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Enter your username"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <Text style={styles.label}>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    marginRight: 185,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    borderRadius: 50,
    padding: 10,
    marginBottom: 15,
    width: "80%",
  },
  button: {
    backgroundColor: "#b68def",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    color: "#b68def",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 50,
  },
});

export default LoginScreen;