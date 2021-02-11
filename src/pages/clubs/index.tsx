import ClubItem from "@/components/ClubItem";
import clubs from "@/dummy/clubs";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Clubs = () => {
  const router = useRouter();

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
    back() {},
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
      router.push(`/clubs/${section.focusItem.dataset.id}/contents`);
    },
    back() {},
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
        <div className="entry_route">
          <span className="i_home">홈</span>
          <span>헬로클럽</span>
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
          <ul id="item-navi">
            {clubs.map((club) => (
              <ClubItem key={club.id} club={club} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
