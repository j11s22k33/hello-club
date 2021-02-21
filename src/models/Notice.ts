// 텍스트 타입 : 100
//     - LIST의 size는 항상 1이고, ""TEXT""필드에만 값이 존재한다.
// 이미지 타입 : 200
//     - LIST에서 ""IMG""필드에만 값이 존재한다.
// 복합 (텍스트 + 이미지) 타입 : 300
//     - LIST에서 ""TEXT""필드와 ""IMG""필드 모두 값이 존재한다.
export type NoticeType = 100 | 200 | 300;

interface NoticeBody {
  TEXT: string;
  IMG: string;
}

interface Notice {
  ID: string;
  label?: string;
  TITLE: string;
  DATE: string;
  TYPE: NoticeType;
  LIST: Array<NoticeBody>;
}

export default Notice;
