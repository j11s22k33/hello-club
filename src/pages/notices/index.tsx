import NoticeItem from "@/components/NoticeItem";
import Notice from "@/models/Notice";
import NoticeCategory from "@/models/NoticeCategory";
import {
  getAllNoticeList,
  getNoticeCategoryList,
  NoticeCategoryListResponse,
  NoticeListResponse,
} from "@/modules/notices/requests";
import { createNoticePopup } from "@/utils/common";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Notices = ({ updateUI }) => {
  const router = useRouter();
  const category = useRef<NoticeCategoryListResponse>();
  const noticeData = useRef<NoticeListResponse>();
  const [selectedNotice, setSelectedNotice] = useState<Notice>();
  const currentPage = useRef(0);
  const currentTab = useRef(0);
  const totalPage = useRef(1);
  const size = 8;

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
        currentTab.current = (currentTab.current + 1) % category.current.total;
        updateNoticeList(category.current.data[currentTab.current]);
      } else if (event.key === "ArrowRight") {
        if (currentTab.current === category.current.total - 1) return;
        currentTab.current = (currentTab.current + 1) % category.current.total;
        updateNoticeList(category.current.data[currentTab.current]);
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
      cols: 1,
    },
    direction: {
      async up(section: any) {
        if (currentPage.current === 0) {
          Navigation.go(tabNavi.id, undefined, true);
        } else {
          currentPage.current = (currentPage.current - 1) % totalPage.current;
          await updateData();
          Navigation.addSection("notices", [itemNavi]);
          Navigation.go(itemNavi.id, { x: 0, y: size }, false);
        }
      },
      async down(section: any) {
        currentPage.current = (currentPage.current + 1) % totalPage.current;
        await updateData();
        Navigation.addSection("notices", [itemNavi]);
        if (currentPage.current === 0) {
          Navigation.go(itemNavi.id, { x: 0, y: 0 }, false);
          Navigation.go(tabNavi.id, undefined, true);
        } else {
          Navigation.go(itemNavi.id, { x: 0, y: 0 }, false);
        }
      },
    },
    keydown(section, event) {
      if (event.key === ",") {
        if (currentPage.current > 0) {
          (async () => {
            currentPage.current = (currentPage.current - 1) % totalPage.current;
            await updateData();
            Navigation.addSection("notices", [itemNavi]);
            Navigation.go(itemNavi.id, { x: 0, y: 0 }, false);
          })();
        }
        return true;
      } else if (event.key === ".") {
        if (currentPage.current < totalPage.current) {
          (async () => {
            currentPage.current = (currentPage.current + 1) % totalPage.current;
            await updateData();
            Navigation.addSection("notices", [itemNavi]);
            Navigation.go(itemNavi.id, { x: 0, y: 0 }, false);
          })();
        }
        return true;
      }
    },
    focus(section: any) {},
    enter(section: any) {
      setSelectedNotice(noticeData.current.data[section.axis.y] as Notice);
    },
    back() {
      pageBack();
    },
  };

  const updateData = async () => {
    const data = await getAllNoticeList({
      clubId: "",
      offset: currentPage.current * size,
      limit: size,
    });
    noticeData.current = data;
    updateUI({});
  };

  useEffect(() => {
    (async () => {
      category.current = await getNoticeCategoryList({ clubId: "" });
      const data = await getAllNoticeList({
        clubId: "",
        cateId: category.current.data[currentTab.current].cateId,
        offset: 0,
        limit: size,
      });
      noticeData.current = data;
      totalPage.current = Math.ceil(data.total / size);
      tabNavi.options.cols = category.current.total;
      updateUI({
        useEffect: () => {
          Navigation.set({
            id: "notices",
            sections: [tabNavi, itemNavi],
          });
        },
      });
    })();
  }, []);

  const updateNoticeList = async (category: NoticeCategory) => {
    noticeData.current = await getAllNoticeList({
      clubId: "",
      cateId: category.cateId,
      offset: 0,
      limit: size,
    });
    totalPage.current = Math.ceil(noticeData.current.total / size);
    updateUI({});
  };

  if (!noticeData.current) {
    return <div></div>;
  }

  return (
    <div id="root">
      <div className="container">
        <div className="contents-utill">
          <div className="entry-route">
            <span className="home">홈</span>
            <span>헬로클럽</span>
            <span>공지사항</span>
          </div>
          <div
            className="key-guide"
            style={{ display: currentPage.current === 0 ? "none" : "" }}
          >
            {/* <span className="align-type">
              <i className="green"></i>정렬 (최신순)
            </span> */}
            <div className="fast-move">
              <button type="button" className="prev"></button>
              <span>페이지 이동</span>
              <button type="button" className="next"></button>
            </div>
          </div>
        </div>
        <nav
          className="tabs-wrap"
          style={{ display: currentPage.current === 0 ? "" : "none" }}
        >
          <ul className="nav-tabs" id="tab-navi">
            {category.current.data.map((category) => (
              <li key={category.cateId} className="tab-item">
                <span>{category.cateName}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="board-list">
          {noticeData.current.data.length === 0 && (
            <div className="empty-contents">
              <p>
                등록된 <em>콘텐츠</em>가 없습니다.
              </p>
            </div>
          )}
          <ul id="item-navi">
            <NoticeItem notice={noticeData.current.topNotice} />
            {noticeData.current.data.map((notice) => (
              <NoticeItem key={notice.id} notice={notice} />
            ))}
          </ul>
          <div
            className="scroll"
            style={{ display: currentPage.current === 0 ? "none" : "" }}
          >
            {Array(totalPage.current)
              .fill(undefined)
              .map((_, index) => {
                return (
                  <span
                    className={currentPage.current === index ? "focus" : ""}
                    key={index}
                  >
                    <i>{index + 1}</i>
                  </span>
                );
              })}
          </div>
        </div>

        {createNoticePopup({
          notice: selectedNotice,
          navigation: Navigation,
          updateUI: updateUI,
          hide: () => setSelectedNotice(undefined),
        })}
      </div>
    </div>
  );
};

export default Notices;
