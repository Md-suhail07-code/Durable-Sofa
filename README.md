# 🛋️ Durable Sofa — Full-Stack E-Commerce Platform

A modern, production-style furniture e-commerce web application built with the **MERN stack**. Durable Sofa lets customers browse premium furniture (sofas, headboards, pillows, mattresses), manage carts, checkout with **Razorpay**, and track orders — while admins manage inventory, users, and sales from a dedicated dashboard.

> Built to demonstrate end-to-end full-stack engineering: REST API design, JWT authentication, OAuth 2.0, payment gateway integration, cloud media storage, and a responsive React SPA with global state management.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Application Workflow](#-application-workflow)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Screens & Routes](#-screens--routes)
- [Architecture Highlights](#-architecture-highlights)

---

## ✨ Features

### Customer Experience
| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browse, search, filter by category & price, and sort products |
| **Product Details** | Image gallery with zoom, technical specs, and add-to-cart |
| **Shopping Cart** | Persistent cart with quantity updates and item removal |
| **Multi-Address Checkout** | Add, edit, delete, and select delivery addresses |
| **Razorpay Payments** | Secure order creation, payment verification, and order confirmation |
| **Order History** | View past orders and payment status |
| **User Profile** | Update profile, upload profile picture (Cloudinary) |

### Authentication & Security
| Feature | Description |
|---------|-------------|
| **Email/Password Auth** | Registration with email verification (Handlebars + Nodemailer) |
| **Google OAuth 2.0** | One-click sign-in via Passport.js |
| **Forgot Password** | OTP-based password reset flow |
| **JWT Protection** | Bearer token middleware on protected routes |
| **Role-Based Access** | Separate user and admin roles with route guards |

### Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Product Management** | CRUD operations with multi-image upload to Cloudinary |
| **User Management** | View all users, delete accounts |
| **Order Management** | View all orders and per-user order history |
| **Sales Dashboard** | Admin analytics overview (extensible) |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Redux Toolkit + Redux Persist** | Global state (user, cart, products, addresses) |
| **Tailwind CSS v4** | Utility-first styling |
| **Radix UI + shadcn/ui** | Accessible, composable UI components |
| **Framer Motion** | Page & component animations |
| **Axios** | HTTP client for API calls |
| **Sonner** | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT + bcryptjs** | Authentication & password hashing |
| **Passport.js (Google OAuth)** | Social login |
| **Razorpay** | Payment gateway |
| **Cloudinary** | Image storage & CDN |
| **Multer** | File upload handling |
| **Nodemailer + Handlebars** | Transactional emails & OTP |

---

## 🔄 Application Workflow

### High-Level System Flow

```mermaid
flowchart LR
    subgraph Client["React Frontend (Port 5173)"]
        UI[Pages & Components]
        Redux[Redux Store]
        UI <--> Redux
    end

    subgraph Server["Express Backend (Port 5000)"]
        Routes[REST Routes]
        Middleware[JWT / Admin Middleware]
        Controllers[Controllers]
        Routes --> Middleware --> Controllers
    end

    subgraph External["External Services"]
        MongoDB[(MongoDB)]
        Cloudinary[Cloudinary CDN]
        Razorpay[Razorpay]
        Google[Google OAuth]
        SMTP[Nodemailer SMTP]
    end

    UI -->|Axios + JWT| Routes
    Controllers --> MongoDB
    Controllers --> Cloudinary
    Controllers --> Razorpay
    Controllers --> Google
    Controllers --> SMTP
```

## Customer Journey

```mermaid
flowchart TD
    A[Visit Homepage] --> B{Authenticated?}
    B -->|No| C[Sign Up / Login]
    C --> C1[Email Verification]
    C --> C2[Google OAuth]
    C1 --> D[Browse Products]
    C2 --> D
    B -->|Yes| D

    D --> E[Search / Filter / Sort]
    E --> F[View Product Details]
    F --> G[Add to Cart]
    G --> H[Review Cart]
    H --> I[Select / Add Delivery Address]
    I --> J[Place Order via Razorpay]
    J --> K{Payment Verified?}
    K -->|Yes| L[Order Success + Cart Cleared]
    K -->|No| M[Payment Failed]
    L --> N[View Order History]
```
### 📋 E-Commerce Application Architecture

Below are the visual flowcharts for both the User and Admin workflows. Copy and paste this entire block into your `README.md` file.

#### 👤 1. User Journey Flowchart

```mermaid
flowchart TD
    %% Styling Definitions
    classDef startEnd fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff;
    classDef process fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff;
    classDef decision fill:#f1c40f,stroke:#f39c12,stroke-width:2px,color:#333;
    classDef failure fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff;

    %% Subgraphs for grouping modules
    subgraph Landing_and_Auth [Landing & Authentication]
        A[Visit Homepage] --> B{Authenticated?}
        B -->|No| C[Sign Up / Login]
        C --> C1[Email Verification]
        C --> C2[Google OAuth]
        C1 --> D
        C2 --> D
    end

    subgraph Shopping_Experience [Shopping Experience]
        B -->|Yes| D[Browse Product Catalog]
        D --> E[Search / Filter / Sort]
        E --> F[View Product Details]
        F --> G[Add to Cart]
        G --> H[Review Cart]
    end

    subgraph Checkout_and_Payment [Checkout & Payment]
        H --> I[Select / Add Delivery Address]
        I --> J[Place Order via Razorpay]
        J --> K{Payment Verified?}
        K -->|No| M[Payment Failed]
    end

    subgraph Post_Purchase [Post-Purchase]
        K -->|Yes| L[Order Success + Cart Cleared]
        L --> N[View Order History]
    end

    %% Applying styles
    class A,N startEnd;
    class C,C1,C2,D,E,F,G,H,I,J,L process;
    class B,K decision;
    class M failure;
```

#### 👑 2. Admin Panel & Middleware Flowchart

```mermaid
flowchart TD
    %% Styling Definitions
    classDef security fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff;
    classDef panel fill:#34495e,stroke:#2c3e50,stroke-width:2px,color:#fff;
    classDef action fill:#e67e22,stroke:#d35400,stroke-width:2px,color:#fff;

    %% Authentication Guard
    A[Admin Initiates Login] --> B[Access /dashboard]
    B --> Guard{ProtectedRoute}
    
    subgraph Frontend_Backend_Security [Security Layer]
        Guard -->|Frontend| F_Guard[adminOnly=true]
        Guard -->|Backend| B_Guard[isAdmin Middleware]
    end

    F_Guard & B_Guard -->|Authorized| C{Admin Panel Panel}

    subgraph Core_Dashboard [Dashboard Sections]
        C --> D[Sales Overview]
        C --> E[Add Product]
        C --> F[Manage Products]
        C --> G[Manage Users]
        C --> H[Manage Orders]
    end

    subgraph Admin_Actions [Data Management]
        E --> E1[Upload Images to Cloudinary]
        F --> F1[Edit / Delete Products]
        G --> G1[View / Delete Users]
        H --> H1[View All Orders]
        H --> H2[View User-Specific Orders]
    end
```

### 1. Authentication & Identity Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant E as Email / Google

    alt Email Registration
        U->>F: Submit signup form
        F->>B: POST /api/users/register
        B->>DB: Create user (isVerified: false)
        B->>E: Send verification email
        U->>F: Click verify link
        F->>B: POST /api/users/verify
        B->>DB: Set isVerified: true
    end

    alt Login
        U->>F: Submit credentials
        F->>B: POST /api/users/login
        B->>DB: Validate user
        B-->>F: accessToken + refreshToken
        F->>F: Store token + Redux Persist
    end

    alt Google OAuth
        U->>F: Click "Sign in with Google"
        F->>B: GET /auth/google
        B->>E: OAuth redirect
        E-->>B: Callback with profile
        B->>DB: Find or create user
        B-->>F: Redirect with JWT token
    end
```

### 2. Checkout & Payment Flow (Razorpay Integration)
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant R as Razorpay
    participant DB as MongoDB

    U->>F: Confirm checkout
    F->>B: POST /api/orders/create
    B->>R: Create Razorpay order
    B->>DB: Save order (status: pending)
    B-->>F: razorpayOrderId + amount
    F->>R: Open Razorpay checkout modal
    U->>R: Complete payment
    R-->>F: paymentId + signature
    F->>B: POST /api/orders/verify
    B->>B: HMAC SHA256 signature check
    B->>DB: Update order (status: paid)
    B->>DB: Clear user cart
    B-->>F: Success response
    F->>F: Navigate to /order-success
```

---

## 📁 Directory Architecture

```text
Durable-Sofa/
├── Frontend/                    # React SPA (Vite)
│   ├── index.html               # App entry HTML
│   ├── vite.config.js           # Vite configuration
│   ├── components.json          # shadcn/ui config
│   ├── eslint.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx             # React root + Redux Provider
│       ├── App.jsx              # React Router configuration
│       ├── index.css            # Global styles (Tailwind)
│       ├── config.js            # Centralized API_URL config
│       ├── pages/               # Route-level page components
│       │   ├── Home.jsx         # Landing page
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── AuthSuccess.jsx  # OAuth callback handler
│       │   ├── EmailVerify.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── VerifyOtp.jsx
│       │   ├── ChangePassword.jsx
│       │   ├── Products.jsx     # Product catalog
│       │   ├── ProductDetails.jsx 
│       │   ├── Cart.jsx
│       │   ├── AddressForm.jsx  # Checkout & address management
│       │   ├── OrderSuccess.jsx
│       │   ├── Orders.jsx       # Order history
│       │   ├── Profile.jsx
│       │   ├── Dashboard.jsx    # Admin layout shell
│       │   ├── NotFound.jsx
│       │   └── admin/           # Admin-only pages
│       │       ├── AddProduct.jsx
│       │       ├── AdminProducts.jsx
│       │       ├── AdminUsers.jsx
│       │       ├── AdminOrders.jsx
│       │       ├── AdminSales.jsx
│       │       └── ShowUserOrders.jsx
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Hero.jsx
│       │   ├── CategoryMarquee.jsx
│       │   ├── WhyChooseUs.jsx
│       │   ├── ProductCard.jsx
│       │   ├── ProductSearch.jsx
│       │   ├── ProductFilter.jsx
│       │   ├── FiltersSideBar.jsx
│       │   ├── CartCard.jsx
│       │   ├── TechnicalSpecs.jsx
│       │   ├── AdminSidebar.jsx
│       │   ├── AdminProductDetails.jsx
│       │   ├── ProtectedRoute.jsx # Auth & role guard
│       │   └── ui/              # shadcn/ui primitives
│       │       ├── button.jsx | input.jsx | card.jsx | dialog.jsx
│       │       └── select.jsx | badge.jsx | accordion.jsx | sonner.jsx
│       ├── redux/               # Global state management
│       │   ├── store.js         # Redux store + persist config
│       │   ├── userSlice.js     # Auth & user profile state
│       │   ├── cartSlice.js     # Shopping cart state
│       │   ├── productSlice.js  # Product catalog cache
│       │   └── addressSlice.js  # Delivery addresses state
│       └── lib/
│           └── utils.js         # Tailwind class merge utility (cn)
│
└── Backend/                     # Express REST API
    ├── server.js                # Express app entry point
    ├── package.json
    ├── config/
    │   ├── passport.js          # Google OAuth strategy
    │   └── razorpay.js          # Razorpay instance config
    ├── Database/
    │   └── db.js                # MongoDB connection (Mongoose)
    ├── Models/                  # Mongoose schemas
    │   ├── userModel.js         # User (roles, auth, profile)
    │   ├── productModel.js      # Products (categories, images, specs)
    │   ├── cartModel.js         # User shopping carts
    │   ├── addressModel.js      # Delivery addresses
    │   ├── orderModel.js        # Orders + Razorpay metadata
    │   └── sessionModel.js
    ├── Controllers/             # Business logic layer
    │   ├── userController.js    # Auth, profile, OTP, admin user ops
    │   ├── productController.js # Product CRUD + Cloudinary upload
    │   ├── cartController.js    # Cart add/update/remove
    │   ├── addressController.js # Address CRUD
    │   └── orderController.js   # Order creation + payment verify
    ├── Routes/                  # API route definitions
    │   ├── authRoute.js         # Google OAuth + /auth/me
    │   ├── userRoute.js         # /api/users/*
    │   ├── productRoute.js      # /api/products/*
    │   ├── cartRoute.js         # /api/cart/*
    │   ├── addressRoute.js      # /api/address/*
    │   └── orderRoute.js        # /api/orders/*
    ├── middleware/
    │   ├── isAuthenticated.js   # JWT verification + isAdmin guard
    │   └── multer.js            # Single & multi-file upload config
    ├── utils/
    │   ├── cloudinary.js        # Cloudinary SDK setup
    │   └── dataUri.js           # File buffer → Data URI converter
    └── emailVerify/
        ├── verifyMail.js        # Email verification templates
        ├── sendOtp.js           # OTP email sender
        └── template.hbs         # Handlebars email template
```

---

## 🔌 API Endpoint Specification

| Method | Endpoint | Auth Level | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| `GET` | `/auth/google` | Public | Initiate Google OAuth session |
| `GET` | `/auth/google/callback` | Public | Google OAuth callback + JWT redirection |
| `GET` | `/auth/me` | Valid JWT | Fetch current authenticated context |
| **Users** | | | |
| `POST` | `/api/users/register` | Public | Register new user account |
| `POST` | `/api/users/verify` | Public | Verify activation token from email |
| `POST` | `/api/users/login` | Public | Verify credentials and return active tokens |
| `POST` | `/api/users/logout` | Valid JWT | Annul active session tokens |
| `POST` | `/api/users/forgotpassword`| Public | Dispatch password reset OTP to email |
| `POST` | `/api/users/verifyotp/:email`| Public | Authenticate password token validation |
| `POST` | `/api/users/changepassword/:email`| Public | Write new password to backend record |
| `GET` | `/api/users/allusers` | Admin Only | Return list of every system user profile |
| `PUT` | `/api/users/updateprofile/:userId`| Valid JWT | Update basic user profile metadata + avatar |
| **Products** | | | |
| `GET` | `/api/products/get-products`| Public | View whole catalog listing |
| `GET` | `/api/products/getProduct/:_id`| Public | Fetch explicit item specs by ID |
| `POST` | `/api/products/add` | Admin Only | Construct new listing with images |
| `PUT` | `/api/products/update-products/:productId`| Admin Only | Modify existing product details |
| `DELETE`| `/api/products/delete-products/:productId`| Admin Only | Remove designated item from system index |
| **Cart** | | | |
| `GET` | `/api/cart/get-cart` | Valid JWT | Access personalized item cart list |
| `POST` | `/api/cart/add-to-cart` | Valid JWT | Commit chosen product reference to cart |
| `PUT` | `/api/cart/update-quantity`| Valid JWT | Change numerical allocation count |
| `DELETE`| `/api/cart/remove-item` | Valid JWT | Excise targeted line item from active session |
| **Address** | | | |
| `POST` | `/api/address/add` | Valid JWT | Register new home or shipping profile |
| `GET` | `/api/address/getAllAddresses`| Valid JWT | Aggregate shipping options for current profile |
| `PUT` | `/api/address/update/:id` | Valid JWT | Edit specific location details |
| `DELETE`| `/api/address/delete/:id` | Valid JWT | Purge entry from profile address book |
| **Orders** | | | |
| `POST` | `/api/orders/create` | Valid JWT | Formulate backend order metadata + call Razorpay |
| `POST` | `/api/orders/verify` | Valid JWT | Verify SHA256 receipt key signature details |
| `GET` | `/api/orders/my-orders` | Valid JWT | Fetch user-specific historical receipts |
| `GET` | `/api/orders/all-orders` | Admin Only | Extract macro overview of all transactions |
| `GET` | `/api/orders/user-orders/:userId`| Admin Only | Drill down into purchases by unique ID |
