const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const comments = rows;
      return comments;
    });
};

exports.insertComment = (article_id, author, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [article_id, author, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
