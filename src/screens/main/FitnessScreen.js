// src/screens/main/FitnessScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Video } from 'expo-av';
import { AIService } from '../../services/AIService';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const FitnessScreen = () => {
  const user = useSelector(state => state.user.data);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadWorkoutPlan();
  }, []);

  const loadWorkoutPlan = async () => {
    try {
      setLoading(true);
      const plan = await AIService.generateWorkoutPlan(user, user.fitnessGoals);
      setWorkoutPlan(plan);
    } catch (error) {
      console.error('Antrenman planı yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorkoutCard = (workout) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => setSelectedExercise(workout)}
    >
      <Image
        source={{ uri: workout.imageUrl }}
        style={styles.workoutImage}
      />
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle}>{workout.name}</Text>
        <Text style={styles.workoutDetails}>
          {workout.sets} set × {workout.reps} tekrar
        </Text>
        <View style={styles.workoutTags}>
          {workout.targetMuscles.map((muscle, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{muscle}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderExerciseModal = () => (
    <Modal
      visible={selectedExercise !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedExercise(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Video
            source={{ uri: selectedExercise?.videoUrl }}
            style={styles.exerciseVideo}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
          <Text style={styles.modalDescription}>
            {selectedExercise?.description}
          </Text>
          <View style={styles.modalStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Setler</Text>
              <Text style={styles.statValue}>{selectedExercise?.sets}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Tekrarlar</Text>
              <Text style={styles.statValue}>{selectedExercise?.reps}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Dinlenme</Text>
              <Text style={styles.statValue}>{selectedExercise?.rest}sn</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedExercise(null)}
          >
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../../assets/animations/fitness-loading.json')}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text style={styles.loadingText}>
          Antrenman planınız hazırlanıyor...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Üst Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Fitness Programınız</Text>
          <Text style={styles.bannerSubtitle}>
            Hedefiniz: {user?.fitnessGoals?.primary || 'Genel Fitness'}
          </Text>
        </View>

        {/* Günlük İstatistikler */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Tamamlanan Antrenman</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>324</Text>
            <Text style={styles.statLabel}>Yakılan Kalori</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>45dk</Text>
            <Text style={styles.statLabel}>Aktif Süre</Text>
          </View>
        </View>

        {/* Günün Antrenmanı */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günün Antrenmanı</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {workoutPlan?.dailyWorkouts?.map((workout, index) => (
              <View key={index} style={styles.workoutCard}>
                {renderWorkoutCard(workout)}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Program Detayları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Detayları</Text>
          {workoutPlan?.weeklySchedule?.map((day, index) => (
            <View key={index} style={styles.dayCard}>
              <Text style={styles.dayTitle}>{day.name}</Text>
              <Text style={styles.dayDescription}>{day.focus}</Text>
              <View style={styles.exerciseList}>
                {day.exercises.map((exercise, exIndex) => (
                  <TouchableOpacity
                    key={exIndex}
                    style={styles.exerciseItem}
                    onPress={() => setSelectedExercise(exercise)}
                  >
                    <Image
                      source={{ uri: exercise.thumbnailUrl }}
                      style={styles.exerciseThumbnail}
                    />
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDetails}>
                        {exercise.sets} set × {exercise.reps} tekrar
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* AI Önerileri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Önerileri</Text>
          <View style={styles.aiTipsCard}>
            <Text style={styles.aiTipsTitle}>Kişisel Öneriler</Text>
            <Text style={styles.aiTipsText}>
              {workoutPlan?.aiTips?.join('\n\n')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Egzersiz Detay Modalı */}
      {renderExerciseModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A2B3C',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
  },
  banner: {
    padding: 20,
    backgroundColor: '#2A3B4C',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#8899AA',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  statCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 15,
    width: width / 3.5,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F2D06B',
  },
  statLabel: {
    fontSize: 12,
    color: '#8899AA',
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  workoutCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    marginRight: 15,
    width: 280,
  },
  workoutImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  workoutInfo: {
    padding: 15,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutDetails: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 5,
  },
  workoutTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#1A2B3C',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: '#F2D06B',
    fontSize: 12,
  },
  dayCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dayDescription: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 5,
  },
  exerciseList: {
    marginTop: 15,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2B3C',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  exerciseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  exerciseInfo: {
    marginLeft: 15,
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 5,
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
    maxHeight: '80%',
  },
  exerciseVideo: {
    width: '100%',
    height: 250,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#8899AA',
    marginTop: 10,
    lineHeight: 24,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#F2D06B',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#1A2B3C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiTipsCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 15,
  },
  aiTipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F2D06B',
    marginBottom: 10,
  },
  aiTipsText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
  },
});

export default FitnessScreen;