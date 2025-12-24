from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from pymongo import MongoClient
from bson import json_util
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv('../.env')

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGODB_URI = os.getenv('MONGODB_URI')
if not MONGODB_URI:
    raise ValueError('❌ Missing MONGODB_URI in .env file')

client = MongoClient(MONGODB_URI)
db = client['Food']
restaurants_collection = db['restaurants']

print('✅ Connected to MongoDB Atlas')

# Node.js service URL
NODE_SERVICE_URL = os.getenv('NODE_SERVICE_URL', 'http://localhost:3000')

# Mock data for restaurants
restaurants = [
    {"id": 1, "name": "Pizza Palace", "cuisine": "Italian", "rating": 4.5, "delivery_time": "25-35 min", "min_order": 15, "image": "🍕"},
    {"id": 2, "name": "Burger House", "cuisine": "American", "rating": 4.2, "delivery_time": "30-40 min", "min_order": 12, "image": "🍔"},
    {"id": 3, "name": "Sushi World", "cuisine": "Japanese", "rating": 4.8, "delivery_time": "35-45 min", "min_order": 20, "image": "🍣"},
    {"id": 4, "name": "Taco Fiesta", "cuisine": "Mexican", "rating": 4.6, "delivery_time": "20-30 min", "min_order": 10, "image": "🌮"},
    {"id": 5, "name": "Dragon Wok", "cuisine": "Chinese", "rating": 4.4, "delivery_time": "30-40 min", "min_order": 15, "image": "🥡"},
    {"id": 6, "name": "Curry Express", "cuisine": "Indian", "rating": 4.7, "delivery_time": "35-45 min", "min_order": 18, "image": "🍛"},
    {"id": 7, "name": "Mediterranean Delight", "cuisine": "Mediterranean", "rating": 4.5, "delivery_time": "30-40 min", "min_order": 16, "image": "🥙"},
    {"id": 8, "name": "BBQ Nation", "cuisine": "BBQ", "rating": 4.3, "delivery_time": "40-50 min", "min_order": 20, "image": "🍖"},
    {"id": 9, "name": "Pasta Paradise", "cuisine": "Italian", "rating": 4.6, "delivery_time": "25-35 min", "min_order": 14, "image": "🍝"},
    {"id": 10, "name": "Healthy Bowls", "cuisine": "Healthy", "rating": 4.8, "delivery_time": "20-30 min", "min_order": 12, "image": "🥗"},
    {"id": 11, "name": "Dessert Heaven", "cuisine": "Desserts", "rating": 4.9, "delivery_time": "15-25 min", "min_order": 8, "image": "🍰"},
    {"id": 12, "name": "Coffee & Snacks", "cuisine": "Cafe", "rating": 4.4, "delivery_time": "15-20 min", "min_order": 5, "image": "☕"}
]

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "python-backend"}), 200

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    """Get all restaurants"""
    try:
        restaurants = list(restaurants_collection.find({}, {'_id': 0}))
        return jsonify({"restaurants": restaurants}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/restaurants/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    """Get a specific restaurant"""
    try:
        restaurant = restaurants_collection.find_one({"id": restaurant_id}, {'_id': 0})
        if restaurant:
            return jsonify(restaurant), 200
        return jsonify({"error": "Restaurant not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/menu/<int:restaurant_id>', methods=['GET'])
def get_menu(restaurant_id):
    """Get menu from Node.js service"""
    try:
        response = requests.get(f'{NODE_SERVICE_URL}/api/menu/{restaurant_id}')
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Unable to fetch menu"}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create a new order (delegates to Node.js service)"""
    try:
        order_data = request.json
        response = requests.post(f'{NODE_SERVICE_URL}/api/orders', json=order_data)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Unable to create order"}), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    """Get order status from Node.js service"""
    try:
        response = requests.get(f'{NODE_SERVICE_URL}/api/orders/{order_id}')
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Unable to fetch order"}), 500

if __name__ == '__main__':
    PORT = int(os.getenv('PYTHON_SERVICE_PORT', 5000))
    app.run(host='0.0.0.0', port=PORT, debug=True)
