import { AppProps } from "next/app";
import "@/assets/css/style.css";
import { useEffect, useRef, useState } from "react";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  /* 
  UI 업데이트 START
  updateUI(cb) -> setUpdateUINum() -> useEffect([updateUINum]) -> cb()
  */
  const __updateUIListener = useRef([])
  const [__updateUINum, __setUpdateUINum] = useState(0)
  
  useEffect(()=>{
    const size = __updateUIListener.current.length
    for (let x=0; x<size; x++) {
      __updateUIListener.current[x]()
    }
    __updateUIListener.current = []
  }, [__updateUINum])
  
  function updateUI(cb?:Function) {
    cb && __updateUIListener.current.push(cb)
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
