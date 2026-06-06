import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize } from '../constants/typography';
import { FeedNavigator } from './FeedNavigator';
import { ShopNavigator } from './ShopNavigator';
import { LearnNavigator } from './LearnNavigator';
import { ProfileNavigator } from './ProfileNavigator';

const Tab = createBottomTabNavigator();

const TabIcon = ({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) => (
  <View style={{ alignItems: 'center', paddingTop: 6 }}>
    <Text style={{ fontSize: 22 }}>{emoji}</Text>
    <Text style={{
      fontFamily: focused ? FontFamily.headingMedium : FontFamily.body,
      fontSize: FontSize.tiny,
      color: focused ? Colors.primary : Colors.textSecondary,
      marginTop: 2,
    }}>
      {label}
    </Text>
  </View>
);

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="PetTalk"
        component={FeedNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Pet Talk" focused={focused} />,
          tabBarAccessibilityLabel: 'Pet Talk community feed',
        }}
      />
      <Tab.Screen
        name="PetShop"
        component={ShopNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛍️" label="Pet Shop" focused={focused} />,
          tabBarAccessibilityLabel: 'Pet Shop product directory',
        }}
      />
      <Tab.Screen
        name="PetLearn"
        component={LearnNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📖" label="Pet Learn" focused={focused} />,
          tabBarAccessibilityLabel: 'Pet Learn vet tips',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
          tabBarAccessibilityLabel: 'My profile',
        }}
      />
    </Tab.Navigator>
  );
};
