// tests/App.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import App from '../src/App';

describe('ASCEND App Tests', () => {
  test('Uygulama başarıyla yükleniyor', () => {
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    expect(getByText('ASCEND')).toBeTruthy();
  });
});

// tests/screens/AuthScreen.test.js
import { LoginScreen, RegisterScreen } from '../src/screens/auth';

describe('Kimlik Doğrulama Testleri', () => {
  test('Giriş formu doğru çalışıyor', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Şifre');
    const loginButton = getByText('Giriş Yap');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // API çağrısının yapıldığını kontrol et
    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('Kayıt formu validasyonu çalışıyor', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    
    const nameInput = getByPlaceholderText('Ad Soyad');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Şifre');
    const registerButton = getByText('Kayıt Ol');

    // Boş form kontrolü
    fireEvent.press(registerButton);
    expect(getByText('Lütfen tüm zorunlu alanları doldurun.')).toBeTruthy();

    // Geçersiz email kontrolü
    fireEvent.changeText(nameInput, 'Test User');
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'pass123');
    fireEvent.press(registerButton);
    expect(getByText('Geçerli bir email adresi girin.')).toBeTruthy();
  });
});

// tests/screens/HomeScreen.test.js
import { HomeScreen } from '../src/screens/main';

describe('Ana Sayfa Testleri', () => {
  test('Günlük istatistikler görüntüleniyor', () => {
    const { getByText, getAllByTestId } = render(<HomeScreen />);
    
    expect(getByText('Günlük İstatistikler')).toBeTruthy();
    expect(getAllByTestId('stat-card')).toHaveLength(4);
  });

  test('AI önerileri yükleniyor', async () => {
    const { getByText, queryByText } = render(<HomeScreen />);
    
    // Yükleniyor durumu kontrolü
    expect(getByText('Öneriler yükleniyor...')).toBeTruthy();
    
    // Önerilerin yüklendiğini kontrol et
    await waitFor(() => {
      expect(queryByText('Öneriler yükleniyor...')).toBeNull();
      expect(getByText('AI Önerileri')).toBeTruthy();
    });
  });
});

// tests/services/AIService.test.js
import { AIService } from '../src/services/AIService';

describe('AI Servis Testleri', () => {
  test('Antrenman planı başarıyla oluşturuluyor', async () => {
    const mockUserProfile = {
      age: 30,
      weight: 75,
      height: 175,
      fitnessLevel: 'intermediate'
    };

    const mockGoals = {
      primary: 'muscle-gain',
      secondary: 'endurance'
    };

    const plan = await AIService.generateWorkoutPlan(mockUserProfile, mockGoals);
    
    expect(plan).toHaveProperty('dailyWorkouts');
    expect(plan.dailyWorkouts.length).toBeGreaterThan(0);
    expect(plan).toHaveProperty('weeklySchedule');
  });

  test('Beslenme önerileri başarıyla oluşturuluyor', async () => {
    const mockUserProfile = {
      age: 30,
      weight: 75,
      height: 175,
      dietaryRestrictions: ['vegetarian']
    };

    const mockPreferences = {
      mealCount: 3,
      snacks: true
    };

    const plan = await AIService.generateNutritionPlan(
      mockUserProfile,
      mockPreferences,
      mockUserProfile.dietaryRestrictions
    );
    
    expect(plan).toHaveProperty('meals');
    expect(plan.meals.length).toBeGreaterThan(0);
    expect(plan).toHaveProperty('macroTargets');
  });
});

// tests/components/common/MetricCard.test.js
import { MetricCard } from '../src/components/common';

describe('Metrik Kart Bileşeni Testleri', () => {
  const mockData = {
    title: 'Kalp Atış Hızı',
    value: 72,
    unit: 'bpm',
    trend: 'up',
    change: 5
  };

  test('Kart doğru verilerle render ediliyor', () => {
    const { getByText } = render(<MetricCard {...mockData} />);
    
    expect(getByText(mockData.title)).toBeTruthy();
    expect(getByText(mockData.value.toString())).toBeTruthy();
    expect(getByText(mockData.unit)).toBeTruthy();
  });

  test('Trend göstergesi doğru çalışıyor', () => {
    const { getByTestId } = render(<MetricCard {...mockData} />);
    
    const trendIcon = getByTestId('trend-icon');
    expect(trendIcon.props.name).toBe('trend-up');
  });
});

// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  }
};