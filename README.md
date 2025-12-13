# Quantum Technician

A modern React-based service booking platform for **Quantum Technician** — a unique dual-expertise business combining traditional craftsmanship with computer science expertise. From drywall to databases.

![Quantum Technician](https://quantumtechnician.com/og-image.png)

## 🌐 Live Site

**[quantumtechnician.com](https://quantumtechnician.com)**

## 🎯 Overview

Quantum Technician serves the Denver metro area with two distinct service worlds:

- **🔧 Technician Services** — Home repairs, smart home installation, property maintenance, landscaping
- **💻 Web Development** — Custom websites, web applications, SEO, AI integrations

The platform features a split-landing architecture where users choose their service world, then navigate through a fully integrated booking and estimation system.

## ✨ Key Features

### Booking System
- **Multi-step booking modal** with intent selection (Book Service vs Get Estimate)
- **Real-time calendar integration** via Google Apps Script
- **Time slot selection** with availability checking
- **Service packages** with detailed pricing

### AI-Powered Estimates
- **GPT-4o-mini vision** for analyzing project photos
- Upload up to 3 images for instant AI assessment
- Intelligent pricing based on service type and complexity
- Promo code system for free estimate retries

### Payment Processing
- **Stripe integration** for secure payments
- Deposit collection for bookings
- AI estimate fee processing ($1.95)

### Customer Portal
- Job tracking with status updates
- Estimate history and management
- Payment status visibility
- Real-time job cards with detailed info

### Analytics & Tracking
- **PostHog** for product analytics and user behavior
- **Google Analytics 4** for traffic and conversions
- Funnel tracking for booking flow optimization
- Custom event tracking throughout the experience

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, React Router 6 |
| **Styling** | Tailwind CSS 3.4 |
| **Build Tool** | Vite 5 |
| **Hosting** | Netlify (with Edge Functions) |
| **Payments** | Stripe.js |
| **AI** | OpenAI GPT-4o-mini (via Netlify Edge) |
| **Email** | EmailJS |
| **Calendar** | Google Apps Script |
| **Analytics** | PostHog, Google Analytics 4 |
| **Icons** | Lucide React, React Icons |

## 📁 Project Structure

```
quantum-handyman-site/
├── index.html              # Main entry with SEO/structured data
├── netlify/
│   └── edge-functions/
│       ├── ai-estimate.js  # OpenAI proxy for AI estimates
│       └── validate-promo.js
├── public/
│   ├── images/             # Optimized service images
│   │   ├── home-repair/
│   │   ├── landscaping/
│   │   ├── profile/
│   │   ├── smart-home/
│   │   └── web-dev/
│   ├── manifest.json       # PWA manifest
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── Components/
│   │   ├── bookingSystem/  # Multi-step booking flow
│   │   │   ├── IntentSelection.jsx
│   │   │   ├── CalendarStep.jsx
│   │   │   ├── ServiceSelection.jsx
│   │   │   ├── TimeSlotSelection.jsx
│   │   │   ├── CustomerInfo.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── BookingSuccess.jsx
│   │   │   ├── EstimateConfirmation.jsx
│   │   │   └── EstimateSuccess.jsx
│   │   ├── portal/         # Customer portal components
│   │   │   ├── JobCard.jsx
│   │   │   ├── EstimateCard.jsx
│   │   │   └── JobPaymentModal.jsx
│   │   ├── BookingModal.jsx
│   │   ├── StripePaymentModal.jsx
│   │   ├── ChatBot.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SplitLanding.jsx  # World selection
│   │   └── ...
│   ├── contexts/
│   │   ├── WorldContext.jsx  # Technician vs Web world
│   │   ├── GoogleAnalyticsProvider.jsx
│   │   └── PostHogProvider.jsx
│   ├── hooks/
│   │   ├── useGoogleScript.js
│   │   ├── useStripe.js
│   │   ├── usePostHog.js
│   │   └── useSmsNotification.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Portal.jsx      # Customer portal
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── HowItWorks.jsx
│   │   └── ...
│   ├── services/
│   │   ├── aiEstimateService.js
│   │   ├── googleCalendarService.js
│   │   ├── googleScriptService.js
│   │   ├── stripePaymentService.js
│   │   ├── emailService.js
│   │   └── promoCodeService.js
│   └── utils/
│       ├── imageCompression.js
│       ├── uniqueIdGenerator.js
│       ├── dataSanitization.js
│       └── chatbotResponses.js
├── technician/
│   └── index.html          # Technician world entry
├── web/
│   └── index.html          # Web dev world entry
├── netlify.toml            # Netlify config & headers
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (22 recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quantum-handyman-site.git
cd quantum-handyman-site

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OpenAI (used by Netlify Edge Function)
VITE_OPENAI_API_KEY=your_openai_api_key

# Google Apps Script
VITE_GOOGLE_SCRIPT_URL=your_apps_script_deployment_url

# Analytics
VITE_POSTHOG_API_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_GA_MEASUREMENT_ID=your_ga4_measurement_id
```

### Development

```bash
# Run dev server with hot reload
npm run dev

# Run with Netlify CLI (for edge functions)
netlify dev
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 📱 Routes

The app uses a dual-world routing structure:

| Route | Description |
|-------|-------------|
| `/` | Split landing page (world selection) |
| `/technician/*` | Technician services world |
| `/web/*` | Web development world |
| `/*/services` | Service listings |
| `/*/portfolio` | Portfolio gallery |
| `/*/portal` | Customer portal |
| `/*/about` | About page |
| `/*/contact` | Contact form |
| `/*/how-it-works` | Process explanation |
| `/*/payment-success` | Stripe success redirect |
| `/*/payment-cancel` | Stripe cancel redirect |

## 🎨 Features Deep Dive

### Split Landing Architecture
Users arrive at a visually split landing page choosing between "Physical Services" (Technician) and "Digital Services" (Web). This sets the `WorldContext` which customizes content, services, and CTAs throughout the experience.

### Booking Flow
1. **Intent Selection** — Choose "Book Service" or "Get Estimate"
2. **Service Selection** — Pick from available packages
3. **Calendar** — Select preferred date
4. **Time Slots** — Choose available time
5. **Customer Info** — Enter details + optional photo upload
6. **Confirmation** — Review and submit
7. **Payment** (optional) — Process deposit via Stripe

### AI Estimation
The AI estimate feature uses OpenAI's GPT-4o-mini with vision capabilities:
- Accepts project description + up to 3 photos
- Proxied through Netlify Edge Function (secure API key)
- Returns structured JSON with price range, materials, labor hours
- Includes promo code (`FREEQUOTE`) for insufficient info scenarios

### Customer Portal
Accessible via magic link or reference number:
- View active jobs with status badges
- Track estimates and their outcomes
- Make payments for approved work
- Contact support directly

## 🔒 Security

- **Content Security Policy** headers configured in `netlify.toml`
- API keys proxied through edge functions (never exposed to client)
- Input sanitization via `dataSanitization.js`
- Secure payment handling through Stripe Elements

## 📊 Analytics Events

Key tracked events:
- `booking_started` / `booking_complete` / `booking_abandoned`
- `estimate_requested` / `estimate_generated`
- `payment_initiated` / `payment_success`
- `funnel_step_*` with timing data
- World selection and navigation patterns

## 🌍 Deployment

The site is deployed on Netlify with:
- Automatic builds from `main` branch
- Edge Functions for serverless API routes
- Custom security headers
- Asset caching optimization
- SPA redirects for client-side routing

## 📄 License

Proprietary — © 2024 Quantum Technician LLC

## 👤 Author

**Morgan B.** — Founder & Technology Craftsman  
Florida International University — Computer Science

---

*"From drywall to databases — solving both physical and digital problems with deep multi-disciplinary expertise."*

