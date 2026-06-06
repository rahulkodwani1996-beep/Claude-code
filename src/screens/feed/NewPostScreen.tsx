import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Species } from '../../types';
import { POST_TAGS } from '../../data/mockData';

const SPECIES_OPTIONS: { value: Species; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐶' },
  { value: 'cat', label: 'Cat', emoji: '🐱' },
  { value: 'both', label: 'Both', emoji: '🐾' },
];

interface Props {
  navigation: any;
}

export const NewPostScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [species, setSpecies] = useState<Species>('both');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    Alert.alert(
      'Story shared!',
      "Your story has been published to the PawPack community. 🐾",
      [{ text: 'Great!', onPress: () => navigation.goBack() }]
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
        <Text style={styles.navTitle}>Share Your Story</Text>
        <TouchableOpacity
          onPress={() => setPreview(!preview)}
          disabled={!canSubmit}
        >
          <Text style={[styles.previewText, !canSubmit && styles.disabled]}>
            {preview ? 'Edit' : 'Preview'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!preview ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Title *</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Give your story a catchy title..."
                placeholderTextColor={Colors.textSecondary}
                value={title}
                onChangeText={t => setTitle(t.slice(0, 100))}
                multiline
              />
              <Text style={styles.charCount}>{title.length}/100</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Your story *</Text>
              <TextInput
                style={styles.bodyInput}
                placeholder="Tell us about it... What happened? Any tips to share? The community loves details!"
                placeholderTextColor={Colors.textSecondary}
                value={body}
                onChangeText={t => setBody(t.slice(0, 2000))}
                multiline
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{body.length}/2000</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>This post is about</Text>
              <View style={styles.speciesRow}>
                {SPECIES_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.speciesChip, species === opt.value && styles.speciesChipActive]}
                    onPress={() => setSpecies(opt.value)}
                  >
                    <Text style={styles.speciesEmoji}>{opt.emoji}</Text>
                    <Text style={[
                      styles.speciesLabel,
                      species === opt.value && styles.speciesLabelActive
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tags (select all that apply)</Text>
              <View style={styles.tagsGrid}>
                {POST_TAGS.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagChip,
                      selectedTags.includes(tag) && styles.tagChipActive,
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextActive,
                    ]}>
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <TouchableOpacity style={styles.photoBtn}>
                <Text style={styles.photoBtnText}>📷  Add Photos (up to 4)</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.previewContainer}>
            <Text style={styles.previewHint}>Preview — this is how your post will look</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>{title}</Text>
              <Text style={styles.previewBody}>{body}</Text>
              {selectedTags.length > 0 && (
                <View style={styles.previewTags}>
                  {selectedTags.map(t => (
                    <Text key={t} style={styles.previewTag}>#{t}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitBtnText}>Publish Story 🐾</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: Colors.background,
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
  previewText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  disabled: { opacity: 0.4 },
  content: { padding: 16 },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  bodyInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 22,
    minHeight: 140,
  },
  charCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  speciesRow: { flexDirection: 'row', gap: 10 },
  speciesChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  speciesChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  speciesEmoji: { fontSize: 16 },
  speciesLabel: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  speciesLabelActive: { color: Colors.primary },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tagChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  tagText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  tagTextActive: { color: Colors.primary, fontFamily: FontFamily.bodyBold },
  photoBtn: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    paddingVertical: 20,
    alignItems: 'center',
  },
  photoBtnText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  previewContainer: { paddingBottom: 40 },
  previewHint: {
    fontFamily: FontFamily.bodyItalic,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  previewTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    color: Colors.textPrimary,
    marginBottom: 12,
    lineHeight: 28,
  },
  previewBody: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  previewTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  previewTag: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: '#fff',
  },
});
