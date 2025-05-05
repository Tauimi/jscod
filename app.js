
const express = require('express');
const { queryDatabase } = require('./db');
const app = express();
const port = 3000;

// Статическая папка для стилей и изображений
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
  res.send('<h1>Welcome to our Store</h1><p>Explore our products!</p>');
});

// Страница с продуктами из базы данных
app.get('/products', async (req, res) => {
  try {
    const products = await queryDatabase('SELECT name, price FROM products');
    res.render('products', { title: 'Products', products: products });
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
