import { getDate } from "./date.js";
import { handleButtonClick } from "./main.js";

// Функция рендера
export function renderComments(commentsForRender, commentsEl) {
  const commentsHtml = commentsForRender
    .map((post, index) => {
      // Условия изменения стилие сердечка и открытия окна редактирования
      const isLike = post.isLiked ? "-active-like" : "";
      const isEdit = post.isEdit ? "" : "hide";
      const isAuthor = post.isAuthor ? "" : "hide";

      // Верстка тела комментария
      return `<li class="comment" >
              <div class="comment-header">
                  <div> ${post.author.name} </div>
                  <div>${getDate(post.date)}</div>
              </div>
              <div class="comment-body">
                  <div id=${post.id} class="comment-text">
                  ${post.text}
                  </div>
              </div>
              <div class="comment-footer">
                  <div class="likes">
                  <span id = "likes-counter" class="likes-counter">${
                    post.likes
                  }</span>
                  <button id=${index} class="like-button ${isLike}"></button>
                  </div>
  
              </div>
              <div class="${isEdit}">
                  <div class="edit-form">
                  <input id='inpt_${index}' type="text" class="add-form-text"/>
                  <div class="add-form-row">
                      <button id='btn_${index}' class="add-form-button">Сохранить</button>
                  </div>
                  </div>
              </div>
              <button id=${index} class="manipulation-of-comments ${isAuthor}">Редактировать</button>
              </li>`;
    })
    .join("");

  commentsEl.innerHTML = commentsHtml;
  handleButtonClick();
}
