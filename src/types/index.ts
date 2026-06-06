export type Species = 'dog' | 'cat' | 'both';

export interface User {
  user_id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  location?: string;
  species_preference: Species;
  joined_date: string;
  pets: Pet[];
}

export interface Pet {
  pet_id: string;
  owner_id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: number;
  photo_url: string;
  bio?: string;
}

export interface Comment {
  comment_id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  body: string;
  created_at: string;
}

export interface Post {
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_pet_name?: string;
  author_pet_breed?: string;
  species_tag: Species;
  title: string;
  body: string;
  images: string[];
  tags: string[];
  likes_count: number;
  liked_by_me: boolean;
  comments: Comment[];
  created_at: string;
}

export interface Review {
  review_id: string;
  product_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  rating: number;
  body: string;
  created_at: string;
  helpful_count: number;
}

export interface Product {
  product_id: string;
  name: string;
  brand: string;
  species_tag: Species;
  category: 'food' | 'grooming' | 'toys' | 'health' | 'accessories' | 'training';
  description: string;
  price_range: string;
  image_url: string;
  affiliate_link?: string;
  reviews: Review[];
  avg_rating: number;
}

export interface VetTip {
  tip_id: string;
  species_tag: Species;
  category: 'nutrition' | 'behavior' | 'grooming' | 'health' | 'training' | 'first-aid';
  title: string;
  body: string;
  author_name: string;
  author_credentials: string;
  thumbnail_url: string;
  read_time_mins: number;
  created_at: string;
  is_featured: boolean;
}

export type PostSortOption = 'recent' | 'most_liked' | 'most_discussed';
export type ProductSortOption = 'top_rated' | 'price_low' | 'price_high' | 'most_reviewed';
export type ProductCategory = 'all' | 'food' | 'grooming' | 'toys' | 'health' | 'accessories' | 'training';
export type TipCategory = 'all' | 'nutrition' | 'behavior' | 'grooming' | 'health' | 'training' | 'first-aid';
