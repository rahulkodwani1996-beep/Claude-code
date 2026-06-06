import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, TextInput,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { ProductCard } from '../../components/ProductCard';
import { EmptyState } from '../../components/EmptyState';
import { SpeciesToggle } from '../../components/SpeciesToggle';
import { useSpecies, matchesSpeciesFilter } from '../../context/SpeciesContext';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { ProductCategory, ProductSortOption } from '../../types';

const CATEGORIES: { key: ProductCategory; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '🐾' },
  { key: 'food', label: 'Food', emoji: '🍖' },
  { key: 'grooming', label: 'Grooming', emoji: '✂️' },
  { key: 'toys', label: 'Toys', emoji: '🧸' },
  { key: 'health', label: 'Health', emoji: '💊' },
  { key: 'accessories', label: 'Accessories', emoji: '🎀' },
  { key: 'training', label: 'Training', emoji: '🎓' },
];

const SORT_OPTIONS: { key: ProductSortOption; label: string }[] = [
  { key: 'top_rated', label: '★ Top Rated' },
  { key: 'most_reviewed', label: '💬 Most Reviewed' },
  { key: 'price_low', label: '↑ Price' },
  { key: 'price_high', label: '↓ Price' },
];

interface Props {
  navigation: any;
}

export const ShopScreen: React.FC<Props> = ({ navigation }) => {
  const { species } = useSpecies();
  const [category, setCategory] = useState<ProductCategory>('all');
  const [sort, setSort] = useState<ProductSortOption>('top_rated');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => matchesSpeciesFilter(p.species_tag, species));

    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      if (sort === 'top_rated') return b.avg_rating - a.avg_rating;
      if (sort === 'most_reviewed') return b.reviews.length - a.reviews.length;
      return 0;
    });
  }, [species, category, sort, search]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Pet Shop</Text>
        <SpeciesToggle />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContent}
        style={styles.categoryScroll}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryChip, category === cat.key && styles.categoryChipActive]}
            onPress={() => setCategory(cat.key)}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text style={[styles.categoryLabel, category === cat.key && styles.categoryLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortContent}
        style={styles.sortScroll}
      >
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortChip, sort === opt.key && styles.sortChipActive]}
            onPress={() => setSort(opt.key)}
          >
            <Text style={[styles.sortText, sort === opt.key && styles.sortTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        keyExtractor={p => p.product_id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🛍️"
            title="No products found"
            subtitle="Try adjusting your filters or search terms."
            ctaLabel="Clear Filters"
            onCta={() => { setCategory('all'); setSearch(''); }}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.display,
    color: Colors.secondary,
  },
  searchRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  categoryScroll: { marginBottom: 8 },
  categoryContent: { paddingHorizontal: 16, gap: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  categoryEmoji: { fontSize: 14 },
  categoryLabel: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  categoryLabelActive: { color: '#fff' },
  sortScroll: { marginBottom: 12 },
  sortContent: { paddingHorizontal: 16, gap: 8 },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  sortText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  sortTextActive: { color: Colors.primary, fontFamily: FontFamily.bodyBold },
  grid: { paddingHorizontal: 16, paddingBottom: 32 },
  gridRow: { gap: 12, marginBottom: 12 },
});
