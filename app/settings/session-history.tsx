import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';
import { SettingsMenuItem } from '@/components/settings/SettingsMenuItem';
import { Download, Trash2, Share2, Shield } from 'lucide-react-native';

export default function SessionHistoryScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              icon={<Download size={20} color={colors.primary} />}
              title="Export Data"
              subtitle="Download your session data in CSV format"
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon={<Share2 size={20} color={colors.primary} />}
              title="Share Data"
              subtitle="Share your progress with coaches"
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon={<Trash2 size={20} color={colors.status.error} />}
              title="Clear History"
              subtitle="Delete all session data"
              onPress={() => {}}
              destructive={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              icon={<Shield size={20} color={colors.primary} />}
              title="Data Privacy"
              subtitle="Manage your data sharing preferences"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Performance Trends"
              subtitle="View your progress over time"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Session Statistics"
              subtitle="Detailed analysis of your sessions"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Custom Reports"
              subtitle="Create personalized reports"
              onPress={() => {}}
            />
          </View>
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
}); 