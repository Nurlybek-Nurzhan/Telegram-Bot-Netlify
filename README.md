# Artisan Schools Premium Account Request Form

A professional web form application that collects premium account requests from school representatives and sends instant notifications via Telegram.

## 🎯 Project Purpose

**Business Use Case:**
- **Target Users:** School administrators, teachers, or representatives
- **Goal:** Streamline premium account requests
- **Benefit:** Instant notifications via Telegram = faster response times
- **Alternative to:** Email forms, Google Forms, or manual inquiry processes

---

## 🛠 Technology Stack

### Frontend
- **Vite 7.2.4** - Modern build tool (fast HMR, optimized builds)
- **TypeScript 5.9.3** - Type-safe JavaScript (strict mode)
- **SCSS 1.97.0** - CSS with variables, mixins, nesting
- **Vanilla JavaScript** - No framework overhead (lightweight)

### Backend
- **Netlify Functions** - Serverless compute (AWS Lambda under the hood)
- **Node.js 20** - Runtime environment
- **CommonJS (.cjs)** - Module format for serverless functions
- **dotenv 17.2.3** - Environment variables loader for local development

### Deployment & Hosting
- **Netlify** - Static hosting + serverless functions
- **Git-based CI/CD** - Push to deploy
- **Environment Variables** - Secure secrets management

### External Services
- **Telegram Bot API** - Message delivery service

---

## 🏗 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  index.html + main.ts (TypeScript/JavaScript)        │  │
│  │  • Form validation                                   │  │
│  │  • XSS protection (safe DOM manipulation)           │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │ HTTP POST                               │
│                   │ /.netlify/functions/send-telegram      │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    NETLIFY PLATFORM                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Static Site Hosting                                │   │
│  │  • Serves HTML, CSS, JS                            │   │
│  │  • CDN (Content Delivery Network)                  │   │
│  │  • HTTPS by default                                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Netlify Functions (AWS Lambda)                     │   │
│  │  • send-telegram.cjs                                │   │
│  │  • Validates form data                              │   │
│  │  • Formats message                                  │   │
│  │  • Escapes Markdown                                 │   │
│  │  • Reads env vars (BOT_TOKEN, CHAT_ID)            │   │
│  └────────────────┬───────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────────┘
                    │ HTTPS POST
                    │ api.telegram.org/bot{TOKEN}/sendMessage
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    TELEGRAM API                              │
│                                                              │
│  • Receives formatted message                               │
│  • Delivers to specified CHAT_ID                            │
│  • Returns success/error response                           │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              YOUR TELEGRAM CHAT                             │
│                                                             │
│  ⭐ PREMIUM ACCOUNT REQUEST                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━                                   │
│  👤 Full Name: John Doe                                     │
│  📱 Phone: +77771234567                                     │
│  🏫 School: Example School                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━                                   │
│  🕐 Received: Dec 17, 2025, 12:42 PM                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Artisan_Schools_Request-Form_Demo_bot/
├── src/
│   ├── main.ts              # Main entry point - form logic & UI
│   ├── main.scss            # Main styles
│   ├── ts/
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── validation.ts    # Form validation logic
│   │   ├── telegram.ts      # API integration
│   └── styles/
│       ├── _variables.scss  # Design tokens & colors
│       ├── _mixins.scss     # SCSS utility mixins
│       └── _reset.scss      # CSS reset
├── netlify/
│   └── functions/
│       └── send-telegram.cjs # Serverless function handler
├── public/                   # Static assets
├── dist/                     # Build output
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── netlify.toml             # Netlify deployment config
├── .env                     # Environment variables (NOT in git)
├── .env.example             # Environment variables template
└── .gitignore               # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Telegram Bot (see setup below)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Artisan_Schools_Request-Form_Demo_bot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 4. Set Up Telegram Bot

