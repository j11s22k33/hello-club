// 이미지 : 100
// 영상 : 200
export type PromotionType = "IMG" | "CONT";

interface Promotion {
  type: PromotionType;
  url: string;
}

export default Promotion;
