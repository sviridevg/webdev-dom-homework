import { getFP } from "./api.js";
import { inputTextEl } from "./main.js";

export function reply(e) {
  if (e.target.className.includes("comment-text")) {
    getFP().then((responseData) => {
      const commentsForRender = responseData.comments;
      let i = Number(e.target.id);
      const currentPostText = commentsForRender.find((el) => el.id === i);

      // Если dTransfer >= 0 значит есть перенос строки с последнего элемента \n (Репост репоста)
      const idTransfer = currentPostText.text.lastIndexOf("\n");
      let currentCommentText;
      if (idTransfer >= 0) {
        const lastComment = currentPostText.text.slice(idTransfer);
        currentCommentText = lastComment;
      } else {
        currentCommentText = currentPostText.text;
      }

      let currentCommentAuthor = currentPostText.author.name;
      inputTextEl.value = `QUOTE_BEGIN > "${currentCommentAuthor}" \n ${currentCommentText} QUOTE_END \n `;
    });
  }
}
