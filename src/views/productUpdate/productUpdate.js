import * as Api from "/api.js";
import { nav } from "../nav/nav.js";

addAllElements();

async function addAllElements() {
  insertNav();
}

function insertNav() {
  document.body.insertAdjacentElement("afterbegin", nav);
}

const updateForm = document.querySelector("#updateForm");
const submitBtn = document.querySelector("#submitBtn");
const titleInput = document.querySelector("#titleInput");
const categoryInput = document.querySelector("#categoryInput");
const priceInput = document.querySelector("#priceInput");
const authorInput = document.querySelector("#authorInput");
const publisherInput = document.querySelector("#publisherInput");
const descriptionInput = document.querySelector("#descriptionInput");
const imageInput = document.querySelector("#imageInput");
const currentImageInput = document.querySelector("#currentImageInput");

const makeCategory = function (category, currentCategory) {
  if (category === currentCategory) {
    categoryInput.innerHTML += `<option class="category" selected>${category}</option>`;
  } else {
    categoryInput.innerHTML += `<option class="category">${category}</option>`;
  }
};

let currentImage = "";

const rendering = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const bookID = urlParams.get("id");
  const currentBook = await Api.get("/api/books", bookID);
  console.log(currentBook);
  //현재 값 value에 넣어주기
  titleInput.value = currentBook.title;
  priceInput.value = currentBook.price;
  authorInput.value = currentBook.author;
  publisherInput.value = currentBook.publisher;
  descriptionInput.value = currentBook.description;
  currentImageInput.src = currentBook.image;

  // image loader
  imageInput.addEventListener("change", imageloader);
  function imageloader() {
    const file = imageInput.files[0];
    if (file) {
      currentImageInput.src = URL.createObjectURL(file);
      currentImage = currentBook.image;
      console.log(666666, currentImage);
    }
  }

  const allBookList = await Api.get("/api/book/booklist");

  //category list 뽑아오기
  let temp = [];
  for (let i = 0; i < allBookList.length; i++) {
    if (
      allBookList[i].category !== undefined &&
      allBookList[i].category !== "0"
    ) {
      temp.push(allBookList[i].category);
    }
  }
  let categoryList = [];
  temp.forEach((e) => {
    if (!categoryList.includes(e)) {
      categoryList.push(e);
    }
  });

  let curr = "";
  //category넣어주기
  for (let i = 0; i < categoryList.length; i++) {
    curr = categoryList[i];
    makeCategory(curr, currentBook.category);
  }
};
rendering();

//수정
// const inputs = document.getElementsByTagName("input");
updateForm.addEventListener("submit", updateHandler);

async function updateHandler(e) {
  e.preventDefault();

  if (!titleInput.value) {
    return alert("책 이름을 입력해주세요.");
  }
  if (!priceInput.value) {
    return alert("책 가격을 입력해주세요.");
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
  if (!currentImageInput.src) {
    return alert("이미지URL을 입력해주세요.");
  }

  const formData = new FormData();
  formData.append(imageInput.name, imageInput.files[0]);

  try {
    //이미지 저장
    const imgUrl = await Api.formPost("/api/bookImage", formData);

    // 기존 이미지 삭제
    const currentImgUrl = currentImage.split("/")[4];
    const imgData = { imgUrl: currentImgUrl };
    await Api.delete("/api/bookImage", "", imgData);

    const data = {
      title: titleInput.value,
      category: categoryInput.value,
      publisher: publisherInput.value,
      description: descriptionInput.value,
      author: authorInput.value,
      price: priceInput.value,
      image: imgUrl, // 이미지 url 넣기
    };

    const urlParams = new URLSearchParams(window.location.search);
    const bookID = urlParams.get("id");

    await Api.patch("/api/book", bookID, data);
    alert("정상적으로 정보 수정되었습니다.");

    window.location.href = `/book/?id=${bookID}`;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
