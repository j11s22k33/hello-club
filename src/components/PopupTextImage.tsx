import Notice from "@/models/Notice";
import Navigation from "@/utils/Navigation";
import { useEffect } from "react";

interface PopupTextImageProps {
  notice: Notice;
  navigation: any;
  hide: () => void;
}

const PopupTextImage: React.FC<PopupTextImageProps> = ({
  notice,
  navigation,
  hide,
}) => {
  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: 1,
      start: true,
    },
    direction: {},
    enter(section) {
      hide();
    },
    back() {
      hide();
    },
    leave(section) {},
    entry(section) {},
  };

  useEffect(() => {
    Navigation.createLayer({
      id: "notice-popup",
      sections: [btnNavi],
    });
    return () => {
      Navigation.removeLayer("notice-popup");
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content large">
        <div className="popup-body">
          <div className="popup-box type-notice-half">
            <div className="popup-slide">
              <ul>
                <li>
                  <div className="img"></div>
                  <div className="text">
                    이번 주 예배 안내입니다
                    <br />
                    <br />
                    우리교회 본당은 450석이므로 주일 예배를 45명씩 4부로 나누어
                    예배를 드릴 예정입니다. 대면 예배에 참여하시기 원하시는 분은
                    아래 예배 안내를 참고해주시기 바랍니다.
                    <br />
                    <br />
                  </div>
                </li>
              </ul>
            </div>
            <div className="control-box">
              <div className="control">
                <span style={{ left: "0%", transform: "translate(0%, -50%)" }}>
                  1
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="popup-footer no-line">
          <div className="button-area">
            <button type="button" className="button focus">
              <span>확인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupTextImage;
