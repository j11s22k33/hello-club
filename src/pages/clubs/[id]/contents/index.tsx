import ContentItem from "@/components/ContentItem";
import { getContentList, getContentCategoryList } from "@/modules/contents/requests";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

type UI_MODE = "UI_DEFAULT_BROWSING" | "UI_CONTENTS_BROWSING" | "UI_SCROLL_BROWSING";

const Contents = () => {
  /* 
  UI 업데이트 START
  updateUI(cb) -> setUpdateUINum() -> useEffect([updateUINum]) -> cb()
  */
  const __updateUIListener = useRef([])
  const [__updateUINum, __setUpdateUINum] = useState(0)
  useEffect(()=>{
    const size = __updateUIListener.current.length
    for (let x=0; x<size; x++) {
      __updateUIListener.current[x]()
    }
    __updateUIListener.current = []
  }, [__updateUINum])
  function updateUI(cb?:Function) {
    cb && __updateUIListener.current.push(cb)
    __setUpdateUINum(c => c+1)
  }
  /* <!-- UI 업데이트 END */
  
  const router = useRouter();
  const data = useRef({
    cateListFocusIdx: 0,
    cateList: {
      TOTAL: 1,
      LIST: [{CATE_ID:"", NAME:"전체"}]
    },
    contents: {
      TOTAL: 0,
      LIST: []
    }
  })

  const [uiMode, setUiMode] = useState<UI_MODE>("UI_DEFAULT_BROWSING")
 
  function pageBack() {
    router.back();
  }

  const tabNavi = {
    id: "tab-navi",
    options: {
      cols: 4,
      axis: {x:0, y:0},
      start: true
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
      getContentCategoryList({
        CLUB_ID: router.query.id as string,
        OFFSET: 1,
        LIMIT: 100,
      }).then(resp => {
        data.current.cateList = resp
        tabNavi.options.cols = data.current.cateList.LIST.length
        tabNavi.options.axis = {x:0, y:0}
        Navigation.set({
          id: "contents",
          sections: [tabNavi, itemNavi],
        })
      })

      getContentList({
        CLUB_ID: router.query.id as string,
        CATE_ID: "string",
        ORDER: "string",
        OFFSET: 1,
        LIMIT: 100,
      }).then(resp => {
        data.current.contents = resp
        // updateUI()
      })
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
            {
              data.current.cateList.LIST.map(item => (
                <li key={item.CATE_ID} className="tab-item">
                  <span>{item.NAME}</span>
                </li>
              ))
            }
          </ul>
        </nav>
        /* <!-- tab : end --> */}

        {/* <!-- contents-list : start --><!-- active 클래스로 리스트 스케일과 스크롤 포커스를 제어합니다. --> */
        <div className={"contents-list " + (uiMode==="UI_SCROLL_BROWSING" ? "active" : "")}>
          {data.current.contents.LIST.length === 0 && (
            <div className="empty-contents">
              <p>
                등록된 <em>콘텐츠</em>가 없습니다.
              </p>
            </div>
          )}

          {/* <!-- list : start --> */}
          <ul id="item-navi">
            {data.current.contents.LIST.map((content) => (
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
