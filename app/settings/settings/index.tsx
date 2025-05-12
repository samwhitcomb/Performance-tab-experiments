import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import { Smartphone, User, Palette, Database, FileText, CircleHelp as HelpCircle, MessageCircle, CircleAlert as AlertCircle, LogOut, ChevronDown, Wifi, Info, Download, Settings2, Languages, Bell, History, Share2, Shield, ChartBar as BarChart2 } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  destructive?: boolean;
}

function SettingItem({ icon, title, onPress, destructive = false }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
    >
      <View style={styles.settingContent}>
        <View style={[
          styles.iconContainer,
          destructive && styles.destructiveIcon
        ]}>
          {icon}
        </View>
        <Text style={[
          styles.settingText,
          destructive && styles.destructiveText
        ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingSection({ title, icon, children }: SettingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const rotateStyle = Platform.select({
    web: {
      transform: [{
        rotate: isExpanded ? '180deg' : '0deg'
      }]
    },
    default: {
      transform: [{
        rotate: isExpanded ? '180deg' : '0deg'
      }]
    }
  });

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggleExpand}>
        <View style={styles.sectionHeaderContent}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={rotateStyle}>
          <ChevronDown size={20} color={colors.grey[400]} />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out...');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <SettingSection 
          title="Device Settings" 
          icon={<Smartphone size={24} color={colors.primary} />}
        >
          <SettingItem
            icon={<Wifi size={20} color={colors.primary} />}
            title="Connect MLMDS"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Info size={20} color={colors.primary} />}
            title="Device Info"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Download size={20} color={colors.primary} />}
            title="Firmware Update"
            onPress={() => {}}
          />
        </SettingSection>

        <SettingSection 
          title="Account Settings" 
          icon={<User size={24} color={colors.primary} />}
        >
          <SettingItem
            icon={<User size={20} color={colors.primary} />}
            title="Name"
            onPress={() => {}}
          />
          <SettingItem
            icon={<User size={20} color={colors.primary} />}
            title="Age"
            onPress={() => {}}
          />
          <SettingItem
            icon={<User size={20} color={colors.primary} />}
            title="Handedness"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Smartphone size={20} color={colors.primary} />}
            title="Bat Type and Size"
            onPress={() => {}}
          />
          <SettingItem
            icon={<User size={20} color={colors.primary} />}
            title="Skill Level"
            onPress={() => {}}
          />
        </SettingSection>

        <SettingSection 
          title="App Preferences" 
          icon={<Settings2 size={24} color={colors.primary} />}
        >
          <SettingItem
            icon={<Settings2 size={20} color={colors.primary} />}
            title="Units"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Languages size={20} color={colors.primary} />}
            title="Language"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Palette size={20} color={colors.primary} />}
            title="Theme"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Bell size={20} color={colors.primary} />}
            title="Notifications"
            onPress={() => {}}
          />
        </SettingSection>

        <SettingSection 
          title="Data and Analytics" 
          icon={<Database size={24} color={colors.primary} />}
        >
          <SettingItem
            icon={<History size={20} color={colors.primary} />}
            title="Session History"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Share2 size={20} color={colors.primary} />}
            title="Export Options"
            onPress={() => {}}
          />
          <SettingItem
            icon={<Shield size={20} color={colors.primary} />}
            title="Data Privacy"
            onPress={() => {}}
          />
          <SettingItem
            icon={<BarChart2 size={20} color={colors.primary} />}
            title="Analytics Settings"
            onPress={() => {}}
          />
        </SettingSection>

        <View style={styles.standaloneSection}>
          <SettingItem
            icon={<FileText size={20} color={colors.primary} />}
            title="Terms and Conditions"
            onPress={() => {}}
          />
          <SettingItem
            icon={<HelpCircle size={20} color={colors.primary} />}
            title="FAQ"
            onPress={() => {}}
          />
          <SettingItem
            icon={<MessageCircle size={20} color={colors.primary} />}
            title="Contact Support"
            onPress={() => {}}
          />
          <SettingItem
            icon={<AlertCircle size={20} color={colors.primary} />}
            title="Troubleshooting"
            onPress={() => {}}
          />
          <SettingItem
            icon={<LogOut size={20} color={colors.status.error} />}
            title="Log Out"
            onPress={handleLogout}
            destructive={true}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
    backgroundColor: colors.white,
  },
  title: {
    ...typography.h1,
    color: colors.grey[600],
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.white,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.grey[600],
    marginLeft: 12,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderTopColor: colors.grey[100],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.grey[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: colors.status.error + '10',
  },
  settingText: {
    ...typography.body1,
    color: colors.grey[600],
  },
  destructiveText: {
    color: colors.status.error,
  },
  standaloneSection: {
    marginTop: 24,
    marginBottom: 32,
    backgroundColor: colors.white,
  },
});