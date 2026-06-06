import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from '../screens/feed/FeedScreen';
import { PostDetailScreen } from '../screens/feed/PostDetailScreen';
import { NewPostScreen } from '../screens/feed/NewPostScreen';
import { PublicProfileScreen } from '../screens/profile/PublicProfileScreen';

const Stack = createNativeStackNavigator();

export const FeedNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={FeedScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    <Stack.Screen name="NewPost" component={NewPostScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
  </Stack.Navigator>
);
