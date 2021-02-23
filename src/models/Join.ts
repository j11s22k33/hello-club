// 즉시 가입 : 100
// 인증 가입 : 200
type JoinType = "100" | "200";
// 가입된 클럽 : Y
// 미가입된 클럽 : N
type JoinStatus = "Y" | "N";

interface Join {
  isJoin: JoinStatus;
  joinType: JoinType;
  privacyMessage: string;
  certTell: string;
  introImg: string;
  introText: string;
}

export default Join;
