import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const users = [
  { id: "1", name: "VAWC Support" },
  { id: "2", name: "Counselor Jane" },
  { id: "3", name: "Legal Aid Team" },
];

const ChatList = () => {
  const router = useRouter();

  const openChat = (user: { id: string; name: string }) => {
    router.push({ pathname: "./Chat", params: { userId: user.id, name: user.name } });
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.push("/Home")} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {/* Title in the Middle */}
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatCard} onPress={() => openChat(item)}>
            <Text style={styles.chatName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#7e57c2",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerBack: {
    padding: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  chatCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0e7ff",
    marginTop: 10,
    marginHorizontal: 10,
  },
  chatName: { fontSize: 18, fontWeight: "600", color: "#5a35b7" },
});

export default ChatList;