import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface FilterMenuProps {
  visible: boolean;
  onClose: () => void;
  currentFilter: string;
  onSelectFilter: (filter: string) => void;
}

export function FilterMenu({ visible, onClose, currentFilter, onSelectFilter }: FilterMenuProps) {
  const filters = ['All', 'Practice', 'Game'];

  const handleSelect = (filter: string) => {
    onSelectFilter(filter);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Sessions</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#333333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filtersContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterOption,
                  currentFilter === filter && styles.selectedFilter,
                ]}
                onPress={() => handleSelect(filter)}
              >
                <Text style={[
                  styles.filterText,
                  currentFilter === filter && styles.selectedFilterText,
                ]}>
                  {filter}
                </Text>
                
                {currentFilter === filter && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  title: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 18,
    color: colors.grey[600],
  },
  closeButton: {
    padding: 4,
  },
  filtersContainer: {
    padding: 8,
  },
  filterOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedFilter: {
    backgroundColor: 'rgba(43, 115, 223, 0.1)',
  },
  filterText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    color: colors.grey[600],
  },
  selectedFilterText: {
    fontFamily: 'Barlow-Bold',
    color: colors.primary,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});