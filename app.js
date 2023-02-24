const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topicsController");
const {
  getArticles,
  getArticleByArticleId,
} = require("./controllers/articlesController");

const {
  getCommentsByArticleId,
  postComment,
} = require("./controllers/commentsController");

const {
  handleServerError,
  handle404nonExistentPaths,
  handleCustomErrors,
  handlePSQL400s,
} = require("./errors/errorHandling");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByArticleId);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.use(handle404nonExistentPaths);

app.use(handleCustomErrors);
app.use(handlePSQL400s);
app.use(handleServerError);

module.exports = app;
