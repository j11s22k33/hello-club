import { AppProps } from "next/app";
import "@/assets/css/style.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  /* 
  UI 업데이트 START
  updateUI(cb) -> setUpdateUINum() -> useEffect([updateUINum]) -> cb()
  */
  const __updateUIListener = useRef({
    effect: [],
    layoutEffect: []
  })
  const [__updateUINum, __setUpdateUINum] = useState(0)
  
  useEffect(()=>{
    const listeners = __updateUIListener.current.effect
    const length = listeners.length
    __updateUIListener.current.effect = []

    console.log('[updateUI useEffect] listeners.length:%o __updateUINum:%o', length, __updateUINum)

    for (let x=0; x<length; x++) {
      listeners[x]()
    }
  }, [__updateUINum])
  
  useLayoutEffect(()=>{
    const listeners = __updateUIListener.current.layoutEffect
    const length = listeners.length
    __updateUIListener.current.layoutEffect = []
    
    console.log('[updateUI useLayoutEffect] listeners.length:%o __updateUINum:%o', length, __updateUINum)

    for (let x=0; x<length; x++) {
      listeners[x]()
    }
  }, [__updateUINum])
  
  function updateUI(effectCb?:Function, layoutEffectCb?:Function) {
    effectCb && __updateUIListener.current.effect.push(effectCb)
    layoutEffectCb && __updateUIListener.current.layoutEffect.push(layoutEffectCb)
    __setUpdateUINum(c => c+1)
  }
  /* <!-- UI 업데이트 END */
  
  return (
    <>
      <Component {...pageProps} updateUI={updateUI}/>
    </>
  )
}

export default App;
