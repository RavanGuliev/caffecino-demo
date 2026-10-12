# Caffècino — Front (React + Vite)

Kafe üçün elektron menyu saytı və admin panel. Backend: `../caffecino-backend` (Laravel 12 API).

## İşə salmaq

```bash
npm install
cp .env.example .env    # lazım olsa ünvanları dəyişin
npm run dev             # http://localhost:5555
```

Backend işləmirsə, demo data ilə göstərmək üçün `.env`-də `VITE_USE_MOCK=true` yazın.

| Ünvan | Səhifə |
|---|---|
| `/` | Ana səhifə: banner, kateqoriyalar, populyar məhsullar |
| `/menu/:id` | Kateqoriya menyusu, axtarış |
| `/favorites` | Bəyəndiklərim |
| `/game` | "Dənləri tut!" mini oyunu |
| `/admin` | Admin panel (giriş: backend `.env` → `ADMIN_EMAIL` / `ADMIN_PASSWORD`) |
| `/?lucky=1` | "Şans kofesi" modalını yenidən göstərir (demo üçün) |

## .env

| Açar | Təyinat |
|---|---|
| `VITE_API_URL` | Laravel API ünvanı, məs. `https://api.caffecino.az/api` |
| `VITE_USE_MOCK` | `true` — backend-siz demo data (`src/data/mockData.js`) |
| `VITE_SITE_URL` | Saytın tam ünvanı — WhatsApp/Instagram paylaşma önizləməsi üçün |

## Struktur

```
src/
  api/api.js            sayt üçün API sorğuları (+ mock rejimi)
  admin/                admin panel (ayrıca chunk kimi yüklənir)
  components/
    Main/               ana səhifə, menyu, məhsul kartı/pəncərəsi, axtarış
    Lucky/              "Şans kofesi" modalı
    Favorites/          bəyənmələr, cookie razılıq paneli
    Game/               mini oyun (canvas mühərriki: engine.js)
  hooks/                dil, sazlamalar, bəyənmələr, iş saatı, səhifə başlığı
public/locales/{az,en,ru}/   tərcümələr (landing.json — sayt, admin.json — admin)
```

## Məlumat saxlama (cihazda)

| Nə | Harada | Müddət |
|---|---|---|
| Cookie razılığı | cookie `caffecino_consent` | 1 il |
| Bəyənmələr | cookie `caffecino_likes` (yalnız razılıq verilibsə) | 1 il (Safari: 7 gün) |
| Dil seçimi | localStorage `lang` | — |
| Günün şans kofesi | localStorage `lucky_coffee` | həmin gün |
| Oyun rekordu | localStorage (yalnız razılıq verilibsə) | — |
| Admin girişi | localStorage `admin_token` | 7 gün (server tərəfindən) |

## Serverə qoymaq

```bash
npm run build     # dist/ qovluğu
```

`dist/` statik hostinqə yüklənir. SPA olduğu üçün bütün yollar `index.html`-ə yönləndirilməlidir:
Vercel üçün `vercel.json`, Apache üçün `htaccess` faylı hazırdır (serverdə adını `.htaccess` edin).
