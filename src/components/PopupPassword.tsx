import Navigation from "@/utils/Navigation";
import { useEffect } from "react";

interface PopupPasswordProps {
  ok: (password: string) => void;
  cancel: () => void;
}

const PopupPassword: React.FC<PopupPasswordProps> = ({ ok, cancel }) => {
  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: 1,
      start: true,
    },
    direction: {},
    enter(section) {
      ok("123456");
    },
    back() {
      cancel();
    },
    leave(section) {},
    entry(section) {},
  };

  useEffect(() => {
    Navigation.createLayer({
      id: "popup-password",
      sections: [btnNavi],
    });
    return () => {
      Navigation.removeLayer("popup-password");
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
            <p>잘못된 인증번호 입니다. 다시 입력해주세요.</p>
            <div className="password focus">
              <span className="entered">
                <input type="password" name="" maxLength={1} minLength={1} />
              </span>
              <span className="entered">
                <input type="password" name="" maxLength={1} minLength={1} />
              </span>
              <span className="entered">
                <input type="password" name="" maxLength={1} minLength={1} />
              </span>
              <span className="entered">
                <input type="password" name="" maxLength={1} minLength={1} />
              </span>
              <span>
                <input type="password" name="" maxLength={1} minLength={1} />
              </span>
              <span>
                <input type="password" name="" maxLength={1} minLength={1} />
              </span>
            </div>
            <p className="alt">※인증번호 문의 : 0000 - 0000</p>
          </div>
        </div>
        <div className="popup-footer">
          <div className="button-area">
            <button type="button" className="button">
              <span>확인</span>
            </button>
            <button type="button" className="button">
              <span>취소</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupPassword;
