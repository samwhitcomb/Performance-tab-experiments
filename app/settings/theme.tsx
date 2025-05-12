import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useColors, typography } from '@/constants/theme';
import { SettingsMenuItem } from '@/components/settings/SettingsMenuItem';

export default function ThemeScreen() {
  const { theme, setTheme } = useTheme();
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.grey[50] }]}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.grey[400] }]}>
            Theme Preferences
          </Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.white }]}>
            <SettingsMenuItem
              title="System"
              onPress={() => setTheme('system')}
              showChevron={false}
              selected={theme === 'system'}
            />
            <SettingsMenuItem
              title="Light"
              onPress={() => setTheme('light')}
              showChevron={false}
              selected={theme === 'light'}
            />
            <SettingsMenuItem
              title="Dark"
              onPress={() => setTheme('dark')}
              showChevron={false}
              selected={theme === 'dark'}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.caption,
    textTransform: 'uppercase',
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: 'white',
  },
});