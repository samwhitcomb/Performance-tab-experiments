import { Stack } from 'expo-router';
import { useColors } from '@/constants/theme';

export default function SettingsLayout() {
  const colors = useColors();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.grey[600],
        headerTitleStyle: {
          fontFamily: 'Barlow-SemiBold',
        },
        headerBackTitleVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="device-info"
        options={{
          title: 'Device Info',
        }}
      />
      <Stack.Screen
        name="name"
        options={{
          title: 'Name',
        }}
      />
      <Stack.Screen
        name="age"
        options={{
          title: 'Age',
        }}
      />
      <Stack.Screen
        name="handedness"
        options={{
          title: 'Handedness',
        }}
      />
      <Stack.Screen
        name="bat-settings"
        options={{
          title: 'Bat Settings',
        }}
      />
      <Stack.Screen
        name="skill-level"
        options={{
          title: 'Skill Level',
        }}
      />
      <Stack.Screen
        name="units"
        options={{
          title: 'Units',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: 'Language',
        }}
      />
      <Stack.Screen
        name="theme"
        options={{
          title: 'Theme',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="session-history"
        options={{
          title: 'Session History',
        }}
      />
      <Stack.Screen
        name="export"
        options={{
          title: 'Export Options',
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Data Privacy',
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: 'Analytics Settings',
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: 'Terms and Conditions',
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          title: 'FAQ',
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: 'Contact Support',
        }}
      />
      <Stack.Screen
        name="troubleshooting"
        options={{
          title: 'Troubleshooting',
        }}
      />
    </Stack>
  );
}