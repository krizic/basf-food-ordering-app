# Software Requirements Document (SRD)
## Full Stack Online Food Delivery Web Store

---

## 1. Project Overview

### 1.1 Product Vision
A responsive, full-stack food delivery web application that allows anonymous users to browse, customize, and order food items without requiring account creation.

### 1.2 Core Value Proposition
- Zero-friction ordering for first-time users
- Fully functional anonymous checkout
- Responsive design across all devices
- Complete order management system

---

## 2. Technical Stack Requirements

### 2.1 Frontend
- **Framework**: React 19.2
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Context API + useState/useReducer
- **Routing**: React Router DOM v6
- **Form Handling**: React Hook Form + Zod validation

### 2.2 Backend
- **Framework**: Nest.js
- **ORM**: Prisma 6
- **Database**: SQLite (development), PostgreSQL-ready schema
- **API**: RESTful endpoints
- **Validation**: Class Validator + Class Transformer

### 2.3 Infrastructure
- **Containerization**: Docker + Docker Compose
- **Multi-stage builds** for optimized production images
- **Environment-based configuration**

---

## 3. Core Functional Requirements

### 3.1 User Experience Flow (Anonymous)
```
Home → Browse Menu → Select Item → Customize → Add to Cart → 
Review Cart → Checkout → Order Confirmation → Order Tracking
```

### 3.2 Feature Breakdown

#### 3.2.1 Public Landing Page (FE-01)
- **Requirements**:
  - Hero section with featured items
  - Restaurant/category browsing
  - Search functionality
  - Responsive grid layout
- **Acceptance Criteria**:
  - Loads within 2 seconds
  - Mobile-responsive grid (1-4 columns)
  - Search returns results in <500ms

#### 3.2.2 Food Selection & Customization (FE-02)
- **Requirements**:
  - Product cards with images, name, price
  - Item details modal/expansion
  - Quantity selector (+/- buttons)
  - Customization options (e.g., spice level, toppings)
  - Real-time price calculation
- **Acceptance Criteria**:
  - Customization changes update price immediately
  - All modifications persist to cart
  - Image lazy loading implemented

#### 3.2.3 Shopping Cart Management (FE-03)
- **Requirements**:
  - Persistent cart (localStorage + session)
  - Cart preview/sidebar
  - Item quantity modification
  - Remove item functionality
  - Subtotal, tax, delivery fee calculation
- **Acceptance Criteria**:
  - Cart persists across page refreshes
  - All calculations accurate to 2 decimal places
  - Real-time inventory validation

#### 3.2.4 Anonymous Checkout System (FE-04)
- **Requirements**:
  - Guest checkout flow
  - Contact information collection (email/phone)
  - Delivery address with Google Maps integration
  - Order notes/special instructions
  - Multiple payment method support (mock)
- **Acceptance Criteria**:
  - Complete checkout without registration
  - Email validation
  - Order confirmation display
  - Order number generation

#### 3.2.5 Order Management (BE-01)
- **Requirements**:
  - Order creation endpoint
  - Order status tracking (Pending → Preparing → Out for Delivery → Delivered)
  - Order history retrieval by contact info
- **Acceptance Criteria**:
  - ACID-compliant transaction handling
  - Order status webhook support
  - 99% successful order creation rate

#### 3.2.6 Admin Management (BE-02)
- **Requirements**:
  - Menu item CRUD operations
  - Order management dashboard
  - Inventory management
  - Analytics endpoints
- **Acceptance Criteria**:
  - Role-based access control
  - Audit logging for all admin actions
  - Bulk operations support

---

## 4. Database Schema

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model MenuItem {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal
  category    String
  imageUrl    String?
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  options     MenuOption[]
  orders      OrderItem[]
}

model MenuOption {
  id        String   @id @default(cuid())
  name      String
  choices   Json     // Array of {name: string, priceDelta: decimal}
  isRequired Boolean  @default(false)
  maxChoices Int?
  menuItem  MenuItem @relation(fields: [menuItemId], references: [id])
  menuItemId String
}

model Order {
  id            String   @id @default(cuid())
  orderNumber   String   @unique
  customerEmail String?
  customerPhone String?
  deliveryAddress Json   // {street, city, postalCode, instructions}
  status        OrderStatus @default(PENDING)
  subtotal      Decimal
  tax           Decimal
  deliveryFee   Decimal
  total         Decimal
  specialInstructions String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  items         OrderItem[]
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}

model OrderItem {
  id          String   @id @default(cuid())
  order       Order    @relation(fields: [orderId], references: [id])
  orderId     String
  menuItem    MenuItem @relation(fields: [menuItemId], references: [id])
  menuItemId  String
  quantity    Int
  unitPrice   Decimal
  totalPrice  Decimal
  customizations Json   // Store selected options
}
```

Pre-seed database with some items and categories for development.

---

## 5. API Specification

### 5.1 Public Endpoints

#### GET `/api/menu`
- **Response**: `{ categories: Category[], items: MenuItem[] }`
- **Cache**: 5 minutes

#### POST `/api/orders`
- **Body**:
```json
{
  "customer": {
    "email": "user@example.com",
    "phone": "+1234567890"
  },
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "City",
    "postalCode": "12345"
  },
  "items": [
    {
      "menuItemId": "item_123",
      "quantity": 2,
      "customizations": {
        "spiceLevel": "medium",
        "extraToppings": ["cheese", "bacon"]
      }
    }
  ],
  "specialInstructions": "Leave at door"
}
```
- **Response**: `{ orderId: string, orderNumber: string, estimatedDelivery: string }`

#### GET `/api/orders/:orderNumber`
- **Query Params**: `?email=user@example.com` (for verification)
- **Response**: Full order details with status

### 5.2 Admin Endpoints (Protected)
- `POST /api/admin/menu-items` - Create menu item
- `PUT /api/admin/menu-items/:id` - Update item
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/:id/status` - Update order status

