import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TextInput,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { TipCard } from '../../components/TipCard';
import { EmptyState } from '../../components/EmptyState';
import { SpeciesToggle } from '../../components/SpeciesToggle';
import { useSpecies, matchesSpeciesFilter } from '../../context/SpeciesContext';
import { MOCK_VET_TIPS } from '../../data/mockData';
import { TipCategory } from '../../types';

const CATEGORIES: { key: TipCategory; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '📚' },
  { key: 'nutrition', label: 'Nutrition', emoji: '🥗' },
  { key: 'behavior', label: 'Behavior', emoji: '🧠' },
  { key: 'grooming', label: 'Grooming', emoji: '✂️' },
  { key: 'health', label: 'Health', emoji: '💊' },
  { key: 'training', label: 'Training', emoji: '🎓' },
  { key: 'first-aid', label: 'First Aid', emoji: '🩺' },
];

interface Props {
  navigation: any;
}

export const LearnScreen: React.FC<Props> = ({ navigation }) => {
  const { species } = useSpecies();
  const [category, setCategory] = useState<TipCategory>('all');
  const [search, setSearch] = useState('');

  const filteredTips = useMemo(() => {
    let result = MOCK_VET_TIPS.filter(t => matchesSpeciesFilter(t.species_tag, species));

    if (category !== 'all') {
      result = result.filter(t => t.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q)
      );
    }

    return result;
  }, [species, category, search]);

  const featuredTip = MOCK_VET_TIPS.find(t =>
    t.is_featured && matchesSpeciesFilter(t.species_tag, species)
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Pet Learn</Text>
        <SpeciesToggle />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search vet tips..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filteredTips.filter(t => !t.is_featured || category !== 'all')}
        keyExtractor={t => t.tip_id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {featuredTip && category === 'all' && !search && (
              <TipCard
                tip={featuredTip}
                onPress={() => navigation.navigate('TipDetail', { tip: featuredTip })}
                featured
              />
            )}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContent}
              style={styles.categoryScroll}
            >
              {CATEGORIES.map(cat => (
                <View
                  key={cat.key}
                  style={[styles.categoryChip, category === cat.key && styles.categoryChipActive]}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text
                    style={[styles.categoryLabel, category === cat.key && styles.categoryLabelActive]}
                    onPress={() => setCategory(cat.key)}
                  >
                    {cat.label}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => (
          <TipCard
            tip={item}
            onPress={() => navigation.navigate('TipDetail', { tip: item })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🩺"
            title="No tips found"
            subtitle="Try a different category or search term."
          />
        }
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
    marginBottom: 12,
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
  categoryScroll: { marginBottom: 16 },
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
  list: { paddingHorizontal: 16, paddingBottom: 32 },
});
