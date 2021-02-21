// 이미지 : 100
// 영상 : 200
export type PromotionType = 100 | 200;

interface Promotion {
  TYPE: PromotionType;
  URL: string;
  FREQ: string;
  PNUM: string;
}

export default Promotion;
