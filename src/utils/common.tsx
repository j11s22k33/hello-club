import PopupNoticeImage from "@/components/PopupNoticeImage";
import PopupNoticeText from "@/components/PopupNoticeText";
import PopupNoticeTextImage from "@/components/PopupNoticeTextImage";
import Notice from "@/models/Notice";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * @returns [state, setState, cbRef]
 * @param initVal 
 */
const useStateCallbackWrapper = (initVal:any):
[
  any,
  React.Dispatch<any>,
  React.MutableRefObject<{
    effect: any[];
    layoutEffect: any[];}>
] => {
  const [state, setState] = useState(initVal)
  const cbRef = useRef({
    effect: [],
    layoutEffect: []
  })

  useLayoutEffect(() => {
    const list = cbRef.current.layoutEffect 
    const len = list.length
    cbRef.current.layoutEffect = []

    for (let x=0; x<len; x++) {
      list[x](state)
    }
  }, [state])

  useEffect(() => {
    const list = cbRef.current.effect 
    const len = list.length
    cbRef.current.effect = []

    for (let x=0; x<len; x++) {
      list[x](state)
    }
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
