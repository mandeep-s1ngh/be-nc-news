const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topicsController");
const { getArticles } = require("./controllers/articlesController");

const { handleServerError } = require("./errors/errorHandling");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.use(handleServerError);

module.exports = app;
