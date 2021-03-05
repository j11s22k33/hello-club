export default {
  production: process.env.NODE_ENV === "production",
  API_UIPF: process.env.NEXT_PUBLIC_API_UIPF,
  API_ADMIN: process.env.NEXT_PUBLIC_API_ADMIN,
  // isSTB: /CloudStreaming/.test(window.navigator.userAgent)
  isSTB: process.env.NEXT_PUBLIC_IS_STB === '1'
};