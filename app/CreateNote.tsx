import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL, getToken } from "@/constants/api";
import { useNotes } from "@/context/NotesContext";
import { useFocusEffect } from "@react-navigation/native";
import { showToast } from "@/utils/snackbar";

const CreateNote = () => {
  const router = useRouter();
  const { selectedNote, setSelectedNote } = useNotes();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        router.back();
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );

  // Handle Save (Create or Edit)
  const handleSave = async () => {
    if (selectedNote?.title.trim() === "") return;

    setLoading(true);
    try {
      const method = selectedNote?.id ? "PUT" : "POST"; // Use PUT for editing, POST for new note
      const url = selectedNote?.id
        ? `${API_URL}/notes/${selectedNote?.id}`
        : `${API_URL}/notes`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
          title: selectedNote?.title,
          body: selectedNote?.body,
        }),
      });

      if (!response.ok)
        showToast(
          "fail",
          `Failed to ${selectedNote?.id ? "update" : "create"} note`
        );

      setLoading(false);
      showToast(
        "success",
        `Note ${selectedNote?.id ? "updated" : "created"} successfully`
      );
      router.replace("/NotesList"); // Navigate back to Notes List
    } catch (error) {
      setLoading(false);
      console.error(
        `Error ${selectedNote?.id ? "updating" : "saving"} note:`,
        error
      );
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Note?", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const response = await fetch(
              `${API_URL}/notes/${selectedNote?.id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${await getToken()}`, // Pass token for authentication
                },
              }
            );

            if (!response.ok) throw new Error("Failed to delete note");

            setLoading(false);
            router.replace("/NotesList"); // Adjust path as needed
          } catch (error) {
            setLoading(false);
            console.error("Error deleting note:", error);
            Alert.alert("Error", "Failed to delete note. Please try again.");
          }
        },
      },
    ]);
  };

  const handleViewDetails = () => {
    router.push(`/${selectedNote?.id}`); // Navigate to the new NoteDetails screen
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#f7f7f7", "#e0e0e0"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            value={selectedNote?.title}
            multiline={false}
            numberOfLines={1}
            maxLength={50}
            onChangeText={(text) => {
              setSelectedNote({ ...(selectedNote as any), title: text });
            }}
          />
          <TextInput
            style={styles.bodyInput}
            placeholder="Write your note..."
            value={selectedNote?.body}
            onChangeText={(text) => {
              setSelectedNote({ ...(selectedNote as any), body: text });
            }}
            multiline
          />
        </ScrollView>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.ButtonText}>
            {selectedNote?.id ? "Update" : "Save"}
          </Text>
        </TouchableOpacity>
        {selectedNote?.id && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.ButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={handleViewDetails}
            >
              <Text style={styles.ButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20 },
  scrollContainer: { flexGrow: 1 },
  titleInput: {
    fontSize: 22,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
    paddingVertical: 10,
    marginBottom: 15,
    width: "100%",
  },
  bodyInput: {
    fontSize: 18,
    flex: 1,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    minHeight: 250,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },

  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    flex: 1, // Make buttons equal width
    marginRight: 10, // Space between buttons
  },
  detailsButton: {
    backgroundColor: "#34C759",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    flex: 1, // Make buttons equal width
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  ButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateNote;
