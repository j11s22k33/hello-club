import ContentItem from "@/components/ContentItem";
import { getContentList } from "@/modules/contents/requests";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const Contents = () => {
  const router = useRouter();
  const [contents, setContents] = useState([]);

  const fetchContents = useCallback(async () => {
    const data = await getContentList({
      CLUB_ID: router.query.id as string,
      CATE_ID: "string",
      ORDER: "string",
      OFFSET: 1,
      LIMIT: 100,
    });
    setContents(data.LIST);
  }, []);

  function pageBack() {
    router.back();
  }

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
      pageBack();
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
    enter() {
      alert("VOD OR YOUTUBE 재생");
    },
    back() {
      pageBack();
    },
  };

  useEffect(() => {
    (async () => {
      const data = await getContentList({
        CLUB_ID: router.query.id as string,
        CATE_ID: "string",
        ORDER: "string",
        OFFSET: 1,
        LIMIT: 100,
      });
      setContents(data.LIST);
      Navigation.set({
        id: "contents",
        sections: [tabNavi, itemNavi],
      });
    })();
  }, []);

  return (
    <div id="root">
      <div id="navi" className="container">
        <div className="contents-utill">
          <div className="entry-route">
            <span className="home">홈</span>
            <span>헬로클럽</span>
            <span>콘텐츠</span>
          </div>
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
              <ContentItem key={content.ID} content={content} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contents;
