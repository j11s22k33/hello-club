import notices from "@/dummy/notices";
import Notice from "@/models/Notice";
import { ClubInfoResponse, getClubInfo } from "@/modules/clubs/requests";
import { createNoticePopup } from "@/utils/common";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const logPrefix = "[개별 클럽 홈] ";

const Index = () => {
  const router = useRouter();
  const [selectedNotice, setSelectedNotice] = useState<Notice>();
  const [club, setClub] = useState<ClubInfoResponse>();

  function pageBack() {
    // router.back()
    alert("디폴트 채널로 이동");
  }

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
    enter(section: any) {
      alert("이미지 OR VOD 전체 화면 보기");
    },
    focus(section: any) {},
    back() {
      pageBack();
    },
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
    enter(section: any) {
      alert("가입하기 OR 탈퇴하기 팝업");
    },
    focus(section: any) {},
    back() {
      pageBack();
    },
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
        console.log("%o라이브 이동", logPrefix);
        alert("YOUTUBE LIVE 방송");
      } else if (section.axis.y === 1) {
        console.log("%o공지사항 목록 이동", logPrefix);
        router.push("/notices");
      } else if (section.axis.y === 2) {
        console.log("%o콘텐츠 목록 이동", logPrefix);
        router.push(`/clubs/1/contents`);
      } else if (section.axis.y === 3) {
        console.log("%o클럽 목록 이동", logPrefix);
        router.replace("/clubs");
      }
    },
    focus(section: any) {},
    back() {
      pageBack();
    },
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
    enter(section: any) {
      setSelectedNotice(notices[0]);
    },
    focus(section: any) {},
    back() {
      pageBack();
    },
  };

  useEffect(() => {
    (async () => {
      const data = await getClubInfo({
        CLUB_ID: "",
        SOURCE_ID: "string",
      });
      setClub(data);

      Navigation.set({
        id: "home",
        sections: [bannerNavi, joinNavi, menuNavi, noticeNavi],
      });
    })();
  }, []);

  if (!club) {
    return <div></div>;
  }

  return (
    <div id="root">
      <div className="container main">
        {/* 홍보 영역 전체 화면 보기 */}
        <div className="full-img" style={{ display: "none" }}>
          {/* <div className="img" style="background-image: url(/images/club/img-main-default.png)"></div>
                <div className="failed-load">
                    <p>
                        영상을 불러오지 못했습니다 <br>
                        잠시 후 다시 이용해 주세요
                    </p>
                </div> */}
          <div className="mask">
            <p className="text">
              이전 또는 종료키를 선택하시면, 이전 화면으로 이동됩니다
            </p>
          </div>
        </div>

        <div className="main-header">
          <h2
            className="logo"
            style={{ backgroundImage: "url(/images/temp/logo4.png)" }}
          ></h2>
          <p className="channel">
            {club.NAME} <em>{club.CH_NUM}번</em>
          </p>
        </div>
        <div className="main-body">
          <div className="pr-area">
            <ul id={bannerNavi.id}>
              <li className="focus">
                <span className="img"></span>
                <div className="failed-load">
                  <p>
                    영상을 불러오지 못했습니다 <br />
                    잠시 후 다시 이용해 주세요
                  </p>
                </div>
                <button type="button">
                  <span>전체화면보기</span>
                </button>
              </li>
              <li className="">
                <span
                  className="img"
                  style={{
                    backgroundImage: "url(/images/club/img-main-default.png)",
                  }}
                ></span>
                <div className="failed-load">
                  <p>
                    영상을 불러오지 못했습니다 <br />
                    잠시 후 다시 이용해 주세요
                  </p>
                </div>
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
                    실시간 예배
                    <span className="sticker">
                      {club.LIVE.IS_LIVE === "Y" ? "방송중" : "방송전"}
                    </span>
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
        {createNoticePopup({
          notice: selectedNotice,
          navigation: Navigation,
          hide: () => setSelectedNotice(undefined),
        })}
      </div>
    </div>
  );
};

export default Index;
