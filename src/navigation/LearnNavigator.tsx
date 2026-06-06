import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LearnScreen } from '../screens/learn/LearnScreen';
import { TipDetailScreen } from '../screens/learn/TipDetailScreen';

const Stack = createNativeStackNavigator();

export const LearnNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Learn" component={LearnScreen} />
    <Stack.Screen name="TipDetail" component={TipDetailScreen} />
  </Stack.Navigator>
);
