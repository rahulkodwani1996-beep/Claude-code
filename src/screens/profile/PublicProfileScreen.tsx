import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { PetCard } from '../../components/PetCard';
import { PostCard } from '../../components/PostCard';
import { EmptyState } from '../../components/EmptyState';
import { MOCK_USERS, MOCK_PETS, MOCK_POSTS } from '../../data/mockData';
import { formatDisplayDate } from '../../utils/formatDate';

type Tab = 'pets' | 'posts';

interface Props {
  navigation: any;
  route: { params: { userId: string } };
}

export const PublicProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [activeTab, setActiveTab] = useState<Tab>('pets');

  const user = MOCK_USERS.find(u => u.user_id === userId);

  if (!user) {
    return (
      <View style={styles.container}>
        <EmptyState emoji="🔍" title="Profile not found" subtitle="This user may have removed their account." />
      </View>
    );
  }

  const pets = MOCK_PETS.filter(p => p.owner_id === userId);
  const posts = MOCK_POSTS.filter(p => p.author_id === userId);

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>{user.display_name}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          <Text style={styles.displayName}>{user.display_name}</Text>
          {user.location && (
            <Text style={styles.location}>📍 {user.location}</Text>
          )}
          <Text style={styles.joinedDate}>
            Joined {formatDisplayDate(user.joined_date)}
          </Text>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{pets.length}</Text>
              <Text style={styles.statLabel}>Pets</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          {(['pets', 'posts'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'pets' ? '🐾 Their Pets' : '📝 Their Posts'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'pets' && (
            <>
              {pets.length === 0 ? (
                <EmptyState emoji="🐾" title="No pets yet" subtitle="This user hasn't added any pets." />
              ) : (
                <View style={styles.petGrid}>
                  {pets.map(pet => (
                    <View key={pet.pet_id} style={styles.petGridItem}>
                      <PetCard pet={pet} />
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === 'posts' && (
            <>
              {posts.length === 0 ? (
                <EmptyState emoji="📝" title="No posts yet" subtitle="This user hasn't shared anything yet." />
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post.post_id}
                    post={post}
                    onPress={() => navigation.navigate('PetTalk', { screen: 'PostDetail', params: { post } })}
                  />
                ))
              )}
            </>
          )}
        </View>

        <View style={{ height: 32 }} />
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.primary,
    width: 60,
  },
  navTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
  displayName: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  location: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body - 1,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  joinedDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  bio: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    gap: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: { alignItems: 'center' },
  statNumber: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  tabText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body - 1,
    color: Colors.textSecondary,
  },
  tabTextActive: { color: '#fff' },
  tabContent: { paddingHorizontal: 16 },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  petGridItem: { width: '47%' },
});
