const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { queryDatabase } = require('./models/db');
const app = express();
const port = 3000;

// Middleware для парсинга тела запроса
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Сессии
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, password, email, adminPassword } = req.body;

    // Проверяем, является ли введенный пароль паролем для админа
    const role = adminPassword === '123' ? 'admin' : 'user'; // Если пароль "123", роль admin, иначе user

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
        const result = await queryDatabase(query, [username, hashedPassword, email, role]);
        req.session.user = result[0]; // Сохраняем пользователя в сессии
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Вход пользователя
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = $1';
    try {
        const result = await queryDatabase(query, [username]);
        if (result.length > 0 && await bcrypt.compare(password, result[0].password)) {
            req.session.user = result[0]; // Сохраняем пользователя в сессии
            if (result[0].role === 'admin') {
                return res.redirect('/admin'); // Перенаправление в админ-панель
            }
            res.redirect('/');
        } else {
            res.status(400).send('Invalid username or password');
        }
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

// Главная страница
app.get('/', async (req, res) => {
    const category = req.query.category || '';
    const getCategoriesQuery = 'SELECT DISTINCT category FROM products';
    const getProductsQuery = category
        ? `SELECT * FROM products WHERE category = $1`
        : 'SELECT * FROM products';

    try {
        const categories = await queryDatabase(getCategoriesQuery);
        const products = await queryDatabase(getProductsQuery, category ? [category] : []);
        res.render('index', { title: 'Our Products', products: products, categories: categories, selectedCategory: category });
    } catch (err) {
        res.status(500).send('Error fetching products');
    }
});

// Корзина
app.get('/cart', (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    res.render('cart', { cart: req.session.cart });
});

// Добавление товара в корзину
app.post('/cart/add', (req, res) => {
    const { productId, quantity } = req.body;
    const product = { productId, quantity };
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push(product);
    res.redirect('/cart');
});

// Оформление заказа
app.post('/checkout', async (req, res) => {
    const userId = req.session.user ? req.session.user.id : null;
    const cart = req.session.cart || [];
    const total = cart.reduce((acc, item) => acc + (item.quantity * getProductPrice(item.productId)), 0);

    const query = 'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *';
    try {
        const result = await queryDatabase(query, [userId, total]);
        res.redirect('/order/' + result[0].id);
    } catch (err) {
        res.status(500).send('Error placing order');
    }
});

// Получение цены товара
const getProductPrice = (productId) => {
    return 100; // Примерная стоимость
};

// Админ-панель для управления заказами
app.get('/admin', async (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        const getOrdersQuery = 'SELECT * FROM orders';
        try {
            const orders = await queryDatabase(getOrdersQuery);
            res.render('admin', { title: 'Admin Panel', orders: orders });
        } catch (err) {
            res.status(500).send('Error fetching orders');
        }
    } else {
        res.status(403).send('Access denied');
    }
});

// Обновление статуса заказа
app.post('/admin/update-order/:id', async (req, res) => {
    const orderId = req.params.id;
    const newStatus = 'Completed';  // Например, меняем статус на "Completed"
    const updateStatusQuery = 'UPDATE orders SET status = $1 WHERE id = $2';
    
    try {
        await queryDatabase(updateStatusQuery, [newStatus, orderId]);
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send('Error updating order status');
    }
});

// Удаление заказа
app.post('/admin/delete-order/:id', async (req, res) => {
    const orderId = req.params.id;
    const deleteOrderQuery = 'DELETE FROM orders WHERE id = $1';

    try {
        await queryDatabase(deleteOrderQuery, [orderId]);
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send('Error deleting order');
    }
});

// Личный кабинет пользователя
app.get('/account', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;
    const getUserOrdersQuery = 'SELECT * FROM orders WHERE user_id = $1';
    try {
        const orders = await queryDatabase(getUserOrdersQuery, [userId]);
        res.render('account', { title: 'Your Account', orders: orders });
    } catch (err) {
        res.status(500).send('Error fetching user orders');
    }
});

// Логика выхода пользователя
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
