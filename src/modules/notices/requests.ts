import API from "@/config/axios";
import Notice from "@/models/Notice";
import { DefaultRequest } from "../DefaultRequest";
import { DefaultResponse } from "../DefaultResponse";

export interface NoticeListRequest extends DefaultRequest {
  clubId: string;
  offset: number;
  limit: number;
}

export interface NoticeListResponse extends DefaultResponse {
  total: number;
  data: Array<Notice>;
}

export const getAllNoticeList = async (
  params: NoticeListRequest
): Promise<NoticeListResponse> => {
  const res = await API.get("/v1/club/notice/list", { params });
  return res.data;
};
