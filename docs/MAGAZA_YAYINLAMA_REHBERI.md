# UZAKTAN TÜRKOLOG — GOOGLE PLAY & APPLE APP STORE YAYINLAMA REHBERİ

## 1. Uygulama Paket Bilgileri

- **Uygulama Adı:** Uzaktan Turkolog (Uzaktan Türkolog)
- **Paket Kimliği (Android Package ID):** `com.uzaktanturkolog.app`
- **Apple Bundle ID (iOS):** `com.uzaktanturkolog.ios`
- **İlk Sürüm:** `1.0.0` (Build / Version Code: `100`)
- **Hedef Android SDK:** `API 34 (Android 14)`
- **Minimum Android SDK:** `API 23 (Android 6.0)`
- **Minimum iOS Sürümü:** `iOS 15.0+`
- **Destek ve Sahip E-Posta:** `dadasosman2525@gmail.com`

---

## 2. Google Play Console Yayınlama Adımları

1. **Google Play Developer Hesabı:**
   - [play.google.com/console](https://play.google.com/console) adresinden geliştirici hesabınıza giriş yapınız.
   - "Uygulama Oluştur" seçeneğini seçin. Başlık: `Uzaktan Türkolog`, Varsayılan Dil: `Türkçe (tr-TR)`.

2. **Android App Bundle (.aab) Üretimi:**
   - Flutter veya Capacitor ile derleme alırken release modunda çalıştırın:
     ```bash
     flutter build appbundle --release
     ```
   - Çıktı: `build/app/outputs/bundle/release/app-release.aab` dosyasını Play Console'a yükleyiniz.

3. **Veri Güvenliği (Data Safety) Formu Yanıtları:**
   - *Kullanıcı Verisi:* E-posta, Ad (Hesap oluşturma ve profil yönetimi için, üçüncü taraflarla paylaşılmaz).
   - *Ses / Mikrofon:* İsteğe bağlı (Öğrencinin Kazakça telaffuzunu cihaz üzerinde analiz etmek için kullanılır, sunucuda kalıcı saklanmaz).
   - *Veri Şifreleme:* Tüm veriler HTTPS/TLS üzerinden aktarılır.
   - *Hesap Silme:* Profil ayarları üzerinden hesap silme seçeneği sunulmaktadır (Google Play zorunlu kuralı).

---

## 3. Apple App Store Connect Yayınlama Adımları

1. **Apple Developer Hesabı:**
   - [appstoreconnect.apple.com](https://appstoreconnect.apple.com) üzerinde `com.uzaktanturkolog.ios` Bundle ID ile yeni bir uygulama kaydı oluşturun.

2. **Gizlilik Açıklamaları (App Privacy):**
   - Kullanıcı Kimliği, Kullanıcı İçeriği ve Ses Kaydı seçenekleri işaretlenir.

3. **TestFlight ve İnceleme:**
   - İlk sürümü TestFlight dahili testine gönderip telefonunuzda doğrulayın.
   - Ardından "İncelemeye Gönder" (Submit for Review) butonuna basınız.
