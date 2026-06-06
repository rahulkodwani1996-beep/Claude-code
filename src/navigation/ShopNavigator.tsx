import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopScreen } from '../screens/shop/ShopScreen';
import { ProductDetailScreen } from '../screens/shop/ProductDetailScreen';
import { WriteReviewScreen } from '../screens/shop/WriteReviewScreen';

const Stack = createNativeStackNavigator();

export const ShopNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Shop" component={ShopScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="WriteReview" component={WriteReviewScreen} options={{ presentation: 'modal' }} />
  </Stack.Navigator>
);
