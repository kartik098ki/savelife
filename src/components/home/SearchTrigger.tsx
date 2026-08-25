import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

interface SearchTriggerProps {
  onPress: () => void;
  placeholder?: string;
}

export const SearchTrigger: React.FC<SearchTriggerProps> = ({
  onPress,
  placeholder = 'Where do you want to go?',
}) => {
  return (
    <TouchableOpacity
      style={styles.searchPill}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Search size={22} color={COLORS.textPrimary} strokeWidth={2.2} style={styles.icon} />
      <Text style={styles.placeholderText}>{placeholder}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchPill: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
});
