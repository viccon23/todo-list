const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  apiBaseUrl: isDevelopment ? 'http://localhost:5000' : 'http://localhost:5000'
};