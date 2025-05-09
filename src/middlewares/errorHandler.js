
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging and monitoring
  console.error(err.stack);

  // Determine the status code
  let statusCode = err.statusCode || 500; // Use custom status code if provided, otherwise default to 500
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request for validation errors
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404; // Not Found for invalid ObjectIds
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401; // Unauthorized for JWT errors
  }

  // Determine the error message
  let message = err.message || 'Internal Server Error'; // Use custom message if provided, otherwise default

  // Customize message for specific error types (optional, but recommended)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Invalid input data: ${errors.join(', ')}`;
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = `Resource not found`;
  } else if (err.code === 11000) { // MongoDB duplicate key error
    message = 'Duplicate field value entered';
  }

  // Send the JSON response
  res.status(statusCode).json({
    success: false, // Indicate failure
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), 
    
  });
};

module.exports = errorHandler;