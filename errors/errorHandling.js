exports.handleServerError = (err, req, res, next) => {
  console.log(err);
  if (err) res.status(500).send({ msg: "Internal Server Error!" });
};
