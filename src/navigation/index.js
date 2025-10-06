import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

import AuthStack from "./AuthStack";
import UserStack from "./UserStack";
import AdminStack from "./AdminStack";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { userRole, loading } = useContext(AuthContext);
  console.log(userRole, '////////////////');

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00ff15ff" />
        <Text style={{color: "#00ff15ff"}}>loading...</Text>
      </View>
    );
  }

  let screenComponent;

  if (!userRole) {
  screenComponent = <Stack.Screen name="Auth" component={AuthStack} />;
} else if (userRole === "user") {
  screenComponent = <Stack.Screen name="User" component={UserStack} />;
} else if (userRole === "admin"){
  screenComponent = <Stack.Screen name="Admin" component={AdminStack} />;
}

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* {!userRole ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : userRole === "user" ? (
        <Stack.Screen name="User" component={UserStack} />
      ) : userRole === "admin"(
        <Stack.Screen name="Admin" component={AdminStack} />
      )} */}
      {screenComponent}
    </Stack.Navigator>
  );
}
