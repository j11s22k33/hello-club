// 100: 라이브 방송
// 200 : 공지 사항
// 300 : 콘텐츠 목록
type MenuType = 100 | 200 | 300;

interface Menu {
  IDX: number;
  TYPE: MenuType;
  TITLE: string;
}

export default Menu;
