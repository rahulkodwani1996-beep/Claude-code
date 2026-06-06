import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Pet } from '../types';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';

interface Props {
  pet: Pet;
  onPress?: () => void;
}

export const PetCard: React.FC<Props> = ({ pet, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: pet.photo_url }} style={styles.photo} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.breed}>{pet.breed}</Text>
        <Text style={styles.age}>
          {pet.species === 'dog' ? '🐶' : '🐱'} {pet.age} yr{pet.age !== 1 ? 's' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  photo: {
    width: '100%',
    height: 120,
  },
  info: {
    padding: 10,
  },
  name: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  breed: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  age: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
