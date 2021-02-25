import { AppProps } from "next/app";
import "@/assets/css/style.css";
import { useStateCallbackWrapper } from "@/utils/common"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [updUI, setUpdUI, updUICbList] = useStateCallbackWrapper(0)
  
  function updateUI(layoutEffectCb?:Function, effectCb?:Function) {
    layoutEffectCb && updUICbList.current.layoutEffect.push(layoutEffectCb)
    effectCb && updUICbList.current.effect.push(effectCb)
    setUpdUI(c => c+1)
  }

  return (
    <>
      <Component {...pageProps} updateUI={updateUI}/>
    </>
  )
}

export default App;