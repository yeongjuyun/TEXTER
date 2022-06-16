import * as Api from "/api.js";
import { nav } from "../nav/nav.js";

addAllElements();

async function addAllElements() {
  insertNav();
}

function insertNav() {
  document.body.insertAdjacentElement("afterbegin", nav);
}

const addForm = document.getElementById("addForm");
const submitBtn = document.querySelector("#submitBtn");
const select = document.querySelector("#category");

const nameInput = document.querySelector("#nameInput");
const categorySelect = document.querySelector("#category");
const priceInput = document.querySelector("#priceInput");
const authorInput = document.querySelector("#authorInput");
const descriptionInput = document.querySelector("#descriptionInput");
const imgInput = document.querySelector("#imgInput");
const publisherInput = document.querySelector("#publisherInput");

// 카테고리 불러오기
const getCategoryList = async () => {
  const data = await Api.get("/api/category/categorylist");
  const result = await data
    .map((a) => `<option class="category">${a.name}</option>`)
    .join("");
  select.innerHTML = result;
};
getCategoryList();

addForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  if (!nameInput.value) {
    return alert("책 이름을 입력해주세요.");
  }
  if (!priceInput.value) {
    return alert("책 가격을 입력해주세요.");
  }
  if (priceInput.value < 1) {
    return alert("책 가격을 다시 확인해주세요");
  }
  if (!authorInput.value) {
    return alert("저자를 입력해주세요.");
  }
  if (!publisherInput.value) {
    return alert("출판사를 입력해주세요.");
  }
  if (!descriptionInput.value) {
    return alert("상품 설명을 입력해주세요.");
  }
  if (!imgInput.files[0]) {
    return alert("이미지URL을 입력해주세요.");
  }

  const formData = new FormData();
  formData.append(imgInput.name, imgInput.files[0]);

  try {
    const imgUrl = await Api.formPost("/api/bookImage", formData); //이미지 저장

    let object = {
      title: nameInput.value,
      category: categorySelect.value,
      publisher: publisherInput.value,
      description: descriptionInput.value,
      author: authorInput.value,
      price: priceInput.value,
      image: imgUrl, // 이미지 url 넣기
    };
    const results = await Api.post("/api/book", object); //정보들 디비에 저장
    console.log(results);
    alert("상품이 추가되었습니다.");
    // 추가한 책의 상세페이지로 이동
    const detail = await Api.get("/api/book/booklist");
    const currBook = detail[detail.length - 1];
    window.location.href = `/book/?id=${currBook._id}`;
  } catch (err) {
    alert("책 정보를 모두 입력해주세요");
    console.error(err);
    window.location.href = "/addBook";
  }
});

async function test() {
  const result = await Api.get("/api/book/booklist");
  console.log(result);
}
test();
