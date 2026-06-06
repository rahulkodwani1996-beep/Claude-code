import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';

interface Props {
  navigation: any;
  route?: { params?: { pet?: any } };
}

export const AddPetScreen: React.FC<Props> = ({ navigation, route }) => {
  const existingPet = route?.params?.pet;
  const isEdit = !!existingPet;

  const [name, setName] = useState(existingPet?.name || '');
  const [species, setSpecies] = useState<'dog' | 'cat'>(existingPet?.species || 'dog');
  const [breed, setBreed] = useState(existingPet?.breed || '');
  const [age, setAge] = useState(existingPet?.age?.toString() || '');
  const [bio, setBio] = useState(existingPet?.bio || '');

  const canSave = name.trim().length > 0 && breed.trim().length > 0;

  const handleSave = () => {
    Alert.alert(
      isEdit ? 'Changes saved!' : 'Pet added!',
      isEdit
        ? `${name}'s profile has been updated. 🐾`
        : `Welcome to PawPack, ${name}! 🐾`,
      [{ text: 'Done', onPress: () => navigation.goBack() }]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      `Remove ${name}?`,
      'This will remove this pet from your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>{isEdit ? 'Edit Pet' : 'Add a Pet'}</Text>
        <TouchableOpacity onPress={handleSave} disabled={!canSave}>
          <Text style={[styles.saveText, !canSave && styles.disabled]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.photoUpload}>
          <Text style={styles.photoEmoji}>
            {existingPet?.photo_url ? '📷' : '📷'}
          </Text>
          <Text style={styles.photoLabel}>
            {isEdit ? 'Change Photo' : 'Add Pet Photo'}
          </Text>
        </TouchableOpacity>

        <View style={styles.field}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your pet's name"
            placeholderTextColor={Colors.textSecondary}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Species *</Text>
          <View style={styles.speciesRow}>
            {(['dog', 'cat'] as const).map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.speciesBtn, species === s && styles.speciesBtnActive]}
                onPress={() => setSpecies(s)}
              >
                <Text style={styles.speciesEmoji}>{s === 'dog' ? '🐶' : '🐱'}</Text>
                <Text style={[styles.speciesLabel, species === s && styles.speciesLabelActive]}>
                  {s === 'dog' ? 'Dog' : 'Cat'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Breed *</Text>
          <TextInput
            style={styles.input}
            value={breed}
            onChangeText={setBreed}
            placeholder={species === 'dog' ? 'e.g. Golden Retriever' : 'e.g. Persian'}
            placeholderTextColor={Colors.textSecondary}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age (years)</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="e.g. 3"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Bio (optional)</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder={`A few words about ${name || 'your pet'}...`}
            placeholderTextColor={Colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        {isEdit && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Remove {name} from my profile</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  navTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  saveText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  disabled: { opacity: 0.4 },
  content: { padding: 24, gap: 4 },
  photoUpload: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  photoEmoji: { fontSize: 40 },
  photoLabel: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  field: { marginBottom: 20 },
  label: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  bioInput: { minHeight: 90, lineHeight: 22 },
  speciesRow: { flexDirection: 'row', gap: 12 },
  speciesBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  speciesBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  speciesEmoji: { fontSize: 22 },
  speciesLabel: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  speciesLabelActive: { color: Colors.primary },
  deleteBtn: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deleteBtnText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.error,
  },
});
