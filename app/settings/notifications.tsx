import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';
import { SettingsMenuItem } from '@/components/settings/SettingsMenuItem';

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <View style={styles.sectionContent}>
            <View style={styles.notificationItem}>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Session Reminders</Text>
                <Text style={styles.notificationSubtitle}>Get reminded about your practice sessions</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.grey[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.notificationItem}>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Achievement Alerts</Text>
                <Text style={styles.notificationSubtitle}>Get notified when you reach new milestones</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.grey[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.notificationItem}>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Progress Updates</Text>
                <Text style={styles.notificationSubtitle}>Weekly summaries of your performance</Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: colors.grey[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          <View style={styles.sectionContent}>
            <View style={styles.notificationItem}>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Weekly Reports</Text>
                <Text style={styles.notificationSubtitle}>Receive detailed performance reports</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.grey[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.notificationItem}>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Tips & Insights</Text>
                <Text style={styles.notificationSubtitle}>Get personalized improvement suggestions</Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: colors.grey[200], true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  notificationText: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    ...typography.body1,
    color: colors.grey[600],
  },
  notificationSubtitle: {
    ...typography.caption,
    color: colors.grey[400],
    marginTop: 2,
  },
}); 