import ContentItem from "@/components/ContentItem";
import { getContentList, getContentCategoryList } from "@/modules/contents/requests";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStateCallbackWrapper } from "@/utils/common"

type UI_MODE = "UI_DEFAULT_BROWSING" | "UI_CONTENTS_BROWSING" | "UI_SCROLL_BROWSING";

const pageName = "[콘텐츠 리스트]";

const Contents = ({updateUI}) => {
  const router = useRouter();

  const [uiMode, updateUIMode] = useStateCallbackWrapper("UI_DEFAULT_BROWSING")  

  const elTab = useRef()
  const data = useRef({
    cateList: {
      TOTAL: 0,
      LIST: []
    },
    contents: {
      TOTAL: 0,
      LIST: []
    },
    contentsCols: 4
  })

  function pageBack() {
    router.back();
  }

  const tabNavi = {
    id: "tab-navi",
    options: {
      cols: 4,
      start: true
    },
    direction: {
      down(section: any) {
        if(data.current.contents.LIST.length > 0) {
          Navigation.go(itemNavi.id, undefined, true)
        }
      },
    },
    focus(section: any) {
      const d = data.current.cateList.LIST[section.axis.x]
      console.log(`${pageName} tabNavi focus`, d)
      console.log(section.items)

      getContentList({
        CLUB_ID: router.query.id as string,
        CATE_ID: d.CATE_ID,
        ORDER: "string",
        OFFSET: 0,
        LIMIT: 100,
      }).then(resp => {
        data.current.contents = resp
        updateUI({
            useLayoutEffect: () => {
              Navigation.addSection(pageName, [itemNavi])
            }
        })
      })
    },
    enter() {},
    back() {
      pageBack();
    },
  };
  const itemNavi = {
    id: "item-navi",
    options: {
      cols: data.current.contentsCols,
    },
    direction: {
      up(section: any) {
        Navigation.go(tabNavi.id, undefined, true);
      },
    },
    focus(section: any) {
      const didx = data.current.contentsCols * section.axis.y + section.axis.x
      const d = data.current.contents.LIST[didx]
      console.log(`${pageName} itemNavi focus`, d)

      if(didx < data.current.contentsCols) {
        updateUIMode({
          setState: state => { console.log('updateUIMode setState ', state); return "UI_DEFAULT_BROWSING" },
          useLayoutEffect: state => { console.log('updateUIMode useLayoutEffect ', state)},
          useEffect: state => { console.log('updateUIMode useEffect ', state)},
        })
      } else if(didx > 7) {
        // XXX 테스트
        updateUIMode({
          setState: state => { console.log('updateUIMode setState ', state); return "UI_SCROLL_BROWSING" },
          useLayoutEffect: state => { console.log('updateUIMode useLayoutEffect ', state)},
          useEffect: state => { console.log('updateUIMode useEffect ', state)},
        })
      } else {
        updateUIMode({
          setState: state => { console.log('updateUIMode setState ', state); return "UI_CONTENTS_BROWSING" },
          useLayoutEffect: state => { console.log('updateUIMode useLayoutEffect ', state)},
          useEffect: state => { console.log('updateUIMode useEffect ', state)},
        })
      }
    },
    enter() {
      alert("VOD OR YOUTUBE 재생");
    },
    back() {
      pageBack();
    },
  };

  useEffect(() => {
    console.log(`${pageName} mount`)

    getContentCategoryList({
      CLUB_ID: router.query.id as string,
      OFFSET: 1,
      LIMIT: 100,
    }).then(resp => {
      data.current.cateList = resp

      updateUI({
        useLayoutEffect:()=>{
          tabNavi.options.cols = data.current.cateList.LIST.length
          Navigation.set({
            id: pageName,
            sections: [tabNavi, itemNavi],
          })
        }
      })
    })

    return ()=>{
      console.log(`${pageName} unmount`)
    }
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
          <ul className="nav-tabs" id="tab-navi" ref={elTab}>
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
          {
            data.current.contents.LIST.length === 0 &&
            <div className="empty-contents">
              <p>
                등록된 <em>콘텐츠</em>가 없습니다.
              </p>
            </div>
          }

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
