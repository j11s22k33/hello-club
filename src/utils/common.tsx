import PopupNoticeImage from "@/components/PopupNoticeImage";
import PopupNoticeText from "@/components/PopupNoticeText";
import PopupNoticeTextImage from "@/components/PopupNoticeTextImage";
import Notice from "@/models/Notice";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * @returns [state, setState, cbRef]
 * @param initVal 
 */

interface UseStateCallbackList {
  effect: Function;
  layoutEffect: Function;
}

const useStateCallbackWrapper = (initVal:any):[any, React.Dispatch<any>, React.MutableRefObject<UseStateCallbackList>] => {
  const [state, setState] = useState(initVal)
  const cbRef = useRef<UseStateCallbackList>({ effect: null, layoutEffect: null })

  useLayoutEffect(() => {
    cbRef.current.layoutEffect?.(state)
  }, [state])

  useEffect(() => {
    cbRef.current.effect?.(state)
  }, [state])
  
  return [state, setState, cbRef]
}

function createNoticePopup(props: { notice: Notice; navigation; hide }) {
  switch (props?.notice?.type) {
    case "TXT":
      return <PopupNoticeText {...props} />;
    case "IMG":
      return <PopupNoticeImage {...props} />;
    case "TXTIMG":
      return <PopupNoticeTextImage {...props} />;
  }
}

export { createNoticePopup, useStateCallbackWrapper };
