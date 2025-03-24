// src/screens/auth/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { auth } from '../../config/firebase';
import { setUser } from '../../store/slices/userSlice';
import { setAppReady, setFirstLaunch } from '../../store/slices/appSlice';

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('@first_launch');
        
        if (hasLaunched === null) {
          await AsyncStorage.setItem('@first_launch', 'true');
          dispatch(setFirstLaunch(true));
          setTimeout(() => {
            navigation.replace('Onboarding');
          }, 3000);
        } else {
          dispatch(setFirstLaunch(false));
          checkAuth();
        }
      } catch (error) {
        console.error('First launch check error:', error);
        checkAuth();
      }
    };

    const checkAuth = () => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          dispatch(setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }));
          setTimeout(() => {
            navigation.replace('MainApp');
          }, 2000);
        } else {
          setTimeout(() => {
            navigation.replace('Login');
          }, 2000);
        }
      });

      return unsubscribe;
    };

    checkFirstLaunch();
    dispatch(setAppReady(true));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A2B3C" />
      <LottieView
        source={require('../../assets/animations/loading/app-loading.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>ASCEND</Text>
      <Text style={styles.subtitle}>Yaşamınızı Dönüştüren AI Destekli Kişisel Koçunuz</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#8899AA',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SplashScreen;