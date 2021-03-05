import { AppProps } from "next/app";
import "@/assets/css/style.scss";
import { useStateCallbackWrapper } from "@/utils/common"
import env from "@/config/env";
console.log(env)

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