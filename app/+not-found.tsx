import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/constants/theme';

export default function NotFoundScreen() {
  const colors = useColors();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: colors.white,
    },
    text: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 20,
      color: colors.grey[600],
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    linkText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 16,
      color: colors.primary,
    }
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}