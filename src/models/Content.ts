// “ASSET”: 동영상
// “YOUTUBE”: 유튜브
type ContentType = "ASSET" | "YOUTUBE";

interface Content {
  id: number;
  title: string;
  contentsType: ContentType;
  duration?: number;
  date: string;
  imgUrl: string;
  playUrl?: string;
  asset?: string;
}

export default Content;
