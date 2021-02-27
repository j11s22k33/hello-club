import { useEffect, useRef } from "react";

interface PopupAgree1Props {
  navigation: any;
  updateUI: any;
  ok: () => void;
  cancel: () => void;
}

const PopupAgree1: React.FC<PopupAgree1Props> = ({
  navigation,
  updateUI,
  ok,
  cancel,
}) => {
  const checked = useRef(false);
  const height = 219;
  const movePixel = 20;
  let offsetHeight = 0;
  let pos = 0;
  let limit = 0;

  let body = {
    id: "body",
    options: {
      cols: 1,
      start: true,
    },
    direction: {
      up() {
        if (pos === 0) return;
        pos--;
        moveScroll();
      },
      down() {
        if (pos === limit) {
          navigation.go(check.id, undefined, false);
          return;
        }
        pos++;
        moveScroll();
      },
    },
    enter(section) {},
    back() {
      cancel();
    },
    leave(section) {},
    entry(section) {
      offsetHeight = document.getElementById("body").offsetHeight;
      limit = Math.ceil((offsetHeight - height + 30) / movePixel);
    },
  };

  let check = {
    id: "check",
    options: {
      cols: 1,
    },
    direction: {
      up() {
        navigation.go(body.id, undefined, false);
      },
      down() {
        if (checked.current) {
          navigation.go(btnNavi.id, { x: 0, y: 0 }, false);
        } else {
          navigation.go(btnNavi.id, { x: 1, y: 0 }, false);
        }
      },
    },
    enter(section) {
      checked.current = !checked.current;
      updateUI({});
    },
    back() {},
    leave(section) {},
    entry(section) {},
  };

  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: 2,
    },
    direction: {
      up() {
        navigation.go(check.id, { x: 0, y: 0 }, false);
      },
      down() {},
    },
    keydown(section, event) {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (!checked.current) {
          return true;
        }
      }
    },
    enter(section) {
      if (section.focusItem.dataset.btn === "ok") {
        ok();
      } else if (section.focusItem.dataset.btn === "cancel") {
        cancel();
      }
    },
    back() {
      cancel();
    },
    leave(section) {},
    entry(section) {},
  };

  const moveScroll = () => {
    document.getElementById("body").style.top = `-${pos * movePixel}px`;
    document.getElementById("scroll").style.top = `${Math.min(
      (pos / limit) * 100,
      98
    )}%`;
  };

  useEffect(() => {
    navigation.createLayer({
      id: "popup-agree1",
      sections: [body, check, btnNavi],
    });
    return () => {
      navigation.removeLayer("popup-agree1");
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content large">
        <div className="popup-header">
          <h5 className="popup-title">개인정보 수집 동의</h5>
        </div>
        <div className="popup-body">
          <h5 className="sub-title">개인정보 이용동의</h5>
          <div className="popup-box type-agree">
            <div className="popup-scroll">
              <div className="text-terms" id="body">
                <ol>
                  <li>
                    <p>1. 이용 목적</p>
                    <p className="mgl">: 개인맞춤 서비스 제공</p>
                  </li>
                  <li>
                    <p>2. 수집항목</p>
                    <p className="mgl">
                      : 서비스 이용시간, 이용 메뉴, 이용 콘텐츠, 결제기록,
                      이용금액 등 서비스 이용정보{" "}
                    </p>
                  </li>
                  <li>
                    <p>3. 보유기간</p>
                    <p className="mgl">: 가입 후</p>
                  </li>
                </ol>
              </div>
              <div className="scroll">
                <span
                  id="scroll"
                  style={{ top: "0%", transform: "translate(-50%, -20%)" }}
                />
              </div>
            </div>
          </div>
          <div id={check.id}>
            <div className="input-checkbox">
              <input type="checkbox" checked={checked.current} />
              <label>위의 내용에 동의합니다</label>
            </div>
          </div>
        </div>
        <div className="popup-footer no-line">
          <div className="button-area" id={btnNavi.id}>
            <button type="button" className="button" data-btn="ok">
              <span>가입확인</span>
            </button>
            <button type="button" className="button" data-btn="cancel">
              <span>취소</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupAgree1;
