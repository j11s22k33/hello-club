import API from "@/config/axios";
import Notice from "@/models/Notice";
import NoticeCategory from "@/models/NoticeCategory";
import { DefaultRequest } from "../DefaultRequest";
import { DefaultResponse } from "../DefaultResponse";

export interface NoticeListRequest extends DefaultRequest {
  clubId: string;
  cateId?: string;
  offset?: number;
  limit?: number;
}

export interface NoticeCategoryListRequest extends DefaultRequest {
  clubId: string;
  offset?: number;
  limit?: number;
}

export interface NoticeListResponse extends DefaultResponse {
  total: number;
  topNotice: Notice;
  data: Array<Notice>;
}

export interface NoticeCategoryListResponse extends DefaultResponse {
  total: number;
  data: Array<NoticeCategory>;
}

export const getAllNoticeList = async (
  params: NoticeListRequest
): Promise<NoticeListResponse> => {
  const res = await API.get("/clubpf/svc/notice/list", { params });
  return res.data;
};

export const getNoticeCategoryList = async (
  params: NoticeCategoryListRequest
): Promise<NoticeCategoryListResponse> => {
  const res = await API.get("/clubpf/svc/notice/cateList");
  return res.data;
};
