# UZAKTAN TÜRKOLOG — SUPER ADMIN YÖNETİM KILAVUZU

**Uygulama Sahibi ve Baş Admin:** Osman Dadaş (`dadasosman2525@gmail.com`)  
**Yetki Seviyesi:** Super Admin (Tüm Haklar Tanımlı)  
**Sürüm:** 1.0.0 Pro  

---

## 1. Sisteme Giriş ve Tam Yetki Doğrulaması

Uygulama ilk açıldığında doğrudan **Süper Admin** profilinizle (`dadasosman2525@gmail.com`) eşleştirilmiş olarak başlar.

- Üst gezinti çubuğundaki **"Super Admin Paneli"** sekmesine tıklayarak veya profil sayfasından **"Super Admin Yönetim Paneli"** düğmesine basarak yönetim merkezine geçiş yapabilirsiniz.
- Başka bir tarayıcıdan girdiğinizde **"Giriş Yap"** modalını açıp **"Baş Admin Olarak Doğrudan Giriş Yap"** düğmesine basmanız yeterlidir.
- Sistem sizi tanır ve tüm müfredat düzenleme, kelime silme/ekleme, kullanıcı yönetimi ve hata bildirimlerini onaylama yetkilerini açar.

---

## 2. Müfredat ve Yeni Ders Ekleme

1. Admin Panelinde **"📚 Müfredat & Dersler"** sekmesine gidin.
2. **"Yeni Ünite Ekle"** butonuna basınız.
3. Seviyeyi (A1, A2, B1, B2 veya C1) seçin.
4. Ünite başlığını Türkçe ve Kazakça olarak giriniz (Örn: `Ünite 5: Seyahat ve Ulaşım / 5-бөлім: Саяхат және көлік`).
5. **"Üniteyi Kaydet"** butonuna bastığınızda yeni ünite anında öğrencilerin öğrenme yoluna eklenir.

---

## 3. Yanlış Çevirileri Düzeltme (Kullanıcı Bildirimleri)

Öğrenciler sözlükte veya derslerde yanlış olduğunu düşündükleri bir çeviri gördüklerinde bayrak butonuna basarak size bildirim gönderirler:

1. Admin Panelinde **"🚨 Hata Bildirimleri"** sekmesine tıklayınız.
2. Bildirilen kelimeyi, mevcut anlamını ve kullanıcının önerdiği doğru karşılığı inceleyiniz.
3. **"Onayla ve Sözlüğü Güncelle ✓"** butonuna bastığınız anda sistem:
   - İlgili kelimeyi veritabanındaki tüm derslerde ve sözlükte otomatik olarak günceller.
   - Bildirim durumunu "Çözüldü" olarak işaretler.
   - Denetim günlüğüne (Audit Log) işlem kaydını yazar.

---

## 4. Yeni Kelime Ekleme ve Düzenleme

1. Admin Panelinde **"📖 Sözlük & Kelime CMS"** sekmesine gidin.
2. Arama çubuğuna kelimeyi yazarak mevcut kelimeleri filtreleyin veya **"Yeni Kelime Ekle"**ye basın.
3. Kazakça Kiril yazımını (Örn: `Сәлеметсіз бе!`), Latin karşılığını (`Sälemetsiz be!`), Türkçe anlamını ve varsa **Yalancı Eşdeğerlik Uyarısını** giriniz.
4. Kaydettiğinizde kelime hem Sözlükte hem de Aralıklı Tekrar (SRS) modülünde derhal kullanılabilir hale gelir.

---

## 5. Veritabanını Yedekleme (Disaster Recovery)

Uygulamanın sağ üst köşesinde bulunan **"Yedek Al (JSON)"** butonuna tıklayarak:
- Tüm üniteleri,
- Tüm dersleri ve alıştırmaları,
- Sözlükteki tüm kelimeleri,
- Çözülmüş ve bekleyen hata bildirimlerini,
- Güvenlik denetim kayıtlarını tek bir `.json` dosyası olarak bilgisayarınıza indirebilirsiniz.
