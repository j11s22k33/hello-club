// 현재 라이브 방송 중 : Y
// 현재 라이브 방송 중이 아님 : N
export type LiveStatus = "Y" | "N";

interface Live {
  IS_LIVE: LiveStatus;
  PLAY_URL: string;
}

export default Live;
