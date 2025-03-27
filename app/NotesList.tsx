import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { useNotes } from "@/context/NotesContext";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { API_URL, getToken } from "@/constants/api";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

const NotesList = () => {
  const router = useRouter();
  const { setSelectedNote } = useNotes();
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState([
    {
      id: "",
      title: "",
      body: "",
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      const handleExitApp = async () => {
        try {
          await SecureStore.deleteItemAsync("userToken");
          await SecureStore.deleteItemAsync("userPreferences");
          BackHandler.exitApp();
        } catch (error) {
          console.error("Error clearing SecureStore data:", error);
        }
      };

      const handleBackPress = () => {
        Alert.alert("Exit App", "Do you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: handleExitApp },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/notes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch notes");

        const data = await response.json();
        const notes = data?.body?.sort(
          (a: any, b: any) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        setNote(notes);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching note:", error);
      }
    };

    fetchNote();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notes</Text>

      {note.length === 0 ? (
        // No Notes UI
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={80} color="#bbb" />
          <Text style={styles.emptyTitle}>No Notes Yet</Text>
          <Text style={styles.emptyText}>
            Start by creating your first note.
          </Text>

          <TouchableOpacity
            style={styles.createNoteButton}
            onPress={() => {
              setSelectedNote(null);
              router.push("/CreateNote");
            }}
          >
            <Text style={styles.createNoteButtonText}>Create Note</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={note}
          keyExtractor={(item) => item?.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item?.id}
              style={styles.noteCard}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedNote(item);
                router.push({ pathname: "/CreateNote" });
              }}
            >
              <Text style={styles.noteTitle} numberOfLines={1}>
                {item?.title}
              </Text>
              <Text style={styles.noteBody} numberOfLines={2}>
                {item?.body}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating Add Note Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedNote(null);
          router.push("/CreateNote");
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FB" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    alignSelf: "center",
  },
  listContainer: { paddingBottom: 80 },
  noteCard: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#007AFF",
    width: width - 40,
    alignSelf: "center",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  noteBody: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 36,
    color: "#FFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // No Notes UI Styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  createNoteButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  createNoteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default NotesList;
