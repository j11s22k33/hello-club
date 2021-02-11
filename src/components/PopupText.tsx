import Notice from "@/models/Notice";
import { useEffect } from "react";

interface PopupTextProps {
  notice: Notice;
  navigation: any;
  hide: () => void;
}

const PopupText: React.FC<PopupTextProps> = ({ notice, navigation, hide }) => {
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
    navigation.createLayer({
      id: "notice-popup",
      sections: [btnNavi],
    });
    return () => {
      navigation.removeLayer("notice-popup");
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
              <div className="text-terms">
                <p>
                  이번 주 예배 안내입니다
                  <br />
                  <br />
                  우리교회 본당은 450석이므로 주일 예배를 45명씩 4부로 나누어
                  예배를 드릴 예정입니다. 대면 예배에 참여하시기 원하시는 분은
                  아래 예배 안내를 참고해주시기 바랍니다.
                  <br />
                  <br />
                  기저질환을 가지고 계시거나, 평상시 사람을 많이 만나시는 분들은
                  실시간으로 진행되는 영상을 통해 예배를 드려주시기 바라며,
                  코로나가 속히 종식이 되기를 함께 기도해주시기 바랍니다.
                  <br />
                  <br />
                  상암교회 김봉수 목사 * 예배 안내 (실시간 온라인 예배)
                  <br />
                  주일 1부 예배 : 오전 8시 (1~6구역)
                  <br />
                  주일 2부 예배 : 오전 9시 30분 (7~12구역)
                  <br />
                  주일 3부 예배 : 오전 11시 (13~18구역)
                  <br />
                  주일 4부 예배 : 오후 12시 30분 (19~27구역)
                  <br />
                  <br />
                  * 헌금 계좌 안내
                  <br />
                  [십일조, 감사, 주정, 선교헌금]
                  <br />
                  국민 598601-04-137958 (대한예수교장로회 상암교회)
                  <br />
                  [건축헌금]
                  <br />
                  농협 351-0090-3647-43 (상암교회)
                  <br />
                </p>
              </div>
              <div className="scroll">
                <span
                  style={{
                    top: "20%",
                    transform: "translate(-50%, -20%)",
                  }}
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div className="popup-footer no-line">
          <div className="button-area" id="btn-navi">
            <button type="button" className="button">
              <span>확인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupText;
