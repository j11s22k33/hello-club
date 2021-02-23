import { ClubInfoResponse } from "@/modules/clubs/requests";

const clubHome: ClubInfoResponse = {
  clubId: "111",
  clubName: "club",
  chnlNo: 123,
  sourceId: 123,
  join: {
    isJoin: "N",
    joinType: "100",
    privacyMessage: "msg",
    certTell: "010",
    introImg: "http://imgurl",
    introText: "text",
  },
  menuList: [
    {
      type: "LIVE",
      title: "라이브방송",
    },
    {
      type: "NOTICE",
      title: "공지사항",
    },
    {
      type: "CONT",
      title: "콘텐츠목록",
    },
  ],
  notice: {
    id: 1,
    title: "공지제목",
    date: "20210222000000",
    type: "TXTIMG",
    text: "내용",
    imgUrl: "http://imgurl",
  },
  live: {
    isLive: "N",
    playUrl: "http://youtu.be/aaa",
  },
  promotion: {
    total: 1,
    data: [
      {
        type: "IMG",
        url: "http://imgurl",
      },
    ],
  },
};

export default clubHome;
