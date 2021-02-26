import { ReactNode, useEffect } from "react";

interface PopupAlertProps {
  navigation: any;
  title: string;
  message: ReactNode;
  ok: () => void;
  cancel: () => void;
}

const PopupAlert: React.FC<PopupAlertProps> = ({
  navigation,
  title,
  message,
  ok,
  cancel,
}) => {
  // TODO: 버튼 동적으로 처리 필요
  // 알림, 탈퇴 완료, 탈퇴 확인, 가입 완료
  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: 2,
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
          <div className="popup-text-normal">
            <p>{message}</p>
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

export default PopupAlert;
