# GOAT PANO

**Proje yönetimini eğlenceye dönüştüren Kanban panosu**

![Version](https://img.shields.io/github/package-json/v/bcanata/planka?style=flat-square) [![Docker](https://img.shields.io/badge/Docker-deployed-%23066da5?style=flat-square&color=blue)](https://pano.8092.tr) [![License](https://img.shields.io/badge/License-Fair%20Use-%234285F4?style=flat-square)](https://github.com/plankanban/planka/blob/master/LICENSES/PLANKA%20Community%20License%20EN.md)

![Demo](https://raw.githubusercontent.com/plankanban/planka/master/assets/demo.gif)

> **GOAT PANO**, PLANKA projesinin Türkçe'ye özelleştirilmiş ve yeniden markalanmış bir fork'udur. Temel projenin tüm özelliklerini korurken, Türk dil desteği ve sosyal medya paylaşım özellikleri eklenmiştir.

## Temel Özellikler

- **📋 İşbirlikçi Kanban Panoları**: Projeler, panolar, listeler, kartlar oluşturun ve sezgisel sürükle-bırak arayüzü ile görevleri yönetin
- **⚡ Gerçek Zamanlı Güncellemeler**: Tüm kullanıcılar arasında anında senkronizasyon, yenileme gerekmez
- **✍️ Zengin Markdown Desteği**: Güçlü markdown editörü ile güzel biçimlendirilmiş kart açıklamaları yazın
- **🔔 Esnek Bildirimler**: 100+ sağlayıcı üzerinden uyarılar alın, iş akışınıza tam olarak özelleştirin
- **🔐 Sorunsuz Kimlik Doğrulama**: OpenID Connect entegrasyonu ile tek tıklamalı giriş
- **🌍 Çok Dilli ve Kolay Çevrilebilir**: Küresel kitle için tam uluslararasılaştırma desteği
- **🇹🇷 Türkçe Dil Desteği**: Tamamen Türkçe arayüz ve sosyal medya entegrasyonu
- **📱 Herkese Açık Panolar**: Panolarınızı herkese açık linkler ile paylaşın, giriş gerektirmez

### 🆕 GOAT PANO Özel Özellikleri

- **🌐 Herkese Açık Paylaşım**: Panolarınızı benzersiz linkler ile herkese açın
  - Salt okunur erişim - kimseği davet gerekmez
  - Güvenli rastgele tokenler ile paylaşım
  - Sosyal medya paylaşım butonları (Twitter, Facebook, LinkedIn, WhatsApp)
  - Türkçe paylaşım metinleri

- **🎨 Tam Türkçe Arayüz**:
  - Menüler, butonlar ve uyarılar tamamen Türkçe
  - Tarih ve saat formatları Türk standartlarına uygun
  - Sosyal medya paylaşım metinleri Türkçe

- **📊 Sosyal Medya Entegrasyonu**:
  - Tek tıklama ile panolarınızı sosyal medyada paylaşın
  - Özelleştirilmiş Türkçe paylaşım metinleri
  - Her platform için özel renkler ve hover efektleri

## Kurulum

GOAT PANO'yu kurmak için birden fazla yöntem mevcuttur - [kurulum rehberinde](https://docs.planka.cloud/docs/welcome/) daha fazlasını öğrenin.

Yapılandırma ve ortam ayarları için [yapılandırma bölümüne](https://docs.planka.cloud/docs/category/configuration/) bakın.

### Docker ile Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/bcanata/planka.git
cd planka

# Docker Compose ile başlatın
docker-compose up -d --build
```

### Ortam Değişkenleri

```bash
# Zorunlu değişkenler
BASE_URL=https://your-domain.com
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/database

# Opsiyonel Türkçe dil desteği
DEFAULT_LANGUAGE=tr-TR

# Varsayılan yönetici kullanıcısı
DEFAULT_ADMIN_EMAIL=admin@your-domain.com
DEFAULT_ADMIN_PASSWORD=admin-password
DEFAULT_ADMIN_NAME=Yönetici
```

## Herkese Açık Paylaşım Kullanımı

1. **Paylaşımı Etkinleştir**:
   - Proje yöneticisi olarak pano ayarlarını açın
   - "Panoyu Paylaş" butonuna tıklayın
   - Paylaşımı etkinleştirin

2. **Paylaşım Linki**:
   - Oluşturulan benzersiz linki kopyalayın
   - `https://your-domain.com/public/{token}` formatında

3. **Sosyal Medyada Paylaş**:
   - Paylaşım sayfasında sosyal medya butonlarını kullanın
   - Özelleştirilmiş Türkçe metinler ile paylaşın

## Lisans

GOAT PANO, [Fair Use License](https://github.com/plankanban/planka/blob/master/LICENSES/PLANKA%20Community%20License%20EN.md) altında dağıtılan [fair-code](https://faircode.io) yazılımıdır.

- **✅ Kaynak Kodu Açık**: Kaynak kodu her zaman görülebilir
- **✅ Kendi Sunucunuzda Barındırın**: Herhangi bir yere kurun ve barındırın
- **✅ Genişletilebilir**: Kendi işlevselliğinizle özelleştirin
- **🎓 Eğitim Kullanımı**: Okullar ve eğitim kurumları için ücretsiz

Detaylar için [Lisans Rehberi](https://github.com/plankanban/planka/blob/master/LICENSES/PLANKA%20License%20Guide%20EN.md) kontrol edin.

## Katkıda Bulunma

Hata buldunuz veya özellik isteğiniz mi var? Başlamak için [Katkıda Bulunma Rehberi](https://github.com/plankanban/planka/blob/master/CONTRIBUTING.md)'ne göz atın.

Projeyi yerel olarak kurmak için [geliştirme bölümüne](https://docs.planka.cloud/docs/category/development/) bakın.

## İletişim

- **🌐 Canlı Demo**: [https://pano.8092.tr](https://pano.8092.tr)
- **📧 E-posta**: github@goat-pano.dev
- **🔒 Güvenlik**: security@goat-pano.dev

> **Not**: Bu PLANKA projesinin bir fork'udur. Orijinal projeye katkıları için [PLANKA GitHub deposunu](https://github.com/plankanban/planka) ziyaret edin.

## Teşekkürler

Tüm katkıda bulunanlarımıza teşekkür ederiz!

[![Contributors](https://contrib.rocks/image?repo=plankanban/planka)](https://github.com/plankanban/planka/graphs/contributors)

---

**GOAT PANO** - Proje yönetimini eğlenceye dönüştürün! 🚀