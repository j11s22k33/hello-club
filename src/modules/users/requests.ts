import API from "@/config/axios";
import { DefaultRequest } from "../DefaultRequest";
import { DefaultResponse } from "../DefaultResponse";

interface JoinRequest extends DefaultRequest {
  clubId: string;
}

interface AuthRequest extends DefaultRequest {
  clubId: string;
  stbType: string;
  authNo: string;
}

interface WithDrawRequest extends DefaultRequest {
  clubId: string;
}

interface ResultResponse extends DefaultResponse {
  result: string;
}

export const join = async (params: JoinRequest): Promise<ResultResponse> => {
  const res = await API.get("/v1/club/account/join", { params });
  return res.data;
};

export const auth = async (params: AuthRequest): Promise<ResultResponse> => {
  const res = await API.get("/v1/club/account/auth", { params });
  return res.data;
};

export const withdraw = async (
  params: WithDrawRequest
): Promise<ResultResponse> => {
  const res = await API.get("/uipf/v1/club/account/withdraw", { params });
  return res.data;
};
