import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { AddPetScreen } from '../screens/profile/AddPetScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { PublicProfileScreen } from '../screens/profile/PublicProfileScreen';
import { AuthScreen } from '../screens/auth/AuthScreen';

const Stack = createNativeStackNavigator();

export const ProfileNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyProfile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="AddPet" component={AddPetScreen} options={{ presentation: 'modal' }} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
    <Stack.Screen name="Auth" component={AuthScreen} />
  </Stack.Navigator>
);