---

## 6. Component Architecture (Frontend)

```
src/
├── components/
│   ├── layout/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── CartSidebar/
│   ├── menu/
│   │   ├── MenuCategory/
│   │   ├── MenuItemCard/
│   │   └── ItemCustomizer/
│   ├── cart/
│   │   ├── CartItem/
│   │   └── CartSummary/
│   ├── checkout/
│   │   ├── ContactForm/
│   │   ├── AddressForm/
│   │   └── PaymentMethod/
│   └── shared/
│       ├── Button/
│       ├── Input/
│       └── Modal/
├── contexts/
│   ├── CartContext.tsx
│   └── OrderContext.tsx
├── hooks/
│   ├── useCart.ts
│   └── useMenu.ts
├── pages/
│   ├── Home.tsx
│   ├── Menu.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── OrderConfirmation.tsx
└── services/
    ├── api.ts
    └── cartStorage.ts
```

---

## 7. Docker Configuration

### 7.1 Dockerfile (Frontend)
```dockerfile
# Development
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Production
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 7.2 Dockerfile (Backend)
```dockerfile
FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]
```

### 7.3 docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      target: development
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      target: development
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    environment:
      - DATABASE_URL=file:/data/dev.db
      - NODE_ENV=development
    volumes:
      - db-data:/data

volumes:
  db-data:
```

---

## 8. Performance Requirements

### 8.1 Frontend
- **Lighthouse Scores**: >90 Performance, >95 Accessibility
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **Bundle Size**: <500KB gzipped initial load

### 8.2 Backend
- **API Response Time**: <200ms for 95th percentile
- **Database Queries**: <50ms average
- **Concurrent Users**: Support 1000+ simultaneous sessions

### 8.3 Scalability
- Database connection pooling configured
- Stateless API design for horizontal scaling
- CDN-ready static assets

---

## 9. Development Workflow

### 9.1 Git Branch Strategy
```
main (protected)
├── release/*
├── feature/*
├── hotfix/*
└── develop
```

### 9.2 Code Quality Standards
- ESLint + Prettier configuration
- TypeScript strict mode enabled
- 80% minimum test coverage
- Husky pre-commit hooks

### 9.3 Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright for critical user flows
- **Snapshot Testing**: Component visual regression

---

## 10. Deployment Configuration

### 10.1 Environment Variables
```env
# Frontend (.env.production)
VITE_API_URL=https://api.yourdomain.com
VITE_GOOGLE_MAPS_API_KEY=xxx

# Backend (.env.production)
DATABASE_URL=postgresql://...
JWT_SECRET=xxx
CORS_ORIGINS=https://yourdomain.com
```

### 10.2 CI/CD Pipeline (GitHub Actions)
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker-compose -f docker-compose.test.yml up --exit-code-from test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: ./deploy.sh
```

---

## 11. Success Metrics & KPIs

### 11.1 Business Metrics
- Conversion rate (Browse → Order)
- Average order value
- Cart abandonment rate
- Customer acquisition cost

### 11.2 Technical Metrics
- API uptime (99.95% target)
- Error rate (<0.1% target)
- Page load performance
- Mobile vs. desktop conversion

### 11.3 User Experience Metrics
- Net Promoter Score (NPS)
- Customer Satisfaction (CSAT)
- Time to complete checkout
- Support ticket volume

---

## 12. Future Enhancements (Post-MVP)

### 12.1 Phase 2
- User accounts and authentication
- Loyalty program integration
- Real-time order tracking with WebSockets
- Multi-restaurant support

### 12.2 Phase 3
- Mobile app (React Native)
- AI-powered recommendations
- Dynamic pricing engine
- Advanced analytics dashboard

### 12.3 Phase 4
- Multi-language support
- Voice ordering integration
- IoT integration for smart delivery
- Blockchain-based payment system

---

## 13. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Anonymous checkout abuse | Medium | High | Rate limiting, CAPTCHA, fraud detection |
| SQLite production scaling | Low | Medium | PostgreSQL migration path built-in |
| Payment integration | Medium | High | Mock implementation first, Stripe/Braintree ready |
| Responsive design issues | Low | Medium | Comprehensive cross-browser testing |
| Docker performance | Low | Low | Production-optimized multi-stage builds |

---

## 14. Documentation Requirements

### 14.1 Developer Documentation
- API Swagger/OpenAPI specification
- Component library with Storybook
- Database schema documentation
- Deployment runbooks

### 14.2 User Documentation
- FAQ section
- Order tracking instructions
- Contact support information
- Privacy policy and terms

---

**Document Version**: 1.0  
**Last Updated**: $(date)  
**Product Owner**: [Your Name]  
**Stakeholders**: Development Team, Design Team, Operations Team  

---