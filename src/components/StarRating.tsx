import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface DisplayProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export const StarRating: React.FC<DisplayProps> = ({ rating, size = 14, showNumber = false }) => {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map(star => (
        <Text key={star} style={{ fontSize: size }}>
          {star <= Math.round(rating) ? '★' : '☆'}
        </Text>
      ))}
      {showNumber && (
        <Text style={[styles.number, { fontSize: size - 1 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

interface SelectorProps {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}

export const StarSelector: React.FC<SelectorProps> = ({ value, onChange, size = 32 }) => {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Text style={{ fontSize: size, color: star <= value ? '#F2CC8F' : Colors.border }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    color: Colors.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
});
