const express = require("express");
const router = express.Router();
const uploadBooks = require('../middleware/uploadBooks');

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { container } = require("../container");
const { BooksRepository } = require("../services/BooksRepository");

COUNTER_URL = process.env.COUNTER_URL;

// Получение массива книг
router.get('/', async (req, res) => {
    try {
        const service = container.get(BooksRepository);
        const books = await service.getAll();
        res.json(books);
        // res.render("book/index", {
        //     title: "Книги",
        //     books
        // });
    } catch (error) {
        res.status(500).json('Internal Server Error ' + error.message);
    }
});

// Получение книги по ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const service = container.get(BooksRepository);
        const book = await service.getBook(id);

        if (book) {
            // Отправка POST-запроса для увеличения счетчика
            try {
                await axios.post(`${COUNTER_URL}/counter/${id}/incr`);
            } catch (error) {
                // Обработка ошибки, если не удалось увеличить счетчик
                console.error('Error incrementing counter:', error.message);
            }

            // Получение значения счетчика из Redis
            try {
                const response = await axios.get(`${COUNTER_URL}/counter/${id}`);
                const counterValue = response.data.counterValue;

                // Отображение страницы с информацией о книге и значением счетчика
                // res.render("book/view", {
                //     title: "Книга | просмотр",
                //     book, // Передаем значение счетчика в шаблон
                //     counterValue
                // });
                res.json(book);
            } catch (error) {
                console.error('Error getting counter value:', error.message);
                // Обработка ошибки, если не удалось получить значение счетчика
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(404)
            res.json('404 | Cтраница не найдена')
        }
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});

// Обновление книги по ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const service = container.get(BooksRepository);
        const book = await service.update(id, req.body);

        if (book) {
            res.json(book);
            //res.redirect(`/api/books/${id}`);
        } else {
            res.status(404)
            res.redirect('/404');
        }
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});

// Добавление книги
router.post('/',
    uploadBooks.single('fileBook'),
    async (req, res) => {
        try {
            const service = container.get(BooksRepository);
            let data = req.body;
            if (req.file) {
                data.fileBook = req.file.path;
            }

            const book = await service.create(req.body);

            res.status(201)
            res.json(book);
            //res.redirect('/api/books')
        } catch {
            res.status(500).json('Internal Server Error');
        }
    });

// Удаление книги по ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const service = container.get(BooksRepository);
        const book = await service.delete(id);

        if (book) {
            res.json('ok')
        } else {
            res.status(404).json('404 | страница не найдена')
        }

    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});


// необходимо для ejs в старых заданиях 
router.get('/create', (req, res) => {
    res.render("book/create", {
        title: "Книги | создать книгу",
        book: {},
        action: '/api/books'
    });
});

router.get('/:id/download', (req, res) => {
    const { books } = store
    const { id } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx !== -1) {
        const filePath = path.join(__dirname, '..', books[idx].fileBook);
        if (fs.existsSync(filePath)) {
            res.download(filePath, (err) => {
                if (err) {
                    res.status(500).json('Ошибка при скачивании файла');
                }
            });
        } else {
            res.status(404).json('Файл не найден на сервере');
        }

    } else {
        res.status(404)
        res.redirect('/404');
    }
});

router.get('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        //const book = await Books.findById(id, '-__v');

        if (book) {
            res.render("book/update", {
                title: "Книга | изменить книгу",
                book,
                action: '/api/books',
            });
        } else {
            res.status(404)
            res.redirect('/404');
        }
    } catch (err) {
        res.status(500).json('Internal Server Error');
    }
});


module.exports = router;