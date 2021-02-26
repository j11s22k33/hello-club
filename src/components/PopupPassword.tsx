import { auth } from "@/modules/users/requests";
import { useEffect, useRef, useState } from "react";

interface PopupPasswordProps {
  navigation: any;
  updateUI: any;
  ok: () => void;
  cancel: () => void;
}

const PopupPassword: React.FC<PopupPasswordProps> = ({
  navigation,
  updateUI,
  ok,
  cancel,
}) => {
  const numbers = useRef(Array(6).fill(undefined));
  const [error, setError] = useState<string>();

  let numberNavi = {
    id: "number-navi",
    options: {
      cols: 6,
      start: true,
    },
    direction: {},
    keydown(section, event) {
      if (/^[0-9]*$/.test(event.key)) {
        numbers.current[section.axis.x] = event.key;
        const x = section.axis.x + 1;
        if (x < numbers.current.length) {
          navigation.go(section.id, { x: x, y: 0 });
        } else {
          navigation.go(btnNavi.id, { x: 0, y: 0 });
        }
        updateUI({});
        return true;
      } else if (event.key === "Backspace") {
        const x = section.axis.x - 1;
        if (x >= 0) {
          numbers.current[x] = undefined;
          navigation.go(section.id, { x: x, y: 0 });
        }
        updateUI({});
        return true;
      }
    },
    back() {
      cancel();
    },
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
        numbers.current = Array(6).fill(undefined);
        navigation.go(numberNavi.id, { x: 0, y: 0 });
        updateUI({});
      },
    },
    async enter(section) {
      if (section.focusItem.dataset.btn === "ok") {
        try {
          const res = await auth({ clubId: "", stbType: "", authNo: "" });
          if (res.result === "0000") {
            ok();
          } else {
            setError("잘못된 인증번호 입니다. 다시 입력해주세요.");
            updateUI({});
          }
        } catch (e) {}
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

  useEffect(() => {
    navigation.createLayer({
      id: "popup-password",
      sections: [numberNavi, btnNavi],
    });
    return () => {
      navigation.removeLayer("popup-password");
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content small">
        <div className="popup-header">
          <h5 className="popup-title">가입 인증 번호 입력</h5>
        </div>
        <div className="popup-body">
          <div className="popup-password">
            <p>{error}</p>
            <div className="password focus" id={numberNavi.id}>
              {numbers.current.map((n) => (
                <span className={n ? "entered" : ""}>
                  <input type="password" name="" maxLength={1} minLength={1} />
                </span>
              ))}
            </div>
            <p className="alt">※인증번호 문의 : 0000 - 0000</p>
          </div>
        </div>
        <div className="popup-footer">
          <div className="button-area" id={btnNavi.id}>
            <button type="button" className="button" data-btn="ok">
              <span>확인</span>
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

export default PopupPassword;
