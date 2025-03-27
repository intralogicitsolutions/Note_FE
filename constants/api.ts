import * as SecureStore from "expo-secure-store";

const API_URL =
  "https://d862-2405-f600-8-6174-f35b-d846-8312-b130.ngrok-free.app";

const saveToken = async (token: string) => {
  await SecureStore.setItemAsync("token", token);
};

const getToken = async () => {
  const token = await SecureStore.getItemAsync("token");
  return token;
};

export { saveToken, getToken, API_URL };
