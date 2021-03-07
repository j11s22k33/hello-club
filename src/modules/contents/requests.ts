import API from "@/config/axios";
import Content from "@/models/Content";
import ContentCategory from "@/models/ContentCategory";
import { DefaultRequest } from "../DefaultRequest";
import { DefaultResponse } from "../DefaultResponse";

export interface ContentListRequest extends DefaultRequest {
  clubId: string;
  cateId: string;
  order: string;
  offset: number;
  limit: number;
}

export interface ContentListResponse extends DefaultResponse {
  total: number;
  data: Array<Content>;
}

export interface ContentCategoryRequest extends DefaultRequest {
  clubId: string;
  offset: number;
  limit: number;
}

export interface ContentCategoryResponse extends DefaultResponse {
  total: number;
  data: Array<ContentCategory>;
}

export const getContentList = async (
  params: ContentListRequest
): Promise<ContentListResponse> => {
  const res = await API.get("/clubpf/svc/contents/list", { params });
  return res.data;
};

export const getContentCategoryList = async (
  params: ContentCategoryRequest
): Promise<ContentCategoryResponse> => {
  const res = await API.get("/clubpf/svc/contents/cateList", { params });
  return res.data;
};