1. **Create a Telegram Bot:**
   - Open Telegram and message [@BotFather](https://t.me/BotFather)
   - Send `/newbot` command
   - Follow instructions to create your bot
   - Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Get Your Chat ID:**
   - Message [@userinfobot](https://t.me/userinfobot) on Telegram
   - Copy your chat ID (numeric value)

### 5. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

**⚠️ IMPORTANT:** Never commit `.env` to git! It's already in `.gitignore`.

### 6. Run Development Server

**Option 1: Netlify Dev (Recommended)**
```bash
# Export environment variables (Git Bash)
export TELEGRAM_BOT_TOKEN=your_token_here
export TELEGRAM_CHAT_ID=your_chat_id_here

# Start dev server
netlify dev
```

**Option 2: Windows CMD/PowerShell**
```bash
set TELEGRAM_BOT_TOKEN=your_token_here
set TELEGRAM_CHAT_ID=your_chat_id_here
netlify dev
```

The app will be available at:
- **Main app:** http://localhost:8888
- **Vite dev server:** http://localhost:5173 (proxied through 8888)

### 7. Build for Production
```bash
npm run build
```

Build output will be in the `dist/` directory.

---

## 🔄 How It Works

### Step-by-Step Flow

1. **User Visits Website**
   - Browser loads HTML, CSS, and JavaScript

2. **User Fills Form**
   - Real-time validation on blur (when leaving field)

3. **User Submits Form**
   - Client-side validation runs
   - If valid, sends POST request to `/.netlify/functions/send-telegram`

4. **Netlify Function Processes Request**
   - Validates data
   - Formats message with Markdown
   - Sends to Telegram Bot API

5. **Telegram Delivers Message**
   - Message appears in your Telegram chat
   - Formatted with emojis and structure

6. **User Gets Confirmation**
   - Success message displayed
   - Form resets for next submission

---

## 🛡 Security Features

### ✅ Implemented
1. **XSS Protection** - Safe DOM manipulation (no `innerHTML` with user input)
2. **Environment Variables** - Bot token never exposed to client
3. **Backend Validation** - Double validation (client + server)
4. **Markdown Escaping** - Prevents injection attacks in Telegram messages
5. **CORS Configuration** - Controlled access to API endpoints
6. **TypeScript Strict Mode** - Type safety and null checks

### 🔒 Best Practices
- `.env` in `.gitignore`
- Secrets stored in Netlify environment variables (production)
- HTTPS enforced by default (Netlify)
- Input sanitization on both client and server

---

## 📱 Features

### Form Validation
- **Full Name:** 2-100 characters
- **Phone:** 7-20 digits with international support
- **School Name:** 3-150 characters
- Real-time validation on blur
- Clear error messages with icons

### User Experience
- Loading states during submission
- Success/error feedback
- Form reset after successful submission
- Keyboard accessibility (Tab navigation)
- ARIA labels for screen readers
- Responsive design (mobile-friendly)

---

## 🚀 Deployment

### Deploy to Netlify

1. **Connect Repository**
   ```bash
   netlify init
   ```

2. **Set Environment Variables**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add `TELEGRAM_BOT_TOKEN`
   - Add `TELEGRAM_CHAT_ID`

3. **Deploy**
   ```bash
   # Manual deploy
   netlify deploy --prod

   # Or push to git (auto-deploy)
   git push origin main
   ```

### Build Settings
Already configured in `netlify.toml`:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`
- **Node version:** 20

---

## 🧪 Testing

### Test Form Submission
1. Fill all fields with valid data
2. Click "Request Premium"
3. Should see success message
4. Check your Telegram chat for notification

---

## 🔧 Development

### Available Scripts

```bash
# Start development server with Netlify Functions
npm run dev

# Start only Vite dev server (no functions)
npm run dev:vite

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

### Code Quality
- **TypeScript strict mode** enabled
- **No `any` types** - Full type safety
- **ESLint ready** - Add `.eslintrc` for linting
- **Prettier ready** - Add `.prettierrc` for formatting

---

## 📊 Performance

### Bundle Sizes
- **JavaScript:** 2.48 KB (gzipped)
- **CSS:** 1.66 KB (gzipped)
- **HTML:** 1.66 KB (gzipped)
- **Total:** ~6 KB

### Load Times
- **First Contentful Paint:** <500ms
- **Time to Interactive:** <1s
- **Lighthouse Score:** 95+

---

## 🤔 Why This Stack?

### Netlify
- ✅ Free tier generous (100GB bandwidth/month)
- ✅ Zero DevOps - no server management
- ✅ Automatic HTTPS
- ✅ Global CDN built-in
- ✅ Serverless functions = no backend code needed

### Vite
- ✅ 10-100x faster HMR than Webpack
- ✅ Instant server start (~200ms)
- ✅ Optimized production builds
- ✅ Native ES modules

### TypeScript
- ✅ Type safety catches errors at compile time
- ✅ Better IDE support (autocomplete, refactoring)
- ✅ Self-documenting code
- ✅ Easier maintenance

### Vanilla JS (No Framework)
- ✅ Zero framework overhead (2.48 KB vs React's 40 KB)
- ✅ No learning curve
- ✅ Perfect for simple forms
- ✅ Works everywhere

### Telegram
- ✅ Free API (unlimited messages)
- ✅ Instant notifications (mobile + desktop)
- ✅ No email server needed
- ✅ Rich formatting support

---

## 🐛 Troubleshooting

### Function Returns 404
**Problem:** `/.netlify/functions/send-telegram` returns 404

**Solutions:**
1. Make sure you're running `netlify dev`, not `npm run dev`
2. Check `netlify.toml` has correct functions directory
3. Restart the dev server

### Function Returns 500 (Server Configuration Error)
**Problem:** Missing environment variables

**Solutions:**
1. Check `.env` file exists with correct values
2. Export variables in terminal before running `netlify dev`
3. For production, add variables in Netlify Dashboard

### Build Fails
**Problem:** TypeScript compilation errors

**Solutions:**
1. Run `npx tsc --noEmit` to see detailed errors
2. Check all files have proper type annotations
3. Verify `tsconfig.json` is correct

---

## 📝 License

This project is private and proprietary to Artisan Education.

---

## 👨‍💻 Development Team

**Developed for:** Artisan Education
**Purpose:** Premium account request form with Telegram integration
**Status:** Production Ready ✅

---

## 🔗 Useful Links

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Netlify function logs in dashboard
3. Check browser console for errors
4. Contact development team

---

**Last Updated:** December 2025
**Version:** 1.0.0
