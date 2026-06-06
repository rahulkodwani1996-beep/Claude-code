import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { Species } from '../types';
import { useSpecies } from '../context/SpeciesContext';

const LABELS: { key: Species; icon: string; label: string }[] = [
  { key: 'dog', icon: '🐶', label: 'Dog' },
  { key: 'both', icon: '🐾', label: 'Both' },
  { key: 'cat', icon: '🐱', label: 'Cat' },
];

export const SpeciesToggle: React.FC = () => {
  const { species, setSpecies } = useSpecies();

  const getToggleColor = (): string => {
    if (species === 'dog') return Colors.accentDog;
    if (species === 'cat') return Colors.accentCat;
    return Colors.border;
  };

  return (
    <View
      style={[styles.container, { borderColor: getToggleColor() }]}
      accessibilityLabel="Filter by species"
      accessibilityRole="radiogroup"
    >
      {LABELS.map(({ key, icon, label }) => {
        const isActive = species === key;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.option,
              isActive && { backgroundColor: getToggleColor() },
            ]}
            onPress={() => setSpecies(key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isActive }}
            accessibilityLabel={`${label} mode`}
          >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 3,
  },
  icon: {
    fontSize: 13,
  },
  label: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.textPrimary,
  },
});
