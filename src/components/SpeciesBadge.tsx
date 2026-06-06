import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Species } from '../types';
import { getSpeciesColor, getSpeciesTextColor } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';

interface Props {
  species: Species;
  size?: 'sm' | 'md';
}

const LABELS: Record<Species, string> = {
  dog: '🐶 Dog',
  cat: '🐱 Cat',
  both: '🐾 Both',
};

export const SpeciesBadge: React.FC<Props> = ({ species, size = 'sm' }) => {
  return (
    <View style={[
      styles.badge,
      { backgroundColor: getSpeciesColor(species) },
      size === 'md' && styles.badgeMd,
    ]}>
      <Text style={[
        styles.text,
        { color: getSpeciesTextColor(species) },
        size === 'md' && styles.textMd,
      ]}>
        {LABELS[species]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.caption,
  },
  textMd: {
    fontSize: FontSize.body - 1,
  },
});
