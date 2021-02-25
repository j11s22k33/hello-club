// 100 : asset vod 200 : youtube 실행
type ContentType = 100 | 200;

interface Content {
  ID: number;
  TITLE?: string;
  CONTENT_TYPE?: ContentType;
  DURATION?: number;
  REGI_DATE?: string;
  PLAY_URL?: string;
  FREQ?: string;
  PNUM?: string;
  POSTER_IMG?: string;
}

export default Content;
