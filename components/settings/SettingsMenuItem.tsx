import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Check } from 'lucide-react-native';
import { useColors, typography } from '@/constants/theme';

interface SettingsMenuItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  isHeader?: boolean;
  selected?: boolean;
}

export function SettingsMenuItem({ 
  icon, 
  title, 
  subtitle,
  onPress, 
  showChevron = true,
  destructive = false,
  isHeader = false,
  selected = false,
}: SettingsMenuItemProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isHeader && styles.headerContainer,
        destructive && styles.destructiveContainer,
        { backgroundColor: colors.white, borderBottomColor: colors.grey[100] }
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon && (
          <View style={[
            styles.iconContainer,
            destructive && styles.destructiveIcon,
            { backgroundColor: colors.grey[50] }
          ]}>
            {icon}
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            destructive ? { color: colors.status.error } : { color: colors.grey[600] }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.grey[400] }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {selected ? (
        <Check size={20} color={colors.primary} />
      ) : showChevron && !destructive ? (
        <ChevronRight size={20} color={colors.grey[400]} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerContainer: {
    borderBottomWidth: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body1,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  destructiveContainer: {},
});