import Notice from "@/models/Notice";
import { useEffect } from "react";

interface PopupTextProps {
  notice: Notice;
  navigation: any;
  updateUI: any;
  hide: () => void;
}

const PopupText: React.FC<PopupTextProps> = ({
  notice,
  navigation,
  updateUI,
  hide,
}) => {
  const height = 322;
  const movePixel = 20;
  let offsetHeight = 0;
  let pos = 0;
  let limit = 0;

  let btnNavi = {
    id: "btn-navi",
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
          return;
        }
        pos++;
        moveScroll();
      },
    },
    enter(section) {
      hide();
    },
    back() {
      hide();
    },
    leave(section) {},
    entry(section) {
      offsetHeight = document.getElementById("body").offsetHeight;
      limit = Math.ceil((offsetHeight - height + 30) / movePixel);
      limit = Math.max(limit, 0);
      if (limit === 0) {
        document.getElementById("scroll-bar").style.display = "none";
      }
    },
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
      id: "popup-notice",
      sections: [btnNavi],
    });
    return () => {
      navigation.removeLayer("popup-notice");
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content large">
        <div className="popup-header">
          <h5 className="popup-title">[코로나 관련 주요 공지]</h5>
        </div>
        <div className="popup-body">
          <div className="popup-box type-notice">
            <div className="popup-scroll">
              <div className="text-terms" id="body">
                <p dangerouslySetInnerHTML={{ __html: notice.text }}></p>
              </div>
              <div className="scroll" id="scroll-bar">
                <span
                  id="scroll"
                  style={{ top: "0%", transform: "translate(-50%, -20%)" }}
                />
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

export default PopupText;
