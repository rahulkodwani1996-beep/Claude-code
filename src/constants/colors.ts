export const Colors = {
  primary: '#E07A5F',
  secondary: '#3D405B',
  accentDog: '#F2CC8F',
  accentCat: '#81B29A',
  background: '#FDFAF6',
  surface: '#FFFFFF',
  textPrimary: '#2C2C2A',
  textSecondary: '#888780',
  border: '#D3D1C7',
  error: '#D62828',
  success: '#4CAF50',
  warning: '#FF9800',
  overlay: 'rgba(0,0,0,0.4)',
  shadow: 'rgba(0,0,0,0.06)',
  dogBadge: '#F2CC8F',
  catBadge: '#81B29A',
  bothBadge: '#D3D1C7',
} as const;

export const getSpeciesColor = (species: 'dog' | 'cat' | 'both'): string => {
  if (species === 'dog') return Colors.accentDog;
  if (species === 'cat') return Colors.accentCat;
  return Colors.border;
};

export const getSpeciesTextColor = (species: 'dog' | 'cat' | 'both'): string => {
  if (species === 'dog') return '#7A5A0A';
  if (species === 'cat') return '#2D5A47';
  return Colors.textSecondary;
};
