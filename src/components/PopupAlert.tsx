import { ReactNode, useEffect } from "react";

type PopupType = "CONFIRM" | "ALERT";

interface PopupAlertProps {
  navigation: any;
  title: string;
  message: ReactNode;
  ok: () => void;
  cancel?: () => void;
  type: PopupType;
}

const PopupAlert: React.FC<PopupAlertProps> = ({
  navigation,
  title,
  message,
  ok,
  cancel,
  type,
}) => {
  // TODO: 버튼 동적으로 처리 필요
  // 알림, 탈퇴 완료, 탈퇴 확인, 가입 완료
  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: type === "CONFIRM" ? 2 : 1,
      start: true,
    },
    direction: {},
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

  useEffect(() => {
    navigation.createLayer({
      id: "popup-alert",
      sections: [btnNavi],
    });
    return () => {
      navigation.removeLayer("popup-alert");
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content medium">
        <div className="popup-header">
          <h5 className="popup-title">{title}</h5>
        </div>
        <div className="popup-body">
          <div className="popup-text-normal">{message}</div>
        </div>
        <div className="popup-footer">
          {type === "CONFIRM" ? (
            <div className="button-area" id={btnNavi.id}>
              <button type="button" className="button" data-btn="ok">
                <span>확인</span>
              </button>
              <button type="button" className="button" data-btn="cancel">
                <span>취소</span>
              </button>
            </div>
          ) : (
            <div className="button-area" id={btnNavi.id}>
              <button type="button" className="button" data-btn="ok">
                <span>닫기</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupAlert;
