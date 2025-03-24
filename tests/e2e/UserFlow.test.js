// tests/e2e/UserFlow.test.js
import { device, element, by, waitFor } from 'detox';

describe('Kullanıcı Akış Testleri', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Başarılı kayıt ve giriş akışı', async () => {
    // Kayıt ekranına git
    await element(by.text('Hesap Oluştur')).tap();

    // Form alanlarını doldur
    await element(by.id('name-input')).typeText('Test User');
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('Test123!');
    await element(by.id('age-input')).typeText('30');
    await element(by.id('height-input')).typeText('175');
    await element(by.id('weight-input')).typeText('75');

    // Kayıt ol butonuna tıkla
    await element(by.text('Kayıt Ol')).tap();

    // Ana sayfanın yüklendiğini kontrol et
    await expect(element(by.text('Hoş Geldiniz'))).toBeVisible();
  });

  it('Modüller arası geçiş testi', async () => {
    // Her bir modüle git ve doğru yüklendiğini kontrol et
    const modules = ['Bilinç', 'Fitness', 'Sağlık', 'Zihinsel', 'Beslenme'];

    for (const module of modules) {
      await element(by.text(module)).tap();
      await expect(element(by.text(`${module} Programı`))).toBeVisible();
    }
  });

  it('Meditasyon seansı başlatma testi', async () => {
    // Bilinç modülüne git
    await element(by.text('Bilinç')).tap();

    // Bir meditasyon seansı seç
    await element(by.text('Sabah Meditasyonu')).tap();

    // Başlat butonuna tıkla
    await element(by.text('Başlat')).tap();

    // Meditation player'ın görünür olduğunu kontrol et
    await expect(element(by.id('meditation-player'))).toBeVisible();
  });

  it('Antrenman programı oluşturma testi', async () => {
    // Fitness modülüne git
    await element(by.text('Fitness')).tap();

    // Yeni program oluştur
    await element(by.text('Program Oluştur')).tap();

    // Hedef seç
    await element(by.text('Kas Kazanımı')).tap();

    // Program detaylarını onayla
    await element(by.text('Programı Başlat')).tap();

    // Program detaylarının görüntülendiğini kontrol et
    await expect(element(by.text('Program Detayları'))).toBeVisible();
  });

  it('Beslenme takibi testi', async () => {
    // Beslenme modülüne git
    await element(by.text('Beslenme')).tap();

    // Öğün ekle
    await element(by.text('Öğün Ekle')).tap();

    // Besin seç
    await element(by.text('Yiyecek Ara')).typeText('Yulaf');
    await element(by.text('Yulaf (100g)')).tap();

    // Miktar gir
    await element(by.id('portion-input')).typeText('50');

    // Ekle butonuna tıkla
    await element(by.text('Ekle')).tap();

    // Günlük özette yeni öğünün görüntülendiğini kontrol et
    await expect(element(by.text('Yulaf - 50g'))).toBeVisible();
  });
});

// tests/e2e/PerformanceTests.test.js
describe('Performans Testleri', () => {
  it('Ana sayfa yüklenme süresi', async () => {
    const startTime = Date.now();
    await device.launchApp();
    await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(2000);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // 3 saniyeden az olmalı
  });

  it('Modüller arası geçiş süresi', async () => {
    const modules = ['Bilinç', 'Fitness', 'Sağlık', 'Zihinsel', 'Beslenme'];
    
    for (const module of modules) {
      const startTime = Date.now();
      await element(by.text(module)).tap();
      await waitFor(element(by.id(`${module.toLowerCase()}-screen`))).toBeVisible().withTimeout(1000);
      const transitionTime = Date.now() - startTime;
      
      expect(transitionTime).toBeLessThan(500); // 500ms'den az olmalı
    }
  });
});

// tests/e2e/OfflineTests.test.js
describe('Çevrimdışı Mod Testleri', () => {
  it('Çevrimdışıyken temel özelliklerin çalışması', async () => {
    // İnternet bağlantısını devre dışı bırak
    await device.setURLBlacklist(['*']);

    // Ana sayfanın yüklendiğini kontrol et
    await expect(element(by.id('home-screen'))).toBeVisible();

    // Kayıtlı antrenman programının görüntülendiğini kontrol et
    await element(by.text('Fitness')).tap();
    await expect(element(by.text('Kayıtlı Program'))).toBeVisible();

    // Kayıtlı meditasyon seanslarının çalıştığını kontrol et
    await element(by.text('Bilinç')).tap();
    await element(by.text('İndirilen Seanslar')).tap();
    await expect(element(by.id('offline-meditations'))).toBeVisible();
  });
});