import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  FlatList,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { SpeciesToggle } from '../../components/SpeciesToggle';
import { PetCard } from '../../components/PetCard';
import { PostCard } from '../../components/PostCard';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PETS, MOCK_POSTS } from '../../data/mockData';
import { formatDisplayDate } from '../../utils/formatDate';

type Tab = 'pets' | 'posts' | 'reviews';

interface Props {
  navigation: any;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isGuest, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('pets');

  if (!isLoggedIn && !isGuest) {
    return (
      <View style={styles.container}>
        <EmptyState
          emoji="🔐"
          title="Sign in to see your profile"
          subtitle="Create an account to track your posts, manage your pets, and connect with the community."
          ctaLabel="Sign In / Sign Up"
          onCta={() => navigation.navigate('Auth')}
        />
      </View>
    );
  }

  if (isGuest) {
    return (
      <View style={styles.container}>
        <EmptyState
          emoji="🐾"
          title="Create your profile"
          subtitle="Sign up to add your pets, share stories, and become part of the PawPack community."
          ctaLabel="Create Account"
          onCta={() => navigation.navigate('Auth')}
        />
      </View>
    );
  }

  const myPets = MOCK_PETS.filter(p => p.owner_id === 'u1').concat(
    MOCK_PETS.filter(p => p.owner_id === 'u3')
  ).slice(0, 4);

  const myPosts = MOCK_POSTS.filter(p => p.author_id === 'u1');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.screenTitle}>My Profile</Text>
          <View style={styles.headerActions}>
            <SpeciesToggle />
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Image
              source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=68' }}
              style={styles.avatar}
            />
            <View style={styles.avatarEditBadge}>
              <Text style={styles.avatarEditIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>{user?.display_name}</Text>
            {user?.location && (
              <Text style={styles.location}>📍 {user.location}</Text>
            )}
            <Text style={styles.joinedDate}>
              Joined {user?.joined_date ? formatDisplayDate(user.joined_date) : ''}
            </Text>
          </View>

          {user?.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        {(['pets', 'posts', 'reviews'] as Tab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'pets' ? '🐾 My Pets' : tab === 'posts' ? '📝 My Posts' : '⭐ My Reviews'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'pets' && (
          <>
            {myPets.length === 0 ? (
              <EmptyState
                emoji="🐶"
                title="No pets yet"
                subtitle="Add your furry friends to your profile!"
                ctaLabel="Add a Pet"
                onCta={() => navigation.navigate('AddPet')}
              />
            ) : (
              <>
                <View style={styles.petGrid}>
                  {myPets.map(pet => (
                    <View key={pet.pet_id} style={styles.petGridItem}>
                      <PetCard
                        pet={pet}
                        onPress={() => navigation.navigate('AddPet', { pet })}
                      />
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.addPetBtn}
                  onPress={() => navigation.navigate('AddPet')}
                >
                  <Text style={styles.addPetBtnText}>+ Add Another Pet</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {activeTab === 'posts' && (
          <>
            {myPosts.length === 0 ? (
              <EmptyState
                emoji="📝"
                title="No posts yet"
                subtitle="Share your first story with the PawPack community!"
                ctaLabel="Share a Story"
                onCta={() => navigation.navigate('PetTalk', { screen: 'NewPost' })}
              />
            ) : (
              myPosts.map(post => (
                <PostCard
                  key={post.post_id}
                  post={post}
                  onPress={() => navigation.navigate('PetTalk', { screen: 'PostDetail', params: { post } })}
                />
              ))
            )}
          </>
        )}

        {activeTab === 'reviews' && (
          <EmptyState
            emoji="⭐"
            title="No reviews yet"
            subtitle="Review a product and help other pet parents make better choices!"
            ctaLabel="Browse Products"
            onCta={() => navigation.navigate('PetShop')}
          />
        )}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.display,
    color: Colors.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsIcon: { fontSize: 22 },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 12,
    backgroundColor: Colors.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  avatarEditIcon: { fontSize: 11 },
  profileInfo: { alignItems: 'center', marginBottom: 10 },
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
  },
  bio: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  editProfileBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 4,
  },
  editProfileBtnText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
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
    fontSize: FontSize.caption,
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
  addPetBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  addPetBtnText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
});
