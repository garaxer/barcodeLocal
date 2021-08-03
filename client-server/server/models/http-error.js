class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
}

/** Glorified try catch that allows you set the status code to give back a more meaningful error. Throwing a http error inside will take priority */
HttpError.errorHandler = (
  messageText = 'Unknown Error has occured',
  statuscode = 500
) => (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((e) => {
    // Check if its an error I created or use the default one provided.
    console.log('caught error:', e);
    const message = (e instanceof HttpError && e.message) || messageText;
    const error = new HttpError(message, statuscode);
    next(error);
  });

module.exports = HttpError;
