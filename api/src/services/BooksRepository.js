const Books = require('../models/book');

class BooksRepository {
    async getAll() {
        const books = await Books.find({}, '-__v');
        return books;
    }

    async getBook(id) {
        const book = await Books.findById(id, '-__v');
        return book;
    }

    async update(id, data) {
        const book = await Books.findById(id, '-__v');
        if (book) {
            book.title = data.title;
            book.description = data.description;
            book.authors = data.authors;
            book.favorite = data.favorite;
            book.fileCover = data.fileCover;
            book.fileName = data.fileName;

            await book.save();

            return book;
            //res.redirect(`/api/books/${id}`);
        } else {
            return null;
        }
    }

    async create(data) {
        const newBook = new Books(data);
        const book = await newBook.save();
        return book;
    }

    async delete(id) {
        const book = await Books.findByIdAndDelete(id);
        return book;
    }
}

module.exports = { BooksRepository };