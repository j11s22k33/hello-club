// 즉시 가입 : 100
// 인증 가입 : 200
type JoinType = 100 | 200;
// 가입된 클럽 : Y
// 미가입된 클럽 : N
type JoinStatus = "Y" | "N";

interface Join {
  IS_JOIN: JoinStatus;
  JOIN_TYPE: JoinType;
  PRIVACY_MESSAGE: string;
  CERT_TELL: string;
  BG_IMG: string;
  BG_TEX: string;
}

export default Join;
