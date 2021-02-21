import ClubItem from "@/components/ClubItem";
import clubs from "@/dummy/clubs";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const logPrefix = "[클럽 목록] ";

const Clubs = () => {
  const router = useRouter();

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
    Navigation.set({
      id: "clubs",
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
            {["전체클럽", "지역별클럽", "가입한클럽"].map((tab) => (
              <li key={tab} className="tab-item">
                <span>{tab}</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="contents-list type-club">
          {/* 등록된 콘텐츠가 없습니다 */}
          {/* <div className="empty-contents">
            <p>
              가입한 <em>클럽</em>이 없습니다.
            </p>
          </div> */}
          <ul id="item-navi">
            {clubs.map((club) => (
              <ClubItem key={club.ID} club={club} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
