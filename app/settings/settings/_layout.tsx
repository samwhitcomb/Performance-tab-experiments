import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="device-info"
        options={{
          title: 'Device Info',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="name"
        options={{
          title: 'Name',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="age"
        options={{
          title: 'Age',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="handedness"
        options={{
          title: 'Handedness',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="bat-settings"
        options={{
          title: 'Bat Settings',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="skill-level"
        options={{
          title: 'Skill Level',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="units"
        options={{
          title: 'Units',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: 'Language',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="theme"
        options={{
          title: 'Theme',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="session-history"
        options={{
          title: 'Session History',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="export"
        options={{
          title: 'Export Options',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Data Privacy',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          title: 'Analytics Settings',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: 'Terms and Conditions',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          title: 'FAQ',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: 'Contact Support',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="troubleshooting"
        options={{
          title: 'Troubleshooting',
          headerBackTitle: 'Settings',
        }}
      />
    </Stack>
  );
}