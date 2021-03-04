import PopupNoticeImage from "@/components/PopupNoticeImage";
import PopupNoticeText from "@/components/PopupNoticeText";
import PopupNoticeTextImage from "@/components/PopupNoticeTextImage";
import Notice from "@/models/Notice";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * ```
 * // 예제
 * const [cnt, updateCnt] = useStateCallbackWrapper(0)
 *
 * updateCnt({
 *    setState: oldState => oldState+1,
 *    useLayoutEffect: newState => console.log(newState),
 *    useEffect: newState => console.log(newState)
 * })
 *
 * ```
 * @param initialState
 * @returns [state, updateState]
 */
const $emptyFn = (state) => { };
const useStateCallbackWrapper = <T extends unknown>(initialState?: T): [T, Function] => {
  const [$state, $setState] = useState(initialState);
  const $res = useRef({ effect: $emptyFn, layoutEffect: $emptyFn });

  useLayoutEffect(() => {
    $res.current.layoutEffect($state);
  }, [$state]);

  useEffect(() => {
    $res.current.effect($state);
  }, [$state]);

  function $udateState({ setState, useLayoutEffect = $emptyFn, useEffect = $emptyFn }) {
    $res.current.effect = useEffect;
    $res.current.layoutEffect = useLayoutEffect;
    $setState(setState);
  }

  return [$state, $udateState];
}

function createNoticePopup(props: {
  notice: Notice;
  navigation;
  hide;
  updateUI;
}) {
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
