// src/screens/main/ConsciousnessScreen.js
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Audio } from 'expo-av';
import { CircularProgress } from 'react-native-circular-progress';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const ConsciousnessScreen = () => {
  const user = useSelector(state => state.user.data);
  const [currentMeditation, setCurrentMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showMeditationModal, setShowMeditationModal] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(null);

  const [dailyStats, setDailyStats] = useState({
    meditationMinutes: 45,
    sessionsCompleted: 3,
    currentStreak: 7,
    weeklyGoal: 120,
    totalSessions: 28
  });

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePlayPause = async () => {
    try {
      if (!sound) return;
      
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Ses kontrolü hatası:', error);
    }
  };

  const loadAudio = async (audioUrl) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false }
      );
      setSound(newSound);
      const status = await newSound.getStatusAsync();
      setDuration(status.durationMillis);
    } catch (error) {
      console.error('Ses yükleme hatası:', error);
    }
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const categories = [
    {
      id: 'daily',
      title: 'Günlük Öneriler',
      meditations: [
        {
          id: 1,
          title: 'Güne Başlangıç',
          duration: '10 dk',
          type: 'Sabah Meditasyonu',
          description: 'Güne enerjik ve pozitif başlamak için ideal meditasyon.',
          imageUrl: '/meditations/morning.jpg',
          audioUrl: '/meditations/morning.mp3',
          level: 'Başlangıç'
        },
        {
          id: 2,
          title: 'Stres Yönetimi',
          duration: '15 dk',
          type: 'Nefes Çalışması',
          description: 'Günlük stresi azaltmak için nefes teknikleri.',
          imageUrl: '/meditations/stress.jpg',
          audioUrl: '/meditations/stress.mp3',
          level: 'Orta'
        }
      ]
    },
    {
      id: 'beginner',
      title: 'Yeni Başlayanlar',
      meditations: [
        {
          id: 3,
          title: 'Temel Meditasyon',
          duration: '5 dk',
          type: 'Rehberli Meditasyon',
          description: 'Meditasyona yeni başlayanlar için temel teknikler.',
          imageUrl: '/meditations/basic.jpg',
          audioUrl: '/meditations/basic.mp3',
          level: 'Başlangıç'
        }
      ]
    },
    {
      id: 'focus',
      title: 'Odaklanma',
      meditations: [
        {
          id: 4,
          title: 'Derin Konsantrasyon',
          duration: '20 dk',
          type: 'Odak Çalışması',
          description: 'Zihinsel netlik ve odaklanma için ileri düzey pratik.',
          imageUrl: '/meditations/focus.jpg',
          audioUrl: '/meditations/focus.mp3',
          level: 'İleri'
        }
      ]
    }
  ];

  const renderProgressSection = () => (
    <View style={styles.progressSection}>
      <View style={styles.progressCard}>
        <CircularProgress
          size={100}
          width={10}
          fill={(dailyStats.meditationMinutes / dailyStats.weeklyGoal) * 100}
          tintColor="#F2D06B"
          backgroundColor="#2A3B4C"
        >
          {() => (
            <View style={styles.progressContent}>
              <Text style={styles.progressNumber}>{dailyStats.meditationMinutes}</Text>
              <Text style={styles.progressLabel}>dk</Text>
            </View>
          )}
        </CircularProgress>
        <Text style={styles.progressTitle}>Haftalık Hedefe Doğru</Text>
        <Text style={styles.progressSubtitle}>{dailyStats.weeklyGoal} dk hedef</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{dailyStats.sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Bugün</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{dailyStats.currentStreak}</Text>
          <Text style={styles.statLabel}>Gün Serisi</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{dailyStats.totalSessions}</Text>
          <Text style={styles.statLabel}>Toplam</Text>
        </View>
      </View>
    </View>
  );

  const renderMeditationCard = (meditation) => (
    <TouchableOpacity
      key={meditation.id}
      style={styles.meditationCard}
      onPress={() => {
        setSelectedMeditation(meditation);
        setShowMeditationModal(true);
        loadAudio(meditation.audioUrl);
      }}
    >
      <Image
        source={{ uri: meditation.imageUrl }}
        style={styles.meditationImage}
      />
      <View style={styles.meditationInfo}>
        <View style={styles.meditationHeader}>
          <Text style={styles.meditationType}>{meditation.type}</Text>
          <Text style={styles.meditationDuration}>{meditation.duration}</Text>
        </View>
        <Text style={styles.meditationTitle}>{meditation.title}</Text>
        <Text style={styles.meditationDescription}>{meditation.description}</Text>
        <View style={styles.meditationFooter}>
          <Text style={styles.meditationLevel}>{meditation.level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMeditationModal = () => (
    <Modal
      visible={showMeditationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowMeditationModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: selectedMeditation?.imageUrl }}
            style={styles.modalImage}
          />
          <Text style={styles.modalTitle}>{selectedMeditation?.title}</Text>
          <Text style={styles.modalType}>{selectedMeditation?.type}</Text>
          <Text style={styles.modalDescription}>
            {selectedMeditation?.description}
          </Text>

          <View style={styles.playerContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  { width: `${(position / duration) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>

            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton}>
                <SkipBack color="#FFFFFF" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause color="#1A2B3C" size={32} />
                ) : (
                  <Play color="#1A2B3C" size={32} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <SkipForward color="#FFFFFF" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setShowMeditationModal(false);
              if (sound) {
                sound.stopAsync();
                setIsPlaying(false);
              }
            }}
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
        {renderProgressSection()}

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <View key={category.id} style={styles.category}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.meditationList}
              >
                {category.meditations.map((meditation) =>
                  renderMeditationCard(meditation)
                )}
              </ScrollView>
            </View>
          ))}
        </View>
      </ScrollView>

      {renderMeditationModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
  },
  progressSection: {
    padding: 20,
  },
  progressCard: {
    alignItems: 'center',
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressNumber: {
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
  playerContainer: {
    marginTop: 30,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2A3B4C',
    borderRadius: 2,
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#F2D06B',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: '#F2D06B',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  closeButton: {
    backgroundColor: '#F2D06B',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  closeButtonText: {
    color: '#1A2B3C',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConsciousnessScreen; '#F2D06B',
  },
  progressLabel: {
    fontSize: 14,
    color: '#8899AA',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statItem: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '30%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F2D06B',
  },
  statLabel: {
    fontSize: 12,
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
  meditationList: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  meditationCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    width: width * 0.7,
    marginRight: 15,
    overflow: 'hidden',
  },
  meditationImage: {
    width: '100%',
    height: 150,
  },
  meditationInfo: {
    padding: 15,
  },
  meditationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  meditationType: {
    fontSize: 12,
    color: '#F2D06B',
  },
  meditationDuration: {
    fontSize: 12,
    color: '#8899AA',
  },
  meditationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  meditationDescription: {
    fontSize: 14,
    color: '#8899AA',
    marginBottom: 12,
  },
  meditationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationLevel: {
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
    color: