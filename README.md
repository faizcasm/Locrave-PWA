# 🌐 Locrave PWA - Hyper-Local Community Platform

**Production-Ready Progressive Web Application for Local Communities**

## 📋 Overview

Locrave is a comprehensive Progressive Web Application designed to connect local communities. It enables users to share posts, book local services, buy/sell items, chat with neighbors, and access emergency alerts - all within their geographic vicinity.

**Author**: Faizan Hameed

## ✨ Key Features

- 🔐 Phone + OTP Authentication with JWT
- 📰 Geo-based Community Feed
- 🛠️ Local Services Marketplace
- 🛒 Buy & Sell Platform
- 🚨 Emergency Alerts
- 💬 Real-time Chat (Socket.IO)
- 📱 Full PWA Support (offline, installable)
- 🌓 Dark/Light Mode
- ♿ Accessibility Support

## 🛠️ Tech Stack

- React 18.2 + TypeScript 5.3
- Vite 5.0 + PWA Plugin
- Zustand (State Management)
- React Router v6
- Axios + Socket.IO Client
- IndexedDB for Offline Storage
- CSS Modules + Framer Motion

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### Development

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📁 Project Structure

```
src/
├── components/     # UI components (common, layout, features)
├── hooks/          # Custom React hooks
├── lib/            # API, Socket, Storage clients
├── pages/          # Route pages
├── routes/         # Routing configuration
├── stores/         # Zustand state stores
├── styles/         # Global CSS
├── types/          # TypeScript definitions
└── utils/          # Utility functions
```

## 🔌 API Integration

The app expects a backend with these endpoints:

- **Auth**: `/auth/login`, `/auth/verify-otp`, `/auth/refresh`
- **Posts**: `/posts` (CRUD operations)
- **Services**: `/services`, `/bookings`
- **Marketplace**: `/marketplace`
- **Chat**: `/chat/rooms`, `/chat/rooms/:id/messages`
- **Notifications**: `/notifications`

### Socket.IO Events

- `chat:message`, `chat:typing`
- `notification:new`
- `post:new`, `post:update`, `post:delete`
- `emergency:alert`
- `booking:update`

## 📱 PWA Features

- ✅ Offline support with service workers
- ✅ Installable on mobile and desktop
- ✅ Push notifications
- ✅ Background sync
- ✅ App shortcuts

## 🏗️ Architecture

### State Management (Zustand)

- `authStore` - Authentication
- `feedStore` - Community posts
- `chatStore` - Messaging
- `notificationStore` - Notifications
- `servicesStore` - Services & bookings
- `marketplaceStore` - Listings
- `emergencyStore` - Emergency alerts
- `uiStore` - UI state (theme, sidebar)

### Storage Strategy

- **Tokens**: localStorage (future: encrypted IndexedDB)
- **Posts**: IndexedDB for offline access
- **Messages**: IndexedDB per room
- **Drafts**: IndexedDB for offline editing

## ⚡ Performance

- Route-based code splitting
- Lazy loading images
- Optimistic UI updates
- Infinite scroll pagination
- Request debouncing
- Service worker caching

## 🔒 Security

- JWT with automatic refresh
- Token storage in localStorage
- Request queue during token refresh
- Input validation with Zod
- XSS protection (React defaults)
- HTTPS-only API calls

## 🚀 Deployment

### Build

```bash
npm run build
```

Outputs to `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Lighthouse Targets

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 100

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## 📄 License

Proprietary and confidential.

---

**Made with ❤️ for Local Communities by Faizan Hameed**
