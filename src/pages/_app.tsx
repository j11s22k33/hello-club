import { AppProps } from "next/app";
import "@/assets/css/style.css";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
