import ContentItem from "@/components/ContentItem";
import { getContentList } from "@/modules/contents/requests";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

type UI_MODE = "UI_DEFAULT_BROWSING" | "UI_CONTENTS_BROWSING" | "UI_SCROLL_BROWSING";

const Contents = () => {
  const router = useRouter();
  const [contents, setContents] = useState([]);
  const [uiMode, setUiMode] = useState<UI_MODE>("UI_DEFAULT_BROWSING")
 
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

      {/* <!-- contents-utill : start --> */}
        <div className="contents-utill">
          <div className="entry-route">
            <span className="home">홈</span>
            <span>헬로클럽</span>
            <span>콘텐츠</span>
          </div>
          
          {/* <!-- key-guide : start --> */
          uiMode==="UI_CONTENTS_BROWSING" &&
          <div className="key-guide">
            <span className="align-type"><i className="green"></i>정렬 (최신순)</span>
            <div className="fast-move">    
                <button type="button" className="prev"></button>
                <span>페이지 이동</span>
                <button type="button" className="next"></button>
            </div>
          </div>
          /* <!-- key-guide : end --> */}

        </div>
        {/* <!-- contents-utill : end --> */}

        {/* <!-- tab : start --> */
        uiMode==="UI_DEFAULT_BROWSING" &&
        <nav className="tabs-wrap">
          <ul className="nav-tabs" id="tab-navi">
            {["전체", "예배영상", "교회행사", "찬송가"].map((tab) => (
              <li key={tab} className="tab-item">
                <span>{tab}</span>
              </li>
            ))}
          </ul>
        </nav>
        /* <!-- tab : end --> */}

        {/* <!-- contents-list : start --><!-- active 클래스로 리스트 스케일과 스크롤 포커스를 제어합니다. --> */
        <div className={"contents-list " + (uiMode==="UI_SCROLL_BROWSING" ? "active" : "")}>
          {contents.length === 0 && (
            <div className="empty-contents">
              <p>
                등록된 <em>콘텐츠</em>가 없습니다.
              </p>
            </div>
          )}

          {/* <!-- list : start --> */}
          <ul id="item-navi">
            {contents.map((content) => (
              <ContentItem key={content.ID} content={content} />
            ))}
          </ul>
          {/* <!-- list : end --> */}

          {/* <!-- scroll : start --> */
          uiMode!=="UI_DEFAULT_BROWSING" &&
          <div className="scroll">
              <span className="focus"><i>1</i></span>
              <span className=""><i>2</i></span>
              <span className=""><i>3</i></span>
              <span className=""><i>4</i></span>
              <span className=""><i>5</i></span>
          </div>
          /* <!-- scroll : end --> */}

        </div>
        /* <!-- contents-list : end --> */}

      </div>
    </div>
  );
};

export default Contents;
