import API from "@/config/axios";
import { DefaultRequest } from "../DefaultRequest";
import { DefaultResponse } from "../DefaultResponse";

interface JoinRequest extends DefaultRequest {
  CLUB_ID: string;
}

interface AuthRequest extends DefaultRequest {
  AUTH_ID: string;
  CLUB_ID: string;
}

interface WithDrawRequest extends DefaultRequest {
  CLUB_ID: string;
}

export const join = async (params: JoinRequest): Promise<DefaultResponse> => {
  const res = await API.post("/v1/club/account/join", { params });
  return res.data;
};

export const auth = async (params: AuthRequest): Promise<DefaultResponse> => {
  const res = await API.post("/v1/club/account/auth", { params });
  return res.data;
};

export const withdraw = async (
  params: WithDrawRequest
): Promise<DefaultResponse> => {
  const res = await API.get("/uipf/v1/club/account/withdraw", { params });
  return res.data;
};
