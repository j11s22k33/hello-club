import Navigation from "@/utils/Navigation";
import { useEffect } from "react";

// “100”: 최신순(기본값)
// “200”: 가나다 순
type SortType = "100" | "200";

interface PopupSortProps {
  ok: (SortType: SortType) => void;
  cancel: () => void;
}

const PopupSort: React.FC<PopupSortProps> = ({ ok, cancel }) => {
  let btnNavi = {
    id: "btn-navi",
    options: {
      cols: 1,
      start: true,
    },
    direction: {},
    enter(section) {
      ok("100");
    },
    back() {
      cancel();
    },
    leave(section) {},
    entry(section) {},
  };

  useEffect(() => {
    Navigation.createLayer({
      id: "popup-sort",
      sections: [btnNavi],
    });
    return () => {
      Navigation.removeLayer("popup-sort");
    };
  }, []);

  return (
    <div className="popup">
      <div className="popup-content small">
        <div className="popup-header">
          <h5 className="popup-title">정렬변경</h5>
        </div>
        <div className="popup-body">
          <h5 className="sub-title">콘텐츠 정렬 순서를 선택하세요</h5>
          <div className="popup-box alt">
            <ul className="align-select">
              <li>
                <p>
                  <span>최근 등록순</span>
                  <i></i>
                </p>
              </li>
              <li className="focus">
                <p>
                  <span>과거 등록순</span>
                  <i></i>
                </p>
              </li>
              <li>
                <p>
                  <span>가나다순</span>
                  <i></i>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="popup-footer no-line">
          <div className="button-area">
            <button type="button" className="button focus">
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

export default PopupSort;
