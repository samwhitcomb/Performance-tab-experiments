import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Barlow_400Regular, Barlow_500Medium, Barlow_600SemiBold, Barlow_700Bold } from '@expo-google-fonts/barlow';
import { View, Text, StyleSheet } from 'react-native';
import { SplashScreen } from 'expo-router';
import { useColors } from '@/constants/theme';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SessionProvider } from 'contexts/SessionContext';

function RootLayoutNav() {
  const colors = useColors();
  const { isDark } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="session" options={{ 
          presentation: 'fullScreenModal',
          animation: 'fade',
          headerShown: false,
        }} />
        <Stack.Screen name="session-history" options={{ 
          headerShown: true,
          animation: 'slide_from_right',
        }} />
        <Stack.Screen 
          name="settings" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }} 
        />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  const colors = useColors();

  const [fontsLoaded, fontError] = useFonts({
    'Barlow-Regular': Barlow_400Regular,
    'Barlow-Medium': Barlow_500Medium,
    'Barlow-SemiBold': Barlow_600SemiBold,
    'Barlow-Bold': Barlow_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.primary }]}>
        <Text style={[styles.loadingText, { color: colors.white }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SessionProvider>
          <RootLayoutNav />
        </SessionProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 18,
  }
});