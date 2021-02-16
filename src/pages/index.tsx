import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  const bannerNavi = {
    id: "banner-navi",
    options: {
      cols: 1,
      start: true,
    },
    direction: {
      right(section: any) {
        Navigation.go(menuNavi.id, undefined, false);
      },
    },
    enter(section: any) {},
    focus(section: any) {},
  };

  const joinNavi = {
    id: "join-navi",
    options: {
      cols: 1,
    },
    direction: {
      left(section: any) {
        Navigation.go(bannerNavi.id, undefined, false);
      },
      down(section: any) {
        Navigation.go(menuNavi.id, { x: 0, y: 0 }, false);
      },
    },
    enter(section: any) {},
    focus(section: any) {},
  };

  const menuNavi = {
    id: "menu-navi",
    options: {
      cols: 1,
    },
    direction: {
      left(section: any) {
        Navigation.go(bannerNavi.id, undefined, false);
      },
      up(section: any) {
        Navigation.go(joinNavi.id, undefined, false);
      },
      down(section: any) {
        Navigation.go(noticeNavi.id, undefined, false);
      },
    },
    enter(section: any) {
      if (section.axis.y === 0) {
      } else if (section.axis.y === 1) {
        router.push("/notices");
      } else if (section.axis.y === 2) {
      } else if (section.axis.y === 3) {
        router.push("/clubs");
      }
    },
    focus(section: any) {},
  };

  const noticeNavi = {
    id: "notice-navi",
    options: {
      cols: 1,
    },
    direction: {
      up(section: any) {
        Navigation.go(menuNavi.id, { x: 0, y: 3 }, false);
      },
    },
    enter(section: any) {},
    focus(section: any) {},
  };

  useEffect(() => {
    Navigation.set({
      id: "home",
      sections: [bannerNavi, joinNavi, menuNavi, noticeNavi],
    });
  }, []);

  return (
    <div id="root">
      <div className="container main">
        {/* <div className="full-img">
        <div
          className="img"
          style={{ backgroundImage: "url(/images/club/img-main.png)" }}
        ></div>
        <div className="mask">
          <p className="text">
            이전 또는 종료키를 선택하시면, 이전 화면으로 이동됩니다
          </p>
        </div>
      </div> */}

        <div className="main-header">
          <h2
            className="logo"
            style={{ backgroundImage: "url(/images/temp/logo4.png)" }}
          ></h2>
          <p className="channel">
            운산성결교회 전용채널 <em>100번</em>
          </p>
        </div>
        <div className="main-body">
          <div className="pr-area">
            <ul id={bannerNavi.id}>
              {/* <li>
                <span
                  className="img"
                  style={{
                    backgroundImage: "url(/images/club/img-main-default.png)",
                  }}
                ></span>
                <button type="button">
                  <span>전체화면보기</span>
                </button>
              </li> */}
              <li className="">
                <span className="img"></span>
                <button type="button">
                  <span>전체화면보기</span>
                </button>
              </li>
            </ul>
          </div>
          <div className="lnb">
            <div className="banner">
              <p className="text">
                일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔
              </p>
              <div id={joinNavi.id}>
                <button type="button">
                  <span>가입하기</span>
                </button>
              </div>
            </div>
            <nav>
              <ul id={menuNavi.id}>
                <li>
                  <p className="ic-live">
                    실시간 예배<span className="sticker">방송중</span>
                  </p>
                </li>
                <li>
                  <p className="ic-notice">공지사항</p>
                </li>
                <li>
                  <p className="ic-vod">예배와 찬양</p>
                </li>
                <li>
                  <p className="ic-all">전체클럽 가기</p>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="main-footer">
          <div className="notice">
            <p>
              <em>[공지사항]</em> 1월24일 일요 예배를 (권장훈 목사) 11시에
              시작하오니 라이브방송으로 실시간 예배에 참여해주세요 1월24일 일요
              예배를 (권장훈 목사) 11시에 시작하오니 라이브방송으로 실시간
              예배에 참여해주세요
            </p>
          </div>
          <div id={noticeNavi.id}>
            <button type="button">
              <span>상세보기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
