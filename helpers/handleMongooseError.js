const handleMongooseError = (error, data, next) => {
  const { name, code } = error;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  next();
};

module.exports = handleMongooseError;

// const messageList = {
//   400: "Bad Request",
//   401: "Unauthorized",
//   403: "Forbidden",
//   404: "Not Found",
//   409: "Conflict",
// };

// const HttpError = (status, message = messageList[status]) => {
//   const error = new Error(message);
//   error.status = status;
//   return error;
// };

// export default HttpError;
