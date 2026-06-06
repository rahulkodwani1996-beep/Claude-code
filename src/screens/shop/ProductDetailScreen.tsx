import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  Dimensions, Linking, Alert,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { SpeciesBadge } from '../../components/SpeciesBadge';
import { StarRating } from '../../components/StarRating';
import { Product, Review } from '../../types';
import { formatDisplayDate } from '../../utils/formatDate';

const { width } = Dimensions.get('window');

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍖 Food',
  grooming: '✂️ Grooming',
  toys: '🧸 Toys',
  health: '💊 Health',
  accessories: '🎀 Accessories',
  training: '🎓 Training',
};

interface Props {
  navigation: any;
  route: { params: { product: Product } };
}

export const ProductDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { product } = route.params;
  const [reviewSort, setReviewSort] = useState<'recent' | 'helpful'>('recent');

  const sortedReviews = [...product.reviews].sort((a, b) => {
    if (reviewSort === 'helpful') return b.helpful_count - a.helpful_count;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: product.reviews.filter(r => r.rating === star).length,
    pct: product.reviews.length > 0
      ? (product.reviews.filter(r => r.rating === star).length / product.reviews.length) * 100
      : 0,
  }));

  const handleViewOnStore = () => {
    if (product.affiliate_link) {
      Linking.openURL(product.affiliate_link);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image_url }} style={styles.heroImage} resizeMode="cover" />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <SpeciesBadge species={product.species_tag} size="md" />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{CATEGORY_LABELS[product.category]}</Text>
            </View>
          </View>

          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <StarRating rating={product.avg_rating} size={20} showNumber />
            <Text style={styles.reviewCountText}>({product.reviews.length} reviews)</Text>
          </View>

          <Text style={styles.price}>{product.price_range}</Text>

          {product.affiliate_link && (
            <TouchableOpacity style={styles.storeBtn} onPress={handleViewOnStore}>
              <Text style={styles.storeBtnText}>View on Store →</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>

          {product.reviews.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>

              <View style={styles.ratingOverview}>
                <View style={styles.ratingBig}>
                  <Text style={styles.ratingNumber}>{product.avg_rating.toFixed(1)}</Text>
                  <StarRating rating={product.avg_rating} size={22} />
                  <Text style={styles.totalReviews}>{product.reviews.length} reviews</Text>
                </View>
                <View style={styles.ratingBars}>
                  {ratingDistribution.map(({ star, count, pct }) => (
                    <View key={star} style={styles.ratingBarRow}>
                      <Text style={styles.ratingBarLabel}>{star}★</Text>
                      <View style={styles.ratingBarTrack}>
                        <View style={[styles.ratingBarFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.ratingBarCount}>{count}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.reviewSortRow}>
                {(['recent', 'helpful'] as const).map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.reviewSortChip, reviewSort === opt && styles.reviewSortChipActive]}
                    onPress={() => setReviewSort(opt)}
                  >
                    <Text style={[
                      styles.reviewSortText,
                      reviewSort === opt && styles.reviewSortTextActive,
                    ]}>
                      {opt === 'recent' ? 'Most Recent' : 'Most Helpful'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {sortedReviews.map(review => (
                <View key={review.review_id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image source={{ uri: review.author_avatar }} style={styles.reviewAvatar} />
                    <View style={styles.reviewMeta}>
                      <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                      <Text style={styles.reviewDate}>{formatDisplayDate(review.created_at)}</Text>
                    </View>
                    <StarRating rating={review.rating} size={14} />
                  </View>
                  <Text style={styles.reviewBody}>{review.body}</Text>
                  <TouchableOpacity style={styles.helpfulBtn}>
                    <Text style={styles.helpfulText}>👍 Helpful ({review.helpful_count})</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          <TouchableOpacity
            style={styles.writeReviewBtn}
            onPress={() => navigation.navigate('WriteReview', { product })}
          >
            <Text style={styles.writeReviewBtnText}>✏️  Write a Review</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navbar: {
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
  heroImage: {
    width: '100%',
    height: 260,
    backgroundColor: Colors.border,
  },
  content: { padding: 16 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  categoryBadge: {
    backgroundColor: Colors.background,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
  },
  brand: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    color: Colors.textPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  reviewCountText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body - 1,
    color: Colors.textSecondary,
  },
  price: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    color: Colors.primary,
    marginBottom: 16,
  },
  storeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  storeBtnText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: '#fff',
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  description: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 24,
  },
  ratingOverview: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  ratingBig: { alignItems: 'center', width: 80 },
  ratingNumber: {
    fontFamily: FontFamily.heading,
    fontSize: 36,
    color: Colors.textPrimary,
  },
  totalReviews: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  ratingBars: { flex: 1, gap: 6 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingBarLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    width: 20,
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#F2CC8F',
    borderRadius: 3,
  },
  ratingBarCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    width: 20,
    textAlign: 'right',
  },
  reviewSortRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  reviewSortChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  reviewSortChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  reviewSortText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  reviewSortTextActive: { color: '#fff' },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18 },
  reviewMeta: { flex: 1 },
  reviewAuthor: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body - 1,
    color: Colors.textPrimary,
  },
  reviewDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  reviewBody: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  helpfulBtn: { alignSelf: 'flex-start' },
  helpfulText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  writeReviewBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginTop: 8,
  },
  writeReviewBtnText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.primary,
  },
});
