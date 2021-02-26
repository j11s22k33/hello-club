import { useEffect } from "react";

interface PopupJoinProps {
  navigation: any;
  ok: () => void;
  cancel: () => void;
}

const PopupJoin: React.FC<PopupJoinProps> = ({ navigation, ok, cancel }) => {
  const height = 322;
  const movePixel = 20;
  let offsetHeight = 0;
  let pos = 0;
  let limit = 0;

  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: 2,
      start: true,
    },
    direction: {
      up() {
        if (pos === 0) return;
        pos--;
        moveScroll();
      },
      down() {
        if (pos === limit) return;
        pos++;
        moveScroll();
      },
    },
    enter(section) {
      ok();
    },
    back() {
      cancel();
    },
    leave(section) {},
    entry(section) {
      offsetHeight = document.getElementById("body").offsetHeight;
      limit = Math.ceil((offsetHeight - height + 30) / movePixel);
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
      id: "popup-join",
      sections: [btnNavi],
    });
    return () => {
      navigation.removeLayer("popup-join");
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content large">
        <div className="popup-header">
          <h5 className="popup-title">가입하기</h5>
        </div>
        <div className="popup-body">
          <div className="popup-box type-privacy">
            <div className="popup-scroll">
              <div className="text-terms" id="body">
                <p className="mgt">
                  본 헬로클럽은 무료 서비스로 가입 후, 이용하실 수 있습니다.
                </p>
                <dl>
                  <dt>1. 개인 정보 수집 및 이동 동의 (필수)</dt>
                  <dd>
                    헬로tv는 헬로클럽 서비스 제공을 위하여 필요한 최소한의
                    개정보를 수집하고 있습니다
                  </dd>
                  <dd>- 수집항목: 헬로tv 가입자 이름</dd>
                  <dd>- 이용목적: [운산 성결교회] 헬로클럽 서비스 제공</dd>
                  <dd>
                    - 보유기간: [운산 성결교회] 헬로클럽 가입 기간 (탈퇴 시,
                    즉시 삭제)
                  </dd>
                </dl>
                <p className="mgt">
                  개인 정보 수집 및 이용 동의를 거부하실 수 있으며, 거부 시
                  서비스 이용이 제한됩니다.
                </p>
                <dl>
                  <dt>2. 콘텐츠 제공 및 운영 안내</dt>
                  <dd>
                    헬로tv는 헬로클럽 서비스 제공을 위하여 필요한 최소한의
                    개정보를 수집하고 있습니다
                  </dd>
                  <dd>
                    본 헬로클럽은 [운산 성결교회]에서 운영 및 관리하는 서비스로,
                    제공되는 콘텐츠의 저작권과 책임은 [운산 성결교회]에게
                    있습니다.
                  </dd>
                </dl>
              </div>
              <div className="scroll">
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

export default PopupJoin;
