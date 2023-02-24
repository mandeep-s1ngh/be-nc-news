const {
  fetchArticles,
  fetchArticleByArticleId,
  updateVotes,
} = require("../models/articlesModels");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleByArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;

  const { inc_votes } = req.body;

  const promiseArray = [
    fetchArticleByArticleId(article_id),
    updateVotes(article_id, inc_votes),
  ];

  Promise.all(promiseArray)
    .then(([originalArticle, updatedArticle]) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
