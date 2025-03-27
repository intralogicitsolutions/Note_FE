// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from "@react-navigation/native";
// import NotesList from "../app/screens/NotesList";
// import CreateNote from "../app/screens/CreateNote";
// import NoteDetails from "../app/screens/NoteDetails";

// const Stack = createStackNavigator();

// export default function RootLayout() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="NotesList">
//         <Stack.Screen name="NotesList" component={NotesList} />
//         <Stack.Screen name="CreateNote" component={CreateNote} />
//         <Stack.Screen name="NoteDetails" component={NoteDetails} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import { NotesProvider } from "@/context/NotesContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <NotesProvider>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <Stack screenOptions={{ headerShown: false }} />
    </NotesProvider>
  );
}
