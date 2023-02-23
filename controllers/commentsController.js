const { fetchArticleByArticleId } = require("../models/articlesModels");
const { fetchCommentsByArticleId } = require("../models/commentsModels");

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
