// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './store';

// Auth Screens
import SplashScreen from './screens/auth/SplashScreen';
import OnboardingScreen from './screens/auth/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from './screens/main/HomeScreen';
import ConsciousnessScreen from './screens/main/ConsciousnessScreen';
import FitnessScreen from './screens/main/FitnessScreen';
import HealthScreen from './screens/main/HealthScreen';
import MentalScreen from './screens/main/MentalScreen';
import NutritionScreen from './screens/main/NutritionScreen';

// Profile & Settings
import ProfileScreen from './screens/profile/ProfileScreen';
import SettingsScreen from './screens/profile/SettingsScreen';
import SubscriptionScreen from './screens/profile/SubscriptionScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1A2B3C',
          borderTopColor: 'transparent',
        },
        tabBarActiveTintColor: '#F2D06B',
        tabBarInactiveTintColor: '#8899AA',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />
        }}
      />
      <Tab.Screen 
        name="Consciousness" 
        component={ConsciousnessScreen}
        options={{
          title: 'Bilinç',
          tabBarIcon: ({ color }) => <BrainIcon color={color} />
        }}
      />
      <Tab.Screen 
        name="Fitness" 
        component={FitnessScreen}
        options={{
          title: 'Fitness',
          tabBarIcon: ({ color }) => <DumbbellIcon color={color} />
        }}
      />
      <Tab.Screen 
        name="Health" 
        component={HealthScreen}
        options={{
          title: 'Sağlık',
          tabBarIcon: ({ color }) => <HeartIcon color={color} />
        }}
      />
      <Tab.Screen 
        name="Mental" 
        component={MentalScreen}
        options={{
          title: 'Zihinsel',
          tabBarIcon: ({ color }) => <MindIcon color={color} />
        }}
      />
      <Tab.Screen 
        name="Nutrition" 
        component={NutritionScreen}
        options={{
          title: 'Beslenme',
          tabBarIcon: ({ color }) => <NutritionIcon color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          
          {/* Main App Flow */}
          <Stack.Screen name="MainApp" component={MainTabs} />
          
          {/* Profile & Settings */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}