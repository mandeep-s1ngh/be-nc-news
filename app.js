const cors = require("cors");
const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topicsController");
const {
  getArticles,
  getArticleByArticleId,
  patchArticleVotes,
} = require("./controllers/articlesController");

const {
  getCommentsByArticleId,
  postComment,
  deleteCommentById,
} = require("./controllers/commentsController");

const { getUsers } = require("./controllers/usersController");

const { getEndpoints } = require("./controllers/endpointsController");

const {
  handleCustomErrors,
  handleServerError,
  handle404nonExistentPaths,
  handlePSQL400s,
} = require("./errors/errorHandling");

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByArticleId);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/users", getUsers);

app.get("/api", getEndpoints);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handle404nonExistentPaths);

app.use(handleCustomErrors);
app.use(handlePSQL400s);
app.use(handleServerError);

module.exports = app;
