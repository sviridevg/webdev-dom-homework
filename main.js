import { getFP, sendD } from "./api.js";
import { fourHundredError, somethingsWrong } from "./error.js";
import { renderComments } from "./render.js";

const buttonEl = document.getElementById("add-form-button");
export const commentsEl = document.getElementById("comments");
export const inputNameEl = document.getElementById("inputName");
export const inputTextEl = document.getElementById("inputText");
export const baseURL = "https://wedev-api.sky.pro/api/v1/sviridevg/comments";
export const formEl = document.getElementById("form");
export const commentPreloadEl = document.getElementById("commentPreload");
export const bodyContainerEl = document.getElementById("bodyContainer");

// Прелоадер страницы комментариев
commentsEl.disabled = true;
commentsEl.textContent = "Пожалуйста подождите комментарии загружаются";

// Получение данных с сервера v2.0
const getFetchPromise = () => {
  getFP().then((responseData) => {
    const commentsForRender = responseData.comments;
    renderComments(commentsForRender, commentsEl);
  });
};
getFetchPromise();

// Проверка на наличие текста в в форме
function error(a) {
  if (a.value === "") {
    a.classList.add("error");
    buttonEl.classList.add("error");
    return true;
  }
  return false;
}

// Функция добавления нового комментария
buttonEl.addEventListener("click", function (e) {
  inputNameEl.classList.remove("error");
  inputTextEl.classList.remove("error");
  buttonEl.classList.remove("error");
  const nameError = error(inputNameEl);
  const textError = error(inputTextEl);
  if (nameError || textError) {
    return;
  }

  // Прелоадер отправки комментария
  formEl.classList.value = "hide";
  commentPreloadEl.classList.value = "-loading";
  sendData();

  // Отправка данных на серевр v3.0
  function sendData() {
    sendD()
      .then((response) => {
        const respStat = response.status;
        if (response.status === 201) {
          return response.json();
        } else {
          throw respStat;
        }
      })
      .then((responseData) => {
        return getFP();
      })
      .then((responseData) => {
        const commentsForRender = responseData.comments;
        renderComments(commentsForRender, commentsEl);
      })
      .then((Data) => {
        // Отображение формы
        formEl.classList.value = "add-form";
        commentPreloadEl.classList.value = "hide";
        // Очистка формы
        document.getElementById("inputName").value = "";
        document.getElementById("inputText").value = "";
        scroll();
      })
      .catch((respStat) => {
        if (respStat === 400) {
          return fourHundredError();
        } else if (respStat === 500) {
          setTimeout(() => {
            sendData();
          }, 2500);
        } else {
          somethingsWrong();
        }
      });
  }
});

// Прокрутка документа после добавления комментария
export function scroll() {
  formEl.scrollIntoView({ block: "center", behavior: "smooth" });
}

// Убираем уязвимость
export function goodByeHacker(text) {
  return text
    .replaceAll("<", "&lt")
    .replaceAll(">", "&gt")
    .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
    .replaceAll("QUOTE_END", "</div>");
}
