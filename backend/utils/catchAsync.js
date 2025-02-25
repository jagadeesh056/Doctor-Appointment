const ApiError = require("./ApiError");
function catchAsync(fn) {
    return function(req, res, next) {
      Promise.resolve(fn(req, res, next)).catch((err) => {
        const newError = new ApiError(404, err.message)
        next(newError);
    });
    }
  }
  
  module.exports = catchAsync;