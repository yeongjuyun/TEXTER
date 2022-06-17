# 쇼핑몰 웹 서비스 프로젝트

상품들을 조회하고, 장바구니에 추가하고, 또 주문을 할 수 있는 쇼핑몰 웹 서비스 제작 프로젝트입니다.<br />

## 1. 서비스 링크

### http://kdt-sw2-seoul-team11.elicecoding.com/

<br />

## 2. 서비스 소개

1. 회원가입, 로그인, 회원정보 수정 등 **유저 정보 관련 CRUD**
2. **제품 목록**을 조회 및, **제품 상세 정보**를 조회 가능함.
3. 장바구니에 제품을 추가할 수 있으며, **장바구니에서 CRUD** 작업이 가능함.
4. 장바구니는 서버 DB가 아닌, 프론트 단에서 저장 및 관리됨 (localStorage, indexedDB 등)
5. 장바구니에서 주문을 진행하며, **주문 완료 후 조회 및 삭제**가 가능함.

<br />

### 2-1. API 문서

### https://documenter.getpostman.com/view/20764920/UzBjtUHm

<br />

## 3. 기술 스택

![image](https://i.ibb.co/N34mXzy/image.png)

### 주요 사용 기술

#### 1. 프론트엔드

- **Vanilla javascript**, html, css (**Bulma css**)
- Font-awesome
- Daum 도로명 주소 api
- 이외

#### 2. 백엔드

- **Express** (nodemon, babel-node로 실행됩니다.)
- Mongodb, Mongoose
- s3 이미지 업로더 (배포예정)
- cors
- 이외

<br />

## 4. 인프라 구조

![image](https://i.ibb.co/9tGxmx0/image.png)<br />

<br />

## 5. 제작자

| 이름   | 담당 업무  |
| ------ | ---------- |
| 이지민 | 프론트엔드 |
| 나해란 | 프론트엔드 |
| 김명균 | 백엔드     |
| 윤영주 | 백엔드     |

---
