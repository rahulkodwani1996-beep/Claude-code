import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Species } from '../../types';
import { useSpecies } from '../../context/SpeciesContext';

interface Props {
  navigation: any;
}

const OPTIONS: { value: Species; emoji: string; title: string; subtitle: string; color: string }[] = [
  {
    value: 'dog',
    emoji: '🐶',
    title: "I'm a Dog Parent",
    subtitle: 'See posts, products, and tips curated for dogs',
    color: Colors.accentDog,
  },
  {
    value: 'cat',
    emoji: '🐱',
    title: "I'm a Cat Parent",
    subtitle: 'See posts, products, and tips curated for cats',
    color: Colors.accentCat,
  },
  {
    value: 'both',
    emoji: '🐾',
    title: 'I Have Both!',
    subtitle: 'See everything for dogs and cats',
    color: Colors.border,
  },
];

export const SpeciesSelectScreen: React.FC<Props> = ({ navigation }) => {
  const { setSpecies } = useSpecies();
  const [selected, setSelected] = useState<Species | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    setSpecies(selected);
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🏡</Text>
        <Text style={styles.title}>Welcome to PawPack!</Text>
        <Text style={styles.subtitle}>
          Tell us about your furry family so we can personalize your experience.
        </Text>
        <Text style={styles.note}>You can change this anytime in the app.</Text>
      </View>

      <View style={styles.options}>
        {OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.option,
              selected === opt.value && { borderColor: opt.color, borderWidth: 2.5 },
            ]}
            onPress={() => setSelected(opt.value)}
          >
            <View style={[styles.optionIcon, { backgroundColor: opt.color + '30' }]}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
            </View>
            <View style={[
              styles.radio,
              selected === opt.value && { backgroundColor: opt.color, borderColor: opt.color },
            ]}>
              {selected === opt.value && <Text style={styles.radioCheck}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
        onPress={handleContinue}
        disabled={!selected}
      >
        <Text style={styles.continueBtnText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  note: {
    fontFamily: FontFamily.bodyItalic,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  options: {
    gap: 12,
    flex: 1,
  },
  option: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  optionSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheck: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueBtnText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: '#fff',
  },
});
