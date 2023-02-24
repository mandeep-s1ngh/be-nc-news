const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC"
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticleByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM articles where article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found`,
        });
      }
      return article;
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      const updatedArticle = rows[0];
      return updatedArticle;
    });
};
