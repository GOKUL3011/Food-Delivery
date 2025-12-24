# Food Delivery App - Complete Setup Guide

A professional React-based food delivery application with microservices architecture using Python Flask, Node.js Express, and MongoDB Atlas.

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │  (Port 3001)
│   Professional  │
│   Modern UI     │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Python Flask   │  (Port 5000)
│  Restaurant API │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│  Node.js Express│  (Port 3000)
│  Menu & Orders  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MongoDB Atlas  │
│  Database       │
└─────────────────┘
```

## 🚀 Quick Start

### Step 1: Configure MongoDB Atlas IP Whitelist

**IMPORTANT**: Before running the application, you must whitelist your IP address in MongoDB Atlas:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Either:
   - Click "Add Current IP Address" (recommended for development)
   - Or add "0.0.0.0/0" to allow all IPs (NOT recommended for production)
6. Click "Confirm"

### Step 2: Seed the Database

```bash
cd "d:\Food App"
node seed-database.js
```

This will populate MongoDB with:
- 12 restaurants across different cuisines
- 77 menu items with descriptions and prices

### Step 3: Start Backend Services

**Terminal 1 - Node.js Service:**
```bash
cd "d:\Food App\node-service"
npm start
```
Service runs on **http://localhost:3000**

**Terminal 2 - Python Service:**
```bash
cd "d:\Food App\python-service"
python app.py
```
Service runs on **http://localhost:5000**

### Step 4: Start React Frontend

**Terminal 3 - React App:**
```bash
cd "d:\Food App\frontend-react"
npm start
```

If port 3000 is in use, it will prompt to use port 3001.
Frontend runs on **http://localhost:3001**

## 📱 Features

### Customer Features
- ✅ Browse restaurants by cuisine
- ✅ Search restaurants and menus
- ✅ Filter by cuisine type
- ✅ View detailed menus with descriptions
- ✅ Add items to cart
- ✅ Real-time cart updates
- ✅ Place orders with delivery info
- ✅ Order confirmation and tracking
- ✅ Professional UI similar to Swiggy/UberEats

### Technical Features
- ✅ React with React Router for SPA navigation
- ✅ MongoDB Atlas for data persistence
- ✅ RESTful API communication
- ✅ Microservices architecture
- ✅ Responsive design
- ✅ Modern UI with animations
- ✅ Local storage for cart persistence

## 🗄️ Database Schema

### Restaurants Collection
```javascript
{
  id: Number,
  name: String,
  cuisine: String,
  rating: Number,
  delivery_time: String,
  min_order: Number,
  image: String (emoji)
}
```

### Menus Collection
```javascript
{
  id: Number,
  restaurantId: Number,
  name: String,
  price: Number,
  category: String,
  description: String
}
```

### Orders Collection
```javascript
{
  orderId: String,
  restaurantId: Number,
  items: Array,
  customerInfo: Object,
  status: String,
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 API Endpoints

### Python Flask Service (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/restaurants | Get all restaurants |
| GET | /api/restaurants/:id | Get specific restaurant |
| GET | /api/menu/:id | Get menu (proxied to Node.js) |
| POST | /api/orders | Create order (proxied to Node.js) |
| GET | /api/orders/:id | Get order (proxied to Node.js) |

### Node.js Express Service (Port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/menu/:restaurantId | Get restaurant menu |
| POST | /api/orders | Create new order |
| GET | /api/orders/:orderId | Get order details |
| PUT | /api/orders/:orderId/status | Update order status |

## 📁 Project Structure

```
Food App/
├── frontend-react/          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── RestaurantList.js
│   │   │   ├── RestaurantList.css
│   │   │   ├── RestaurantMenu.js
│   │   │   ├── RestaurantMenu.css
│   │   │   ├── Cart.js
│   │   │   ├── Cart.css
│   │   │   ├── OrderConfirmation.js
│   │   │   └── OrderConfirmation.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── python-service/          # Flask backend
│   ├── app.py
│   └── requirements.txt
├── node-service/            # Express backend
│   ├── server.js
│   └── package.json
├── seed-database.js         # Database seeding script
└── README.md
```

## 🎨 UI Components

### 1. Restaurant List
- Hero section with gradient background
- Search bar with real-time filtering
- Cuisine filter chips
- Restaurant cards with:
  - Restaurant icon/emoji
  - Rating badge
  - Delivery time
  - Minimum order amount
  - Hover effects and animations

### 2. Restaurant Menu
- Restaurant header with details
- Category tabs for filtering
- Menu item cards with:
  - Item name and description
  - Category badge
  - Price display
  - Add to cart button
  - Toast notifications

### 3. Shopping Cart
- Item list with quantity controls
- Price calculations
- Delivery information form
- Order summary
- Checkout button

### 4. Order Confirmation
- Success animation with checkmark
- Order details display
- Item breakdown
- Order tracking visualization
- Status indicators

## 🔧 Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios for HTTP requests
- CSS3 with CSS Variables
- LocalStorage for cart persistence

### Backend
- **Python**: Flask 3.0.0, Flask-CORS, Requests, PyMongo
- **Node.js**: Express 4.18, Mongoose, Body-Parser, CORS

### Database
- MongoDB Atlas (Cloud)
- 3 Collections: restaurants, menus, orders

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: "Could not connect to any servers in your MongoDB Atlas cluster"
**Solution**: Whitelist your IP address in MongoDB Atlas Network Access settings.

### Port Already in Use

**Error**: "Something is already running on port 3000"
**Solution**: 
- For React: Choose to run on another port (3001) when prompted
- For Node.js: Kill the process using the port or change PORT in server.js

### Cannot Find Module

**Error**: "Cannot find module 'mongoose'"
**Solution**: 
```bash
cd "d:\Food App"
npm install mongoose
```

### Python Import Errors

**Error**: "No module named 'pymongo'"
**Solution**:
```bash
cd "d:\Food App\python-service"
pip install -r requirements.txt
```

## 📊 Data Overview

### Restaurants (12 total)
1. Pizza Palace (Italian)
2. Burger House (American)
3. Sushi World (Japanese)
4. Taco Fiesta (Mexican)
5. Dragon Wok (Chinese)
6. Curry Express (Indian)
7. Mediterranean Delight (Mediterranean)
8. BBQ Nation (BBQ)
9. Pasta Paradise (Italian)
10. Healthy Bowls (Healthy)
11. Dessert Heaven (Desserts)
12. Coffee & Snacks (Cafe)

### Menu Items (77 total)
- Each restaurant has 6-7 unique items
- Items include appetizers, mains, sides, drinks, and desserts
- Prices range from $3.99 to $18.99
- All items have detailed descriptions

## 🔐 Security Notes

For production deployment:
1. Use environment variables for MongoDB URI
2. Implement proper authentication
3. Add rate limiting
4. Use HTTPS
5. Implement input validation
6. Add CSRF protection
7. Whitelist only necessary IP addresses

## 📝 License

This is an educational project for demonstration purposes.

## 👨‍💻 Support

For issues or questions, check the troubleshooting section above.
