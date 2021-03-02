import env from "@/config/env";
import clubHome from "@/dummy/clubHome";
import clubs from "@/dummy/clubs";
import contents from "@/dummy/contents";
import contentsCateList from "@/dummy/contentsCateList";
import notices from "@/dummy/notices";
import { NoticeListRequest } from "@/modules/notices/requests";
import Navigation from "@/utils/Navigation";
import axios, { AxiosError } from "axios";
import MockAdapter from "axios-mock-adapter";

const API = axios.create({
  baseURL: env.API,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    Navigation.prevent = true;

    config.params = {
      ...config.params,
      SID: "SID",
      LOCAL: "LOCAL",
      SOID: "SOID",
      MODEL: "MODEL",
      MAC: "MAC",
    };
    console.log(`[axios.intercenptors.request]`, config);
    return config;
  },
  (error) => {
    Navigation.prevent = false;

    console.log(
      "[axios.intercenptors.request.error]",
      error.message,
      error.config
    );
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    Navigation.prevent = false;

    console.log(
      `[axios.intercenptors.response]`,
      response.config,
      response.data
    );
    return response;
  },
  (error: AxiosError) => {
    Navigation.prevent = false;

    console.log(`[axios.intercenptors.response.error]`, error);
    if (error.config) {
      //
    } else if (error.config && error.response) {
      //
    } else {
      //
    }
    return Promise.reject(error);
  }
);

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// https://www.npmjs.com/package/axios-mock-adapter
const mock = new MockAdapter(API, { delayResponse: 300 });
mock.onGet("/v1/club/list/all").reply((config) => {
  const list = clubs.createClubs(random(30, 30), config.params);
  // const list = clubs.createClubs(random(0, 30), config.params)
  return [
    200,
    {
      RESULT_CODE: 200,
      RESULT_MESSAGE: "",
      TOTAL: list.length,
      LIST: list,
    },
  ];
});

mock.onGet("/v1/club/content/list").reply((config) => {
  const list = contents.createContents(random(30, 30), config.params);
  // const list = contents.createContents(random(0, 30), config.params)
  return [
    200,
    {
      RESULT_CODE: 200,
      RESULT_MESSAGE: "",
      TOTAL: list.length,
      LIST: list,
    },
  ];
});

mock.onGet("/v1/club/category/list").reply((config) => {
  return [
    200,
    {
      RESULT_CODE: 200,
      RESULT_MESSAGE: "",
      TOTAL: contentsCateList.length,
      LIST: contentsCateList,
    },
  ];
});

mock.onGet("/clubpf/svc/club/info").reply((config) => {
  return [200, clubHome];
});

mock.onGet("/uipf/v1/club/account/withdraw").reply((config) => {
  return [200, { result: "0000" }];
});

mock.onGet("/v1/club/account/auth").reply((config) => {
  return [200, { result: "0000" }];
});

mock.onGet("/v1/club/account/join").reply((config) => {
  return [200, { result: "0000" }];
});

mock.onGet("/uipf/v1/club/agree/list").reply((config) => {
  return [200, { C0101: "약관1", C0102: "약관2" }];
});

mock.onGet("/v1/club/notice/list").reply((config) => {
  const request = config.params as NoticeListRequest;
  return [
    200,
    {
      total: notices.length,
      data: notices.slice(request.offset, request.offset + request.limit),
    },
  ];
});

mock.onGet("/clubpf/svc/notice/cateList").reply((config) => {
  return [200, { data: ["공지사항", "교회소개"] }];
});

export default API;

export const fetcher = <T>(url: string): Promise<T> =>
  API.get<T>(url).then(({ data }) => data);
