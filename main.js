import { getFP, sendD } from "./api.js";
import { fourHundredError, somethingsWrong } from "./error.js";
import { like } from "./like.js";
import { renderComments } from "./render.js";
import { reply } from "./reply.js";

const buttonEl = document.getElementById("add-form-button");
export const commentsEl = document.getElementById("comments");
export const inputNameEl = document.getElementById("inputName");
export const inputTextEl = document.getElementById("inputText");
const dellbutton = document.getElementById("dell");
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

// Работаем с количеством лайков с имитайцией запросов в API
commentsEl.addEventListener("click", function (e) {
  like(e);
});

// Забираем комментарий для ответа на него
commentsEl.addEventListener("click", function (e) {
  reply(e);
});

// Редактирование комментария
commentsEl.addEventListener("click", function (e) {
  if (e.target.className.includes("manipulation-of-comments")) {
    let i = Number(e.target.id);
    const editCurrentPost = commentsForRender[i];
    editCurrentPost.isEdit = !editCurrentPost.isEdit;
    renderComments();
    const editInput = document.getElementById(`inpt_${i}`);
    editInput.defaultValue = editCurrentPost.comment;
  }
});

// Сохранение измененного комментария
commentsEl.addEventListener("click", function (e) {
  if (e.target.className.includes("add-form-button")) {
    let { id } = e.target;
    let i = Number(id.slice(4));
    const editInputValue = document.getElementById(`inpt_${i}`).value;
    commentsForRender[i].comment = editInputValue;
    commentsForRender[i].isEdit = false;
    renderComments();
  }
});

// Проверка на наличия текста в в форме
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
  const oldCommentsEl = commentsEl.innerHTML;
  inputNameEl.classList.remove("error");
  inputTextEl.classList.remove("error");
  buttonEl.classList.remove("error");
  const nameError = error(inputNameEl);
  const textError = error(inputTextEl);
  sendData();

  if (nameError || textError) {
    return;
  }

  // Прелоадер отправки комментария
  formEl.classList.value = "hide";
  commentPreloadEl.classList.value = "-loading";

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
        handleButtonClick();
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
export function handleButtonClick() {
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

// // Удаляем комменнтарий из массива
// dellbutton.addEventListener("click", function (e) {
//   commentsForRender.pop();
//   renderComments();
// });
