import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Image, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import AdminStack from "./AdminStack";

import vinfoLogo from "../vinfoLogo2.jpg"; // ✅ your logo

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { userRole, loading } = useContext(AuthContext);
  console.log(userRole, "////////////////");

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Image
          source={vinfoLogo}
          style={{
            width: 250,
            height: 250,
            resizeMode: "contain",
            marginBottom: 20,
          }}
        />
        <ActivityIndicator size="large" color="#0062ffff" />
      </View>
    );
  }

  let screenComponent;

  if (!userRole) {
    screenComponent = <Stack.Screen name="Auth" component={AuthStack} />;
  } else if (userRole === "user") {
    screenComponent = <Stack.Screen name="User" component={UserStack} />;
  } else if (userRole === "admin") {
    screenComponent = <Stack.Screen name="Admin" component={AdminStack} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {screenComponent}
    </Stack.Navigator>
  );
}
