// src/screens/profile/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserData, clearUser } from '../../store/slices/userSlice';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AuthService } from '../../services/AuthService';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Bildirim', 'Galeri erişimi için izin gerekli.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.cancelled) {
        await uploadProfileImage(result.uri);
      }
    } catch (error) {
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu.');
    }
  };

  const uploadProfileImage = async (uri) => {
    try {
      setLoading(true);
      
      // Resim formatını belirle
      const fileExtension = uri.split('.').pop();
      const fileName = `profile_${user.uid}.${fileExtension}`;
      
      // Fetch ile image'ı blob'a çevir
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Storage referansı oluştur ve yükle
      const storageRef = ref(storage, `profile_images/${fileName}`);
      await uploadBytes(storageRef, blob);
      
      // Yüklenen resmin URL'ini al
      const downloadURL = await getDownloadURL(storageRef);
      
      // Kullanıcı verisini güncelle
      await dispatch(updateUserData({ 
        userId: user.uid, 
        data: { profileImage: downloadURL } 
      })).unwrap();
      
      Alert.alert('Başarılı', 'Profil resminiz güncellendi.');
    } catch (error) {
      Alert.alert('Hata', 'Profil resmi yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          onPress: async () => {
            try {
              await AuthService.logout();
              dispatch(clearUser());
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const userStats = {
    workoutsCompleted: 24,
    meditationMinutes: 320,
    streakDays: 7,
    points: 1250
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={pickImage}
            disabled={loading}
          >
            {user?.profileImage ? (
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Feather name="user" size={40} color="#8899AA" />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Feather name="edit-2" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          
          <View style={styles.subscriptionBadge}>
            <Text style={styles.subscriptionText}>
              {user?.subscription === 'premium' ? 'Premium Üye' : 'Standart Üye'}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.workoutsCompleted}</Text>
            <Text style={styles.statLabel}>Antrenman</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.meditationMinutes}dk</Text>
            <Text style={styles.statLabel}>Meditasyon</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.streakDays} gün</Text>
            <Text style={styles.statLabel}>Seri</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.points}</Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Hesap</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Feather name="user" size={20} color="#F2D06B" />
            <Text style={styles.menuItemText}>Profili Düzenle</Text>
            <Feather name="chevron-right" size={20} color="#8899AA" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Feather name="award" size={20} color="#F2D06B" />
            <Text style={styles.menuItemText}>Üyelik</Text>
            <Feather name="chevron-right" size={20} color="#8899AA" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Feather name="settings" size={20} color="#F2D06B" />
            <Text style={styles.menuItemText}>Genel Ayarlar</Text>
            <Feather name="chevron-right" size={20} color="#8899AA" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Feather name="bell" size={20} color="#F2D06B" />
            <Text style={styles.menuItemText}>Bildirimler</Text>
            <Feather name="chevron-right" size={20} color="#8899AA" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Privacy')}
          >
            <Feather name="lock" size={20} color="#F2D06B" />
            <Text style={styles.menuItemText}>Gizlilik ve Güvenlik</Text>
            <Feather name="chevron-right" size={20} color="#8899AA" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Destek</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Help')}
          >
            <Feather name="help-circle" size={20} color="#F2D06B" />
            <Text style={styles.menuItemText}>Yardım ve Destek</Text>
            <Feather name="chevron-right" size={20} color="#8899AA" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('About')}
          >
            <Feather name="info" size={20} color="#F2D06B" />
            <Text style={styles.menuItemText}>Hakkında</Text>
            <Feather name="chevron-right" size={20} color="#8899AA" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    backgroundColor: '#2A3B4C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#F2D06B',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#8899AA',
    marginBottom: 10,
  },
  subscriptionBadge: {
    backgroundColor: '#F2D06B',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A2B3C',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F2D06B',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8899AA',
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3B4C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 15,
    marginTop: 10,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;