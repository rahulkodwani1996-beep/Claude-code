import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';

interface Props {
  navigation: any;
}

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.display_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Display name cannot be empty.');
      return;
    }
    updateUser({ display_name: name.trim(), bio: bio.trim(), location: location.trim() });
    Alert.alert('Saved!', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
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
        <Text style={styles.navTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=68' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Display Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your display name"
            placeholderTextColor={Colors.textSecondary}
            autoCapitalize="words"
            maxLength={50}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={t => setBio(t.slice(0, 160))}
            placeholder="Tell the community a bit about you and your pets"
            placeholderTextColor={Colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{bio.length}/160</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Location (city only)</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Mumbai"
            placeholderTextColor={Colors.textSecondary}
          />
          <Text style={styles.hint}>We only show city, never exact address.</Text>
        </View>
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
  content: { padding: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  changePhotoBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  changePhotoText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body - 1,
    color: Colors.primary,
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
  bioInput: { minHeight: 100, lineHeight: 22 },
  charCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  hint: {
    fontFamily: FontFamily.bodyItalic,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
