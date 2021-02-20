import API from "@/config/axios";
import Club from "@/models/Club";

export interface AllClubListRequestParams {
  SID: String;
  LOCAL: string;
  SOID: string;
  MODEL: string;
  MAC: string;
  OFFSET: string;
  LIMIT: string;
}

export interface AllClubListResponse {
  RESULT_CODE: number;
  RESULT_MESSAGE: string;
  TOTAL: number;
  LIST: Array<Club>;
}

export const getAllClubList = async (
  params: AllClubListRequestParams
): Promise<AllClubListResponse> => {
  const res = await API.get("/v1/club/list/all", { params });
  return res.data;
};
