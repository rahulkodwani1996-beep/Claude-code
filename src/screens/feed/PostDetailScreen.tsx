import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Dimensions, FlatList,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { SpeciesBadge } from '../../components/SpeciesBadge';
import { Post, Comment } from '../../types';
import { formatRelativeTime, formatDisplayDate } from '../../utils/formatDate';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: { params: { post: Post } };
}

export const PostDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const [post, setPost] = useState<Post>(route.params.post);
  const [commentText, setCommentText] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const handleLike = () => {
    setPost(p => ({
      ...p,
      liked_by_me: !p.liked_by_me,
      likes_count: p.liked_by_me ? p.likes_count - 1 : p.likes_count + 1,
    }));
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      comment_id: `c_${Date.now()}`,
      post_id: post.post_id,
      author_id: 'current',
      author_name: 'You',
      author_avatar: 'https://i.pravatar.cc/150?img=68',
      body: commentText.trim(),
      created_at: new Date().toISOString(),
    };
    setPost(p => ({ ...p, comments: [...p.comments, newComment] }));
    setCommentText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn}>
          <Text style={styles.menuText}>•••</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.authorRow}>
          <TouchableOpacity
            style={styles.authorLeft}
            onPress={() => navigation.navigate('PublicProfile', { userId: post.author_id })}
          >
            <Image source={{ uri: post.author_avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.authorName}>{post.author_name}</Text>
              {post.author_pet_name && (
                <Text style={styles.petInfo}>
                  {post.author_pet_name} · {post.author_pet_breed}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.authorRight}>
            <SpeciesBadge species={post.species_tag} size="md" />
            <Text style={styles.date}>{formatDisplayDate(post.created_at)}</Text>
          </View>
        </View>

        <Text style={styles.title}>{post.title}</Text>

        {post.images.length > 0 && (
          <View style={styles.gallery}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={e => setImageIndex(Math.round(e.nativeEvent.contentOffset.x / (width - 32)))}
              scrollEventThrottle={16}
            >
              {post.images.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={[styles.galleryImage, { width: width - 32 }]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            {post.images.length > 1 && (
              <View style={styles.imageDots}>
                {post.images.map((_, i) => (
                  <View key={i} style={[styles.imageDot, i === imageIndex && styles.imageDotActive]} />
                ))}
              </View>
            )}
          </View>
        )}

        <Text style={styles.body}>{post.body}</Text>

        {post.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {post.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Text style={styles.actionIcon}>{post.liked_by_me ? '❤️' : '🤍'}</Text>
            <Text style={[styles.actionText, post.liked_by_me && styles.likedText]}>
              {post.likes_count} likes
            </Text>
          </TouchableOpacity>
          <View style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{post.comments.length} comments</Text>
          </View>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.commentsHeader}>Comments ({post.comments.length})</Text>

        {post.comments.map(comment => (
          <View key={comment.comment_id} style={styles.comment}>
            <Image source={{ uri: comment.author_avatar }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.author_name}</Text>
                <Text style={styles.commentTime}>{formatRelativeTime(comment.created_at)}</Text>
              </View>
              <Text style={styles.commentBody}>{comment.body}</Text>
            </View>
          </View>
        ))}

        {post.comments.length === 0 && (
          <Text style={styles.noComments}>No comments yet. Be the first!</Text>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          placeholderTextColor={Colors.textSecondary}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !commentText.trim() && styles.sendBtnDisabled]}
          onPress={handleComment}
          disabled={!commentText.trim()}
        >
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  backBtn: { padding: 4 },
  backText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: Colors.primary,
  },
  menuBtn: { padding: 4 },
  menuText: {
    fontSize: 18,
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  scroll: { flex: 1 },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  authorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
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
  authorRight: { alignItems: 'flex-end', gap: 4 },
  date: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h1,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 16,
    lineHeight: 28,
  },
  gallery: {
    marginBottom: 16,
  },
  galleryImage: {
    height: 240,
    borderRadius: 0,
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  imageDotActive: {
    backgroundColor: Colors.primary,
    width: 18,
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.background,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: { fontSize: 18 },
  actionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  likedText: { color: Colors.primary },
  commentsHeader: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  comment: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentContent: { flex: 1 },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body - 1,
    color: Colors.textPrimary,
  },
  commentTime: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  commentBody: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  noComments: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: {
    fontFamily: FontFamily.headingMedium,
    fontSize: FontSize.body,
    color: '#fff',
  },
});
