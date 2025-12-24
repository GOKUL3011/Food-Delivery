require('dotenv').config({ path: '../.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.NODE_SERVICE_PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGODB_URI || !JWT_SECRET) {
    console.error('❌ Missing required environment variables. Check .env file.');
    process.exit(1);
}

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI).then(() => {
    console.log('✅ Connected to MongoDB Atlas');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// Menu Schema
const menuSchema = new mongoose.Schema({
    id: Number,
    restaurantId: Number,
    name: String,
    price: Number,
    category: String,
    description: String
});

// Order Schema
const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    restaurantId: Number,
    items: [{
        id: Number,
        name: String,
        price: Number,
        quantity: Number,
        category: String
    }],
    customerInfo: {
        name: String,
        email: String,
        phone: String,
        address: String
    },
    status: { type: String, default: 'pending' },
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Menu = mongoose.model('Menu', menuSchema);
const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', userSchema);

// Mock data for menus
const menus = {
    1: [
        { id: 1, name: "Margherita Pizza", price: 12.99, category: "Pizza", description: "Fresh mozzarella, tomatoes, basil" },
        { id: 2, name: "Pepperoni Pizza", price: 14.99, category: "Pizza", description: "Spicy pepperoni, extra cheese" },
        { id: 3, name: "Quattro Formaggi", price: 15.99, category: "Pizza", description: "Four cheese blend" },
        { id: 4, name: "Vegetarian Supreme", price: 13.99, category: "Pizza", description: "Mixed vegetables, olives" },
        { id: 5, name: "Caesar Salad", price: 8.99, category: "Salad", description: "Romaine lettuce, parmesan, croutons" },
        { id: 6, name: "Garlic Bread", price: 5.99, category: "Sides", description: "Crispy garlic butter bread" }
    ],
    2: [
        { id: 7, name: "Classic Burger", price: 10.99, category: "Burger", description: "Beef patty, lettuce, tomato" },
        { id: 8, name: "Cheese Burger", price: 11.99, category: "Burger", description: "Double cheese, special sauce" },
        { id: 9, name: "Bacon Burger", price: 13.99, category: "Burger", description: "Crispy bacon, BBQ sauce" },
        { id: 10, name: "Veggie Burger", price: 9.99, category: "Burger", description: "Plant-based patty" },
        { id: 11, name: "Fries", price: 4.99, category: "Sides", description: "Crispy golden fries" },
        { id: 12, name: "Onion Rings", price: 5.99, category: "Sides", description: "Crispy battered onion rings" },
        { id: 13, name: "Milkshake", price: 6.99, category: "Drinks", description: "Vanilla, chocolate, or strawberry" }
    ],
    3: [
        { id: 14, name: "California Roll", price: 9.99, category: "Roll", description: "Crab, avocado, cucumber" },
        { id: 15, name: "Spicy Tuna Roll", price: 11.99, category: "Roll", description: "Tuna, spicy mayo" },
        { id: 16, name: "Dragon Roll", price: 14.99, category: "Roll", description: "Eel, avocado, special sauce" },
        { id: 17, name: "Salmon Sashimi", price: 15.99, category: "Sashimi", description: "Fresh salmon slices" },
        { id: 18, name: "Tuna Sashimi", price: 16.99, category: "Sashimi", description: "Premium tuna slices" },
        { id: 19, name: "Miso Soup", price: 3.99, category: "Soup", description: "Traditional Japanese soup" },
        { id: 20, name: "Edamame", price: 4.99, category: "Appetizer", description: "Steamed soybeans" }
    ],
    4: [
        { id: 21, name: "Beef Tacos", price: 9.99, category: "Tacos", description: "3 tacos with seasoned beef" },
        { id: 22, name: "Chicken Tacos", price: 9.49, category: "Tacos", description: "3 tacos with grilled chicken" },
        { id: 23, name: "Fish Tacos", price: 10.99, category: "Tacos", description: "3 tacos with crispy fish" },
        { id: 24, name: "Burrito Bowl", price: 11.99, category: "Bowls", description: "Rice, beans, meat, toppings" },
        { id: 25, name: "Quesadilla", price: 8.99, category: "Appetizer", description: "Cheese, chicken, peppers" },
        { id: 26, name: "Nachos Supreme", price: 10.99, category: "Appetizer", description: "Loaded with cheese, jalapeños" },
        { id: 27, name: "Churros", price: 5.99, category: "Dessert", description: "Cinnamon sugar churros" }
    ],
    5: [
        { id: 28, name: "Kung Pao Chicken", price: 12.99, category: "Main", description: "Spicy chicken with peanuts" },
        { id: 29, name: "Sweet & Sour Pork", price: 11.99, category: "Main", description: "Crispy pork in sweet sauce" },
        { id: 30, name: "Beef with Broccoli", price: 13.99, category: "Main", description: "Tender beef, fresh broccoli" },
        { id: 31, name: "Fried Rice", price: 8.99, category: "Rice", description: "Egg fried rice with vegetables" },
        { id: 32, name: "Chow Mein", price: 9.99, category: "Noodles", description: "Stir-fried noodles" },
        { id: 33, name: "Spring Rolls", price: 5.99, category: "Appetizer", description: "4 crispy vegetable rolls" },
        { id: 34, name: "Wonton Soup", price: 6.99, category: "Soup", description: "Pork wontons in broth" }
    ],
    6: [
        { id: 35, name: "Chicken Tikka Masala", price: 14.99, category: "Main", description: "Creamy tomato curry" },
        { id: 36, name: "Butter Chicken", price: 14.99, category: "Main", description: "Rich butter sauce" },
        { id: 37, name: "Lamb Biryani", price: 16.99, category: "Rice", description: "Aromatic rice with lamb" },
        { id: 38, name: "Palak Paneer", price: 12.99, category: "Vegetarian", description: "Spinach and cottage cheese" },
        { id: 39, name: "Garlic Naan", price: 3.99, category: "Bread", description: "Soft garlic flatbread" },
        { id: 40, name: "Samosas", price: 6.99, category: "Appetizer", description: "3 crispy pastries" },
        { id: 41, name: "Mango Lassi", price: 4.99, category: "Drinks", description: "Sweet yogurt drink" }
    ],
    7: [
        { id: 42, name: "Falafel Wrap", price: 9.99, category: "Wrap", description: "Chickpea fritters, tahini" },
        { id: 43, name: "Shawarma Plate", price: 13.99, category: "Main", description: "Chicken or beef shawarma" },
        { id: 44, name: "Greek Salad", price: 8.99, category: "Salad", description: "Feta, olives, cucumber" },
        { id: 45, name: "Hummus & Pita", price: 7.99, category: "Appetizer", description: "Creamy hummus, warm pita" },
        { id: 46, name: "Lamb Kebab", price: 15.99, category: "Main", description: "Grilled lamb skewers" },
        { id: 47, name: "Baklava", price: 5.99, category: "Dessert", description: "Sweet pastry with nuts" }
    ],
    8: [
        { id: 48, name: "BBQ Ribs", price: 18.99, category: "Main", description: "Full rack, smoky BBQ sauce" },
        { id: 49, name: "Pulled Pork Sandwich", price: 11.99, category: "Sandwich", description: "Slow-cooked pulled pork" },
        { id: 50, name: "Brisket Plate", price: 16.99, category: "Main", description: "Smoked beef brisket" },
        { id: 51, name: "BBQ Wings", price: 10.99, category: "Appetizer", description: "10 pieces, tangy sauce" },
        { id: 52, name: "Coleslaw", price: 3.99, category: "Sides", description: "Creamy cabbage salad" },
        { id: 53, name: "Cornbread", price: 4.99, category: "Sides", description: "Sweet cornbread" }
    ],
    9: [
        { id: 54, name: "Fettuccine Alfredo", price: 13.99, category: "Pasta", description: "Creamy parmesan sauce" },
        { id: 55, name: "Spaghetti Carbonara", price: 14.99, category: "Pasta", description: "Bacon, eggs, parmesan" },
        { id: 56, name: "Penne Arrabiata", price: 12.99, category: "Pasta", description: "Spicy tomato sauce" },
        { id: 57, name: "Lasagna", price: 15.99, category: "Pasta", description: "Layers of pasta, meat, cheese" },
        { id: 58, name: "Ravioli", price: 13.99, category: "Pasta", description: "Cheese-filled pasta" },
        { id: 59, name: "Tiramisu", price: 6.99, category: "Dessert", description: "Classic Italian dessert" }
    ],
    10: [
        { id: 60, name: "Protein Power Bowl", price: 11.99, category: "Bowl", description: "Chicken, quinoa, vegetables" },
        { id: 61, name: "Vegan Buddha Bowl", price: 10.99, category: "Bowl", description: "Plant-based protein bowl" },
        { id: 62, name: "Acai Bowl", price: 9.99, category: "Bowl", description: "Acai, granola, fresh fruits" },
        { id: 63, name: "Greek Yogurt Parfait", price: 7.99, category: "Breakfast", description: "Yogurt, berries, honey" },
        { id: 64, name: "Green Smoothie", price: 6.99, category: "Drinks", description: "Spinach, banana, mango" },
        { id: 65, name: "Protein Shake", price: 7.99, category: "Drinks", description: "Whey protein, fruits" }
    ],
    11: [
        { id: 66, name: "Chocolate Cake", price: 6.99, category: "Cake", description: "Rich chocolate layers" },
        { id: 67, name: "Cheesecake", price: 7.99, category: "Cake", description: "New York style cheesecake" },
        { id: 68, name: "Red Velvet Cupcake", price: 4.99, category: "Cupcake", description: "Cream cheese frosting" },
        { id: 69, name: "Brownie Sundae", price: 8.99, category: "Ice Cream", description: "Warm brownie, ice cream" },
        { id: 70, name: "Macarons", price: 9.99, category: "Pastry", description: "6 assorted flavors" },
        { id: 71, name: "Apple Pie", price: 6.99, category: "Pie", description: "Classic homemade pie" }
    ],
    12: [
        { id: 72, name: "Espresso", price: 3.99, category: "Coffee", description: "Strong Italian coffee" },
        { id: 73, name: "Cappuccino", price: 4.99, category: "Coffee", description: "Espresso with foam" },
        { id: 74, name: "Latte", price: 4.99, category: "Coffee", description: "Smooth espresso milk" },
        { id: 75, name: "Croissant", price: 3.99, category: "Pastry", description: "Buttery French pastry" },
        { id: 76, name: "Bagel & Cream Cheese", price: 5.99, category: "Breakfast", description: "Fresh bagel" },
        { id: 77, name: "Muffin", price: 3.99, category: "Pastry", description: "Blueberry or chocolate chip" }
    ]
};

// Mock orders storage
const orders = {};
let orderCounter = 1;

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'node-backend' });
});

