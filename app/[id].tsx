import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNotes } from "@/context/NotesContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const NoteDetails = () => {
  const { selectedNote } = useNotes();
  const router = useRouter();

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

  return (
    <LinearGradient colors={["#F5F7FA", "#DCE1E6"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Ionicons name="document-text-outline" size={28} color="#007AFF" />
            <Text style={styles.title}>
              {selectedNote?.title || "Untitled Note"}
            </Text>
          </View>

          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              📅 Created:{" "}
              <Text style={styles.metaHighlight}>
                {selectedNote?.createdAt
                  ? new Date(selectedNote?.createdAt as Date).toLocaleString()
                  : "Unknown"}
              </Text>
            </Text>
            <Text style={styles.metaText}>
              ⏳ Last Updated:{" "}
              <Text style={styles.metaHighlight}>
                {selectedNote?.updatedAt
                  ? new Date(selectedNote?.updatedAt as Date).toLocaleString()
                  : "Unknown"}
              </Text>
            </Text>
          </View>

          {/* OK Button */}
          <Pressable style={styles.okButton} onPress={() => router.back()}>
            <Text style={styles.okButtonText}>OK</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginLeft: 10,
  },
  metaContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#EAF1FF",
    marginBottom: 20,
  },
  metaText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  metaHighlight: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  okButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  okButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NoteDetails;
