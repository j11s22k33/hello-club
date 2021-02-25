import { AppProps } from "next/app";
import "@/assets/css/style.css";
import { useStateCallbackWrapper } from "@/utils/common"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [tmp, setTmp, cbList] = useStateCallbackWrapper(0)
  
  function updateUI(layoutEffectCb?:Function, effectCb?:Function) {
    layoutEffectCb && cbList.current.layoutEffect.push(layoutEffectCb)
    effectCb && cbList.current.effect.push(effectCb)
    setTmp(c => c+1)
  }

  return (
    <>
      <Component {...pageProps} updateUI={updateUI}/>
    </>
  )
}

export default App;