import express from "express";
import path from "path";

const viewsRouter = express.Router();

// 페이지별로 html, css, js 파일들을 라우팅함
// 아래와 같이 하면, http://localhost:5000/ 에서는 views/home/home.html 파일을,
// http://localhost:5000/register 에서는 views/register/register.html 파일을 화면에 띄움
viewsRouter.use("/", serveStatic("home"));
viewsRouter.use("/register", serveStatic("register"));
viewsRouter.use("/login", serveStatic("login"));

viewsRouter.use("/cart", serveStatic("cart"));
viewsRouter.use("/order", serveStatic("payment"));
viewsRouter.use("/complete", serveStatic("orderComplete"));
viewsRouter.use("/orders", serveStatic("userOrders"));
viewsRouter.use("/category", serveStatic("category"));
viewsRouter.use("/addBook", serveStatic("addProduct"));
viewsRouter.use("/book", serveStatic("productDetail"));
viewsRouter.use("/userList", serveStatic("userList"));
viewsRouter.use("/orderList", serveStatic("orderList"));
viewsRouter.use("/bookUpdate", serveStatic("productUpdate"));

//account 유저 / 관리자 페이지
viewsRouter.use(
  "/accounts-admin",
  serveStaticCustom("accounts", "accountsAdmin")
);
viewsRouter.use(
  "/accounts-user",
  serveStaticCustom("accounts", "accountsUser")
);

// accountUpdate 페이지
viewsRouter.use("/accountUpdate", serveStatic("accountUpdate"));
viewsRouter.use("/accountUpdate/checkPassword", serveStatic("checkPassword"));

// orders 페이지
// viewsRouter.use("/orderlist", serveStaticCustom("orders", "orders-admin"));

// views 폴더의 최상단 파일인 rabbit.png, api.js 등을 쓸 수 있게 함
viewsRouter.use("/", serveStatic(""));

// views폴더 내의 ${resource} 폴더 내의 모든 파일을 웹에 띄우며,
// 이 때 ${resource}.html 을 기본 파일로 설정함.
function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  // express.static 은 express 가 기본으로 제공하는 함수임
  return express.static(resourcePath, option);
}

// custom serveStatic
function serveStaticCustom(resource, filename) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${filename}.html` };
  return express.static(resourcePath, option);
}

export { viewsRouter };
