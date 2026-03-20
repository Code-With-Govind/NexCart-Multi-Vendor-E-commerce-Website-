# NexCart - Multi-Vendor E-Commerce Website

An open-source, full-stack E-Commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform provides a comprehensive solution for online shopping, featuring user authentication, product management, a shopping cart, secure payments, and an administrative dashboard.

## 🌟 Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens).
- **Product Catalog:** Browse products by categories, brands, and view detailed product information.
- **Shopping Cart:** Add, update, and remove items from the cart seamlessly.
- **Checkout Process:** Manage shipping addresses and process orders securely.
- **Payment Integration:** Integrated payment gateways like Razorpay/PayPal.
- **Order Tracking:** Users can view their order history and track order statuses.
- **Admin Dashboard:** Administrators can oversee users, manage products, and update order statuses.
- **Responsive Design:** Optimized for both desktop and mobile viewing with Tailwind CSS.

## 💻 Technologies Used

### Frontend
- React.js (v18)
- Vite
- Tailwind CSS & Radix UI
- Redux Toolkit (State Management)
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JSON Web Token (JWT)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Code-With-Govind/NexCart-Multi-Vendor-E-commerce-Website-.git
   cd NexCart-Multi-Vendor-E-commerce-Website-
   ```

2. **Setup the Backend (Server):**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `server` directory and add your environment variables (MongoDB URI, JWT Secret, Payment API Keys).*

3. **Setup the Frontend (Client):**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Client:**
   ```bash
   cd client
   npm run dev
   ```

The client will typically run on `http://localhost:5173` and the server on `http://localhost:5000`.

## 📂 Project Structure

```text
├── client/           # React frontend application
│   ├── public/       # Public assets
│   ├── src/          # Source files (components, pages, store, etc.)
│   └── package.json  # Frontend dependencies
├── server/           # Node.js Express backend
│   ├── controllers/  # Route controllers
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── package.json  # Backend dependencies
└── README.md         # Project documentation
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
