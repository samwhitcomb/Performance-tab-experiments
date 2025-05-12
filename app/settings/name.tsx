import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';

export default function NameScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            placeholderTextColor={colors.grey[400]}
          />
          
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            placeholderTextColor={colors.grey[400]}
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
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
    padding: 16,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    ...typography.body2,
    color: colors.grey[600],
    marginBottom: 8,
  },
  input: {
    ...typography.body1,
    color: colors.grey[600],
    borderWidth: 1,
    borderColor: colors.grey[200],
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
}); 