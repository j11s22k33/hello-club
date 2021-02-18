import NoticeItem from "@/components/NoticeItem";
import PopupImage from "@/components/PopupImage";
import PopupText from "@/components/PopupText";
import PopupTextImage from "@/components/PopupTextImage";
import notices from "@/dummy/notices";
import Notice from "@/models/Notice";
import { createNoticePopup } from "@/utils/common";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Notices = () => {
  const router = useRouter();
  const [selectedNotice, setSelectedNotice] = useState<Notice>();

  function pageBack() {
    router.back()
  }

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
    back() {
      pageBack()
    },
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
    back() {
      pageBack()
    },
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
        <div className="contents-utill">
          <div className="entry-route">
            <span className="home">홈</span>
            <span>헬로클럽</span>
            <span>공지사항</span>
          </div>
          <div className="key-guide">
            <span className="align-type">
              <i className="green"></i>정렬 (최신순)
            </span>
            <div className="fast-move">
              <button type="button" className="prev"></button>
              <span>페이지 이동</span>
              <button type="button" className="next"></button>
            </div>
          </div>
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
        
        {createNoticePopup({notice:selectedNotice, navigation:Navigation, hide:() => setSelectedNotice(undefined)})}
        
      </div>
    </div>
  );
};

export default Notices;
