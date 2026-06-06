import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { SpeciesBadge } from '../../components/SpeciesBadge';
import { TipCard } from '../../components/TipCard';
import { VetTip } from '../../types';
import { MOCK_VET_TIPS } from '../../data/mockData';
import { formatDisplayDate } from '../../utils/formatDate';

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
  navigation: any;
  route: { params: { tip: VetTip } };
}

export const TipDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { tip } = route.params;
  const [helpfulVote, setHelpfulVote] = useState<'up' | 'down' | null>(null);

  const relatedTips = MOCK_VET_TIPS.filter(
    t => t.tip_id !== tip.tip_id && t.category === tip.category
  ).slice(0, 3);

  const handleHelpful = (vote: 'up' | 'down') => {
    setHelpfulVote(vote);
  };

  const renderBody = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <Text key={i} style={styles.boldLine}>
            {line.slice(2, -2)}
          </Text>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <Text key={i} style={styles.bulletLine}>
            • {line.slice(2)}
          </Text>
        );
      }
      if (line.trim() === '') return <View key={i} style={styles.spacer} />;
      return (
        <Text key={i} style={styles.bodyParagraph}>
          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        </Text>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.shareText}>📤 Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: tip.thumbnail_url }} style={styles.hero} resizeMode="cover" />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[tip.category] }]}>
              <Text style={styles.categoryText}>{CATEGORY_LABELS[tip.category]}</Text>
            </View>
            <SpeciesBadge species={tip.species_tag} size="md" />
          </View>

          <Text style={styles.title}>{tip.title}</Text>

          <View style={styles.authorCard}>
            <View style={styles.authorIcon}>
              <Text style={styles.authorIconText}>🩺</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{tip.author_name}</Text>
              <Text style={styles.authorCredentials}>{tip.author_credentials}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>⏱ {tip.read_time_mins} min read</Text>
            <Text style={styles.meta}>📅 {formatDisplayDate(tip.created_at)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.bodyContent}>
            {renderBody(tip.body)}
          </View>

          <View style={styles.divider} />

          <View style={styles.helpfulSection}>
            <Text style={styles.helpfulTitle}>Was this helpful?</Text>
            <View style={styles.helpfulBtns}>
              <TouchableOpacity
                style={[styles.helpfulBtn, helpfulVote === 'up' && styles.helpfulBtnActive]}
                onPress={() => handleHelpful('up')}
              >
                <Text style={styles.helpfulBtnText}>👍 Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.helpfulBtn, helpfulVote === 'down' && styles.helpfulBtnActive]}
                onPress={() => handleHelpful('down')}
              >
                <Text style={styles.helpfulBtnText}>👎 No</Text>
              </TouchableOpacity>
            </View>
            {helpfulVote && (
              <Text style={styles.helpfulThanks}>
                {helpfulVote === 'up' ? '❤️ Thanks for the feedback!' : 'We\'ll work to improve this.'}
              </Text>
            )}
          </View>

          {relatedTips.length > 0 && (
            <>
              <Text style={styles.relatedTitle}>Related Articles</Text>
              {relatedTips.map(related => (
                <TipCard
                  key={related.tip_id}
                  tip={related}
                  onPress={() => navigation.push('TipDetail', { tip: related })}
                />
              ))}
            </>
          )}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  backText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  shareText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  hero: { width: '100%', height: 220 },
  content: { padding: 16 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12, marginTop: 16 },
  categoryBadge: {
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.caption,
    color: '#fff',
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: 16,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorIconText: { fontSize: 22 },
  authorInfo: { flex: 1 },
  authorName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  authorCredentials: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  meta: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 20,
  },
  bodyContent: { gap: 2 },
  bodyParagraph: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  boldLine: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginTop: 8,
  },
  bulletLine: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 26,
    paddingLeft: 8,
  },
  spacer: { height: 8 },
  helpfulSection: { alignItems: 'center', gap: 16 },
  helpfulTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  helpfulBtns: { flexDirection: 'row', gap: 12 },
  helpfulBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  helpfulBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  helpfulBtnText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  helpfulThanks: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  relatedTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 4,
  },
});
