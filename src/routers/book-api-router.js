import { Router } from "express";
import convert from "xml-js";
import { bookModel } from "../db";

const axios = require("axios");

const bookApiRouter = Router();

bookApiRouter.get("/search/book", async function (req, res, next) {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  try {
    const xml = await axios({
      url:
        "https://openapi.naver.com/v1/search/book_adv.xml?display=3?d_catg=100&d_titl=" +
        encodeURI("소설"), // 통신할 웹문서
      method: "get",
      headers: {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret,
      },
    });
    const xmlToJson = convert.xml2json(xml.data, { compact: true, spaces: 2 });
    const json = JSON.parse(xmlToJson).rss.channel.item;
    const result = [];
    for (let i = 0; i < json.length; i++) {
      let newObj = {};
      for (const js in json[i]) {
        const text = json[i][js]["_text"];
        const parsedText = text.replace(/<[^>]*>/gi, "");
        newObj[js] = parsedText;
      }
      result.push(newObj);
    }

    for (let i = 0; i < result.length; i++) {
      bookModel.create({
        bookName: result[i].title,
        author: result[i].author,
        publisher: result[i].publisher,
        description: result[i].description,
        price: result[i].price,
        category: 0,
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

export { bookApiRouter };
