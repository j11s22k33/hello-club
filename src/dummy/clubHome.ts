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
  // notice: {
  //   id: 1,
  //   title: "공지제목",
  //   date: "20210222000000",
  //   type: "TXT",
  //   text:
  //     "이번 주 예배 안내입니다<br /><br />우리교회 본당은 450석이므로 주일 예배를 45명씩 4부로 나누어예배를 드릴 예정입니다. 대면 예배에 참여하시기 원하시는 분은아래 예배 안내를 참고해주시기 바랍니다.<br /><br />기저질환을 가지고 계시거나, 평상시 사람을 많이 만나시는 분들은실시간으로 진행되는 영상을 통해 예배를 드려주시기 바라며,코로나가 속히 종식이 되기를 함께 기도해주시기 바랍니다.<br /><br />상암교회 김봉수 목사 * 예배 안내 (실시간 온라인 예배)<br />주일 1부 예배 : 오전 8시 (1~6구역)<br />주일 2부 예배 : 오전 9시 30분 (7~12구역)<br />주일 3부 예배 : 오전 11시 (13~18구역)<br />주일 4부 예배 : 오후 12시 30분 (19~27구역)<br /><br />* 헌금 계좌 안내<br />[십일조, 감사, 주정, 선교헌금]<br />국민 598601-04-137958 (대한예수교장로회 상암교회)<br />[건축헌금]<br />농협 351-0090-3647-43 (상암교회)<br />",
  //   imgUrl: [],
  // },
  notice: {
    id: 1,
    title: "공지제목",
    date: "20210222000000",
    type: "TXTIMG",
    text:
      "이번 주 예배 안내입니다<br /><br />우리교회 본당은 450석이므로 주일 예배를 45명씩 4부로 나누어예배를 드릴 예정입니다. 대면 예배에 참여하시기 원하시는 분은아래 예배 안내를 참고해주시기 바랍니다.<br /><br />",
    imgUrl: [
      "https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJCLU4xlE0SoISCvp9ZPiYCxQjtWZyaYw0fSfunfMOKpkJVI8lZFmJM4HNkq3XLdh-7QI&usqp=CAU",
      "https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE",
    ],
  },
  // notice: {
  //   id: 1,
  //   title: "공지제목",
  //   date: "20210222000000",
  //   type: "IMG",
  //   imgUrl: [
  //     "https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE",
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJCLU4xlE0SoISCvp9ZPiYCxQjtWZyaYw0fSfunfMOKpkJVI8lZFmJM4HNkq3XLdh-7QI&usqp=CAU",
  //     "https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile7.uf.tistory.com%2Fimage%2F24283C3858F778CA2EFABE",
  //   ],
  // },
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
