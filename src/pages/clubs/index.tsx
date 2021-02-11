import ClubItem from "@/components/ClubItem";
import clubs from "@/dummy/clubs";
import Navigation from "@/utils/Navigation";
import { useEffect } from "react";

const Clubs = () => {
  const tabNavi = {
    id: "tab-navi",
    options: {
      cols: 3,
      start: true,
    },
    direction: {
      down(section: any) {
        Navigation.go(clubsNavi.id, undefined, true);
      },
    },
    focus(section: any) {},
    enter() {},
    back() {},
  };
  const clubsNavi = {
    id: "club-navi",
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
    back() {},
  };

  useEffect(() => {
    Navigation.set({
      id: "navi",
      sections: [
        {
          id: "navi",
        },
      ],
    });

    Navigation.createLayer({
      id: "clubs",
      sections: [tabNavi, clubsNavi],
    });
    return () => {
      Navigation.removeLayer("navi");
    };
  }, []);

  return (
    <div id="root">
      <div id="navi" className="container">
        <div className="entry_route">
          <span className="i_home">홈</span>
          <span>헬로클럽</span>
        </div>
        <nav className="tabs-wrap">
          <ul className="nav-tabs" id="tab-navi">
            {["전체클럽", "지역별클럽", "가입한클럽"].map((tab) => (
              <li className="tab-item">
                <span>전체클럽</span>
              </li>
            ))}
          </ul>
        </nav>
        <div className="contents-list type-club">
          <ul id="club-navi">
            {clubs.map((club) => (
              <ClubItem club={club} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
