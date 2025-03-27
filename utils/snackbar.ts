import Toast from "react-native-toast-message";

export const showToast = (type: string, message: string) => {
  Toast.show({
    type: type, // "success" | "error" | "info"
    text1: message,
    text2: "Your note was successfully saved. ✅",
    position: "bottom",
    visibilityTime: 3000,
  });
};
