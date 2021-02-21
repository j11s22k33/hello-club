import { ClubInfoResponse } from "@/modules/clubs/requests";

const clubHome: ClubInfoResponse = {
  RESULT_CODE: 200,
  RESULT_MESSAGE: "",
  ID: "1",
  NAME: "운산성결교회 전용채널",
  CH_NUM: 100,
  SOURCE_ID: 1000,
  JOIN: {
    IS_JOIN: "N",
    JOIN_TYPE: 200,
    PRIVACY_MESSAGE: "개인 정보 동의 문구",
    CERT_TELL: "인증 문의 전화 번호",
    BG_IMG: "클럽 소개 이미지",
    BG_TEX: "클럽 소개 문구",
  },
  MENU: [
    {
      IDX: 0,
      TYPE: 100,
      TITLE: "실시간 예배",
    },
    {
      IDX: 1,
      TYPE: 200,
      TITLE: "공지사항",
    },
    {
      IDX: 2,
      TYPE: 300,
      TITLE: "예배와 찬양",
    },
  ],
  NOTICE: {
    ID: "1",
    TITLE: "공지 사항 타이틀",
    DATE: "2021-02-21",
    TYPE: 100,
    LIST: [{ TEXT: "공지사항 내용입니다.", IMG: "" }],
  },
  LIVE: {
    IS_LIVE: "N",
    PLAY_URL: "유튜브 재생 링크",
  },
  PROMOTION: {
    TOTAL: 2,
    LIST: [
      { TYPE: 100, URL: "", FREQ: "", PNUM: "" },
      { TYPE: 100, URL: "", FREQ: "", PNUM: "" },
    ],
  },
};

export default clubHome;
