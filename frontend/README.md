# Fullstack Todo List

Spring Boot, React, Redux Toolkit ve PostgreSQL kullanılarak geliştirilmiş tam kapsamlı bir Todo uygulamasıdır.

Kullanıcılar hesap oluşturabilir, giriş yapabilir ve yalnızca kendi Todo kayıtlarını yönetebilir.

## Canlı Uygulama

- Frontend: https://fullstack-todo-list-rosy.vercel.app
- Backend: https://todo-app-backend-7pv4.onrender.com

> Render ücretsiz planda çalışıyorsa backend bir süre kullanılmadığında uyku moduna geçebilir. İlk istek birkaç saniye sürebilir.

## Özellikler

- Kullanıcı kaydı
- Kullanıcı girişi
- JWT tabanlı kimlik doğrulama
- Şifrelerin BCrypt ile hashlenmesi
- Korumalı Todo sayfası
- Kullanıcıya özel Todo kayıtları
- Todo ekleme
- Todo listeleme
- Todo düzenleme
- Todo silme
- Silmeden önce onay alma
- Todo'yu tamamlandı veya tamamlanmadı olarak işaretleme
- Tümü, tamamlananlar ve tamamlanmayanlar filtreleri
- Redux Toolkit ile state yönetimi
- Geçersiz veya süresi dolmuş token yönetimi
- Mobil cihazlara uyumlu arayüz

## Kullanılan Teknolojiler

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT
- BCrypt
- Maven

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- React Redux
- React Router
- Axios
- CSS

### Deployment

- Frontend: Vercel
- Backend: Render
- Veritabanı: Render PostgreSQL

## Proje Yapısı

```text
fullstack-todo-list
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   └── resources
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend
│   ├── src
│   │   ├── features
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   └── store
│   └── package.json
│
└── README.md
```

## Uygulamayı Yerel Ortamda Çalıştırma

### Gereksinimler

Bilgisayarınızda aşağıdaki araçların kurulu olması gerekir:

- Java 21
- PostgreSQL
- Node.js
- npm
- Git

## Veritabanı Kurulumu

PostgreSQL içerisinde aşağıdaki veritabanını oluşturun:

```sql
CREATE DATABASE todo_app;
```

Tablolar uygulama ilk çalıştırıldığında Hibernate tarafından otomatik olarak oluşturulur.

## Backend Kurulumu

Backend klasörüne geçin:

```bash
cd backend
```

Aşağıdaki environment variable değerlerini tanımlayın:

```text
DB_PASSWORD=postgresql_sifreniz
JWT_SECRET=uzun_ve_guvenli_bir_secret
```

İsteğe bağlı olarak aşağıdaki değerler de değiştirilebilir:

```text
DB_URL=jdbc:postgresql://localhost:5432/todo_app
DB_USERNAME=postgres
JWT_EXPIRATION=86400000
PORT=8080
```

Backend'i çalıştırın:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux veya macOS

```bash
./mvnw spring-boot:run
```

Backend varsayılan olarak şu adreste çalışır:

```text
http://localhost:8080
```

## Frontend Kurulumu

Frontend klasörüne geçin:

```bash
cd frontend
```

Bağımlılıkları yükleyin:

```bash
npm install
```

Uygulamayı çalıştırın:

```bash
npm run dev
```

Frontend varsayılan olarak şu adreste çalışır:

```text
http://localhost:5173
```

Yerel geliştirmede frontend otomatik olarak şu API adresini kullanır:

```text
http://localhost:8080/api
```

Canlı veya farklı bir backend kullanmak için aşağıdaki environment variable tanımlanabilir:

```text
VITE_API_URL=https://backend-adresi.com/api
```

## Build İşlemleri

### Backend Build

```bash
cd backend
mvnw.cmd clean package
```

Linux veya macOS:

```bash
./mvnw clean package
```

### Frontend Build

```bash
cd frontend
npm run build
```

Frontend build dosyaları `frontend/dist` klasöründe oluşturulur.

## API Endpointleri

### Authentication

| Metot | Endpoint | Açıklama |
|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı oluşturur |
| POST | `/api/auth/login` | Kullanıcı girişi yapar ve JWT döndürür |
| GET | `/api/auth/me` | Giriş yapan kullanıcıyı döndürür |

### Todo

| Metot | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/todos` | Kullanıcının Todo kayıtlarını getirir |
| POST | `/api/todos` | Yeni Todo oluşturur |
| PUT | `/api/todos/{id}` | Todo kaydını günceller |
| DELETE | `/api/todos/{id}` | Todo kaydını siler |

Todo endpointleri JWT ile korunmaktadır.

İsteklerde token aşağıdaki şekilde gönderilmelidir:

```http
Authorization: Bearer JWT_TOKEN
```

## Güvenlik

- Kullanıcı şifreleri veritabanında düz metin olarak tutulmaz.
- Şifreler BCrypt kullanılarak hashlenir.
- Korumalı endpointlere JWT olmadan erişilemez.
- Kullanıcılar yalnızca kendi Todo kayıtlarını görüntüleyebilir ve değiştirebilir.
- Geçersiz veya süresi dolmuş tokenlar reddedilir.
- Hassas bilgiler GitHub deposunda tutulmaz ve environment variable olarak tanımlanır.

## Kullanım Akışı

1. Kullanıcı kayıt ekranından hesap oluşturur.
2. Giriş ekranından kullanıcı adı ve şifresiyle giriş yapar.
3. Backend başarılı giriş sonucunda JWT üretir.
4. Frontend tokenı saklar ve korumalı isteklere ekler.
5. Kullanıcı Todo ekleyebilir, düzenleyebilir, silebilir ve filtreleyebilir.
6. Çıkış yapıldığında token ve kullanıcıya ait Redux verileri temizlenir.

