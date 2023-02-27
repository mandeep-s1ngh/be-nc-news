const db = require("../db/connection");

exports.fetchArticles = (topic, sort_by = "created_at", order_by = "desc") => {
  const variablesArray = [];
  const validSortBys = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrderBys = ["asc", "desc", "ASC", "DESC"];

  if (!validOrderBys.includes(order_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request",
    });
  }

  let queryString = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
  if (topic.length === 1) {
    variablesArray.push(topic[0].slug);
    queryString += ` WHERE articles.topic = $1`;
  }
  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by};`;
  return db.query(queryString, variablesArray).then((result) => {
    return result.rows;
  });
};

exports.checkTopicExists = (topic) => {
  let queryString = `SELECT * FROM topics`;
  const topicParams = [];

  if (topic !== undefined) {
    queryString += ` WHERE slug = $1;`;
    topicParams.push(topic);
  }

  return db.query(queryString, topicParams).then((selectedTopic) => {
    if (selectedTopic.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No topic found" });
    }
    return selectedTopic.rows;
  });
};

exports.fetchArticleByArticleId = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
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
