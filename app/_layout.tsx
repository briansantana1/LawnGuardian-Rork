import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LawnProvider } from "@/providers/LawnProvider";
import Colors from "@/constants/colors";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: Colors.light.surface,
        },
        headerTintColor: Colors.light.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="add-task" 
        options={{ 
          presentation: "modal",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="task/[id]" 
        options={{ 
          presentation: "card",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="plans" 
        options={{ 
          presentation: "card",
          title: "Plans",
        }} 
      />
      <Stack.Screen 
        name="cancel-membership" 
        options={{ 
          presentation: "card",
          title: "Cancel Membership",
        }} 
      />
      <Stack.Screen 
        name="restore-membership" 
        options={{ 
          presentation: "card",
          title: "Restore Membership",
        }} 
      />
      <Stack.Screen 
        name="contact-us" 
        options={{ 
          presentation: "card",
          title: "Contact Us",
        }} 
      />
      <Stack.Screen 
        name="my-saved-plans" 
        options={{ 
          presentation: "card",
          title: "My Saved Plans",
        }} 
      />
      <Stack.Screen 
        name="privacy-policy" 
        options={{ 
          presentation: "card",
          title: "Privacy Policy",
        }} 
      />
      <Stack.Screen 
        name="terms-of-use" 
        options={{ 
          presentation: "card",
          title: "Terms of Use",
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LawnProvider>
            <RootLayoutNav />
          </LawnProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
