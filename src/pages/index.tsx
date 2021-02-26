import PopupAgree1 from "@/components/PopupAgree1";
import PopupAlert from "@/components/PopupAlert";
import PopupJoin from "@/components/PopupJoin";
import PopupPassword from "@/components/PopupPassword";
import notices from "@/dummy/notices";
import { MenuType } from "@/models/Menu";
import Notice from "@/models/Notice";
import { ClubInfoResponse, getClubInfo } from "@/modules/clubs/requests";
import { withdraw } from "@/modules/users/requests";
import { createNoticePopup } from "@/utils/common";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const logPrefix = "[개별 클럽 홈] ";

const Index = ({ updateUI }) => {
  const router = useRouter();
  const club = useRef<ClubInfoResponse>();
  const [selectedNotice, setSelectedNotice] = useState<Notice>();
  const [withdrawPopup, setWithdrawPopup] = useState(false);
  const [withdrawAcceptPopup, setWithdrawAcceptPopup] = useState(false);
  const [passwordPopup, setPasswordPopup] = useState(false);
  const [joinPopup, setJoinPopup] = useState(false);
  const [agreePopup1, setAgreePopup1] = useState(false);
  const [agreePopup2, setAgreePopup2] = useState(false);

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
      if (club.current.join.isJoin === "Y") {
        setWithdrawPopup(true);
      } else {
        if (club.current.join.joinType === "100") {
          setJoinPopup(true);
        } else {
          setPasswordPopup(true);
        }
      }
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
      const menyType = section.focusItem.dataset.menuType as MenuType;
      if (menyType === "LIVE") {
        console.log("%o라이브 이동", logPrefix);
        alert("YOUTUBE LIVE 방송");
      } else if (menyType === "NOTICE") {
        console.log("%o공지사항 목록 이동", logPrefix);
        router.push("/notices");
      } else if (menyType === "CONT") {
        console.log("%o콘텐츠 목록 이동", logPrefix);
        router.push(`/clubs/1/contents`);
      } else {
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
      club.current = data;
      updateUI({
        useEffect: () => {
          Navigation.set({
            id: "home",
            sections: [bannerNavi, joinNavi, menuNavi, noticeNavi],
          });
        },
      });
    })();
  }, []);

  if (!club.current) {
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
            {club.current.clubName} <em>{club.current.chnlNo}번</em>
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
            <div
              className="banner"
              style={{ backgroundImage: `url(${club.current.join.introImg})` }}
            >
              <p className="text">{club.current.join.introText}</p>
              <div id={joinNavi.id}>
                <button type="button">
                  <span>
                    {club.current.join.isJoin == "Y" ? "탈퇴하기" : "가입하기"}
                  </span>
                </button>
              </div>
            </div>
            <nav>
              <ul id={menuNavi.id}>
                {club.current.menuList.map((menu) => {
                  if (menu.type === "LIVE") {
                    return (
                      <li data-menu-type={menu.type}>
                        <p className="ic-live">
                          실시간 예배
                          <span className="sticker">
                            {club.current.live.isLive === "Y"
                              ? "방송중"
                              : "방송전"}
                          </span>
                        </p>
                      </li>
                    );
                  } else if (menu.type === "NOTICE") {
                    return (
                      <li data-menu-type={menu.type}>
                        <p className="ic-notice">공지사항</p>
                      </li>
                    );
                  } else if (menu.type === "CONT") {
                    return (
                      <li data-menu-type={menu.type}>
                        <p className="ic-vod">예배와 찬양</p>
                      </li>
                    );
                  }
                })}
                <li>
                  <p className="ic-all">전체클럽 가기</p>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {club.current.notice && (
          <div className="main-footer">
            <div className="notice">
              <p>{club.current.notice.title}</p>
            </div>
            <div id={noticeNavi.id}>
              <button type="button">
                <span>상세보기</span>
              </button>
            </div>
          </div>
        )}
        {passwordPopup && (
          <PopupPassword
            navigation={Navigation}
            updateUI={updateUI}
            ok={async () => {
              try {
                setPasswordPopup(false);
                setJoinPopup(true);
              } catch (e) {
                alert(e);
              }
            }}
            cancel={() => {
              setPasswordPopup(false);
            }}
          />
        )}
        {joinPopup && (
          <PopupJoin
            navigation={Navigation}
            ok={() => {
              setJoinPopup(false);
              setAgreePopup1(true);
            }}
            cancel={() => {
              setJoinPopup(false);
            }}
          />
        )}
        {agreePopup1 && (
          <PopupAgree1
            navigation={Navigation}
            ok={() => {
              setAgreePopup1(false);
            }}
            cancel={() => {
              setAgreePopup1(false);
            }}
          />
        )}
        {agreePopup2 && (
          <PopupAgree1
            navigation={Navigation}
            ok={() => {
              setAgreePopup2(false);
            }}
            cancel={() => {
              setAgreePopup2(false);
            }}
          />
        )}
        {withdrawPopup && (
          <PopupAlert
            navigation={Navigation}
            title={"탈퇴 확인"}
            message={
              <>
                탈퇴 시, 해당 클럽 서비스를
                <br />
                더 이상 이용하실 수 없습니다.
                <br />
                탈퇴 하시겠습니까?"
              </>
            }
            ok={async () => {
              try {
                await withdraw({ clubId: "" });
                setWithdrawPopup(false);
                setWithdrawAcceptPopup(true);
              } catch (e) {
                alert(e);
              }
            }}
            cancel={() => {
              setWithdrawPopup(false);
            }}
          />
        )}
        {withdrawAcceptPopup && (
          <PopupAlert
            navigation={Navigation}
            title={"탈퇴 완료"}
            message={<>탈퇴 되었습니다</>}
            ok={() => {
              club.current.join.isJoin = "N";
              updateUI({});
              setWithdrawAcceptPopup(false);
            }}
            cancel={() => {
              club.current.join.isJoin = "N";
              updateUI({});
              setWithdrawAcceptPopup(false);
            }}
          />
        )}
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
