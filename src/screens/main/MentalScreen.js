// src/screens/main/MentalScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Brain, Target, Clock, Award } from 'lucide-react';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const MentalScreen = () => {
  const user = useSelector(state => state.user.data);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [progress] = useState(new Animated.Value(0));

  const mentalStats = {
    focusScore: 85,
    exercisesCompleted: 12,
    streak: 7,
    timeSpent: '45dk'
  };

  const categories = [
    {
      id: 'focus',
      title: 'Odaklanma Egzersizleri',
      exercises: [
        {
          id: 1,
          title: 'Derin Odaklanma',
          duration: '15 dk',
          type: 'Odak Geliştirme',
          description: 'Zihinsel netlik ve sürdürülebilir odaklanma için egzersizler.',
          imageUrl: '/exercises/focus.jpg',
          level: 'Orta',
          benefits: [
            'Odaklanma süresini artırır',
            'Zihinsel netliği geliştirir',
            'Üretkenliği artırır'
          ]
        },
        {
          id: 2,
          title: 'Pomodoro Tekniği',
          duration: '25 dk',
          type: 'Zaman Yönetimi',
          description: 'Verimli çalışma ve dinlenme döngüleri ile maksimum performans.',
          imageUrl: '/exercises/pomodoro.jpg',
          level: 'Başlangıç',
          benefits: [
            'Zaman yönetimini geliştirir',
            'Verimliliği artırır',
            'Stresi azaltır'
          ]
        }
      ]
    },
    {
      id: 'memory',
      title: 'Hafıza Geliştirme',
      exercises: [
        {
          id: 3,
          title: 'Görsel Hafıza',
          duration: '10 dk',
          type: 'Hafıza Egzersizi',
          description: 'Görsel hafızayı güçlendiren interaktif alıştırmalar.',
          imageUrl: '/exercises/memory.jpg',
          level: 'İleri',
          benefits: [
            'Görsel hafızayı güçlendirir',
            'Detay algısını artırır',
            'Öğrenme kapasitesini geliştirir'
          ]
        }
      ]
    },
    {
      id: 'creativity',
      title: 'Yaratıcılık',
      exercises: [
        {
          id: 4,
          title: 'Düşünce Haritaları',
          duration: '20 dk',
          type: 'Yaratıcı Düşünme',
          description: 'Yaratıcı düşünme ve problem çözme teknikleri.',
          imageUrl: '/exercises/creativity.jpg',
          level: 'Orta',
          benefits: [
            'Yaratıcı düşünmeyi geliştirir',
            'Problem çözme yeteneğini artırır',
            'Yeni fikirler üretmeyi kolaylaştırır'
          ]
        }
      ]
    }
  ];

  const renderStatsSection = () => (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Zihinsel Performans</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Brain color="#F2D06B" size={24} />
          <Text style={styles.statValue}>{mentalStats.focusScore}</Text>
          <Text style={styles.statLabel}>Odak Puanı</Text>
        </View>
        <View style={styles.statCard}>
          <Target color="#F2D06B" size={24} />
          <Text style={styles.statValue}>{mentalStats.exercisesCompleted}</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
        </View>
        <View style={styles.statCard}>
          <Clock color="#F2D06B" size={24} />
          <Text style={styles.statValue}>{mentalStats.timeSpent}</Text>
          <Text style={styles.statLabel}>Süre</Text>
        </View>
        <View style={styles.statCard}>
          <Award color="#F2D06B" size={24} />
          <Text style={styles.statValue}>{mentalStats.streak}</Text>
          <Text style={styles.statLabel}>Seri</Text>
        </View>
      </View>
    </View>
  );

  const renderExerciseCard = (exercise) => (
    <TouchableOpacity
      key={exercise.id}
      style={styles.exerciseCard}
      onPress={() => {
        setSelectedExercise(exercise);
        setShowExerciseModal(true);
      }}
    >
      <Image
        source={{ uri: exercise.imageUrl }}
        style={styles.exerciseImage}
      />
      <View style={styles.exerciseInfo}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseType}>{exercise.type}</Text>
          <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
        </View>
        <Text style={styles.exerciseTitle}>{exercise.title}</Text>
        <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        <View style={styles.exerciseFooter}>
          <Text style={styles.exerciseLevel}>{exercise.level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderExerciseModal = () => (
    <Modal
      visible={showExerciseModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowExerciseModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: selectedExercise?.imageUrl }}
            style={styles.modalImage}
          />
          <Text style={styles.modalTitle}>{selectedExercise?.title}</Text>
          <Text style={styles.modalType}>{selectedExercise?.type}</Text>
          <Text style={styles.modalDescription}>
            {selectedExercise?.description}
          </Text>

          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Faydaları</Text>
            {selectedExercise?.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              // Egzersiz başlatma mantığı
              setShowExerciseModal(false);
            }}
          >
            <Text style={styles.startButtonText}>Egzersizi Başlat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowExerciseModal(false)}
          >
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderStatsSection()}

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <View key={category.id} style={styles.category}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.exerciseList}
              >
                {category.exercises.map((exercise) =>
                  renderExerciseCard(exercise)
                )}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>

      {renderExerciseModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F2D06B',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 5,
  },
  categoriesContainer: {
    padding: 20,
  },
  category: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  exerciseList: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  exerciseCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    width: width * 0.7,
    marginRight: 15,
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: 150,
  },
  exerciseInfo: {
    padding: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  exerciseType: {
    fontSize: 12,
    color: '#F2D06B',
  },
  exerciseDuration: {
    fontSize: 12,
    color: '#8899AA',
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#8899AA',
    marginBottom: 12,
  },
  exerciseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseLevel: {
    fontSize: 12,
    color: '#F2D06B',
    backgroundColor: 'rgba(242, 208, 107, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A2B3C',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '90%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  modalType: {
    fontSize: 14,
    color: '#F2D06B',
    marginTop: 5,
  },
  modalDescription: {
    fontSize: 16,
    color: '#8899AA',
    marginTop: 10,
    lineHeight: 24,
  },
  benefitsSection: {
    marginTop: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F2D06B',
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#F2D06B',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  startButtonText: {
    color: '#1A2B3C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F2D06B',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#F2D06B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MentalScreen;