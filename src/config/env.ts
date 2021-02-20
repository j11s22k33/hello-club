export default {
  production: process.env.NODE_ENV === "production",
  API: process.env.API_HOST || "http://localhost:8080/",
};
