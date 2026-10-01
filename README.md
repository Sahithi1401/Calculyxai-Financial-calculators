<div align="center">

<img src="https://calculyxai.online/logo.png" width="110" alt="Calculyx AI logo" />

# Calculyx AI

**AI‑Powered Financial Intelligence Platform**

_Calculate • Analyze • Compare • Optimize_

[![Live](https://img.shields.io/badge/Live-calculyxai.online-1f6feb?style=for-the-badge)](https://calculyxai.online)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-v1-ff4154?style=for-the-badge)](https://tanstack.com/start)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq-LLM-000000?style=for-the-badge)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](#-license)

🌐 **[calculyxai.online](https://calculyxai.online)** · 🧪 **[Preview](https://calculyxai.lovable.app)**

</div>

---

## ✨ Overview

**Calculyx AI** is an enterprise‑grade AI financial intelligence platform that turns raw numbers into decisions. It combines 27+ interactive calculators, live market data, and LLM‑powered analysis to help people plan loans, taxes, investments, and portfolios across **India 🇮🇳, USA 🇺🇸, and UAE 🇦🇪**.

> Traditional calculators give you numbers. **Calculyx AI tells you what to do with them.**

---

## 🚀 Features

### 💰 Loan & Mortgage
- Home Loan EMI · Mortgage · Amortization Schedule
- Property Cost Breakdown · Interest Analysis
- Bank Comparison Engine · AI Affordability Score

### 📊 Investments
- SIP · FD · Compound Interest · Retirement Planner
- Inflation Calculator · Portfolio Tracker · Net Worth

### 🧾 Taxes
- Income Tax (IN / US / AE) · GST · Take‑Home Salary
- Jurisdiction‑aware tax rules and tips

### 📈 Stocks & Markets
- Live quotes (Finnhub) · Indian stocks · Predictions
- FinancialProduct schema · Rich SEO breadcrumbs

### 💱 Currency
- Live global FX converter · Historical charts

### 🤖 AI Layer
- Groq‑powered financial copilot (Llama 3.3 70B)
- Structured JSON insights: summary, recommendations, risks, next steps
- PDF report generation with charts & analysis

---

## 🧱 Tech Stack

| Layer | Stack |
|---|---|
| **Framework** | TanStack Start v1 (SSR) · React 19 · TypeScript |
| **Build** | Vite 7 · Bun · Cloudflare Workers runtime |
| **Styling** | Tailwind CSS v4 · shadcn/ui · Framer Motion · Recharts |
| **Backend** | Supabase (Postgres + RLS + Auth) · TanStack Server Functions |
| **AI** | Groq API (Llama 3.3 70B Versatile) |
| **Market Data** | Finnhub · Indian Stock API |
| **Email** | Resend (transactional + auth templates) |
| **Deploy** | Vercel · Lovable · Custom Domain (`calculyxai.online`) |

---

## 🔑 Environment Variables & API Keys

Create a `.env` at the project root (copy from `.env.example`). Keys prefixed with `VITE_` are exposed to the browser; the rest are **server‑only**. All variables are 100% **Vercel‑compatible** — paste them into **Vercel → Project Settings → Environment Variables**.

### 🖥️ Client (safe to expose)

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ref |
| `VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY` | logo.dev public key for company logos |

### 🔐 Server (never commit)

| Variable | Purpose | Where to get it |
|---|---|---|
| `SUPABASE_URL` | Supabase project URL | Supabase → Project Settings → API |
| `SUPABASE_PUBLISHABLE_KEY` | Server‑side publishable key | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 Admin key (bypasses RLS) | Supabase → Project Settings → API |
| `GROQ_API_KEY` | **All AI** — insights, chat, analysis (Llama 3.3 70B) | [console.groq.com](https://console.groq.com) |
| `FINNHUB_API_KEY` | Live US stock quotes | [finnhub.io](https://finnhub.io) |
| `INDIAN_STOCK_API_KEY` | NSE / BSE Indian market data | [indianapi.in](https://indianapi.in) |
| `RESEND_API_KEY` | Transactional emails (welcome, contact form) | [resend.com](https://resend.com) |
| `RESEND_FROM` | Verified sender (e.g. `Calculyx <no-reply@calculyxai.online>`) | Your verified Resend domain |

> See [`.env.example`](./.env.example) for a ready‑to‑copy template.

---

## ▲ Deploy on Vercel

This project is **fully Vercel‑compatible** — no Lovable runtime is required.

### 1. Import to Vercel
- Push to GitHub (already done ✅)
- On [vercel.com](https://vercel.com) → **Add New Project** → import your repo
- Framework preset: **Other** (`vercel.json` handles config)

### 2. Configure Environment Variables
In **Project Settings → Environment Variables**, add every key from `.env.example` for **Production**, **Preview**, and **Development** environments.

### 3. Build Settings (auto‑detected via `vercel.json`)
```
Install Command:  bun install
Build Command:    bun run build
Output Directory: .output/public
```

### 4. Deploy
Click **Deploy** — Vercel will build with TanStack Start's Nitro adapter and serve SSR through Vercel's Edge Network.



> ⚠️ **Never commit `.env`**. `SUPABASE_SERVICE_ROLE_KEY` bypasses Row‑Level Security — keep it server‑side only.

---

## 🛠️ Getting Started

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/calculyx-ai.git
cd calculyx-ai

# 2. Install (Bun recommended)
bun install

# 3. Configure environment
cp .env.example .env   # then fill in values

# 4. Dev server
bun run dev            # http://localhost:8080

# 5. Production build
bun run build
```

---

## 🛡️ Security

Enterprise‑grade defense‑in‑depth is baked in:

### 🔒 Transport & Headers (applied via `src/start.ts` + `vercel.json`)
- **HSTS** — `max-age=63072000; includeSubDomains; preload`
- **CSP** — strict Content Security Policy on HTML (whitelisted: Supabase, Groq, Finnhub, Resend, Indian Stock API, logo.dev)
- **X-Frame-Options** `SAMEORIGIN` · **X-Content-Type-Options** `nosniff`
- **Referrer-Policy** `strict-origin-when-cross-origin`
- **Permissions-Policy** — camera, mic, geolocation, payment, USB, FLoC all disabled
- **Cross-Origin-Opener-Policy** / **Resource-Policy** `same-origin`

### 🗄️ Data Layer
- **Row‑Level Security (RLS)** enabled on every user table
- **Role‑based access** via a separate `user_roles` table + `has_role()` SECURITY DEFINER function (no privilege escalation)
- Server functions use `requireSupabaseAuth` middleware — bearer token validated per request
- `SUPABASE_SERVICE_ROLE_KEY` is loaded only inside server handlers, never at module scope, never exposed to browser

### 🔑 Secrets Hygiene
- All secrets read via `process.env.*` on the server only
- `.env` is gitignored; `.env.example` ships the template
- Zero hardcoded API keys or credentials in the source

### 🧾 Input & Output
- **Zod validation** on every server function input
- HTML escaping on all user‑supplied email content
- Auth flows via Supabase (Google OAuth + Email/Password)

### 🤖 AI Layer
- All LLM calls routed through **Groq** (`src/lib/finflow/groq.server.ts`)
- Strict system prompts prevent scope escape / prompt injection
- Rate‑limit handling (429) surfaced to users

---



## 📁 Project Structure

```
src/
├── routes/                  # TanStack file‑based routes (pages + API)
│   ├── __root.tsx           # App shell, SEO, JSON‑LD
│   ├── calc.$type.tsx       # Dynamic calculator pages
│   ├── stocks.$symbol.tsx   # Dynamic stock pages
│   └── sitemap*.xml.ts      # Dynamic sitemap generation
├── components/finflow/      # Calculators, hero, dashboard, charts
├── lib/
│   ├── finflow/             # Server functions, AI, market data
│   └── seo/                 # SEO engine, JSON‑LD, canonical
├── integrations/supabase/   # Client + auth middleware (auto‑gen)
└── styles.css               # Tailwind v4 tokens
```

---

## 🔎 SEO & AI Search

- ✅ Dynamic sitemaps (`/sitemap.xml`, calculators, stocks, pages)
- ✅ Robots.txt tuned for **GPTBot, ClaudeBot, PerplexityBot, Google‑Extended**
- ✅ IndexNow key + Bing/Yandex verification hooks
- ✅ Structured data: `Organization`, `WebSite`, `SoftwareApplication`, `FinancialProduct`, `BreadcrumbList`, `FAQPage`, `HowTo`
- ✅ Unique per‑page `title`, `description`, canonical, OG, Twitter cards

---

## 🗺️ Roadmap

- [x] Core calculators + AI insights
- [x] Live stocks & currency
- [x] Dynamic SEO & sitemaps
- [ ] RAG‑based financial copilot
- [ ] Bank statement OCR & analysis
- [ ] Multi‑language (Hindi, Arabic)
- [ ] Enterprise dashboards

---

## 🤝 Contributing

Pull requests welcome. For major changes, open an issue first to discuss the direction.

```bash
git checkout -b feat/your-feature
bun run build   # must pass
git commit -m "feat: your feature"
```

---

## 📄 License

MIT © [Sai Balaji](https://calculyxai.online) — B.Tech CSE (AI & ML)

---

<div align="center">

### Built with ❤️ to simplify financial decisions through AI

**Calculyx AI** — _Financial Intelligence. Simplified._

</div>
