# MERN E-Commerce Application - Black Book (Documentation)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [User Roles](#user-roles)
5. [Database Models](#database-models)
6. [API Routes](#api-routes)
7. [Frontend Components](#frontend-components)
8. [State Management](#state-management)
9. [Features](#features)
10. [Installation & Setup](#installation--setup)
11. [Environment Variables](#environment-variables)
12. [Key Functionality](#key-functionality)

---

## 1. Project Overview

This is a full-featured MERN stack e-commerce application with three distinct user roles:

- **Customer**: Browse products, add to cart, place orders
- **Seller**: Manage own products and orders
- **Admin**: Manage all products, sellers, orders, and platform features

---

## 2. Tech Stack

### Frontend

| Technology       | Purpose          |
| ---------------- | ---------------- |
| React 18         | UI Framework     |
| Vite             | Build Tool       |
| Redux Toolkit    | State Management |
| React Router DOM | Routing          |
| Tailwind CSS     | Styling          |
| Radix UI         | UI Components    |
| Axios            | HTTP Client      |
| Lucide React     | Icons            |

### Backend

| Technology | Purpose          |
| ---------- | ---------------- |
| Express.js | Web Framework    |
| MongoDB    | Database         |
| Mongoose   | ODM              |
| JWT        | Authentication   |
| Bcryptjs   | Password Hashing |
| Cloudinary | Image Storage    |
| PayPal SDK | Payment Gateway  |
| Razorpay   | Payment Gateway  |

---

## 3. Project Structure

```
mern-ecommerce/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin-view/    # Admin dashboard components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── common/        # Shared components
│   │   │   ├── seller-view/   # Seller dashboard components
│   │   │   ├── shopping-view/ # Customer shopping components
│   │   │   └── ui/            # Reusable UI components (Radix)
│   │   ├── config/            # Configuration & form controls
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── pages/             # Page components
│   │   │   ├── admin-view/
│   │   │   ├── auth/
│   │   │   ├── seller-view/
│   │   │   └── shopping-view/
│   │   └── store/             # Redux store & slices
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── controllers/           # Route controllers
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── seller/
│   │   └── shop/
│   ├── helpers/               # Cloudinary, PayPal, Razorpay
│   ├── middleware/            # Error handling
│   ├── models/                # Mongoose models
│   ├── routes/                # Express routes
│   ├── server.js              # Entry point
│   ├── package.json
│   └── products.json          # Sample products
│
└── BLACK_BOOK.md              # This documentation
```

---

## 4. User Roles

### Role: `user` (Customer)

- Browse products
- Search products
- Add to cart
- Manage addresses
- Place orders
- Write reviews
- View order history

### Role: `seller`

- Register as seller (requires approval)
- Add/edit/delete own products
- View orders for own products
- Update order status
- Manage seller profile

### Role: `admin`

- View all products
- Add/edit/delete any product
- Manage all orders
- Approve/reject sellers
- Manage platform features
- View all sellers

---

## 5. Database Models

### User Model

```javascript
{
  userName: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: "user", "seller", "admin")
}
```

### Product Model

```javascript
{
  image: String (Cloudinary URL),
  title: String,
  description: String,
  category: String (men, women, kids, accessories, footwear),
  brand: String (nike, adidas, puma, levi, zara, h&m),
  price: Number,
  salePrice: Number,
  totalStock: Number,
  averageReview: Number,
  sellerId: ObjectId (ref: Seller),
  timestamps: true
}
// Indexed for text search: title, description, category, brand
```

### Order Model

```javascript
{
  userId: String,
  cartId: String,
  cartItems: [{
    productId: String,
    title: String,
    image: String,
    price: String,
    quantity: Number,
    sellerId: String,
    sellerShopName: String
  }],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String
}
```

### Seller Model

```javascript
{
  userId: ObjectId (ref: User, required, unique),
  shopName: String (required),
  ownerName: String (required),
  email: String (required),
  phone: String,
  shopDescription: String,
  businessLicense: String,
  shopAddress: {
    address, city, state, pincode
  },
  status: String (enum: pending, approved, rejected),
  rejectionReason: String,
  timestamps: true
}
```

### Other Models

- **Address**: User addresses
- **Cart**: User shopping cart
- **Review**: Product reviews
- **Feature**: Platform features (banners, highlights)
- **Notification**: Admin notifications

---

## 6. API Routes

### Authentication Routes (`/api/auth`)

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| POST   | `/register`   | Register new user |
| POST   | `/login`      | Login user        |
| POST   | `/logout`     | Logout user       |
| GET    | `/check-auth` | Verify JWT token  |

### Admin Routes

#### Products (`/api/admin/products`)

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | `/`      | Get all products |
| POST   | `/`      | Add new product  |
| PUT    | `/:id`   | Update product   |
| DELETE | `/:id`   | Delete product   |

#### Orders (`/api/admin/orders`)

| Method | Endpoint | Description         |
| ------ | -------- | ------------------- |
| GET    | `/`      | Get all orders      |
| PUT    | `/:id`   | Update order status |

#### Sellers (`/api/admin/sellers`)

| Method | Endpoint | Description           |
| ------ | -------- | --------------------- |
| GET    | `/`      | Get all sellers       |
| PUT    | `/:id`   | Approve/reject seller |

#### Notifications (`/api/admin/notifications`)

| Method | Endpoint | Description         |
| ------ | -------- | ------------------- |
| GET    | `/`      | Get notifications   |
| PUT    | `/:id`   | Mark as read        |
| POST   | `/`      | Create notification |

### Seller Routes (`/api/seller`)

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/products`     | Get seller's products |
| POST   | `/products`     | Add product           |
| PUT    | `/products/:id` | Update product        |
| DELETE | `/products/:id` | Delete product        |
| GET    | `/orders`       | Get seller's orders   |
| PUT    | `/orders/:id`   | Update order status   |
| GET    | `/profile`      | Get seller profile    |
| PUT    | `/profile`      | Update seller profile |

### Shop Routes

#### Products (`/api/shop/products`)

| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| GET    | `/:id`          | Get product details      |
| GET    | `/get-products` | Get products by category |

#### Cart (`/api/shop/cart`)

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | `/`      | Get user cart    |
| POST   | `/`      | Add to cart      |
| PUT    | `/:id`   | Update cart item |
| DELETE | `/:id`   | Remove from cart |

#### Address (`/api/shop/address`)

| Method | Endpoint | Description        |
| ------ | -------- | ------------------ |
| GET    | `/`      | Get user addresses |
| POST   | `/`      | Add address        |
| PUT    | `/:id`   | Update address     |
| DELETE | `/:id`   | Delete address     |

#### Orders (`/api/shop/order`)

| Method | Endpoint | Description       |
| ------ | -------- | ----------------- |
| GET    | `/`      | Get user orders   |
| POST   | `/`      | Create new order  |
| GET    | `/:id`   | Get order details |

#### Search (`/api/shop/search`)

| Method | Endpoint    | Description     |
| ------ | ----------- | --------------- |
| GET    | `/?key=...` | Search products |

#### Reviews (`/api/shop/review`)

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/:productId` | Get product reviews |
| POST   | `/:productId` | Add review          |

### Common Routes (`/api/common/feature`)

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | `/`      | Get all features |
| POST   | `/`      | Add feature      |
| PUT    | `/:id`   | Update feature   |
| DELETE | `/:id`   | Delete feature   |

---

## 7. Frontend Components

### Pages Structure

#### Auth Pages

- `/auth/login` - User login
- `/auth/register` - User registration

#### Admin Pages (`/admin`)

- `/admin/dashboard` - Admin overview
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/sellers` - Seller approval
- `/admin/features` - Banner/feature management

#### Seller Pages (`/seller`)

- `/seller/dashboard` - Seller overview
- `/seller/products` - Product management
- `/seller/orders` - Order management
- `/seller/profile` - Profile management
- `/auth/register-seller` - Seller registration

#### Shopping Pages (`/shop`)

- `/shop/home` - Home page with featured products
- `/shop/listing` - Product listing with filters
- `/shop/search` - Product search
- `/shop/checkout` - Checkout process
- `/shop/account` - User account & orders
- `/shop/payment-success` - Successful payment
- `/shop/paypal-return` - PayPal return
- `/shop/paypal-cancel` - PayPal cancelled

---

## 8. State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: {...},
    isAuthenticated: boolean,
    isLoading: boolean
  },

  // Admin State
  adminProducts: {...},
  adminOrder: {...},

  // Shop State (Customer)
  shopProducts: {...},
  shopCart: {...},
  shopAddress: {...},
  shopOrder: {...},
  shopSearch: {...},
  shopReview: {...},

  // Common
  commonFeature: {...},

  // Seller
  seller: {...}
}
```

---

## 9. Features

### Authentication

- JWT-based authentication
- Cookie-based session management
- Role-based access control
- Protected routes

### Product Management

- Categories: Men, Women, Kids, Accessories, Footwear
- Brands: Nike, Adidas, Puma, Levi's, Zara, H&M
- Product images via Cloudinary
- Sale pricing
- Stock management

### Shopping Features

- Shopping cart (add, update, remove items)
- Address management
- Product search with filters
- Sort by price/title
- Product reviews & ratings

### Order Management

- Multiple payment methods (PayPal, Razorpay)
- Order status tracking
- Order history
- Seller-specific order views

### Seller Features

- Seller registration with approval workflow
- Product management
- Order fulfillment
- Profile management

### Admin Features

- Full platform control
- Seller approval system
- Feature/banner management
- Order oversight

---

## 10. Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

```bash
cd mern-ecommerce/server
npm install
# Create .env file (see below)
npm run dev    # Development
npm start     # Production
```

### Frontend Setup

```bash
cd mern-ecommerce/client
npm install
npm run dev    # Development
npm run build  # Production
```

### Default URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 11. Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
PORT=5000

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 12. Key Functionality

### Authentication Flow

1. User registers → Password hashed with bcryptjs
2. User logs in → JWT token generated
3. Token stored in HTTP-only cookie
4. Protected routes verify token via middleware

### Shopping Flow

1. Browse products → Filter/sort → Add to cart
2. Manage cart → Update quantities/remove items
3. Add/select delivery address
4. Choose payment method → Redirect to payment
5. On success → Order created → Cart cleared

### Seller Flow

1. Register as seller → Status: "pending"
2. Admin approves → Status: "approved"
3. Seller can add products (linked to sellerId)
4. Orders containing seller's products visible to seller
5. Seller updates order status

### Admin Flow

1. Login with admin role
2. Manage all products, orders, sellers
3. Approve/reject seller applications
4. Manage platform features/banners

---

## Quick Reference

### Categories

- Men, Women, Kids, Accessories, Footwear

### Brands

- Nike, Adidas, Puma, Levi's, Zara, H&M

### Order Status

- Pending, Confirmed, Shipped, Delivered, Cancelled

### Payment Status

- Pending, Paid, Failed, Refunded

### Seller Status

- Pending (awaiting approval)
- Approved
- Rejected

---

_Document Version: 1.0_
_Last Updated: 2024_
