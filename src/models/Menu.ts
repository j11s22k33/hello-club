// 100: 라이브 방송
// 200 : 공지 사항
// 300 : 콘텐츠 목록
export type MenuType = "LIVE" | "NOTICE" | "CONT";

interface Menu {
  type: MenuType;
  title: string;
}

export default Menu;
