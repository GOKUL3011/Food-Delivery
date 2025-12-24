require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI in .env file');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI).then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    seedDatabase();
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Schemas
const restaurantSchema = new mongoose.Schema({
    id: Number,
    name: String,
    cuisine: String,
    rating: Number,
    delivery_time: String,
    min_order: Number,
    image: String
});

const menuSchema = new mongoose.Schema({
    id: Number,
    restaurantId: Number,
    name: String,
    price: Number,
    category: String,
    description: String
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const Menu = mongoose.model('Menu', menuSchema);
const User = mongoose.model('User', userSchema);

// Restaurant Data
const restaurants = [
    {id: 1, name: "Pizza Palace", cuisine: "Italian", rating: 4.5, delivery_time: "25-35 min", min_order: 15, image: "🍕"},
    {id: 2, name: "Burger House", cuisine: "American", rating: 4.2, delivery_time: "30-40 min", min_order: 12, image: "🍔"},
    {id: 3, name: "Sushi World", cuisine: "Japanese", rating: 4.8, delivery_time: "35-45 min", min_order: 20, image: "🍣"},
    {id: 4, name: "Taco Fiesta", cuisine: "Mexican", rating: 4.6, delivery_time: "20-30 min", min_order: 10, image: "🌮"},
    {id: 5, name: "Dragon Wok", cuisine: "Chinese", rating: 4.4, delivery_time: "30-40 min", min_order: 15, image: "🥡"},
    {id: 6, name: "Curry Express", cuisine: "Indian", rating: 4.7, delivery_time: "35-45 min", min_order: 18, image: "🍛"},
    {id: 7, name: "Mediterranean Delight", cuisine: "Mediterranean", rating: 4.5, delivery_time: "30-40 min", min_order: 16, image: "🥙"},
    {id: 8, name: "BBQ Nation", cuisine: "BBQ", rating: 4.3, delivery_time: "40-50 min", min_order: 20, image: "🍖"},
    {id: 9, name: "Pasta Paradise", cuisine: "Italian", rating: 4.6, delivery_time: "25-35 min", min_order: 14, image: "🍝"},
    {id: 10, name: "Healthy Bowls", cuisine: "Healthy", rating: 4.8, delivery_time: "20-30 min", min_order: 12, image: "🥗"},
    {id: 11, name: "Dessert Heaven", cuisine: "Desserts", rating: 4.9, delivery_time: "15-25 min", min_order: 8, image: "🍰"},
    {id: 12, name: "Coffee & Snacks", cuisine: "Cafe", rating: 4.4, delivery_time: "15-20 min", min_order: 5, image: "☕"}
];

// Menu Data
const menus = [
    // Pizza Palace (Restaurant 1)
    { id: 1, restaurantId: 1, name: "Margherita Pizza", price: 12.99, category: "Pizza", description: "Fresh mozzarella, tomatoes, basil" },
    { id: 2, restaurantId: 1, name: "Pepperoni Pizza", price: 14.99, category: "Pizza", description: "Spicy pepperoni, extra cheese" },
    { id: 3, restaurantId: 1, name: "Quattro Formaggi", price: 15.99, category: "Pizza", description: "Four cheese blend" },
    { id: 4, restaurantId: 1, name: "Vegetarian Supreme", price: 13.99, category: "Pizza", description: "Mixed vegetables, olives" },
    { id: 5, restaurantId: 1, name: "Caesar Salad", price: 8.99, category: "Salad", description: "Romaine lettuce, parmesan, croutons" },
    { id: 6, restaurantId: 1, name: "Garlic Bread", price: 5.99, category: "Sides", description: "Crispy garlic butter bread" },

    // Burger House (Restaurant 2)
    { id: 7, restaurantId: 2, name: "Classic Burger", price: 10.99, category: "Burger", description: "Beef patty, lettuce, tomato" },
    { id: 8, restaurantId: 2, name: "Cheese Burger", price: 11.99, category: "Burger", description: "Double cheese, special sauce" },
    { id: 9, restaurantId: 2, name: "Bacon Burger", price: 13.99, category: "Burger", description: "Crispy bacon, BBQ sauce" },
    { id: 10, restaurantId: 2, name: "Veggie Burger", price: 9.99, category: "Burger", description: "Plant-based patty" },
    { id: 11, restaurantId: 2, name: "Fries", price: 4.99, category: "Sides", description: "Crispy golden fries" },
    { id: 12, restaurantId: 2, name: "Onion Rings", price: 5.99, category: "Sides", description: "Crispy battered onion rings" },
    { id: 13, restaurantId: 2, name: "Milkshake", price: 6.99, category: "Drinks", description: "Vanilla, chocolate, or strawberry" },

    // Sushi World (Restaurant 3)
    { id: 14, restaurantId: 3, name: "California Roll", price: 9.99, category: "Roll", description: "Crab, avocado, cucumber" },
    { id: 15, restaurantId: 3, name: "Spicy Tuna Roll", price: 11.99, category: "Roll", description: "Tuna, spicy mayo" },
    { id: 16, restaurantId: 3, name: "Dragon Roll", price: 14.99, category: "Roll", description: "Eel, avocado, special sauce" },
    { id: 17, restaurantId: 3, name: "Salmon Sashimi", price: 15.99, category: "Sashimi", description: "Fresh salmon slices" },
    { id: 18, restaurantId: 3, name: "Tuna Sashimi", price: 16.99, category: "Sashimi", description: "Premium tuna slices" },
    { id: 19, restaurantId: 3, name: "Miso Soup", price: 3.99, category: "Soup", description: "Traditional Japanese soup" },
    { id: 20, restaurantId: 3, name: "Edamame", price: 4.99, category: "Appetizer", description: "Steamed soybeans" },

    // Taco Fiesta (Restaurant 4)
    { id: 21, restaurantId: 4, name: "Beef Tacos", price: 9.99, category: "Tacos", description: "3 tacos with seasoned beef" },
    { id: 22, restaurantId: 4, name: "Chicken Tacos", price: 9.49, category: "Tacos", description: "3 tacos with grilled chicken" },
    { id: 23, restaurantId: 4, name: "Fish Tacos", price: 10.99, category: "Tacos", description: "3 tacos with crispy fish" },
    { id: 24, restaurantId: 4, name: "Burrito Bowl", price: 11.99, category: "Bowls", description: "Rice, beans, meat, toppings" },
    { id: 25, restaurantId: 4, name: "Quesadilla", price: 8.99, category: "Appetizer", description: "Cheese, chicken, peppers" },
    { id: 26, restaurantId: 4, name: "Nachos Supreme", price: 10.99, category: "Appetizer", description: "Loaded with cheese, jalapeños" },
    { id: 27, restaurantId: 4, name: "Churros", price: 5.99, category: "Dessert", description: "Cinnamon sugar churros" },

    // Dragon Wok (Restaurant 5)
    { id: 28, restaurantId: 5, name: "Kung Pao Chicken", price: 12.99, category: "Main", description: "Spicy chicken with peanuts" },
    { id: 29, restaurantId: 5, name: "Sweet & Sour Pork", price: 11.99, category: "Main", description: "Crispy pork in sweet sauce" },
    { id: 30, restaurantId: 5, name: "Beef with Broccoli", price: 13.99, category: "Main", description: "Tender beef, fresh broccoli" },
    { id: 31, restaurantId: 5, name: "Fried Rice", price: 8.99, category: "Rice", description: "Egg fried rice with vegetables" },
    { id: 32, restaurantId: 5, name: "Chow Mein", price: 9.99, category: "Noodles", description: "Stir-fried noodles" },
    { id: 33, restaurantId: 5, name: "Spring Rolls", price: 5.99, category: "Appetizer", description: "4 crispy vegetable rolls" },
    { id: 34, restaurantId: 5, name: "Wonton Soup", price: 6.99, category: "Soup", description: "Pork wontons in broth" },

    // Curry Express (Restaurant 6)
    { id: 35, restaurantId: 6, name: "Chicken Tikka Masala", price: 14.99, category: "Main", description: "Creamy tomato curry" },
    { id: 36, restaurantId: 6, name: "Butter Chicken", price: 14.99, category: "Main", description: "Rich butter sauce" },
    { id: 37, restaurantId: 6, name: "Lamb Biryani", price: 16.99, category: "Rice", description: "Aromatic rice with lamb" },
    { id: 38, restaurantId: 6, name: "Palak Paneer", price: 12.99, category: "Vegetarian", description: "Spinach and cottage cheese" },
    { id: 39, restaurantId: 6, name: "Garlic Naan", price: 3.99, category: "Bread", description: "Soft garlic flatbread" },
    { id: 40, restaurantId: 6, name: "Samosas", price: 6.99, category: "Appetizer", description: "3 crispy pastries" },
    { id: 41, restaurantId: 6, name: "Mango Lassi", price: 4.99, category: "Drinks", description: "Sweet yogurt drink" },

    // Mediterranean Delight (Restaurant 7)
    { id: 42, restaurantId: 7, name: "Falafel Wrap", price: 9.99, category: "Wrap", description: "Chickpea fritters, tahini" },
    { id: 43, restaurantId: 7, name: "Shawarma Plate", price: 13.99, category: "Main", description: "Chicken or beef shawarma" },
    { id: 44, restaurantId: 7, name: "Greek Salad", price: 8.99, category: "Salad", description: "Feta, olives, cucumber" },
    { id: 45, restaurantId: 7, name: "Hummus & Pita", price: 7.99, category: "Appetizer", description: "Creamy hummus, warm pita" },
    { id: 46, restaurantId: 7, name: "Lamb Kebab", price: 15.99, category: "Main", description: "Grilled lamb skewers" },
    { id: 47, restaurantId: 7, name: "Baklava", price: 5.99, category: "Dessert", description: "Sweet pastry with nuts" },

    // BBQ Nation (Restaurant 8)
    { id: 48, restaurantId: 8, name: "BBQ Ribs", price: 18.99, category: "Main", description: "Full rack, smoky BBQ sauce" },
    { id: 49, restaurantId: 8, name: "Pulled Pork Sandwich", price: 11.99, category: "Sandwich", description: "Slow-cooked pulled pork" },
    { id: 50, restaurantId: 8, name: "Brisket Plate", price: 16.99, category: "Main", description: "Smoked beef brisket" },
    { id: 51, restaurantId: 8, name: "BBQ Wings", price: 10.99, category: "Appetizer", description: "10 pieces, tangy sauce" },
    { id: 52, restaurantId: 8, name: "Coleslaw", price: 3.99, category: "Sides", description: "Creamy cabbage salad" },
    { id: 53, restaurantId: 8, name: "Cornbread", price: 4.99, category: "Sides", description: "Sweet cornbread" },

    // Pasta Paradise (Restaurant 9)
    { id: 54, restaurantId: 9, name: "Fettuccine Alfredo", price: 13.99, category: "Pasta", description: "Creamy parmesan sauce" },
    { id: 55, restaurantId: 9, name: "Spaghetti Carbonara", price: 14.99, category: "Pasta", description: "Bacon, eggs, parmesan" },
    { id: 56, restaurantId: 9, name: "Penne Arrabiata", price: 12.99, category: "Pasta", description: "Spicy tomato sauce" },
    { id: 57, restaurantId: 9, name: "Lasagna", price: 15.99, category: "Pasta", description: "Layers of pasta, meat, cheese" },
    { id: 58, restaurantId: 9, name: "Ravioli", price: 13.99, category: "Pasta", description: "Cheese-filled pasta" },
    { id: 59, restaurantId: 9, name: "Tiramisu", price: 6.99, category: "Dessert", description: "Classic Italian dessert" },

    // Healthy Bowls (Restaurant 10)
    { id: 60, restaurantId: 10, name: "Protein Power Bowl", price: 11.99, category: "Bowl", description: "Chicken, quinoa, vegetables" },
    { id: 61, restaurantId: 10, name: "Vegan Buddha Bowl", price: 10.99, category: "Bowl", description: "Plant-based protein bowl" },
    { id: 62, restaurantId: 10, name: "Acai Bowl", price: 9.99, category: "Bowl", description: "Acai, granola, fresh fruits" },
    { id: 63, restaurantId: 10, name: "Greek Yogurt Parfait", price: 7.99, category: "Breakfast", description: "Yogurt, berries, honey" },
    { id: 64, restaurantId: 10, name: "Green Smoothie", price: 6.99, category: "Drinks", description: "Spinach, banana, mango" },
    { id: 65, restaurantId: 10, name: "Protein Shake", price: 7.99, category: "Drinks", description: "Whey protein, fruits" },

    // Dessert Heaven (Restaurant 11)
    { id: 66, restaurantId: 11, name: "Chocolate Cake", price: 6.99, category: "Cake", description: "Rich chocolate layers" },
    { id: 67, restaurantId: 11, name: "Cheesecake", price: 7.99, category: "Cake", description: "New York style cheesecake" },
    { id: 68, restaurantId: 11, name: "Red Velvet Cupcake", price: 4.99, category: "Cupcake", description: "Cream cheese frosting" },
    { id: 69, restaurantId: 11, name: "Brownie Sundae", price: 8.99, category: "Ice Cream", description: "Warm brownie, ice cream" },
    { id: 70, restaurantId: 11, name: "Macarons", price: 9.99, category: "Pastry", description: "6 assorted flavors" },
    { id: 71, restaurantId: 11, name: "Apple Pie", price: 6.99, category: "Pie", description: "Classic homemade pie" },

    // Coffee & Snacks (Restaurant 12)
    { id: 72, restaurantId: 12, name: "Espresso", price: 3.99, category: "Coffee", description: "Strong Italian coffee" },
    { id: 73, restaurantId: 12, name: "Cappuccino", price: 4.99, category: "Coffee", description: "Espresso with foam" },
    { id: 74, restaurantId: 12, name: "Latte", price: 4.99, category: "Coffee", description: "Smooth espresso milk" },
    { id: 75, restaurantId: 12, name: "Croissant", price: 3.99, category: "Pastry", description: "Buttery French pastry" },
    { id: 76, restaurantId: 12, name: "Bagel & Cream Cheese", price: 5.99, category: "Breakfast", description: "Fresh bagel" },
    { id: 77, restaurantId: 12, name: "Muffin", price: 3.99, category: "Pastry", description: "Blueberry or chocolate chip" }
];

async function seedDatabase() {
    try {
        // Clear existing data
        await Restaurant.deleteMany({});
        await Menu.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert restaurants
        await Restaurant.insertMany(restaurants);
        console.log(`✅ Inserted ${restaurants.length} restaurants`);

        // Insert menu items
        await Menu.insertMany(menus);
        console.log(`✅ Inserted ${menus.length} menu items`);

        // Insert test users
        const testUsers = [
            {
                username: 'testuser',
                email: 'test@example.com',
                password: await bcrypt.hash('password123', 10)
            },
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: await bcrypt.hash('john1234', 10)
            },
            {
                username: 'foodlover',
                email: 'foodlover@example.com',
                password: await bcrypt.hash('foodie2024', 10)
            }
        ];

        await User.insertMany(testUsers);
        console.log(`✅ Inserted ${testUsers.length} test users`);

        console.log('🎉 Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}
