import API from "@/config/axios";
import Notice from "@/models/Notice";
import { DefaultRequest } from "../DefaultRequest";
import { DefaultResponse } from "../DefaultResponse";

export interface NoticeListRequest extends DefaultRequest {
  CLUB_ID: string;
  OFFSET: string;
  LIMIT: string;
}

export interface NoticeListResponse extends DefaultResponse {
  TOP_NOTICE: Notice;
  NOTICE: Array<Notice>;
}

export const getAllClubList = async (
  params: NoticeListRequest
): Promise<NoticeListResponse> => {
  const res = await API.get("/v1/club/notice/list", { params });
  return res.data;
};
