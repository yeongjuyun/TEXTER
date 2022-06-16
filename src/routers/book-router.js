import { Router } from "express";
import { bookService } from "../services";
import { categoryService, categories } from "../services";
import { adminRequired } from "../middlewares";
import { upload, s3 } from "../utils/s3";

import is from "@sindresorhus/is";
const axios = require("axios");
const convert = require("xml-js");
const request = require("request");

const bookRouter = Router();

// 전체 책 리스트
bookRouter.get("/book/booklist", async (req, res, next) => {
  try {
    const books = await bookService.getBooks();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
});

bookRouter.get("/books/:id", async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await bookService.getFindById(bookId); // 전체 책 리스트
    res.status(200).json(book); // json 형태로 보내줌
  } catch (err) {
    next(err);
  }
});

bookRouter.get("/books/category/:category", async (req, res, next) => {
  try {
    const bookCategory = req.params.category;
    const book = await bookService.getFindByCategory(bookCategory); // 전체 책 리스트
    res.status(200).json(book); // json 형태로 보내줌
  } catch (err) {
    next(err);
  }
});

bookRouter.get("/books/category/:category", async (req, res, next) => {
  try {
    const category = req.params.category;
    const books = await bookService.getFindByCategory(categories[category]);

    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
});

// 책 추가
bookRouter.post("/book", adminRequired, async (req, res, next) => {
  try {
    const { title, category, author, description, image, price, publisher } =
      req.body;
    const bookInfo = {
      title,
      category,
      author,
      description,
      image,
      price,
      publisher,
    };
    const addedBook = await bookService.addBook(bookInfo);
    res.status(201).json(addedBook); // json 형태로 보내줌
  } catch (err) {
    next(err);
  }
});

// 책 이미지 추가
bookRouter.post(
  "/bookImage",
  adminRequired,
  upload.single("image"),
  async (req, res, next) => {
    res.json(req.file.location);
  }
);

// 책 이미지 삭제
bookRouter.delete("/bookImage", adminRequired, async (req, res, next) => {
  try {
    const { imgUrl } = req.body;
    const bucketName = process.env.AWS_BUCKET_NAME;

    s3.deleteObject(
      {
        Bucket: bucketName,
        Key: `images/${imgUrl}`,
      },
      (err, data) => {
        console.error(err);
        console.log(data);
      }
    );
    res.json("기존 이미지가 삭제되었습니다.");
  } catch (err) {
    next(err);
  }
});

bookRouter.delete("/book/:bookId", adminRequired, async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookService.getFindById(bookId);
    const imgUrl = book.image.split("/")[4];
    const bucketName = process.env.AWS_BUCKET_NAME;

    s3.deleteObject(
      {
        Bucket: bucketName,
        Key: `images/${imgUrl}`,
      },
      (err, data) => {
        console.error(err);
        console.log(data);
      }
    );

    const deletedBook = await bookService.deleteBook(bookId);
    res.status(201).json(deletedBook); // json 형태로 보내줌
  } catch (err) {
    next(err);
  }
});

bookRouter.patch("/book/:bookId", adminRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const bookId = req.params.bookId;

    const { title, category, price, author, publisher, description, image } =
      req.body;

    const toUpdate = {
      ...(title && { title }),
      ...(category && { category }),
      ...(price && { price }),
      ...(author && { author }),
      ...(publisher && { publisher }),
      ...(description && { description }),
      ...(image && { image }),
    };

    const updatedBookInfo = await bookService.setBook(
      req.params.bookId,
      toUpdate
    );

    res.status(200).json(updatedBookInfo);
  } catch (err) {
    next(err);
  }
});

// 카테고리+책으로 네이버 API 검색을 통해 DB에 추가
bookRouter.get(
  "/search/book/:catg/:name",
  adminRequired,
  async function (req, res, next) {
    const client_id = "U_caRiNOoMAVi_8tVk77";
    const client_secret = "mZDaYicyb6";
    const { catg, name } = req.params;
    // 카테고리 키 값 추출
    const catgNumber = Object.keys(categories).filter(
      (key) => categories[key] === catg
    )[0];

    try {
      const xml = await axios({
        url:
          `https://openapi.naver.com/v1/search/book_adv.xml?display=5?d_catg=${catgNumber}&d_titl=` +
          encodeURIComponent(name), // 통신할 웹문서
        method: "get",
        headers: {
          "X-Naver-Client-Id": client_id,
          "X-Naver-Client-Secret": client_secret,
        },
      });
      const xmlToJson = convert.xml2json(xml.data, {
        compact: true,
        spaces: 2,
      });
      const json = JSON.parse(xmlToJson).rss.channel.item;
      const result = [];
      for (let i = 0; i < json.length; i++) {
        let newObj = {};
        for (const js in json[i]) {
          const text = json[i][js]["_text"];
          const parsedText = text
            .replace(/<[^>]*>/gi, "")
            .replace(/(\r\n|\n|\r)/gm, "");
          newObj[js] = parsedText;
        }
        result.push(newObj);
      }

      for (let i = 0; i < result.length; i++) {
        await bookService.addBook({
          title: result[i].title,
          link: result[i].link,
          author: result[i].author,
          price: result[i].price,
          publisher: result[i].publisher,
          pubdate: result[i].pubdate,
          image: result[i].image,
          description: result[i].description,
          isbn: result[i].isbn,
          category: catg,
        });
      }
      const category = await categoryService.findName(catg);
      if (!category) {
        await categoryService.addCategory(catg);
      }

      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
    }
  }
);

export { bookRouter };
