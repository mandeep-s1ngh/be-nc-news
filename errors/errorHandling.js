exports.handle404nonExistentPaths = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg === "No article found") {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQL400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.handleServerError = (err, req, res, next) => {
  if (err) res.status(500).send({ msg: "Internal Server Error!" });
};

// exports.handleCustomErrors = (err, req, res, next) => {
//   console.log(">>> custom error", err);
//   if (err.code === "22P02") {
//     res.status(400).send({ msg: err.msg || "Bad Request" });
//   } else if (err.msg === "No article found") {
//     res.status(404).send({ msg: err.msg });
//   } else {
//     next(err);
//   }
// };
