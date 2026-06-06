import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { StarSelector } from '../../components/StarRating';
import { Product } from '../../types';

interface Props {
  navigation: any;
  route: { params: { product: Product } };
}

export const WriteReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { product } = route.params;
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');

  const canSubmit = rating > 0 && body.trim().length > 0;

  const handleSubmit = () => {
    Alert.alert(
      'Review submitted!',
      'Thank you for helping other pet parents make better choices. 🐾',
      [{ text: 'Done', onPress: () => navigation.goBack() }]
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
        <Text style={styles.navTitle}>Write a Review</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.productInfo}>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your rating *</Text>
          <View style={styles.starRow}>
            <StarSelector value={rating} onChange={setRating} size={44} />
          </View>
          {rating > 0 && (
            <Text style={styles.ratingLabel}>
              {['', '😞 Poor', '😐 Fair', '😊 Good', '😄 Great', '🤩 Excellent'][rating]}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your review *</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with other pet parents. How did your pet like it? Would you recommend it?"
            placeholderTextColor={Colors.textSecondary}
            value={body}
            onChangeText={t => setBody(t.slice(0, 500))}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{body.length}/500</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={styles.submitBtnText}>Submit Review</Text>
        </TouchableOpacity>
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
    width: 60,
  },
  navTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  content: { padding: 24 },
  productInfo: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productBrand: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  section: { marginBottom: 28 },
  sectionLabel: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  starRow: { alignItems: 'flex-start' },
  ratingLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginTop: 8,
  },
  reviewInput: {
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
