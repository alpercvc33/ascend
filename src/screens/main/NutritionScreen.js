// src/screens/main/NutritionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { AIService } from '../../services/AIService';
import { CircularProgress } from 'react-native-circular-progress';
import { Camera } from 'lucide-react';

const NutritionScreen = () => {
  const user = useSelector(state => state.user.data);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyStats, setDailyStats] = useState({
    calories: {
      consumed: 1250,
      target: 2000
    },
    protein: {
      consumed: 75,
      target: 120
    },
    carbs: {
      consumed: 150,
      target: 250
    },
    fat: {
      consumed: 45,
      target: 65
    }
  });

  useEffect(() => {
    loadNutritionPlan();
  }, []);

  const loadNutritionPlan = async () => {
    try {
      setLoading(true);
      const plan = await AIService.generateNutritionPlan(
        user,
        user.nutritionPreferences,
        user.dietaryRestrictions
      );
      setNutritionPlan(plan);
    } catch (error) {
      console.error('Beslenme planı yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
    setShowMealModal(true);
  };

  const renderNutrientProgress = (nutrient, consumed, target) => (
    <View style={styles.nutrientCard}>
      <CircularProgress
        size={80}
        width={8}
        fill={(consumed / target) * 100}
        tintColor="#F2D06B"
        backgroundColor="#2A3B4C"
      >
        {
          (fill) => (
            <Text style={styles.progressText}>
              {Math.round(fill)}%
            </Text>
          )
        }
      </CircularProgress>
      <View style={styles.nutrientInfo}>
        <Text style={styles.nutrientTitle}>{nutrient}</Text>
        <Text style={styles.nutrientValues}>
          {consumed}g / {target}g
        </Text>
      </View>
    </View>
  );

  const renderMealModal = () => (
    <Modal
      visible={showMealModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowMealModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: selectedMeal?.imageUrl }}
            style={styles.mealImage}
          />
          <Text style={styles.modalTitle}>{selectedMeal?.name}</Text>
          
          <View style={styles.nutritionInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Kalori</Text>
              <Text style={styles.infoValue}>{selectedMeal?.calories} kcal</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Protein</Text>
              <Text style={styles.infoValue}>{selectedMeal?.protein}g</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Karbonhidrat</Text>
              <Text style={styles.infoValue}>{selectedMeal?.carbs}g</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Yağ</Text>
              <Text style={styles.infoValue}>{selectedMeal?.fat}g</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Malzemeler</Text>
          {selectedMeal?.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Hazırlanışı</Text>
          {selectedMeal?.instructions.map((step, index) => (
            <Text key={index} style={styles.instruction}>
              {index + 1}. {step}
            </Text>
          ))}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowMealModal(false)}
          >
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Günlük Özet */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Günlük Beslenme Özeti</Text>
          <View style={styles.calorieCard}>
            <Text style={styles.calorieTitle}>Kalori Takibi</Text>
            <View style={styles.calorieInfo}>
              <Text style={styles.calorieConsumed}>
                {dailyStats.calories.consumed}
              </Text>
              <Text style={styles.calorieTarget}>
                /{dailyStats.calories.target} kcal
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${(dailyStats.calories.consumed / dailyStats.calories.target) * 100}%`
                  }
                ]} 
              />
            </View>
          </View>

          {/* Besin Değerleri */}
          <View style={styles.nutrientsContainer}>
            {renderNutrientProgress('Protein', dailyStats.protein.consumed, dailyStats.protein.target)}
            {renderNutrientProgress('Karbonhidrat', dailyStats.carbs.consumed, dailyStats.carbs.target)}
            {renderNutrientProgress('Yağ', dailyStats.fat.consumed, dailyStats.fat.target)}
          </View>

          {/* Su Takibi */}
          <View style={styles.waterTracking}>
            <Text style={styles.waterTitle}>Su Takibi</Text>
            <View style={styles.waterProgress}>
              <View style={styles.waterBottles}>
                {[...Array(8)].map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setWaterIntake(index + 1)}
                    style={[
                      styles.waterBottle,
                      index < waterIntake && styles.waterBottleFilled
                    ]}
                  >
                    <Text style={styles.waterBottleText}>💧</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.waterAmount}>{waterIntake * 250}ml / 2000ml</Text>
            </View>
          </View>
        </View>

        {/* Günün Öğünleri */}
        <View style={styles.mealsContainer}>
          <Text style={styles.sectionTitle}>Günün Öğünleri</Text>
          {nutritionPlan?.meals.map((meal, index) => (
            <TouchableOpacity
              key={index}
              style={styles.mealCard}
              onPress={() => handleMealSelect(meal)}
            >
              <Image
                source={{ uri: meal.imageUrl }}
                style={styles.mealThumbnail}
              />
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
              </View>
              <View style={styles.mealStatus}>
                <Text style={styles.statusText}>
                  {meal.consumed ? 'Tamamlandı' : 'Planlandı'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Önerileri */}
        <View style={styles.aiTipsContainer}>
          <Text style={styles.sectionTitle}>AI Beslenme Önerileri</Text>
          <View style={styles.aiTipsCard}>
            {nutritionPlan?.tips.map((tip, index) => (
              <Text key={index} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Yemek Ekleme Butonu */}
      <TouchableOpacity style={styles.addButton}>
        <Camera color="#FFFFFF" size={24} />
        <Text style={styles.addButtonText}>Yemek Ekle</Text>
      </TouchableOpacity>

      {/* Yemek Detay Modalı */}
      {renderMealModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
  },
  summaryContainer: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  calorieCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  calorieTitle: {
    fontSize: 16,
    color: '#8899AA',
  },
  calorieInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 10,
  },
  calorieConsumed: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F2D06B',
  },
  calorieTarget: {
    fontSize: 16,
    color: '#8899AA',
    marginLeft: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1A2B3C',
    borderRadius: 4,
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F2D06B',
    borderRadius: 4,
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  nutrientCard: {
    alignItems: 'center',
  },
  nutrientInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  nutrientTitle: {
    fontSize: 14,
    color: '#8899AA',
  },
  nutrientValues: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 5,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  waterTracking: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 20,
  },
  waterTitle: {
    fontSize: 16,
    color: '#8899AA',
    marginBottom: 15,
  },
  waterProgress: {
    alignItems: 'center',
  },
  waterBottles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  waterBottle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1A2B3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterBottleFilled: {
    backgroundColor: '#3498db',
  },
  waterBottleText: {
    fontSize: 16,
  },
  waterAmount: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  mealsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  mealThumbnail: {
    width: 80,
    height: 80,
  },
  mealInfo: {
    flex: 1,
    padding: 15,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mealTime: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 5,
  },
  mealCalories: {
    fontSize: 14,
    color: '#F2D06B',
    marginTop: 5,
  },
  mealStatus: {
    padding: 15,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#8899AA',
  },
  aiTipsContainer: {
    padding: 20,
  },
  aiTipsCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F2D06B',
    borderRadius: 30,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#1A2B3C',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
  mealImage: {
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
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8899AA',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  ingredient: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
    lineHeight: 20,
  },
  instruction: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 20,
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
});

export default NutritionScreen;