const { fetchArticleByArticleId } = require("../models/articlesModels");
const {
  fetchCommentsByArticleId,
  insertComment,
  removeCommentById,
} = require("../models/commentsModels");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promiseArray = [
    fetchArticleByArticleId(article_id),
    fetchCommentsByArticleId(article_id),
  ];

  Promise.all(promiseArray)
    .then(([article, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;

  const { author, body } = req.body;

  insertComment(article_id, author, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
