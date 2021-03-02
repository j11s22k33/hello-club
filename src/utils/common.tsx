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
const useStateCallbackWrapper = <T extends unknown>(
  initialState?: T
): [T, Function] => {
  const [_state, _setState] = useState(initialState);
  const _ref = useRef({ effect: null, layoutEffect: null });

  useLayoutEffect(() => {
    _ref.current.layoutEffect?.(_state);
  }, [_state]);

  useEffect(() => {
    _ref.current.effect?.(_state);
  }, [_state]);

  function _udateState({ setState, useLayoutEffect, useEffect }) {
    _ref.current.effect = useEffect;
    _ref.current.layoutEffect = useLayoutEffect;
    _setState(setState);
  }

  return [_state, _udateState];
};

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
