import PopupAgree from "@/components/PopupAgree";
import PopupAlert from "@/components/PopupAlert";
import PopupPassword from "@/components/PopupPassword";
import { MenuType } from "@/models/Menu";
import Notice from "@/models/Notice";
import { ClubInfoResponse, getClubInfo } from "@/modules/clubs/requests";
import {
  AgreeResponse,
  getAgree,
  join,
  withdraw,
} from "@/modules/users/requests";
import { createNoticePopup } from "@/utils/common";
import Navigation from "@/utils/Navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const logPrefix = "[개별 클럽 홈] ";

type PopupType =
  | "PASSWORD"
  | "WITHDRAW"
  | "WITHDRAW_ACCEPT"
  | "AGREE1"
  | "AGREE2"
  | "SUCCESS_JOIN"
  | "NO_LIVE";

const Index = ({ updateUI }) => {
  const router = useRouter();
  const club = useRef<ClubInfoResponse>();
  const agree = useRef<AgreeResponse>();
  const [selectedNotice, setSelectedNotice] = useState<Notice>();
  const [popup, setPopup] = useState<PopupType>();
  const isFull = useRef(false);
  const promotionPos = useRef(0);
  const isVODLoaded = useRef(true);

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
    keydown(section, event) {
      if (isFull.current) {
        if (event.key === "Backspace" || event.key === "Enter") {
          isFull.current = false;
          updateUI({});
          return true;
        }
      } else {
        if (event.key === "ArrowDown") {
          return true;
        } else if (event.key === "ArrowRight") {
          Navigation.go(menuNavi.id, undefined, false);
          return true;
        } else if (event.key === "Enter") {
          isFull.current = true;
          updateUI({});
          return true;
        }
      }
    },
    focus(section: any) {},
    back() {
      pageBack();
    },
  };

  const showJoinPopup = () => {
    if (club.current.join.joinType === "100") {
      setPopup("AGREE1");
    } else {
      setPopup("PASSWORD");
    }
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
        setPopup("WITHDRAW");
      } else {
        showJoinPopup();
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
      if (club.current.join.isJoin === "N") {
        showJoinPopup();
        return;
      }
      const menyType = section.focusItem.dataset.menuType as MenuType;
      if (menyType === "LIVE") {
        if (club.current.live.isLive === "Y") {
          console.log("%o라이브 이동", logPrefix);
          alert("YOUTUBE LIVE 방송");
        } else {
          setPopup("NO_LIVE");
        }
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
      setSelectedNotice(club.current.notice);
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

      agree.current = await getAgree({
        CLUB_ID: ""
      });
      
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

  useEffect(() => {
    const id = setInterval(() => {
      promotionPos.current =
        (promotionPos.current + 1) % club.current.promotion.data.length;
      updateUI({});
    }, 5000);
    return () => clearInterval(id);
  }, [promotionPos]);

  if (!club.current) {
    return <div></div>;
  }

  return (
    <div id="root">
      <div className="container main">
        {/* 홍보 영역 전체 화면 보기 */}
        <div
          className="full-img"
          style={{ display: isFull.current ? "" : "none" }}
        >
          <div
            className="img"
            style={{
              backgroundImage: `url(${
                club.current.promotion.data[promotionPos.current].url
              })`,
            }}
          ></div>
          {!isVODLoaded && (
            <div className="failed-load">
              <p>
                영상을 불러오지 못했습니다 <br />
                잠시 후 다시 이용해 주세요
              </p>
            </div>
          )}
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
                <span
                  className="img"
                  style={{
                    backgroundImage: `url(${
                      club.current.promotion.data[promotionPos.current].url
                    })`,
                  }}
                ></span>
                {!isVODLoaded.current && (
                  <div className="failed-load">
                    <p>
                      영상을 불러오지 못했습니다 <br />
                      잠시 후 다시 이용해 주세요
                    </p>
                  </div>
                )}
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
                {club.current.menuList.map((menu, i) => {
                  if (menu.type === "LIVE") {
                    return (
                      <li data-menu-type={menu.type} key={i}>
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
                      <li data-menu-type={menu.type} key={i}>
                        <p className="ic-notice">공지사항</p>
                      </li>
                    );
                  } else if (menu.type === "CONT") {
                    return (
                      <li data-menu-type={menu.type} key={i}>
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
        {popup === "PASSWORD" && (
          <PopupPassword
            navigation={Navigation}
            updateUI={updateUI}
            ok={() => {
              setPopup("AGREE1");
            }}
            cancel={() => {
              setPopup(undefined);
            }}
          />
        )}
        {popup === "AGREE1" && (
          <PopupAgree
            title={"개인정보 수집"}
            body={agree.current.C0101}
            navigation={Navigation}
            updateUI={updateUI}
            ok={() => {
              setPopup("AGREE2");
            }}
            cancel={() => {
              setPopup(undefined);
            }}
          />
        )}
        {popup === "AGREE2" && (
          <PopupAgree
            title={"제 3자 제공 동의 내역"}
            body={agree.current.C0102}
            navigation={Navigation}
            updateUI={updateUI}
            ok={async () => {
              try {
                const res = await join({ clubId: "" });
                if (res.result === "0000") {
                  setPopup("SUCCESS_JOIN");
                } else {
                  alert(res.result);
                }
              } catch (e) {
                alert(e);
              }
            }}
            cancel={() => {
              setPopup(undefined);
            }}
          />
        )}
        {popup === "SUCCESS_JOIN" && (
          <PopupAlert
            navigation={Navigation}
            title={"가입 완료"}
            message={
              <>
                <p className="accent">
                  <em>{club.current.clubName} 클럽</em>
                </p>
                <p>가입이 완료 되었습니다</p>
              </>
            }
            type="ALERT"
            ok={() => {
              club.current.join.isJoin = "Y";
              updateUI({});
              setPopup(undefined);
            }}
          />
        )}
        {popup === "WITHDRAW" && (
          <PopupAlert
            navigation={Navigation}
            title={"탈퇴 확인"}
            type="CONFIRM"
            message={
              <p>
                탈퇴 시, 해당 클럽 서비스를
                <br />
                더 이상 이용하실 수 없습니다.
                <br />
                탈퇴 하시겠습니까?"
              </p>
            }
            ok={async () => {
              try {
                const res = await withdraw({ clubId: "" });
                if (res.result === "0000") {
                  setPopup("WITHDRAW_ACCEPT");
                } else {
                  alert(res.result);
                }
              } catch (e) {
                alert(e);
              }
            }}
            cancel={() => {
              setPopup(undefined);
            }}
          />
        )}
        {popup === "WITHDRAW_ACCEPT" && (
          <PopupAlert
            navigation={Navigation}
            title={"탈퇴 완료"}
            message={<>탈퇴 되었습니다</>}
            type="ALERT"
            ok={() => {
              club.current.join.isJoin = "N";
              updateUI({});
              setPopup(undefined);
            }}
            cancel={() => {
              club.current.join.isJoin = "N";
              updateUI({});
              setPopup(undefined);
            }}
          />
        )}
        {popup === "NO_LIVE" && (
          <PopupAlert
            navigation={Navigation}
            title={"알림"}
            message={<>현재 방송중이 아닙니다.</>}
            type="ALERT"
            ok={() => {
              setPopup(undefined);
            }}
          />
        )}
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

export default Index;
