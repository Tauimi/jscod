
const { Pool } = require('pg');

// Получаем строку подключения из переменной окружения
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Строка подключения из переменной окружения
  ssl: {
    rejectUnauthorized: false
  }
});

// Функция для выполнения запроса к базе данных
const queryDatabase = async (query, params) => {
  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

module.exports = { queryDatabase };
