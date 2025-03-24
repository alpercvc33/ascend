// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../../services/AuthService';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import LottieView from 'lottie-react-native';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    fitnessLevel: 'beginner',
  });

  const handleRegister = async () => {
    try {
      if (!validateForm()) return;
      
      setLoading(true);
      const user = await AuthService.register(formData.email, formData.password, {
        name: formData.name,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        gender: formData.gender,
        fitnessLevel: formData.fitnessLevel,
      });

      dispatch(setUser(user));
      navigation.replace('MainApp');
    } catch (error) {
      Alert.alert('Hata', error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Hata', 'Geçerli bir email adresi girin.');
      return false;
    }

    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LottieView
            source={require('../../assets/animations/register.json')}
            autoPlay
            loop
            style={styles.animation}
          />

          <Text style={styles.title}>Hesap Oluştur</Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              placeholderTextColor="#8899AA"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#8899AA"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#8899AA"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Şifre Tekrar"
              placeholderTextColor="#8899AA"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            />

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Yaş"
                placeholderTextColor="#8899AA"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
              />

              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Boy (cm)"
                placeholderTextColor="#8899AA"
                keyboardType="numeric"
                value={formData.height}
                onChangeText={(text) => setFormData({ ...formData, height: text })}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Kilo (kg)"
                placeholderTextColor="#8899AA"
                keyboardType="numeric"
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
              />

              <View style={[styles.input, styles.halfInput, styles.picker]}>
                <Text style={styles.pickerLabel}>Cinsiyet</Text>
                <View style={styles.genderButtons}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      formData.gender === 'male' && styles.genderButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, gender: 'male' })}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      formData.gender === 'male' && styles.genderButtonTextActive
                    ]}>Erkek</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      formData.gender === 'female' && styles.genderButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, gender: 'female' })}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      formData.gender === 'female' && styles.genderButtonTextActive
                    ]}>Kadın</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Zaten hesabın var mı? Giriş yap
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  animation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#2A3B4C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  picker: {
    justifyContent: 'center',
  },
  pickerLabel: {
    color: '#8899AA',
    marginBottom: 5,
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#8899AA',
    marginHorizontal: 2,
  },
  genderButtonActive: {
    backgroundColor: '#F2D06B',
    borderColor: '#F2D06B',
  },
  genderButtonText: {
    color: '#8899AA',
    textAlign: 'center',
  },
  genderButtonTextActive: {
    color: '#1A2B3C',
  },
  button: {
    backgroundColor: '#F2D06B',
    borderRadius: 25,
    padding: 15,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#1A2B3C',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  loginLinkText: {
    color: '#F2D06B',
    fontSize: 16,
  },
});