import Navigation from "@/utils/Navigation";
import { useEffect } from "react";

interface PopupAgreeProps {
  ok: () => void;
  cancel: () => void;
}

const PopupAgree: React.FC<PopupAgreeProps> = ({ ok, cancel }) => {
  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: 1,
      start: true,
    },
    direction: {},
    enter(section) {
      ok();
    },
    back() {
      cancel();
    },
    leave(section) {},
    entry(section) {},
  };

  useEffect(() => {
    Navigation.createLayer({
      id: "popup-alert",
      sections: [btnNavi],
    });
    return () => {
      Navigation.removeLayer("popup-alert");
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
              <div className="text-terms">
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
                  style={{ top: "20%", transform: "translate(-50%, -20%)" }}
                />
              </div>
            </div>
          </div>
          <div className="input-checkbox">
            <input type="checkbox" defaultChecked />
            <label>위의 내용에 동의합니다</label>
          </div>
        </div>
        <div className="popup-footer no-line">
          <div className="button-area">
            <button type="button" className="button">
              <span>가입확인</span>
            </button>
            <button type="button" className="button focus">
              <span>취소</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupAgree;
