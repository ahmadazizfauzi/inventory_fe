# Inventory & Stock Management System - Frontend Web Application

A modern, responsive, and enterprise-grade web application for inventory management, stock valuation, and warehouse mutation tracking. Built with **Next.js (App Router)**, **TypeScript**, and a custom **Bootstrap Design System UI Kit** featuring dynamic **Light & Dark Mode** support.

---

## Tech Stack
- **Framework**: Next.js 16 (React 19, App Router)
- **Language**: TypeScript
- **Styling**: Bootstrap 5.3 + Custom CSS Variables & Design Tokens
- **Icons**: Lucide React
- **HTTP Client**: Axios (with Bearer Token Interceptor & Auto-Logout)
- **Component Architecture**: Reusable Atomic UI Kit (`AppButton`, `AppTable`, `AppCard`, `AppModal`, `AppTypography`, etc.)

---

## Getting Started

### 1. Navigate to Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration (.env.local)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to your active Laravel backend API server:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Run Development Server
```bash
npm run dev
```

The frontend application will be accessible at: `http://localhost:3000`

---

## Key Features & Modules

### 1. Authentication & Role-Based Access Control (RBAC)
- **JWT Authentication**: Secure login and registration with automated token refresh and authorization headers.
- **Route Protection & Guards**: Unauthorized visits to protected backoffice pages are automatically redirected to the login portal.
- **Role Permissions**: Dynamic navigation menu and button visibility tailored to user roles (**Superadmin**, **Admin**, and **Staff**).

### 2. Analytics Dashboard & Valuation Monitoring (`/dashboard`)
- Real-time inventory valuation summary:
  - **Total Asset Value** (based on purchase/capital costs)
  - **Total Market Value** (based on current retail prices)
  - **Potential Gross Profit** margin estimation
- Stock alert widgets: Low stock warning count and out-of-stock monitor.

### 3. Product Catalog & Inventory Tracking (`/products`)
- Search by SKU or product name.
- Filter by category and stock levels (*All, Normal, Low Stock, Out of Stock*).
- Server-side sorting and pagination.
- Full CRUD workflows: Add product, edit pricing & specifications, soft delete.

### 4. Master Data: Categories & Suppliers (`/categories`, `/suppliers`)
- **Categories**: Master organization for products with relationship deletion protection.
- **Suppliers**: Partner vendor directory with contact info and address management.

### 5. Stock Mutations Audit Trail (`/stock-mutations`)
- Real-time logging of stock movement transactions:
  - **Stock IN**: Inbound goods from suppliers with invoice reference notes.
  - **Stock OUT**: Outbound goods for fulfillment or operational usage.
- Automatic inventory recalculation upon transaction submission.

### 6. User Management (`/users`)
- Accessible to **Superadmin** and **Admin**.
- Add, update role permissions, and manage user accounts with self-deletion protection.

### 7. Custom UI Kit & Design System (`/ui-kit`)
- Pre-built reusable components following strict design tokens for consistency.
- Instant theme toggle between **Dark Mode** and **Light Mode** without layout flicker.

---

## Demo Accounts for Testing

All test accounts use the password: `password`

| Role | Email | Access Scope |
| :--- | :--- | :--- |
| **Superadmin** | `superadmin@demo.com` | Full system access, all CRUD modules & user management |
| **Admin** | `admin@demo.com` | Products, categories, suppliers, mutations & staff management |
| **Staff** | `staff@demo.com` | Catalog viewing & recording stock in/out mutations |

---

## Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server on `http://localhost:3000` |
| `npm run build` | Compiles and optimizes production build |
| `npm run start` | Runs the built production server |
| `npm run lint` | Runs ESLint code quality checks |
