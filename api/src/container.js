require("reflect-metadata");
const { decorate, injectable, Container } = require("inversify");
const { BooksRepository } = require("./services/BooksRepository");
const container = new Container();

decorate(injectable(), BooksRepository);
container.bind(BooksRepository).toSelf();

module.exports = { container };