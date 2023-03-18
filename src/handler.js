/**
 Name: Nadya Mumtazah
 finished: 18-03-2023 19:55
**/

const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf");

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const model = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount == readPage ? true : false,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  bookshelf.push(model);

  const isSuccess = bookshelf.filter((item) => item.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooks = (request, h) => {
  if (Object.keys(request.query).length > 0) {
    const { name, reading, finished } = request.query;
    if (name) {
      const filteredName = bookshelf.filter(
        (item) => item.name.toLowerCase() == name.toLowerCase()
      );
      const response = h.response({
        status: "success",
        data: {
          books: filteredName.map(({ id, name, publisher }) => ({
            id,
            name,
            publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
    if (reading) {
      if (reading == 0) {
        const filteredBasedOnReading = bookshelf.filter(
          (item) => item.reading == false
        );
        const response = h.response({
          status: "success",
          data: {
            books: filteredBasedOnReading.map(({ id, name, publisher }) => ({
              id,
              name,
              publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
      if (reading == 1) {
        const filteredBasedOnReading = bookshelf.filter(
          (item) => item.reading == true
        );
        const response = h.response({
          status: "success",
          data: {
            books: filteredBasedOnReading.map(({ id, name, publisher }) => ({
              id,
              name,
              publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }
    if (finished) {
      if (finished == 0) {
        const filteredBasedOnFinished = bookshelf.filter(
          (item) => item.finished == false
        );
        const response = h.response({
          status: "success",
          data: {
            books: filteredBasedOnFinished.map(({ id, name, publisher }) => ({
              id,
              name,
              publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }
    if (finished == 1) {
      const filteredBasedOnReading = bookshelf.filter(
        (item) => item.finished == true
      );
      const response = h.response({
        status: "success",
        data: {
          books: filteredBasedOnReading.map(({ id, name, publisher }) => ({
            id,
            name,
            publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }
  const response = h.response({
    status: "success",
    data: {
      books: bookshelf.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getDetailBook = (request, h) => {
  const { bookId } = request.params;

  const find = bookshelf.find((item) => item.id === bookId);
  if (!find) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: "success",
    data: {
      book: find,
    },
  });
  response.code(200);
  return response;
};

const updateBook = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const findBook = bookshelf.findIndex((item) => item.id === bookId);
  const updatedAt = new Date().toISOString();

  if (findBook !== -1) {
    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }

    bookshelf[findBook] = {
      ...bookshelf[findBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;

  const find = bookshelf.findIndex((item) => item.id === bookId);

  if (find !== -1) {
    bookshelf.splice(find, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  getAllBooks,
  addBook,
  getDetailBook,
  updateBook,
  deleteBook,
};
