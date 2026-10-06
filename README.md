# Full-Stack E-Commerce Platform

A full-stack e-commerce web application built using React.js, Node.js, Express.js, and SQLite.

The application provides a complete shopping workflow including user authentication, product browsing, search and filtering, cart management, wishlist, checkout, payments, orders, product reviews, and admin management.

## Live Demo

Frontend: https://ecommerce-platform-36j1.onrender.com/

Backend API: https://ecommerce-platform-api-f1gq.onrender.com/

## Features

### User Features

- User registration and login
- JWT authentication
- Protected routes
- Product browsing
- Product search
- Category filtering
- Brand filtering
- Price filtering
- Rating and discount filtering
- Product details
- Shopping cart
- Wishlist
- Checkout
- Order history
- Order cancellation
- Product reviews and ratings
- Account management

### Payment Features

- Credit/Debit Card
- UPI
- Net Banking
- Cash on Delivery
- Mock transaction processing

> Payments are implemented as a demonstration and do not process real transactions.

### Admin Features

- Admin dashboard
- Product management
- Create products
- Update products
- Delete products
- Category management
- Order management
- Update order status
- Inventory management

## Tech Stack

### Frontend

- React.js
- React Router
- Bootstrap
- JavaScript
- HTML5
- CSS3
- Fetch API

### Backend

- Node.js
- Express.js
- REST APIs
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- SQLite
- SQL

### Tools

- VS Code
- Git
- GitHub
- npm
- Nodemon

### Deployment

- Render

## Project Architecture

```text
                    E-Commerce Platform
                           |
             ┌─────────────┴─────────────┐
             |                           |
        React Frontend              Express Backend
             |                           |
        React Router                REST APIs
             |                           |
        Fetch API                 Authentication
             |                           |
             └─────────────┬─────────────┘
                           |
                       SQLite DB