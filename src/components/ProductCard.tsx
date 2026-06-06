import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { SpeciesBadge } from './SpeciesBadge';
import { StarRating } from './StarRating';

interface Props {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.94}>
      <Image
        source={{ uri: product.image_url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <SpeciesBadge species={product.species_tag} />
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.ratingRow}>
          <StarRating rating={product.avg_rating} size={12} />
          <Text style={styles.reviewCount}>({product.reviews.length})</Text>
        </View>
        <Text style={styles.price}>{product.price_range}</Text>
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
    flex: 1,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 10,
    gap: 4,
  },
  brand: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  name: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body - 1,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  price: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.caption,
    color: Colors.primary,
  },
});
