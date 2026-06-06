import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Post } from '../types';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { SpeciesBadge } from './SpeciesBadge';
import { formatRelativeTime } from '../utils/formatDate';

interface Props {
  post: Post;
  onPress: () => void;
  onAuthorPress?: () => void;
  onLike?: () => void;
}

export const PostCard: React.FC<Props> = ({ post, onPress, onAuthorPress, onLike }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.96}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onAuthorPress} style={styles.authorRow}>
          <Image source={{ uri: post.author_avatar }} style={styles.avatar} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author_name}</Text>
            {post.author_pet_name && (
              <Text style={styles.petInfo}>
                {post.author_pet_name} · {post.author_pet_breed}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <SpeciesBadge species={post.species_tag} />
          <Text style={styles.time}>{formatRelativeTime(post.created_at)}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.body} numberOfLines={3}>{post.body}</Text>

      {post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      {post.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {post.tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.stat} onPress={onLike}>
          <Text style={[styles.statIcon, post.liked_by_me && styles.likedIcon]}>
            {post.liked_by_me ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.statText, post.liked_by_me && styles.likedText]}>
            {post.likes_count}
          </Text>
        </TouchableOpacity>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>💬</Text>
          <Text style={styles.statText}>{post.comments.length}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  petInfo: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  time: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 24,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 10,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.background,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statIcon: {
    fontSize: 16,
  },
  likedIcon: {},
  statText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  likedText: {
    color: '#E07A5F',
  },
});
