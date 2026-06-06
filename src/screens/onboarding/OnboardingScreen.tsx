import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  ScrollView, Animated,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🐾',
    title: 'Share Your Journey',
    subtitle: 'Connect with pet parents who truly get it. Tell your stories, ask questions, and celebrate every milestone with your furry family.',
    bg: '#FFF5EE',
  },
  {
    emoji: '🛍️',
    title: 'Discover Trusted Products',
    subtitle: 'Browse a curated directory of food, toys, grooming essentials, and more — filtered for your dog or cat. Real reviews from real pet parents.',
    bg: '#F0F7F4',
  },
  {
    emoji: '🩺',
    title: 'Learn From Vets',
    subtitle: 'Free, expert-written guides on nutrition, behavior, health, and first aid. Knowledge that actually helps you raise a healthy, happy pet.',
    bg: '#FEF9EE',
  },
];

interface Props {
  navigation: any;
}

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goTo = (index: number) => {
    setCurrent(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleNext = () => {
    if (current < SLIDES.length - 1) {
      goTo(current + 1);
    } else {
      navigation.replace('Auth');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.slider}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width, backgroundColor: slide.bg }]}>
            <Text style={styles.slideEmoji}>{slide.emoji}</Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={[styles.dot, i === current && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {current < SLIDES.length - 1 ? 'Next →' : 'Get Started'}
          </Text>
        </TouchableOpacity>

        {current === SLIDES.length - 1 && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => navigation.replace('Auth')}
          >
            <Text style={styles.skipText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        )}

        {current < SLIDES.length - 1 && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => navigation.replace('Auth')}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slider: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  slideEmoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  slideTitle: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.display,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  slideSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingHorizontal: 48,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextBtnText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.h2,
    color: '#fff',
  },
  skipBtn: {
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
