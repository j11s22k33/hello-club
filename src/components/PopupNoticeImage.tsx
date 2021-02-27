import Notice from "@/models/Notice";
import Navigation from "@/utils/Navigation";
import { useEffect, useRef } from "react";

interface PopupImageProps {
  notice: Notice;
  navigation: any;
  updateUI: any;
  hide: () => void;
}

const PopupImage: React.FC<PopupImageProps> = ({
  notice,
  navigation,
  updateUI,
  hide,
}) => {
  let imagePos = useRef(0);
  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: 1,
      start: true,
    },
    direction: {
      left() {
        if (imagePos.current === 0) return;
        imagePos.current--;
        updateUI({});
      },
      right() {
        if (imagePos.current === notice.imgUrl.length - 1) return;
        imagePos.current++;
        updateUI({});
      },
    },
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
                  <div className="img">
                    <img
                      src={notice.imgUrl[imagePos.current]}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </li>
              </ul>
            </div>
            <div className="control-box">
              <div className="control">
                <span
                  style={{
                    left: `${
                      ((imagePos.current / (notice.imgUrl.length - 1)) * 100) - 4
                    }%`,
                    transform: "translate(0%, -50%)",
                  }}
                >
                  {imagePos.current + 1}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="popup-footer no-line">
          <div className="button-area" id={btnNavi.id}>
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
