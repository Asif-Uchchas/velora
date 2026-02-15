# 🛍️ Velora - Premium E-Commerce Platform

<p align="center">
  <img src="https://via.placeholder.com/800x400/6366F1/FFFFFF?text=Velora+E-Commerce" alt="Velora Banner" width="800"/>
</p>

<p align="center">
  <b>A world-class, production-ready omnichannel e-commerce platform</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#user-roles">User Roles</a> •
  <a href="#screenshots">Screenshots</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe" alt="Stripe"/>
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [User Roles & Permissions](#user-roles--permissions)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Velora** is a modern, full-featured e-commerce platform built with Next.js 16, React 19, TypeScript, and PostgreSQL. Inspired by Shopify, Stripe, Linear, and Apple, it delivers a premium shopping experience with a focus on performance, accessibility, and beautiful design.

### Key Highlights

✨ **Modern UI/UX** - Beautiful, responsive design with dark mode support  
🚀 **High Performance** - Server Components, streaming, and edge-ready  
🔒 **Secure** - Role-based authentication with NextAuth v5  
💳 **Payments** - Full Stripe integration with webhooks  
📱 **Mobile-First** - Optimized for all devices and aspect ratios  
🎨 **Customizable** - Tailwind CSS + shadcn/ui components  

---

## ✨ Features

### 🏪 Customer Features

#### Product Discovery
- 🏠 **Homepage** with hero section, featured products, and categories
- 🔍 **Advanced Search** with filters and sorting
- 🏷️ **Category Browsing** with product counts
- ⭐ **Featured Products** showcase
- 📱 **Responsive Grid** - 2 columns on mobile, 4 on desktop

#### Product Experience
- 📸 **Multi-Image Gallery** with thumbnail navigation
- 🔍 **Image Zoom/Lightbox** - Click to zoom, keyboard navigation
- 💰 **Taka Currency** (৳) - Bangladeshi Taka formatting
- 🏷️ **Discount Badges** - Show percentage off
- ⭐ **Product Reviews** with star ratings
- 📦 **Stock Indicators** - Real-time availability

#### Shopping Experience
- 🛒 **Shopping Cart** with quantity controls
- 💾 **Persistent Cart** - Saved to database
- ❤️ **Wishlist** - Save products for later
- 💳 **Stripe Checkout** - Secure payment processing
- 📧 **Order Confirmation** - Success page after purchase
- 📋 **Order History** - View past orders with status

#### User Account
- 🔐 **Authentication** - Email/password + GitHub OAuth
- 👤 **Profile Management** - Update name and settings
- 📍 **Saved Addresses** - Multiple shipping addresses
- 📊 **Order Tracking** - View order status

### 🔧 Admin Features

#### Dashboard
- 📊 **Analytics Overview** - KPI cards and charts
- 📈 **Revenue Charts** - Sales trends with Recharts
- 📦 **Recent Orders** - Quick order overview
- ⚠️ **Low Stock Alerts** - Inventory warnings

#### Product Management
- ➕ **Create Products** with multiple images
- ✏️ **Edit Products** - Update all fields
- 🗑️ **Soft Delete** - Archive products
- 🏷️ **Category Management** - Organize products
- 📊 **Inventory Control** - Track stock levels

#### Order Management
- 📋 **Order List** with status filters
- 🔍 **Order Details** - View complete information
- 🚚 **Status Updates** - Processing, shipped, delivered
- 💰 **Payment Tracking** - Stripe integration

#### User Management
- 👥 **User List** with role badges
- 🔑 **Role Management** - Assign permissions
- 📊 **Customer Analytics** - Purchase history

### 🎨 Design Features

- 🌙 **Dark/Light Mode** - System preference + toggle
- ✨ **Smooth Animations** - Framer Motion transitions
- 🎭 **Glassmorphism** - Modern glass effects
- 🎨 **Gradient Accents** - Indigo to cyan gradients
- 📱 **Mobile-Optimized** - Touch-friendly interfaces
- ♿ **Accessible** - ARIA labels, keyboard navigation

---

## 🛠️ Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Node.js** | 18+ | Runtime environment |

### Database & ORM
| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 14+ | Primary database |
| **Prisma** | 6.0 | Database ORM |
| **Neon** | - | Serverless PostgreSQL |

### Authentication
| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth.js** | v5 (beta) | Authentication |
| **bcryptjs** | 2.4.3 | Password hashing |

### Payments
| Technology | Version | Purpose |
|------------|---------|---------|
| **Stripe** | 20.3.1 | Payment processing |

### Styling & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **shadcn/ui** | latest | UI components |
| **Framer Motion** | 12.x | Animations |
| **Lucide React** | latest | Icons |

### State Management
| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 5.0.11 | Client state |
| **Zustand Persist** | - | Local storage |

### Forms & Validation
| Technology | Version | Purpose |
|------------|---------|---------|
| **Zod** | 3.x | Schema validation |
| **React Hook Form** | 7.x | Form management |

---

## 📸 Screenshots

### 🏠 Homepage
<p align="center">
  <img src="https://via.placeholder.com/800x500/6366F1/FFFFFF?text=Homepage+Screenshot" alt="Homepage" width="800"/>
</p>
*Hero section with gradient, featured products, and category grid*

### 🛍️ Product Listing
<p align="center">
  <img src="https://via.placeholder.com/800x500/F1F5F9/1E293B?text=Product+Listing" alt="Product Listing" width="800"/>
</p>
*Product grid with filters, sorting, and pagination*

### 📦 Product Detail
<p align="center">
  <img src="https://via.placeholder.com/800x500/FFFFFF/0F172A?text=Product+Detail" alt="Product Detail" width="800"/>
</p>
*Multi-image gallery with zoom, reviews, and related products*

### 🔍 Image Lightbox
<p align="center">
  <img src="https://via.placeholder.com/800x500/000000/FFFFFF?text=Image+Zoom+Lightbox" alt="Image Lightbox" width="800"/>
</p>
*Fullscreen image viewer with zoom controls and thumbnails*

### 🛒 Shopping Cart
<p align="center">
  <img src="https://via.placeholder.com/800x500/F8FAFC/0F172A?text=Shopping+Cart" alt="Shopping Cart" width="800"/>
</p>
*Cart with quantity controls and order summary*

### 💳 Checkout
<p align="center">
  <img src="https://via.placeholder.com/800x500/6366F1/FFFFFF?text=Stripe+Checkout" alt="Checkout" width="800"/>
</p>
*Stripe checkout integration*

### 📊 Admin Dashboard
<p align="center">
  <img src="https://via.placeholder.com/800x500/0F172A/F8FAFC?text=Admin+Dashboard" alt="Admin Dashboard" width="800"/>
</p>
*Admin overview with KPIs and charts*

### 👥 User Management
<p align="center">
  <img src="https://via.placeholder.com/800x500/1E293B/E2E8F0?text=User+Management" alt="User Management" width="800"/>
</p>
*User list with role management*

### 🌙 Dark Mode
<p align="center">
  <img src="https://via.placeholder.com/800x500/0A0A0A/F8FAFC?text=Dark+Mode" alt="Dark Mode" width="800"/>
</p>
*Beautiful dark mode throughout the application*

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or Neon)
- Stripe account
- GitHub OAuth app (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/velora.git
cd velora
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your environment variables (see [Environment Variables](#environment-variables) section).

### 4. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/velora?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters"

# OAuth (Optional)
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Getting API Keys

#### Database (Neon)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

#### GitHub OAuth
1. Go to Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`

#### Stripe
1. Sign up at [stripe.com](https://stripe.com)
2. Get API keys from Developers → API keys
3. For webhooks, install Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

---

## 🗄️ Database Setup

### Schema Overview

The database includes the following models:

```
User
├── Account (OAuth)
├── Session
├── Order
├── Cart
├── Wishlist
├── Address
└── Review

Product
├── Category
├── OrderItem
├── CartItem
├── WishlistItem
└── Review

Order
├── OrderItem
└── User

Category
└── Product
```

### Seeded Data

The seed script creates:

**Users:**
- **Admin**: admin@velora.com / admin123
- **Store Manager**: manager@velora.com / manager123
- **Moderator**: moderator@velora.com / moderator123
- **Customers**: john@example.com, sarah@example.com, etc. / customer123

**Categories (6):**
- Electronics, Clothing, Home & Living, Sports & Outdoors, Books & Media, Beauty & Personal Care

**Products (18):**
- Headphones, Smartwatches, Cameras, Clothing, Home Decor, Sports Equipment, Books, Beauty Products

---

## 👥 User Roles & Permissions

Velora implements a role-based access control (RBAC) system with 4 user roles:

### 🔑 Role Hierarchy

| Role | Level | Description |
|------|-------|-------------|
| **Customer** | 0 | Regular shoppers |
| **Moderator** | 1 | Content managers |
| **Store Manager** | 2 | Inventory & order managers |
| **Admin** | 3 | Full system access |

### 📋 Permission Matrix

| Permission | Customer | Moderator | Store Manager | Admin |
|------------|----------|-----------|---------------|-------|
| View Store | ✅ | ✅ | ✅ | ✅ |
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| Manage Products | ❌ | ❌ | ✅ | ✅ |
| Manage Categories | ❌ | ❌ | ✅ | ✅ |
| Manage Orders | ❌ | ❌ | ✅ | ✅ |
| Manage Reviews | ❌ | ✅ | ✅ | ✅ |
| View Analytics | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| Full Access | ❌ | ❌ | ❌ | ✅ |

### 🎨 Role Badge Colors

- **Admin**: Red badge
- **Store Manager**: Blue badge
- **Moderator**: Purple badge
- **Customer**: Green badge

---

## 📁 Project Structure

```
velora/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── public/                # Static assets
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Auth routes (login, register)
│   │   ├── (shop)/       # Customer-facing routes
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── products/         # Product listing & detail
│   │   │   ├── categories/       # Category pages
│   │   │   ├── cart/             # Shopping cart
│   │   │   ├── checkout/         # Stripe checkout
│   │   │   └── account/          # User account
│   │   ├── admin/        # Admin dashboard
│   │   └── api/          # API routes
│   ├── components/
│   │   ├── layout/       # Header, Footer, Sidebar
│   │   ├── shared/       # Reusable components
│   │   ├── ui/           # shadcn/ui components
│   │   └── providers/    # Context providers
│   ├── lib/              # Utility libraries
│   │   ├── auth.ts       # NextAuth config
│   │   ├── prisma.ts     # Prisma client
│   │   ├── stripe.ts     # Stripe config
│   │   ├── formatters.ts # Price formatting
│   │   ├── permissions.ts# RBAC utilities
│   │   └── validators.ts # Zod schemas
│   ├── actions/          # Server Actions
│   ├── stores/           # Zustand stores
│   └── types/            # TypeScript types
├── .env                  # Environment variables
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🛣️ API Routes

### Authentication
| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | ALL | NextAuth.js endpoints |

### Stripe
| Route | Method | Description |
|-------|--------|-------------|
| `/api/stripe/webhook` | POST | Stripe webhook handler |

### Server Actions (Server-Side)
- `createProduct` - Create new product
- `updateProduct` - Update existing product
- `deleteProduct` - Archive product
- `createOrder` - Create order from checkout
- `updateOrderStatus` - Update order status
- `getProducts` - Fetch products with filters
- `getOrders` - Fetch user orders
- `addToCart` - Add item to cart
- `toggleWishlist` - Add/remove from wishlist

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Code Style

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Build for production
npm run build
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Prisma](https://prisma.io) - Next-generation ORM
- [Stripe](https://stripe.com) - Payment infrastructure
- [Vercel](https://vercel.com) - Deployment platform

---

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/velora/issues) page
2. Create a new issue with detailed information
3. Join our community Discord (coming soon)

---

<p align="center">
  Made with ❤️ by the Velora Team
</p>

<p align="center">
  ⭐ Star us on GitHub — it motivates us a lot!
</p>
