import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { saveToken } from "@/constants/api";
import SignIn from "./SIgnIn";
import { Linking } from "react-native";

const Main = () => {
  const router = useRouter();

  const handleDeepLink = (event: any) => {
    const url = event.url;
    const params = new URL(url).searchParams;
    const token = params.get("token");
    saveToken(token as string);
    router.push("/NotesList");
  };

  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <SignIn></SignIn>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F7FB" },
});

export default Main;