// ==================== AUTH ENDPOINTS ====================

// Register new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Verify token (optional - for checking if user is authenticated)
app.get('/api/auth/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// ==================== MENU & ORDER ENDPOINTS ====================

// Get menu for a specific restaurant
app.get('/api/menu/:restaurantId', async (req, res) => {
    try {
        const restaurantId = parseInt(req.params.restaurantId);
        const menu = await Menu.find({ restaurantId });
        
        if (menu && menu.length > 0) {
            res.json({ restaurantId, menu });
        } else {
            res.status(404).json({ error: 'Menu not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
    try {
        const { restaurantId, items, customerInfo } = req.body;
        
        if (!restaurantId || !items || !customerInfo) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const orderCount = await Order.countDocuments();
        const orderId = `ORD-${orderCount + 1}`;
        
        const order = new Order({
            orderId,
            restaurantId,
            items,
            customerInfo,
            status: 'pending',
            totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        });
        
        await order.save();
        
        res.status(201).json({ 
            message: 'Order created successfully',
            order 
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get order status
app.get('/api/orders/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({ orderId });
        
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update order status
app.put('/api/orders/:orderId/status', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;
        
        const order = await Order.findOneAndUpdate(
            { orderId },
            { status, updatedAt: new Date() },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ 
            message: 'Order status updated',
            order 
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Node.js service running on port ${PORT}`);
});
