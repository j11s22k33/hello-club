import ContentItem from "@/components/ContentItem";
import contents from "@/dummy/contents";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Contents = () => {
  const router = useRouter();

  const tabNavi = {
    id: "tab-navi",
    options: {
      cols: 4,
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
      router.back();
    },
  };
  const itemNavi = {
    id: "item-navi",
    options: {
      cols: 4,
    },
    direction: {
      up(section: any) {
        Navigation.go(tabNavi.id, undefined, true);
      },
    },
    focus(section: any) {},
    enter() {},
    back() {
      router.back();
    },
  };

  useEffect(() => {
    Navigation.set({
      id: "contents",
      sections: [tabNavi, itemNavi],
    });
  }, []);

  return (
    <div id="root">
      <div id="navi" className="container">
        <div className="entry_route">
          <span className="i_home">홈</span>
          <span>헬로클럽</span>
          <span>콘텐츠</span>
        </div>
        <nav className="tabs-wrap">
          <ul className="nav-tabs" id="tab-navi">
            {["전체", "예배영상", "교회행사", "찬송가"].map((tab) => (
              <li key={tab} className="tab-item">
                <span>{tab}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="contents-list">
          {contents.length === 0 && (
            <div className="empty-contents">
              <p>
                등록된 <em>콘텐츠</em>가 없습니다.
              </p>
            </div>
          )}
          <ul id="item-navi">
            {contents.map((content) => (
              <ContentItem key={content.id} content={content} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contents;
