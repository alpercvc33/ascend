// src/screens/auth/OnboardingScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: "ASCEND'e Hoş Geldiniz",
    description: "Yapay zeka destekli kişisel gelişim yolculuğunuz başlıyor.",
    animation: require('../../assets/animations/welcome.json')
  },
  {
    title: "Kişiselleştirilmiş Deneyim",
    description: "AI koçunuz size özel programlar ve öneriler sunacak.",
    animation: require('../../assets/animations/ai-coach.json')
  },
  {
    title: "5 Boyutlu Gelişim",
    description: "Bilinç, Fitness, Sağlık, Zihin ve Beslenme alanlarında bütünsel gelişim.",
    animation: require('../../assets/animations/holistic.json')
  },
  {
    title: "Hemen Başlayın",
    description: "Ücretsiz deneme süreniz sizi bekliyor!",
    animation: require('../../assets/animations/start.json')
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = new Animated.Value(0);
  const dispatch = useDispatch();

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <LottieView
          source={item.animation}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Register');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      />
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={index}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.replace('Register')}
        >
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>
            {currentIndex === onboardingData.length - 1 ? 'Başla' : 'İleri'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  animation: {
    width: width * 0.8,
    height: width * 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 150,
    width: '100%',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F2D06B',
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  skipButton: {
    padding: 15,
  },
  skipText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#F2D06B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  nextText: {
    color: '#1A2B3C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});