import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';
import { SettingsMenuItem } from '@/components/settings/SettingsMenuItem';
import { MessageCircle, CircleHelp as HelpCircle, FileText, AlertCircle } from 'lucide-react-native';

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              icon={<HelpCircle size={20} color={colors.primary} />}
              title="FAQ"
              subtitle="Find answers to common questions"
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon={<AlertCircle size={20} color={colors.primary} />}
              title="Troubleshooting Guide"
              subtitle="Solve common issues"
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon={<FileText size={20} color={colors.primary} />}
              title="User Manual"
              subtitle="Detailed guide to using the app"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              icon={<MessageCircle size={20} color={colors.primary} />}
              title="Live Chat"
              subtitle="Chat with our support team"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Email Support"
              subtitle="support@mlmds.com"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Phone Support"
              subtitle="1-800-MLMDS-HELP"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Terms of Service"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Privacy Policy"
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