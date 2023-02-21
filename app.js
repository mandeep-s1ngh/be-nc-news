const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topicsController");

const { handleServerError } = require("./errors/errorHandling");

app.get("/api/topics", getTopics);

app.use(handleServerError);

module.exports = app;
