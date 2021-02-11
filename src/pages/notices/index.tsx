import NoticeItem from "@/components/NoticeItem";
import PopupImage from "@/components/PopupImage";
import PopupText from "@/components/PopupText";
import PopupTextImage from "@/components/PopupTextImage";
import notices from "@/dummy/notices";
import Notice from "@/models/Notice";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Notices = () => {
  const router = useRouter();
  const [selectedNotice, setSelectedNotice] = useState<Notice>();

  const tabNavi = {
    id: "tab-navi",
    options: {
      cols: 2,
      start: true,
    },
    direction: {
      down(section: any) {
        Navigation.go(itemNavi.id, undefined, true);
      },
    },
    focus(section: any) {},
    enter() {},
    back() {},
  };
  const itemNavi = {
    id: "item-navi",
    options: {
      cols: 1,
    },
    direction: {
      up(section: any) {
        Navigation.go(tabNavi.id, undefined, true);
      },
    },
    focus(section: any) {},
    enter(section: any) {
      console.log(section);
      setSelectedNotice(notices[section.axis.y] as Notice);
    },
    back() {},
  };

  useEffect(() => {
    Navigation.set({
      id: "notices",
      sections: [tabNavi, itemNavi],
    });
  }, []);

  return (
    <div id="root">
      <div className="container">
        <div className="entry_route">
          <span className="i_home">홈</span>
          <span>헬로클럽</span>
          <span>공지사항</span>
        </div>
        <nav className="tabs-wrap">
          <ul className="nav-tabs" id="tab-navi">
            {["공지사항", "교회소개"].map((tab) => (
              <li key={tab} className="tab-item">
                <span>{tab}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="board-list">
          {notices.length === 0 && (
            <div className="empty-contents">
              <p>
                등록된 <em>콘텐츠</em>가 없습니다.
              </p>
            </div>
          )}
          <ul id="item-navi">
            {notices.map((notice) => (
              <NoticeItem key={notice.id} notice={notice} />
            ))}
          </ul>
        </div>

        {selectedNotice?.type === "TEXT" && (
          <PopupText
            notice={selectedNotice}
            navigation={Navigation}
            hide={() => setSelectedNotice(undefined)}
          />
        )}
        {selectedNotice?.type === "IMAGE" && (
          <PopupImage
            notice={selectedNotice}
            navigation={Navigation}
            hide={() => setSelectedNotice(undefined)}
          />
        )}
        {selectedNotice?.type === "TEXT_IMAGE" && (
          <PopupTextImage
            notice={selectedNotice}
            navigation={Navigation}
            hide={() => setSelectedNotice(undefined)}
          />
        )}
      </div>
    </div>
  );
};

export default Notices;
