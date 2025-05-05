
const express = require('express');
const { queryDatabase } = require('./db');
const app = express();
const port = 3000;

// Функция для добавления продуктов в базу данных
const addProducts = async () => {
  const insertQuery = `
    INSERT INTO products (name, price, manufacturer, description, category, specifications)
    VALUES
      ('Samsung Galaxy S21', 799.99, 'Samsung', 'The Samsung Galaxy S21 is the latest flagship smartphone with top-end features.', 'Electronics', '6.2-inch display, Exynos 2100, 8GB RAM, 4000mAh battery'),
      ('Apple iPhone 13', 999.99, 'Apple', 'The iPhone 13 features an A15 Bionic chip, 6.1-inch display, and improved cameras.', 'Electronics', 'A15 Bionic chip, 6.1-inch display, 12MP dual-camera system'),
      ('Apple MacBook Pro 13-inch (M1, 2020)', 1299.99, 'Apple', 'The Apple MacBook Pro 13-inch with M1 chip is designed to run more efficiently and provide fast performance for all tasks.', 'Electronics', 'Apple M1 chip, 8GB RAM, 256GB SSD'),
      ('Sony WH-1000XM4 Wireless Noise Cancelling Headphones', 348.00, 'Sony', 'Sony WH-1000XM4 is known for its industry-leading noise-cancellation, comfort, and sound quality.', 'Electronics', '30 hours battery life, Bluetooth 5.0, Adaptive Sound Control'),
      ('Samsung QLED 65" 4K Smart TV', 1299.99, 'Samsung', 'Samsung QLED TV offers stunning 4K resolution and vibrant color for an immersive viewing experience.', 'Electronics', 'QLED display, 4K resolution, Smart TV functionality'),
      ('Dyson V11 Torque Drive Cordless Vacuum Cleaner', 599.99, 'Dyson', 'The Dyson V11 Torque Drive delivers powerful suction and intelligent cleaning with an LCD screen to monitor performance.', 'Home Appliances', '160AW suction power, 60 minutes run time, 0.2L dustbin'),
      ('LG OLED55CXPUA Alexa Built-In CX 55" 4K Smart OLED TV', 1499.99, 'LG', 'The LG OLED55CXPUA is a 55-inch 4K OLED TV with AI-enhanced picture quality and immersive sound.', 'Home Appliances', 'OLED display, AI Picture Pro, Dolby Vision IQ'),
      ('KitchenAid 5-Quart Stand Mixer', 379.99, 'KitchenAid', 'The KitchenAid Stand Mixer is perfect for baking and food preparation, with multiple attachments available.', 'Home Appliances', '5-quart bowl, 10-speed settings, tilt-head design'),
      ('Breville BES870XL Barista Express Espresso Machine', 699.99, 'Breville', 'The Breville Barista Express makes it easy to brew coffeehouse-quality espresso at home with its built-in grinder.', 'Home Appliances', '15 bar pump, integrated conical burr grinder, 1.8L water tank'),
      ('Google Pixel 6', 599.99, 'Google', 'Google Pixel 6 features Google Tensor chip and a 50MP main camera with impressive computational photography capabilities.', 'Electronics', 'Google Tensor chip, 8GB RAM, 50MP camera, 6.4-inch OLED display'),
      ('Fitbit Charge 5', 179.95, 'Fitbit', 'The Fitbit Charge 5 is a fitness tracker with built-in GPS, heart rate monitor, and a 7-day battery life.', 'Electronics', 'Built-in GPS, 7-day battery, 24/7 heart rate monitoring'),
      ('Oculus Quest 2', 299.99, 'Meta', 'The Oculus Quest 2 offers a virtual reality experience with no PC or wires required, and includes new gaming titles.', 'Electronics', '6GB RAM, 256GB storage, 3664 x 1920 resolution'),
      ('Dell XPS 13', 1199.99, 'Dell', 'The Dell XPS 13 is a high-performance ultrabook with a 13.3-inch display, ideal for work and travel.', 'Electronics', 'Intel i7-1165G7, 16GB RAM, 512GB SSD, 13.3-inch display'),
      ('ASUS ROG Strix RTX 3080', 999.99, 'ASUS', 'The ASUS ROG Strix RTX 3080 graphics card provides exceptional gaming performance and ray-tracing capabilities.', 'Electronics', 'RTX 3080, 10GB GDDR6X, PCIe 4.0 support'),
      ('Dyson Airwrap Complete Styler', 549.99, 'Dyson', 'Dyson Airwrap is a versatile hair styling tool with multiple attachments to curl, smooth, and volumize your hair.', 'Home Appliances', 'Multiple attachments, 1.2-inch barrel, Intelligent heat control'),
      ('Instant Pot Duo 7-in-1 Electric Pressure Cooker', 89.99, 'Instant Pot', 'The Instant Pot Duo 7-in-1 offers pressure cooking, slow cooking, rice cooking, and more, all in one appliance.', 'Home Appliances', '6-quart capacity, 7 cooking functions, stainless steel'),
      ('Philips Sonicare DiamondClean Smart 9750 Electric Toothbrush', 299.99, 'Philips', 'The Philips Sonicare DiamondClean Smart 9750 is an advanced electric toothbrush with personalized features and superior cleaning performance.', 'Home Appliances', '5 modes, smart sensor, 2-week battery life');
  `;
  
  try {
    await queryDatabase(insertQuery);
    console.log('Products added to the database');
  } catch (err) {
    console.error('Error adding products', err.stack);
  }
};

addProducts(); // Вызовем функцию для добавления продуктов

// Статическая папка для стилей и изображений
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
  res.send('<h1>Welcome to our Store</h1><p>Explore our products!</p>');
});

// Страница с продуктами
app.get('/products', async (req, res) => {
  const getProductsQuery = 'SELECT * FROM products';
  try {
    const products = await queryDatabase(getProductsQuery);
    res.json(products); // Возвращаем данные продуктов в формате JSON
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
