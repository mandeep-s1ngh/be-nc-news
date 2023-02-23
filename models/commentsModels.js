const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const comments = rows;
      return comments;
    });
};
