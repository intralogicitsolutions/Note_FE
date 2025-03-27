import { showToast } from "@/utils/snackbar";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";
import {
  Alert,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SignIn = () => {
  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        Alert.alert("Exit App", "Do you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Prevent going back
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );

  const redirectUri = Linking.createURL("oauth");

  const googleLogin = async () => {
    //   const authUrl = "http://192.168.1.7:3000/auth/google";

    const authUrl =
      "https://d862-2405-f600-8-6174-f35b-d846-8312-b130.ngrok-free.app/auth/google";

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === "success") {
      showToast("success", "Authentication successful");
    } else {
      console.log("Authentication canceled");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={googleLogin}>
        <FontAwesome
          name="google"
          size={20}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Login with Google</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  button: {
    flexDirection: "row", // Arrange icon and text horizontally
    alignItems: "center",
    backgroundColor: "#4285F4", // Google Blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignIn;
