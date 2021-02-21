import API from "@/config/axios";
import Content from "@/models/Content";
import ContentCategory from "@/models/ContentCategory";
import { DefaultRequest } from "../DefaultRequest";
import { DefaultResponse } from "../DefaultResponse";

export interface ContentListRequest extends DefaultRequest {
  CLUB_ID: string;
  CATE_ID: string;
  ORDER: string;
  OFFSET: string;
  LIMIT: string;
}

export interface ContentListResponse extends DefaultResponse {
  TOTAL: number;
  LIST: Array<Content>;
}

export interface ContentCategoryRequest extends DefaultRequest {
  CLUB_ID: string;
  OFFSET: string;
  LIMIT: string;
}

export interface ContentCategoryResponse extends DefaultResponse {
  TOTAL: number;
  LIST: Array<ContentCategory>;
}

export const getAllClubList = async (
  params: ContentListRequest
): Promise<ContentListResponse> => {
  const res = await API.get("/v1/club/content/list", { params });
  return res.data;
};

export const getContentCategoryList = async (
  params: ContentCategoryRequest
): Promise<ContentCategoryResponse> => {
  const res = await API.get("/v1/club/category/list", { params });
  return res.data;
};
