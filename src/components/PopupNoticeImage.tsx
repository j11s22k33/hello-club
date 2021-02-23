import Notice from "@/models/Notice";
import Navigation from "@/utils/Navigation";
import { useEffect } from "react";

interface PopupImageProps {
  notice: Notice;
  navigation: any;
  hide: () => void;
}

const PopupImage: React.FC<PopupImageProps> = ({
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
      id: "popup-notice",
      sections: [btnNavi],
    });
    return () => {
      Navigation.removeLayer("popup-notice");
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content xlarge">
        <div className="popup-body">
          <div className="popup-box type-notice-img">
            <div className="popup-slide">
              <ul>
                <li>
                  <div className="img" />
                </li>
              </ul>
            </div>
            <div className="control-box">
              <div className="control">
                <span
                  style={{ left: "100%", transform: "translate(-100%, -50%)" }}
                >
                  2
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

export default PopupImage;
