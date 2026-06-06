import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { VetTip } from '../types';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { SpeciesBadge } from './SpeciesBadge';

const CATEGORY_COLORS: Record<string, string> = {
  nutrition: '#81C784',
  behavior: '#64B5F6',
  grooming: '#F48FB1',
  health: '#FF8A65',
  training: '#BA68C8',
  'first-aid': '#EF5350',
};

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: 'Nutrition',
  behavior: 'Behavior',
  grooming: 'Grooming',
  health: 'Health',
  training: 'Training',
  'first-aid': 'First Aid',
};

interface Props {
  tip: VetTip;
  onPress: () => void;
  featured?: boolean;
}

export const TipCard: React.FC<Props> = ({ tip, onPress, featured = false }) => {
  if (featured) {
    return (
      <TouchableOpacity style={styles.featuredCard} onPress={onPress} activeOpacity={0.94}>
        <Image source={{ uri: tip.thumbnail_url }} style={styles.featuredImage} resizeMode="cover" />
        <View style={styles.featuredOverlay} />
        <View style={styles.featuredContent}>
          <View style={styles.featuredBadgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[tip.category] }]}>
              <Text style={styles.categoryText}>{CATEGORY_LABELS[tip.category]}</Text>
            </View>
            <SpeciesBadge species={tip.species_tag} />
          </View>
          <Text style={styles.featuredTitle} numberOfLines={2}>{tip.title}</Text>
          <Text style={styles.featuredMeta}>
            {tip.author_name} · {tip.read_time_mins} min read
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.94}>
      <Image source={{ uri: tip.thumbnail_url }} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[tip.category] }]}>
            <Text style={styles.categoryText}>{CATEGORY_LABELS[tip.category]}</Text>
          </View>
          <SpeciesBadge species={tip.species_tag} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{tip.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{tip.author_name}</Text>
        <Text style={styles.credentials} numberOfLines={1}>{tip.author_credentials}</Text>
        <Text style={styles.readTime}>⏱ {tip.read_time_mins} min read</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 100,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 2,
  },
  categoryBadge: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.caption,
    color: '#fff',
  },
  title: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body - 1,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  author: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
  credentials: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  readTime: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  featuredCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  featuredTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    color: '#fff',
    lineHeight: 28,
    marginBottom: 6,
  },
  featuredMeta: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: 'rgba(255,255,255,0.8)',
  },
});
