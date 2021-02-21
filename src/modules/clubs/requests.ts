import API from "@/config/axios";
import Club from "@/models/Club";
import Join from "@/models/Join";
import Live from "@/models/Live";
import Menu from "@/models/Menu";
import Notice from "@/models/Notice";
import Promotion from "@/models/Promotion";
import { DefaultRequest } from "../DefaultRequest";
import { DefaultResponse } from "../DefaultResponse";

export interface ClubListRequest extends DefaultRequest {
  OFFSET: string;
  LIMIT: string;
}

export interface ClubListByFilterRequest extends DefaultRequest {
  FILTER: String;
  OFFSET: string;
  LIMIT: string;
}

export interface ClubListResponse extends DefaultResponse {
  TOTAL: number;
  LIST: Array<Club>;
}

export interface ClubInfoRequest extends DefaultRequest {
  CLUB_ID: string;
  SOURCE_ID: string;
}

export interface ClubInfoResponse extends DefaultResponse {
  ID: string;
  NAME: string;
  CH_NUM: number;
  SOURCE_ID: number;
  JOIN: Join;
  MENU: Menu;
  NOTICE: Notice;
  LIVE: Live;
  PROMOTION: {
    TOTAL: number;
    LIST: Array<Promotion>;
  };
}

export const getAllClubList = async (
  params: ClubListRequest
): Promise<ClubListResponse> => {
  const res = await API.get("/v1/club/list/all", { params });
  return res.data;
};

export const getLocalClubList = async (
  params: ClubListByFilterRequest
): Promise<ClubListResponse> => {
  const res = await API.get("/v1/club/list/local", { params });
  return res.data;
};

export const getMyClubList = async (
  params: ClubListRequest
): Promise<ClubListResponse> => {
  const res = await API.get("/v1/club/list/my", { params });
  return res.data;
};

export const getClubInfo = async (
  params: ClubInfoRequest
): Promise<ClubListResponse> => {
  const res = await API.get("/v1/club/info", { params });
  return res.data;
};
