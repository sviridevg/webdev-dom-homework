import { getFP } from "./api.js";
import { bodyContainerEl, commentsEl } from "./main.js";
import { renderComments } from "./render.js";

// Функция для имитации запросов в API
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

export function like(e) {
  if (e.target.className.includes("like-button")) {
    // Выбрал необходимое сердечко и добавил на него стиль с анимацией
    e.target.classList.value = "like-button -loading";
    // В этот же момент добавил для Body стиль курсора с прогрессом загрузки
    bodyContainerEl.classList.value = "container progress-cursor";
    // Запустилась функция имитации запросов в API
    delay(2000).then(() => {
      const ppp = getFP().then((responseData) => {
        return responseData.comments;
      });

      console.log(ppp);

      //   let index = Number(e.target.id);
      //   const currentPost = ppp[index];
      //   console.log(object);
      //   let currentComment = currentPost.isLiked;
      //   let currentCounterLike = currentPost.likes;
      //   currentComment = !currentComment;
      //   if (currentComment) {
      //     currentCounterLike = currentCounterLike + 1;
      //   } else {
      //     currentCounterLike = currentCounterLike - 1;
      //   }

      //   currentPost.isLiked = currentComment;
      //   currentPost.likes = currentCounterLike;
      //   renderComments(allPosts, commentsEl);

      // По завершению рендера убираю у Body стиль курсора
      bodyContainerEl.classList.value = "container";
    });
  }
}
