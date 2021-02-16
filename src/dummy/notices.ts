import Notice from "@/models/Notice";

const notices: Array<Notice> = [
  {
    id: 1,
    label: "[예배안내]",
    title:
      "운산 성결교회 예배 시간 안내 드립니다. 운산 성결교회 예배 시간 안내 드립니다. 운산 성결교회 예배 시간 안내 드립니다.",
    date: "2021.01.01",
    type: "TEXT",
  },
  {
    id: 2,
    label: "[안내]",
    title: "운산 성결교회 예배 시간 안내 드립니다.",
    date: "2021.01.01",
    type: "IMAGE",
  },
  {
    id: 3,
    label: undefined,
    title: "운산 성결교회 예배 시간 안내 드립니다.",
    date: "2021.01.01",
    type: "TEXT_IMAGE",
  },
];

export default notices;
