# AI Hub Iran - پلتفرم جامع هوش مصنوعی

یک اپلیکیشن چت‌بات هوش مصنوعی مخصوص بازار ایران با امکانات متنوع

## ویژگی‌ها

- ✅ **۵ مدل چت‌بات** - GPT-4, Claude 3, Gemini, Llama 3, Mistral
- ✅ **ساخت عکس** - تولید تصاویر با DALL-E 3
- 🚧 **ساخت ویدیو** - تولید ویدیو با هوش مصنوعی (به زودی)
- 🚧 **ساخت موسیقی** - تولید موسیقی اختصاصی (به زودی)
- ✅ **ایجنت‌های تخصصی** - برنامه‌نویس، نویسنده، مشاور مالی، مترجم، بازاریاب
- ✅ **تحلیل مالی** - داده‌های لحظه‌ای بازار ایران
- ✅ **سیستم کردیت** - خرید و مدیریت اعتبار
- ✅ **احراز هویت OTP** - با کاوه‌نگار

## تکنولوژی‌ها

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **AI**: OpenRouter API
- **SMS**: Kavenegar
- **Auth**: NextAuth.js

## نصب و راه‌اندازی

### ۱. نصب وابستگی‌ها

```bash
npm install
```

### ۲. تنظیم متغیرهای محیطی

فایل `.env.example` را به `.env` کپی کنید و مقادیر را تنظیم کنید:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://..."
OPENROUTER_API_KEY="..."
KAVENEGAR_API_KEY="..."
NEXTAUTH_SECRET="..."
OPENAI_API_KEY="..."
```

### ۳. تنظیم دیتابیس

```bash
npx prisma generate
npx prisma db push
```

### ۴. اجرای پروژه

```bash
npm run dev
```

## ساختار پروژه

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── chat/          # Chat API
│   │   ├── credits/       # Credits API
│   │   ├── image/         # Image generation API
│   │   ├── market/        # Market data API
│   │   └── otp/           # OTP verification API
│   ├── (auth)/
│   │   ├── login/         # Login page
│   │   └── verify/        # OTP verification page
│   └── (dashboard)/
│       ├── chat/          # Chat interface
│       ├── images/        # Image generation
│       ├── videos/        # Video generation
│       ├── music/         # Music generation
│       ├── agents/        # AI agents
│       ├── financial/     # Financial data
│       ├── credits/       # Credits management
│       └── profile/       # User profile
├── components/
│   ├── ui/               # Reusable UI components
│   ├── chat/             # Chat-related components
│   └── Providers.tsx     # Context providers
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── credits.ts        # Credits management
│   ├── kavenegar.ts      # SMS service
│   ├── openrouter.ts     # AI models configuration
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types
```

## سیستم کردیت

| عملیات | کردیت |
|--------|-------|
| پیام چت | ۱ + هزینه مدل |
| ساخت عکس | ۲۰ |
| ساخت ویدیو | ۵۰ |
| ساخت موسیقی | ۳۰ |

## مدل‌های AI

| مدل | هزینه (کردیت/پیام) |
|-----|-------------------|
| GPT-4 Turbo | ۱۰ |
| Claude 3 | ۸ |
| Gemini Pro | ۵ |
| Mistral Large | ۴ |
| Llama 3 70B | ۳ |

## API Endpoints

### احراز هویت
- `POST /api/otp` - ارسال کد OTP
- `POST /api/auth/callback/phone-otp` - تایید OTP

### چت
- `GET /api/chat` - دریافت لیست گفتگوها
- `POST /api/chat` - ارسال پیام جدید

### تصاویر
- `GET /api/image` - دریافت گالری
- `POST /api/image` - ساخت تصویر

### کردیت
- `GET /api/credits` - دریافت موجودی
- `POST /api/credits` - خرید اعتبار

### بازار
- `GET /api/market` - داده‌های لحظه‌ای بازار

## Deployment

پروژه برای deploy روی Vercel بهینه شده است:

```bash
npm run build
```

## License

MIT
