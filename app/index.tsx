import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Use the router for navigation

  const handleLogin = async () => {
    try {
      const res = await fetch("http://192.168.100.134:10000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Save the username in AsyncStorage
        await AsyncStorage.setItem("username", username);
        alert("Login successful!");
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
    router.push("./Register");
  };

  const handleForgotpass = () => {
    router.push("./Forgotpass");
  };

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/images/bg1.png")} style={styles.logo} />

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity onPress={handleForgotpass}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

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
    marginTop: 50,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 0,
  },
  inputContainer: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
    width: "90%",
  },
  button: {
    backgroundColor: "#8c01c0",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "60%",
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotText: {
    color: "#666",
    fontSize: 14,
    textDecorationLine: "underline",
    marginTop: 10,
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
