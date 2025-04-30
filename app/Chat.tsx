import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const Chat = () => {
  const { name } = useLocalSearchParams();
  const [messages, setMessages] = useState([
    { id: "1", text: `Hi, this is ${name}. How can I help you?`, sender: name },
  ]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now().toString(), text: input, sender: "You" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {/* Name in the Middle */}
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "You" ? styles.userMessage : styles.supportMessage,
            ]}
          >
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.chatList}
      />

      {/* Input box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7e57c2',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerBack: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  chatList: { flex: 1, paddingHorizontal: 10, marginTop: 5 },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#d1c4e9' },
  supportMessage: { alignSelf: 'flex-start', backgroundColor: '#ede7f6' },
  sender: { fontWeight: 'bold', marginBottom: 2, color: '#333' },
  messageText: { color: '#333' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f6f6f6',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: { backgroundColor: '#7e57c2', padding: 10, borderRadius: 5 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});

export default Chat;