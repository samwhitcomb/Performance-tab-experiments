import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Smartphone, User, Palette, Database, FileText, CircleHelp as HelpCircle, MessageCircle, CircleAlert as AlertCircle, LogOut, Wifi, Info, Download, Settings2, Languages, Bell, History, Share2, Shield, ChartBar as BarChart2 } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import { SettingsMenuItem } from '@/components/settings/SettingsMenuItem';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <SettingSection title="Device Settings">
          <SettingsMenuItem
            icon={<Smartphone size={20} color={colors.primary} />}
            title="Device Management"
            subtitle="Connect and manage your MLMDS device"
            onPress={() => router.push('/settings/device-info')}
          />
        </SettingSection>

        <SettingSection title="Account Settings">
          <SettingsMenuItem
            icon={<User size={20} color={colors.primary} />}
            title="Profile"
            subtitle="Update your personal information"
            onPress={() => router.push('/settings/name')}
          />
          <SettingsMenuItem
            icon={<Settings2 size={20} color={colors.primary} />}
            title="Equipment"
            subtitle="Configure your bat settings"
            onPress={() => router.push('/settings/bat-settings')}
          />
        </SettingSection>

        <SettingSection title="App Preferences">
          <SettingsMenuItem
            icon={<Settings2 size={20} color={colors.primary} />}
            title="General"
            subtitle="Units, language, and theme settings"
            onPress={() => router.push('/settings/units')}
          />
          <SettingsMenuItem
            icon={<Bell size={20} color={colors.primary} />}
            title="Notifications"
            subtitle="Configure app notifications"
            onPress={() => router.push('/settings/notifications')}
          />
        </SettingSection>

        <SettingSection title="Data and Analytics">
          <SettingsMenuItem
            icon={<Database size={20} color={colors.primary} />}
            title="Data Management"
            subtitle="Export, privacy, and analytics settings"
            onPress={() => router.push('/settings/session-history')}
          />
        </SettingSection>

        <SettingSection title="Help & Support">
          <SettingsMenuItem
            icon={<HelpCircle size={20} color={colors.primary} />}
            title="Support Center"
            subtitle="FAQ, troubleshooting, and contact support"
            onPress={() => router.push('./support')}
          />
        </SettingSection>

        <View style={styles.logoutContainer}>
          <SettingsMenuItem
            icon={<LogOut size={20} color={colors.status.error} />}
            title="Log Out"
            onPress={handleLogout}
            destructive={true}
            showChevron={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey[50],
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.grey[400],
    textTransform: 'uppercase',
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: colors.white,
  },
  logoutContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
});