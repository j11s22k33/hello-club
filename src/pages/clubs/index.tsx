import ClubItem from "@/components/ClubItem";
// import clubs from "@/dummy/clubs";
import { getAllClubList } from "@/modules/clubs/requests";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const logPrefix = "[클럽 목록] ";

type UI_MODE = "UI_DEFAULT_BROWSING" | "UI_CONTENTS_BROWSING" | "UI_SCROLL_BROWSING";

const Clubs = () => {
  const router = useRouter();
  const [clubs, setClubs] = useState([]);
  const [uiMode, setUiMode] = useState<UI_MODE>("UI_DEFAULT_BROWSING")
  const [isTabDep2, setIsTabDep2] = useState<Boolean>(true)

  function pageBack() {
    // router.back()
    alert("브릿지 홈 OR Full홈 으로 이동");
  }

  const tabNavi = {
    id: "tab-navi",
    options: {
      cols: 3,
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
    enter(section: any) {
      // router.push(`/clubs/${section.focusItem.dataset.id}/contents`);
      console.log("%o개별 클럽 홈으로 이동", logPrefix);
      router.replace("/"); // 개별 클럽 홈 이동
    },
    back() {
      pageBack();
    },
  };

  useEffect(() => {
    (async () => {
      const data = await getAllClubList({
        OFFSET: 1,
        LIMIT: 100,
      });
      setClubs(data.LIST);
      Navigation.set({
        id: "clubs",
        sections: [tabNavi, itemNavi],
      });
    })();
  }, []);

  return (
    <div id="root">
      <div className="container">
        
        {/* <!-- contents-utill : start --> */
        <div className="contents-utill">
          <div className="entry-route">
            <span className="home">홈</span>
            <span>헬로클럽</span>
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
        /* <!-- contents-utill : end --> */}

        {/* <!-- tab : start --> */
        uiMode==="UI_DEFAULT_BROWSING" &&
        <nav className={"tabs-wrap " + (isTabDep2 ? "type-depth2" : "")}>
            <ul className="nav-tabs" id="tab-navi">
                <li className="tab-item focus">
                    <span>전체클럽</span>
                    <ul className="depth2" style={{display:(isTabDep2 ? "":"none")}}>
                        <li>전체</li>
                        <li className="select">서울</li>
                        <li>경기</li>
                    </ul>
                </li>
                <li className="tab-item">
                    <span>지역별클럽</span>
                </li>
                <li className="tab-item">
                    <span>가입한클럽</span>
                </li>
            </ul>
        </nav>
        /* <!-- tab : end --> */}

        {/* <!-- contents-list : start --> */
        <div className={"contents-list type-club " + (uiMode==="UI_SCROLL_BROWSING" && "active")}>
          {/* 등록된 콘텐츠가 없습니다 */}
          {/* <div className="empty-contents">
            <p>
              가입한 <em>클럽</em>이 없습니다.
            </p>
          </div> */}

          {/* <!-- list : start --> */
          <ul id={itemNavi.id}>
            {clubs.map((club) => (
              <ClubItem key={club.ID} club={club} />
            ))}
          </ul>
          /* <!-- list : end --> */}
          
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

export default Clubs;
