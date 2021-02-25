import PopupNoticeImage from "@/components/PopupNoticeImage";
import PopupNoticeText from "@/components/PopupNoticeText";
import PopupNoticeTextImage from "@/components/PopupNoticeTextImage";
import Notice from "@/models/Notice";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * state, setState, cb 반환
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
  const cbList = useRef({
    effect: [],
    layoutEffect: []
  })

  useLayoutEffect(() => {
    const list = cbList.current.layoutEffect 
    const len = list.length
    cbList.current.layoutEffect = []

    for (let x=0; x<len; x++) {
      list[x](state)
    }
  }, [state])

  useEffect(() => {
    const list = cbList.current.effect 
    const len = list.length
    cbList.current.effect = []

    for (let x=0; x<len; x++) {
      list[x](state)
    }
  }, [state])
  
  return [state, setState, cbList]
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
