# Food Delivery Application - Microservices Architecture

A minimal food delivery application built using microservices architecture with Python Flask and Node.js Express.

## Architecture Overview

```
┌─────────────┐
│   Client    │
│  (Browser)  │
│  (Frontend) │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│   Python    │
│   Flask     │
│   :5000     │
└──────┬──────┘
       │ REST API
       ▼
┌─────────────┐
│   Node.js   │
│   Express   │
│   :3000     │
└─────────────┘
```

## Services

### 1. **Python Flask Service** (Port 5000)
- Handles frontend API requests
- Manages restaurant data
- Communicates with Node.js service via REST API

### 2. **Node.js Express Service** (Port 3000)
- Manages menu data
- Handles order processing
- Provides order status tracking

### 3. **Frontend** (HTML/CSS/JS)
- Static files served via Python Flask or separate HTTP server

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm

## Quick Start

### 1. Start Node.js Service (Terminal 1)

```bash
cd "d:\Food App\node-service"
npm install
npm start
```

The Node.js service will start on **http://localhost:3000**

### 2. Start Python Flask Service (Terminal 2)

```bash
cd "d:\Food App\python-service"
pip install -r requirements.txt
python app.py
```

The Python service will start on **http://localhost:5000**

### 3. Open Frontend (Terminal 3)

Serve the frontend using Python's built-in HTTP server:

```bash
cd "d:\Food App\frontend"
python -m http.server 8080
```

Or use Node.js:

```bash
cd "d:\Food App\frontend"
npx http-server -p 8080
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## API Endpoints

### Python Flask Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/restaurants | Get all restaurants |
| GET | /api/restaurants/:id | Get specific restaurant |
| GET | /api/menu/:id | Get menu (proxied to Node.js) |
| POST | /api/orders | Create order (proxied to Node.js) |
| GET | /api/orders/:id | Get order status (proxied to Node.js) |

### Node.js Express Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/menu/:restaurantId | Get menu for restaurant |
| POST | /api/orders | Create new order |
| GET | /api/orders/:orderId | Get order details |
| PUT | /api/orders/:orderId/status | Update order status |

## Service Communication Flow

1. **Frontend → Python Backend**: User interacts with frontend at localhost:8080
2. **Python Backend → Node.js Backend**: RESTful API calls for menu and orders
3. **Node.js Backend → Python Backend**: Response with data
4. **Python Backend → Frontend**: Final response to user

## Load Balancing

For production deployment with load balancing, consider using:
- Nginx or HAProxy for load balancing multiple Python instances
- PM2 for Node.js process management
- Gunicorn with multiple workers for Python Flask

## Deployment Instructions

### Development Environment

**Terminal 1 - Node.js Service:**
```bash
cd "d:\Food App\node-service"
npm install
npm start
```

**Terminal 2 - Python Service:**
```bash
cd "d:\Food App\python-service"
pip install -r requirements.txt
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd "d:\Food App\frontend"
python -m http.server 8080
```

### Production Environment

1. **Use production servers**:
   - Python: Use Gunicorn or uWSGI
   - Node.js: Use PM2 for process management
   - Frontend: Deploy to CDN or use Nginx

2. **Python Production Server**:
   ```bash
   cd python-service
   gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
   ```

3. **Node.js Production Server**:
   ```bash
   cd node-service
   npm install pm2 -g
   pm2 start server.js -i max
   ```

4. **Configure Environment Variables**:
   ```bash
   export NODE_SERVICE_URL=http://localhost:3000
   ```

## Testing the Application

### 1. Test Health Endpoints

```bash
# Python service
curl http://localhost:5000/health

# Node.js service
curl http://localhost:3000/health
```

### 2. Test API Endpoints

```bash
# Get restaurants
curl http://localhost:5000/api/restaurants

# Get menu
curl http://localhost:5000/api/menu/1

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "items": [{"id": 1, "name": "Pizza", "price": 12.99, "quantity": 2}],
    "customerInfo": {"name": "John", "email": "john@example.com", "address": "123 St"}
  }'
```

## Scaling Services

To run multiple instances manually:

**Python Service on different ports:**
```bash
# Instance 1
python app.py

# Instance 2 (in new terminal)
export PORT=5001
python app.py
```

Use a load balancer like Nginx or HAProxy to distribute traffic.

## Stopping Services

Press `Ctrl+C` in each terminal window to stop the services.

## Project Structure

```
Food App/
├── python-service/
│   ├── app.py                 # Flask application
│   └── requirements.txt       # Python dependencies
├── node-service/
│   ├── server.js              # Express application
│   └── package.json           # Node.js dependencies
├── frontend/
│   ├── index.html             # Main HTML page
│   ├── styles.css             # Styling
│   └── app.js                 # Frontend JavaScript
└── README.md                  # This file
```

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend 1**: Python 3.11, Flask
- **Backend 2**: Node.js 18, Express
- **Architecture**: Microservices with RESTful APIs

## Troubleshooting

### Port Already in Use
```bash
# Windows - Check what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :3000
netstat -ano | findstr :8080

# Stop the process or use a different port
```

### Services Not Communicating
- Verify NODE_SERVICE_URL environment variable in Python service
- Check that Node.js service is running on port 3000
- Review terminal logs for errors

### Frontend Can't Connect to API
- Ensure Python Flask service is running on port 5000
- Check API_BASE_URL in [frontend/app.js](frontend/app.js)
- Verify CORS is enabled on Flask service

## License

This is a demonstration project for educational purposes.
