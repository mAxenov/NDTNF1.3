const express = require('express');
const redis = require('redis');

const app = express();

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || "localhost";

// Подключение к Redis
const redisClient = redis.createClient({
    url: `${REDIS_URL}:6379`
});

(async () => {
    await redisClient.connect();
})();

// Обработчик для увеличения счетчика
app.post('/counter/:id/incr', async (req, res) => {
    const { id } = req.params;
    // Увеличение счетчика в Redis
    try {
        const counterValue = await redisClient.incr(`counter:${id}`);
        return res.json({ id, counterValue });
    } catch {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Обработчик для получения значения счетчика
app.get('/counter/:id', async (req, res) => {
    const { id } = req.params;
    // Получение значения счетчика из Redis
    try {
        const counterValue = await redisClient.get(`counter:${id}`);
        if (counterValue === null) {
            return res.status(404).json({ error: 'Counter not found' });
        }
        return res.json({ id, counterValue });
    }
    catch {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Запуск сервера
app.listen(PORT, () =>
    console.log(`Server listens ${PORT} port `));