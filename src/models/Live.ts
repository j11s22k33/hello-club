// 현재 라이브 방송 중 : Y
// 현재 라이브 방송 중이 아님 : N
export type LiveStatus = "Y" | "N";

interface Live {
  isLive: LiveStatus;
  playUrl: string;
}

export default Live;
