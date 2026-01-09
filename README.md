# Food Delivery Web Application

A full-stack online food delivery web application that allows anonymous users to browse, customize, and order food items without requiring account creation.

## 🚀 Features

- **Zero-friction ordering** - Complete checkout without registration
- **Menu browsing** - Browse food items by category
- **Cart management** - Persistent shopping cart with localStorage
- **Anonymous checkout** - Guest checkout with contact and delivery information
- **Order tracking** - Order confirmation and status tracking
- **Responsive design** - Mobile-friendly interface

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router DOM v6** - Client-side routing
- **React Hook Form + Zod** - Form handling and validation

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database operations
- **SQLite** - Development database (PostgreSQL-ready schema)
- **Class Validator** - Request validation

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Frontend production server

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** >= 20.x
- **Docker Compose** >= 2.x

## 🏃‍♂️ Getting Started

### Option 1: Using Docker Compose (Recommended)

The easiest way to run the entire application stack:

```bash
# Clone the repository
git clone <repository-url>
cd Workshop1

# Start all services
docker-compose up --build

# The application will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
```

### Option 2: Running Locally (Development)

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed

# Start the development server
npm run start:dev
```

The backend API will be available at `http://localhost:3000`

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
├── docker-compose.yml          # Docker Compose configuration
├── backend/
│   ├── Dockerfile              # Backend Docker configuration
│   ├── package.json            # Backend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.ts             # Database seeding script
│   │   └── migrations/         # Database migrations
│   └── src/
│       ├── main.ts             # Application entry point
│       ├── app.module.ts       # Root module
│       ├── admin/              # Admin endpoints
│       ├── menu/               # Menu management
│       ├── order/              # Order processing
│       └── prisma/             # Prisma service
├── frontend/
│   ├── Dockerfile              # Frontend Docker configuration
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── src/
│       ├── App.tsx             # Root React component
│       ├── components/         # Reusable UI components
│       ├── contexts/           # React Context providers
│       ├── hooks/              # Custom React hooks
│       ├── pages/              # Page components
│       ├── services/           # API and storage services
│       └── types/              # TypeScript type definitions
```

## 🔧 Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

## 📜 Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed the database |
| `npm run db:setup` | Run migrations and seed |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🗄 Database

The application uses **SQLite** for development with a **PostgreSQL-ready** Prisma schema. The database includes the following models:

- **MenuItem** - Food items with categories, prices, and options
- **MenuOption** - Customization options for menu items
- **Order** - Customer orders with delivery information
- **OrderItem** - Individual items within an order

## 🌐 API Endpoints

### Menu
- `GET /menu` - Get all menu items
- `GET /menu/:id` - Get a specific menu item

### Orders
- `POST /order` - Create a new order
- `GET /order/:orderNumber` - Get order by order number

### Admin
- `GET /admin/orders` - Get all orders (admin)
- `PATCH /admin/orders/:id/status` - Update order status

## 🐳 Docker Commands

```bash
# Start services
docker-compose up

# Start services in detached mode
docker-compose up -d

# Rebuild and start services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
