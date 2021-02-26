import { AppProps } from "next/app";
import "@/assets/css/style.css";
import { useStateCallbackWrapper } from "@/utils/common"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [tmp, uTmp] = useStateCallbackWrapper(0)
  
  function updateUI({useLayoutEffect, useEffect}) {
    uTmp({
      setState: c => c+1, 
      useLayoutEffect, 
      useEffect
    })
  }

  return (
    <>
      <Component {...pageProps} updateUI={updateUI}/>
    </>
  )
}

export default App;