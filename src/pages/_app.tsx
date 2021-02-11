import { AppProps } from "next/app";
import "@/assets/css/style.css";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
