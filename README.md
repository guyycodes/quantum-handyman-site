# Quantum Technician

A modern React-based web development services platform for **Quantum Technician** — full-stack development by a CS-degree developer.

![Quantum Technician](https://quantumtechnician.com/og-image.png)

## 🌐 Live Site

**[quantumtechnician.com](https://quantumtechnician.com)**

## 🎯 Overview

Quantum Technician offers professional web development services in the Denver metro area and nationwide:

- **💻 Custom Web Applications** — React, Node.js, full-stack development
- **🛒 E-commerce Solutions** — Online stores with payment integration
- **🔍 SEO & Performance** — Search optimization and Core Web Vitals
- **🤖 AI Integration** — ChatGPT, Claude, and custom AI solutions
- **📱 Creator Packages** — Content creators and influencer solutions

## ✨ Key Features

### Service Booking
- **Multi-step booking modal** for consultations
- **Service packages** with transparent pricing
- **Contact form** with instant notifications

### AI-Powered Estimates
- **GPT-4o-mini vision** for analyzing project requirements
- Upload images for instant AI assessment
- Intelligent pricing based on project complexity

### Analytics & Tracking
- **PostHog** for product analytics and user behavior
- **Google Analytics 4** for traffic and conversions
- Custom event tracking throughout the experience

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, React Router 6 |
| **Styling** | Tailwind CSS 3.4 |
| **Build Tool** | Vite 5 |
| **Hosting** | Netlify (with Edge Functions) |
| **AI** | OpenAI GPT-4o-mini (via Netlify Edge) |
| **Email** | EmailJS |
| **Analytics** | PostHog, Google Analytics 4 |
| **Icons** | Lucide React, React Icons |

## 📁 Project Structure

```
quantum-technician-site/
├── index.html              # Main entry with SEO/structured data
├── netlify/
│   └── edge-functions/
│       ├── ai-estimate.js  # OpenAI proxy for AI estimates
│       └── validate-promo.js
├── public/
│   ├── images/             # Optimized service images
│   │   ├── web-dev/
│   │   └── profile/
│   ├── manifest.json       # PWA manifest
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── Components/
│   │   ├── BookingModal.jsx
│   │   ├── ChatBot.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SplitLanding.jsx
│   │   └── ...
│   ├── contexts/
│   │   ├── WorldContext.jsx
│   │   ├── GoogleAnalyticsProvider.jsx
│   │   └── PostHogProvider.jsx
│   ├── hooks/
│   │   ├── usePostHog.js
│   │   └── useSmsNotification.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Portfolio.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── HowItWorks.jsx
│   │   └── ...
│   ├── services/
│   │   ├── emailService.js
│   │   └── promoCodeService.js
│   └── utils/
│       ├── uniqueIdGenerator.js
│       ├── dataSanitization.js
│       └── chatbotResponses.js
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
git clone https://github.com/guyycodes/quantum-handyman-site.git
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

# OpenAI (used by Netlify Edge Function)
VITE_OPENAI_API_KEY=your_openai_api_key

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

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/web/` | Web development home |
| `/web/services` | Service listings |
| `/web/portfolio` | Portfolio gallery |
| `/web/about` | About page |
| `/web/contact` | Contact form |
| `/web/how-it-works` | Process explanation |

## 🎨 Services Offered

### Custom Web Applications
Full-stack web application development using React, Node.js, and modern technologies. $100/page.

### E-commerce Solutions
Complete e-commerce platforms with payment integration, inventory management, and analytics. $1,300 - $5,000.

### SEO & Performance
Search engine optimization, performance tuning, and Core Web Vitals optimization. $500 - $2,000.

### AI Integration
ChatGPT, Claude, and custom AI model integration into web applications. Starting at $1,000.

### Creator Packages
Specialized solutions for content creators and influencers looking to build their online presence.

## 🔒 Security

- **Content Security Policy** headers configured in `netlify.toml`
- API keys proxied through edge functions (never exposed to client)
- Input sanitization via `dataSanitization.js`

## 🌍 Deployment

The site is deployed on Netlify with:
- Automatic builds from `main` branch
- Edge Functions for serverless API routes
- Custom security headers
- Asset caching optimization
- SPA redirects for client-side routing

## 📄 License

Proprietary — © 2025 Quantum Technician LLC

## 👤 Author

**Morgan B.** — Founder & Full-Stack Developer  
Florida International University — Computer Science

---

*Professional web development with CS expertise — turning your digital vision into reality.*
