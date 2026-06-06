import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, RefreshControl, TextInput,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { PostCard } from '../../components/PostCard';
import { EmptyState } from '../../components/EmptyState';
import { SpeciesToggle } from '../../components/SpeciesToggle';
import { useSpecies, matchesSpeciesFilter } from '../../context/SpeciesContext';
import { MOCK_POSTS, POST_TAGS } from '../../data/mockData';
import { Post, PostSortOption } from '../../types';

const SORT_OPTIONS: { key: PostSortOption; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'most_liked', label: 'Most Liked' },
  { key: 'most_discussed', label: 'Most Discussed' },
];

interface Props {
  navigation: any;
}

export const FeedScreen: React.FC<Props> = ({ navigation }) => {
  const { species } = useSpecies();
  const [sort, setSort] = useState<PostSortOption>('recent');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const filteredPosts = useMemo(() => {
    let result = posts.filter(p => matchesSpeciesFilter(p.species_tag, species));

    if (selectedTags.length > 0) {
      result = result.filter(p =>
        selectedTags.some(t => p.tags.includes(t))
      );
    }

    return [...result].sort((a, b) => {
      if (sort === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === 'most_liked') return b.likes_count - a.likes_count;
      return b.comments.length - a.comments.length;
    });
  }, [posts, species, sort, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p =>
      p.post_id === postId
        ? { ...p, liked_by_me: !p.liked_by_me, likes_count: p.liked_by_me ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const POPULAR_TAGS = POST_TAGS.slice(0, 10);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Pet Talk</Text>
        <SpeciesToggle />
      </View>

      <View style={styles.sortRow}>
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortChip, sort === opt.key && styles.sortChipActive]}
            onPress={() => setSort(opt.key)}
          >
            <Text style={[styles.sortChipText, sort === opt.key && styles.sortChipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagScrollContent}
        style={styles.tagScroll}
      >
        {POPULAR_TAGS.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={[styles.tagChipText, selectedTags.includes(tag) && styles.tagChipTextActive]}>
              #{tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredPosts}
        keyExtractor={p => p.post_id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
            onAuthorPress={() => navigation.navigate('PublicProfile', { userId: item.author_id })}
            onLike={() => toggleLike(item.post_id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🐾"
            title="No stories yet"
            subtitle="Be the first to share yours! Your community is waiting."
            ctaLabel="Share a Story"
            onCta={() => navigation.navigate('NewPost')}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewPost')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>✏️  Share your story</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  sortRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  sortChip: {
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  sortChipText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  sortChipTextActive: {
    color: '#fff',
  },
  tagScroll: {
    marginBottom: 8,
  },
  tagScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tagChip: {
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagChipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  tagChipText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  tagChipTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bodyBold,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.body,
    color: '#fff',
  },
});
