# UZAKTAN TÜRKOLOG — AKADEMİK KAZAKÇA FONETİK ATLASI VE TAM MÜFREDAT REHBERİ

**Platform Adı:** Uzaktan Türkolog  
**Sistem Sahibi / Baş Admin:** Osman Dadaş (`dadasosman2525@gmail.com`)  
**Metodoloji:** Karşılaştırmalı Türk Dilleri ve Çağdaş Uygulamalı Dil Bilimi  

---

## 1. Kazakçanın 9 Özel Sesinin Fonetik ve Akustik Tasnifi

Kazak alfabesi 42 harften oluşur. Türkiye Türkçesi fonolojisinde bulunmayan ve öğrenicilerin telaffuzda en çok zorlandığı 9 ses aşağıda akustik rezonans formantları (F1, F2) ve Uluslararası Fonetik Alfabe (IPA) standartlarıyla çözümlenmiştir:

| Harf | IPA | Sesletim Bölgesi ve Organı | Formant F1 (Hz) | Formant F2 (Hz) | Türkoloji Tarihi ve Köken Bağı | Örnek Kelimeler |
|---|---|---|---|---|---|---|
| **Ә / ә** | [æ] | Açık, düz, ön-damaksıl ince ünlü | 660 | 1720 | Azerbaycan Türkçesindeki «ə», Eski Anadolu açık e'si | Әке (Baba), Ән (Şarkı) |
| **І / і** | [ɪ] | Dar, düz, ön-damaksıl çok kısa kapalı ünlü | 390 | 1990 | Eski Türkçe kapalı e/i (Kül Tigin: «İl tutar») | Іні (Kardeş), Тіл (Dil) |
| **Ң / ң** | [ŋ] | Art-damaksıl nazal ötümlü ünsüz (Sağır Kâf) | 280 | 2100 | Orhun Abideleri 𐰭, Osmanlıca ك (kâf-ı nûnî) | Мың (Bin), Жаңа (Yeni) |
| **Ғ / ғ** | [ʁ] | Art-damaksıl sızıcı ötümlü ünsüz (Kalın gayn) | 350 | 1100 | Eski Türkçe 𐰍 (Tağ ➔ Taw), Arapça Gayn (غ) | Ғалым (Âlim), Тауға (Dağa) |
| **Қ / қ** | [q] | Küçük-dil / art-damak patlamalı ötümsüz ünsüz | 320 | 1200 | Orhun Yazıtları 𐰴, Dîvânu Lugâti't-Türk «Qazaq» | Қазақ (Kazak), Қала (Şehir) |
| **Ү / ү** | [ʏ] | Dar, yuvarlak, ön-damaksıl ince ünlü | 380 | 1600 | Ortak Türkçe ince yuvarlak ünlü: «Üy, Kün» | Үй (Ev), Үлкен (Büyük) |
| **Ұ / ұ** | [ʊ] | Dar, yuvarlak, art-damaksıl kalın boğaz ünlüsü | 440 | 1020 | Eski Türkçe «Ul / Oğul», «Uluğ / Yüce» | Ұл (Erkek çocuk), Ұстаз (Hoca) |
| **Ө / ө** | [œ] | Orta-açık, yuvarlak, ön-damaksıl ince ünlü | 500 | 1370 | Ortak Türkçe «Öz, Köz / Göz, Төр / Başköşe» | Өмір (Ömür), Өзен (Nehir) |
| **Һ / һ** | [h] | Gırtlaksıl sızıcı yumuşak h | 450 | 1500 | Farsça/Arapça alıntılarda soluklu hafif h sesi | Гауһар (Cevher), Қаһарман |

### Web Audio API Akustik Formant Sentezleyicisi
Uygulama, tarayıcıda yerel Kazakça ses paketi (`kk-KZ`) kurulu olmasa dahi **Web Audio API** üzerinden insan ses yolundaki formant rezonans frekanslarını (F1 bandpass filtre ve F2 bandpass filtre) üreterek her harfin doğru akustik tınısını seslendirir.

---

## 2. A1 - C1 Düzeylerinde Genişletilmiş Müfredat Özeti

1. **A1 (Başlangıç Düzeyi):**
   - Ünite 1: Kazak Alfabesi, 9 Özel Ses ve Fonetik Tasnif.
   - Ünite 2: Ünlü Uyumu (Жуан / Жіңішке) ve Çoğul Eklerinin 6 Varyantı (-лар/-лер, -дар/-дер, -тар/-тер).
   - Ünite 3: Tanışma, Sayılar ve Varlık İsimleri.

2. **A2 (Temel İletişim):**
   - Ünite 1: Selamlaşma, Nezaket ve Hal Hatır Sorma (Сен vs Сіз ayrımı, Kişi zamirleri).
   - Ünite 2: Renkler, Fiyatlar ve Sıra Sayıları (-ншы/-нші).
   - Ünite 3: Aile, Akrabalık ve İyelik Ekleri (Тәуелдік жалғаулары).
   - Ünite 4: Alışveriş, Pazar ve Günlük Yaşam.

3. **B1 (Orta Düzey ve İş Dünyası):**
   - Ünite 1: İş Mülakatı, CV (Түйіндеме) ve Tecrübe Bildiren Geçmiş Zaman (-ған/-ген).
   - Ünite 2: Sağlık, Muayene ve Şart Kipi (-са/-се).
   - Ünite 3: Çevre, Doğa ve Ekoloji.

4. **B2 (İleri Düzey, Kültür ve Edebiyat):**
   - Ünite 1: Kazak Kültürü, Gelenekler ve Bayramlar (Наурыз, Тұсаукесер, Беташар, Қонақжайлылық).
   - Ünite 2: Abay Kunanbayev ve Felsefesi (Абайдың «Қара сөздері», Шәкәрім, Birleşik Cümleler).
   - Ünite 3: Medya, Çağdaş İletişim ve Toplumsal Tartışma.

5. **C1 (Akademik Türkoloji ve Diplomasi):**
   - Ünite 1: Karşılaştırmalı Türkoloji ve Kıpçak-Oğuz Düzenli Ses Denklikleri (y- ~ j-, dağ ~ taw).
   - Ünite 2: Uluslararası Diplomasi, Resmi Yazışmalar ve Devletlerarası Sözleşmeler.
   - Ünite 3: Kazak Atasözleri, Deyimler ve Hitabet Sanatı (Мақал-мәтелдер мен шешендік өнер).

---

## 3. Eklenen Yenilikçi Mobil Öğrenim Özellikleri

- **HelloTalk & Tandem Stili Topluluk Sohbeti:** Kazak anadil konuşucuları (Aygül - Almatı, Serik - Astana) ile gerçek zamanlı mesajlaşma, anında sesli dinleme ve çeviri.
- **Duolingo Stili Hızlı Eşleştirme Oyunu (Match Madness):** İki sütun halinde Kazakça ve Türkçe kelimeleri hızlıca eşleştirme ve kombo puan kazanma.
- **Busuu Stili CEFR Seviye Tespit Sınavı:** Kullanıcının düzeyini (A1-C1) ölçüp seviye rotasını otomatik belirleyen akıllı test.
