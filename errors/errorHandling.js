exports.handle404nonExistentPaths = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg === "No article found") {
    res.status(404).send({ msg: err.msg });
  } else if (err.msg === "No comments found for article") {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQL400s = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
};

exports.handleServerError = (err, req, res, next) => {
  if (err) res.status(500).send({ msg: "Internal Server Error!" });
};
