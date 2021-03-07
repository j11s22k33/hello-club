import ContentItem from "@/components/ContentItem";
import {
  getContentCategoryList,
  getContentList,
} from "@/modules/contents/requests";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

type UI_MODE =
  | "UI_DEFAULT_BROWSING"
  | "UI_CONTENTS_BROWSING"
  | "UI_SCROLL_BROWSING";

const pageName = "[콘텐츠 리스트]";

const Contents = ({ updateUI }) => {
  const router = useRouter();
  // const [uiMode, updateUIMode] = useStateCallbackWrapper("UI_DEFAULT_BROWSING");
  // const itemFocus = useRef(0);
  const activePageingMode = useRef(false);
  const currentPage = useRef(0);
  const currentTab = useRef(0);
  const totalPage = useRef(1);
  const size = 8;

  const elTab = useRef();
  const data = useRef({
    cateList: {
      total: 0,
      data: [],
    },
    contents: {
      total: 0,
      data: [],
    },
    contentsCols: 4,
  });

  function pageBack() {
    router.back();
  }

  const tabNavi = {
    id: "tab-navi",
    options: {
      cols: 1,
      start: true,
    },
    direction: {
      down(section: any) {
        Navigation.go(itemNavi.id, undefined, false);
      },
    },
    keydown(section, event) {
      if (event.key === "ArrowLeft") {
        if (currentTab.current === 0) return;
        currentTab.current =
          (currentTab.current - 1) % data.current.cateList.total;
        updateList(() => {
          Navigation.addSection(pageName, [itemNavi]);
        });
      } else if (event.key === "ArrowRight") {
        if (currentTab.current === data.current.cateList.total - 1) return;
        currentTab.current =
          (currentTab.current + 1) % data.current.cateList.total;
        updateList(() => {
          Navigation.addSection(pageName, [itemNavi]);
        });
      }
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
      cols: data.current.contentsCols,
    },
    direction: {
      left(section: any) {
        Navigation.go(scrollNavi.id, undefined, false);
      },
      up(section: any) {
        if (currentPage.current === 0) {
          Navigation.go(tabNavi.id, undefined, true);
        } else {
          currentPage.current = (currentPage.current - 1) % totalPage.current;
          updateList(() => {
            Navigation.addSection(pageName, [itemNavi]);
            Navigation.go(itemNavi.id, { x: 0, y: 0 }, false);
          });
        }
      },
      down(section: any) {
        currentPage.current = (currentPage.current + 1) % totalPage.current;
        updateList(() => {
          Navigation.addSection(pageName, [itemNavi]);
          Navigation.go(itemNavi.id, { x: 0, y: 0 }, false);
        });
      },
    },
    focus(section: any) {
      const itemIndex =
        data.current.contentsCols * section.axis.y + section.axis.x;
      if (totalPage.current > 1) {
        if (currentPage.current === 0) {
          activePageingMode.current = itemIndex > 3;
        }
      } else {
        activePageingMode.current = false;
      }
      updateUI({});
    },
    enter() {
      alert("VOD OR YOUTUBE 재생");
    },
    back() {
      pageBack();
    },
  };

  const scrollNavi = {
    id: "scroll-navi",
    options: {
      cols: 1,
    },
    direction: {
      up(section: any) {},
      down(section: any) {},
      right(section: any) {
        document.getElementById("temp").classList.remove("active");
        Navigation.go(itemNavi.id, undefined, true);
      },
    },
    focus(section: any) {},
    enter() {},
    back() {
      pageBack();
    },
    leave(section) {},
    entry(section) {
      document.getElementById("temp").classList.add("active");
    },
  };

  const updateList = (updateUICallback?: () => void) => {
    getContentList({
      clubId: router.query.id as string,
      cateId: data.current.cateList.data[currentTab.current].cateId,
      order: "string",
      offset: currentPage.current * size,
      limit: size + 4,
    }).then((resp) => {
      data.current.contents = resp;
      totalPage.current = Math.ceil(resp.total / size);
      updateUI({
        useLayoutEffect: () => {
          updateUICallback && updateUICallback();
        },
      });
    });
  };

  useEffect(() => {
    console.log(`${pageName} mount`);

    getContentCategoryList({
      clubId: router.query.id as string,
      offset: 0,
      limit: 100,
    }).then((resp) => {
      data.current.cateList = resp;
      updateList(() => {
        Navigation.addSection(pageName, [itemNavi, scrollNavi]);
      });
      updateUI({
        useLayoutEffect: () => {
          tabNavi.options.cols = data.current.cateList.data.length;
          Navigation.set({
            id: pageName,
            sections: [tabNavi, itemNavi, scrollNavi],
          });
        },
      });
    });

    return () => {
      console.log(`${pageName} unmount`);
    };
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

          {
            /* <!-- key-guide : start --> */
            activePageingMode.current && (
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
            )
            /* <!-- key-guide : end --> */
          }
        </div>
        {/* <!-- contents-utill : end --> */}

        {
          /* <!-- tab : start --> */
          !activePageingMode.current && (
            <nav className="tabs-wrap">
              <ul className="nav-tabs" id="tab-navi" ref={elTab}>
                {data.current.cateList.data.map((item) => (
                  <li key={item.cateId} className="tab-item">
                    <span>{item.cateName}</span>
                  </li>
                ))}
              </ul>
            </nav>
          )
          /* <!-- tab : end --> */
        }

        {
          /* <!-- contents-list : start --><!-- active 클래스로 리스트 스케일과 스크롤 포커스를 제어합니다. --> */
          <div
            id="temp"
            className={"contents-list " + (activePageingMode.current ? "" : "")}
          >
            {data.current.contents.data.length === 0 && (
              <div className="empty-contents">
                <p>
                  등록된 <em>콘텐츠</em>가 없습니다.
                </p>
              </div>
            )}

            {/* <!-- list : start --> */}
            <ul id="item-navi">
              {data.current.contents.data.map((content, index) => (
                <ContentItem
                  key={content.id}
                  content={content}
                  naviIgnore={index > 7}
                />
              ))}
            </ul>
            {/* <!-- list : end --> */}
            {
              /* <!-- scroll : start --> */
              activePageingMode.current && (
                <div className="scroll" id={scrollNavi.id}>
                  {Array(totalPage.current)
                    .fill(undefined)
                    .map((_, index) => {
                      return (
                        <span
                          className={currentPage.current === index ? "" : ""}
                          key={index}
                        >
                          <i>{index + 1}</i>
                        </span>
                      );
                    })}
                </div>
              )
            }
          </div>
          /* <!-- contents-list : end --> */
        }
      </div>
    </div>
  );
};

export default Contents;
